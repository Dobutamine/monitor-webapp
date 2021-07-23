/* eslint-disable */
class Heart {
  constructor(_model) {

    // state properties (accessible from outside)
    this.aaf = 0.0
    this.vaf = 0.0
    this.vaf2 = 0
    this.n1 = 1.9
    this.n2 = 1.9

    this.prev_aaf = 0.0
    this.prev_vaf = 0.0

    this.prev_lvp = 0
    this.prev_lvv = 0

    this.prev_rvp = 0
    this.prev_rvv = 0

    this.lvSwTempDiastole = 0
    this.lvSwTempSystole = 0

    this.rvSwTempDiastole = 0
    this.rvSwTempSystole = 0

    this.systole = false
    this.diastole = false

    this.esv_lv = 0
    this.esv_rv = 0
    this.esv_la = 0
    this.esv_ra = 0

    this.esp_lv = 0
    this.esp_rv = 0
    this.esp_la = 0
    this.esp_ra = 0

    this.edv_lv = 0
    this.edv_rv = 0
    this.edv_la = 0
    this.edv_ra = 0

    this.edp_lv = 0
    this.edp_rv = 0
    this.edv_la = 0
    this.edv_ra = 0

    this.lv_stroke = 0
    this.lv_stroke_work = 0
    this.lv_ejection_fraction = 0
    this.lv_pe = 0

    this.rv_stroke = 0
    this.rv_stroke_work = 0
    this.rv_ejection_fraction = 0
    this.rv_pe = 0

    this.pva_lv = 0
    this.pva_rv = 0
    this.pva = 0

    this.A = 0
    this.B = 0

    // local state properties
    this._model = _model;

  }

  modelStep() {
    if (this.is_enabled) {
        this.modelCycle();
    }
  }

  // the model step function is called during every step of the model
  modelCycle() {
    
    const t = this._model.modeling_stepsize

    // get the relevant timings from the ecg model
    let ncc_atrial = this._model.components.ECG.ncc_atrial
    let atrial_duration = this._model.components.ECG.pq_time
    let ncc_ventricular = this._model.components.ECG.ncc_ventricular
    let ventricular_duration = (this._model.components.ECG.cqt_time)

    // varying elastance activation function of the atria
    if (ncc_atrial >= 0 && ncc_atrial < (atrial_duration / t)) {
      this.aaf = Math.pow(Math.sin(Math.PI * (ncc_atrial / atrial_duration) * t), 2);
    } else {
      this.aaf = 0;
    }

    // varying elastance activation function of the ventricles


    if (ncc_ventricular >= 0 && ncc_ventricular < (ventricular_duration / t)) {
      this.vaf = Math.pow(Math.sin(Math.PI * (ncc_ventricular / ventricular_duration) * t), 2);
      // E[t] = a (1 - Exp[-n*t])*(1 - (t/t0)^m/(1 + (t/t0)^m))
      // a = 1.8; t0 = 0.5; n = 2; m = 20; (T = 1)

      // const _t = ncc_ventricular * t
      // const t0 = ventricular_duration
      // const f1 = Math.exp(-this.n * _t)
      // const f2 = Math.pow(_t / t0, this.m)

      // this.vaf = this.a * (1 - f1) * ((1 - f2)/ (1 + f2)) 
      
    } else {
      this.vaf = 0
      this.vaf2 = 0
    }

    // E[t] = a (1 - Exp[-n*t])*(1 - (t/t0)^m/(1 + (t/t0)^m))

    // heart cycle determination
    if (this.prev_vaf >= this.vaf && !this.diastole) {
      this.diastole = true
      this.systole = false
      this.endSystolicMeasurements()
    }
    if (this.prev_vaf < this.vaf && !this.systole) {
      this.systole = true
      this.diastole = false
      this.endDiastolicMeasurements()
    }
    this.prev_vaf = this.vaf

    // do the stroke work calculations
    this.strokeWorkCalculations()
 
    // increase the atrial and ventricular activation function timers
    this._model.components.ECG.ncc_atrial += 1;
    this._model.components.ECG.ncc_ventricular += 1;

    // transfer the activation function to the heart compartments
    this._model.components.RA.el_act = this.aaf;
    this._model.components.RV.el_act = this.vaf;
    this._model.components.LA.el_act = this.aaf;
    this._model.components.LV.el_act = this.vaf;

  }

  strokeWorkCalculations () {

    const lvv = this._model.components.LV.vol
    const lvp = this._model.components.LV.pres

    const rvv = this._model.components.RV.vol
    const rvp = this._model.components.RV.pres

    const dV_lv = lvv - this.prev_lvv
    const dV_rv = rvv - this.prev_rvv

    const dPVA_lv = dV_lv * lvp
    const dPVA_rv = dV_rv * rvp

    if (this.diastole) {
      this.lvSwTempDiastole += dPVA_lv
      this.rvSwTempDiastole += dPVA_rv
    }

    if (this.systole) {
      this.lvSwTempSystole += -dPVA_lv
      this.rvSwTempSystole += -dPVA_rv
    }

    this.prev_lvv = lvv
    this.prev_rvv = rvv

  }

  endDiastolicMeasurements () {

    this.edv_lv = this._model.components.LV.vol
    this.edv_rv = this._model.components.RV.vol
    this.edv_la = this._model.components.LA.vol
    this.edv_ra = this._model.components.RA.vol

    this.lv_ejection_fraction = this.lv_stroke / this.edv_lv
    this.rv_ejection_fraction = this.rv_stroke / this.edv_rv

    this.edp_lv = this._model.components.LV.pres
    this.edp_rv = this._model.components.RV.pres
    this.edp_la = this._model.components.LA.pres
    this.edp_ra = this._model.components.RA.pres

  }

  endSystolicMeasurements () {

    this.lv_stroke_work = this.lvSwTempSystole - this.lvSwTempDiastole
    this.lvSwTempDiastole = 0
    this.lvSwTempSystole = 0

    this.rv_stroke_work = this.rvSwTempSystole - this.rvSwTempDiastole
    this.rvSwTempDiastole = 0
    this.rvSwTempSystole = 0

    this.lv_pe = (this.esp_lv * (this.esv_lv - this._model.components.LV.vol_u) / 2) - (this.edp_lv * (this.edv_lv - this._model.components.LV.vol_u) / 4) 
    this.rv_pe = (this.esp_rv * (this.esv_rv - this._model.components.RV.vol_u) / 2) - (this.edp_rv * (this.edv_rv - this._model.components.RV.vol_u) / 4) 

    this.pva_lv = this.lv_pe + this.lv_stroke_work
    this.pva_rv = this.rv_pe + this.rv_stroke_work
    this.pva = this.pva_lv + this.pva_rv

    this.calcEnergyUse()
    
    this.esv_lv = this._model.components.LV.vol
    this.esv_rv = this._model.components.RV.vol
    this.esv_la = this._model.components.LA.vol
    this.esv_ra = this._model.components.RA.vol

    this.lv_stroke = this.edv_lv - this.esv_lv
    this.rv_stroke = this.edv_rv - this.esv_rv

    this.esp_lv = this._model.components.LV.pres
    this.esp_rv = this._model.components.RV.pres
    this.esp_la = this._model.components.LA.pres
    this.esp_ra = this._model.components.RA.pres

  }

  calcEnergyUse () {

    // The Pressure-volume area (PVA) represents the total mechanical energy generated by ventricular contraction. 
    // This is equal to the sum of the stroke work (SW), encompassed within the PV loop, and the elastic potential energy (PE).
    // There is a highly linear correlation between the PVA and cardiac oxygen consumption per beat. 
    // This relationship holds true under a variety of loading and contractile conditions. 
    // This estimation of myocardial oxygen consumption (MVO2) is used to study the coupling of mechanical work and the energy requirement of the heart in various disease states, such as diabetes, ventricular hypertrophy, and heart failure. 
    // MVO2 is also used in the calculation of cardiac efficiency, which is the ratio of cardiac stroke work to MVO2.

    // PVA correlates linearly with myocardial oxygen consumption per beat (MVO2): MVO2 = a.PVA+b (https://www.ahajournals.org/doi/10.1161/01.cir.85.3.988?url_ver=Z39.88-2003&rfr_id=ori:rid:crossref.org&rfr_dat=cr_pub%20%200pubmed)
    this.mvo2_lv = this.A * this.pva_lv + this.B
    this.mvo2_rv = this.A * this.pva_rv + this.B

    // we have to convert this to the myocarcical energy consumption per sec
    const beats_per_sec = this._model.components.ECG.heart_rate / 60

    this.mvo2_lv_per_sec = this.mvo2_lv * beats_per_sec
    this.mvo2_rv_per_sec = this.mvo2_lv * beats_per_sec

    // convert this to atp use per sec and transfer this to the left and right ventricle compartment
    // 1 ml of oxygen = .. mmol of oxygen which translates into .. mmol of atp


  }
}
