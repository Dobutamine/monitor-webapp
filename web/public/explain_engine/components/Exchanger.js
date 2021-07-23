/* eslint-disable */

class Exchanger {
  constructor(_model) {
    this._model = _model;
    this.etco2_scripted = 50
  }

  modelStep() {
    if (this.is_enabled) {
      this.modelCycle();
    }
  }

  setEtCO2 (new_etco2) {
    this.etco2_scripted = new_etco2
  }

  modelCycle() {
    // calculate the flux
    // diff = mmol / mmHg * sec
    // flux is in mmol !!!

    let blood_compartment = this._model.components[this.comp_blood];
    let gas_compartment = this._model.components[this.comp_gas];
    
    this.flux_o2 = (blood_compartment.po2 - gas_compartment.po2) * (this.dif_o2) * this._model.modeling_stepsize;

    // in blood the pco2 is in kPa and in the gas in mmHg
    blood_compartment.pco2 = this.etco2_scripted

    this.flux_co2 = (blood_compartment.pco2 - gas_compartment.pco2) * (this.dif_co2) * this._model.modeling_stepsize;

    if (Number.isNaN(this.flux_o2)) {
      this.flux_o2 = 0;
    }

    if (Number.isNaN(this.flux_co2)) {
      this.flux_co2 = 0;
    }

    if (blood_compartment.is_enabled && blood_compartment.initialized) {
      if (blood_compartment.vol > 0) {
        blood_compartment.to2 = (blood_compartment.to2 * blood_compartment.vol - this.flux_o2) / blood_compartment.vol;

        if (blood_compartment.to2 < 0) {
          blood_compartment.to2 = 0.0;
        }

        blood_compartment.tco2 = (blood_compartment.tco2 * blood_compartment.vol - this.flux_co2) / blood_compartment.vol;

        if (blood_compartment.tco2 < 0) {
          blood_compartment.tco2 = 0.0;
        }
      }
    }

    if (gas_compartment.is_enabled && gas_compartment.initialized) {
      if (gas_compartment.vol > 0) {

        gas_compartment.co2 = (gas_compartment.co2 * gas_compartment.vol + this.flux_o2) / gas_compartment.vol;

        if (gas_compartment.co2 < 0) {
          gas_compartment.co2 = 0;
        }

        gas_compartment.cco2 = (gas_compartment.cco2 * gas_compartment.vol + this.flux_co2) / gas_compartment.vol;

        if (gas_compartment.cco2 < 0) {
          gas_compartment.cco2 = 0;
        }
      }
    }
  }
}
