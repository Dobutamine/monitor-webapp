/* eslint-disable */

class Resuscitation {
  constructor(_model) {
    this._model         = _model;
    this._comp_counter  = 0;
    this._resp_counter  = 0;
    this.compressions  = 0;
  }

  modelStep() {
    if (this.is_enabled) {
      this.modelCycle();
    }
  }

  modelCycle() {
    // Model sinus function
    let a_sinus  = (this.p_max + this.p_min) / 2; // average
    let b_sinus  = (this.p_max - this.p_min) / 2; // amplitude
    let c_sinus  = 2 * Math.PI * this.f_comp;
    this._sinus = a_sinus + b_sinus * Math.sin(c_sinus * this._comp_counter - 0.5 * Math.PI);

    this.compressions = this._sinus;

    switch(this.continue_resuscitation){
      case true:
        this.continue()
        break

      case false:
        this.discontinue()
        break
    }
  }

  continue(){
    // Apply chest compressions
    this._model.components["LV"].pres_ext     = 1.0 * this._sinus;
    this._model.components["RV"].pres_ext     = 1.0 * this._sinus;
    this._model.components["LA"].pres_ext     = 1.0 * this._sinus;
    this._model.components["RA"].pres_ext     = 1.0 * this._sinus;
    // this._model.components["COR"].pres_ext    = 0.8 * this._sinus;
    this._model.components["AA"].pres_ext     = 0.5 * this._sinus;
    this._model.components["AARCH"].pres_ext  = 0.5 * this._sinus;
    this._model.components["VCII"].pres_ext   = 0.5 * this._sinus;
    this._model.components["APC"].pres_ext    = 0.5 * this._sinus;
    this._model.components["PV"].pres_ext     = 0.5 * this._sinus;
    this._model.components["LL"].pres_ext     = 0.3 * this._sinus;
    this._model.components["LR"].pres_ext     = 0.3 * this._sinus;

    this._model.components["CHEST_L"].pres_ext= 0.3 * this._sinus;
    this._model.components["CHEST_R"].pres_ext= 0.3 * this._sinus;
    
    // update counter for sinus 
    this._comp_counter += this._model.modeling_stepsize;

    // Apply respiratory support
    this._model.components['Ventilator'].is_enabled  = true;
  }

  discontinue(){
    // Apply chest compressions
    if (this._comp_counter <= (this.ratio_comp/this.f_comp)){
      this._model.components["LV"].pres_ext     = 1.0 * this._sinus;
      this._model.components["RV"].pres_ext     = 1.0 * this._sinus;
      this._model.components["LA"].pres_ext     = 1.0 * this._sinus;
      this._model.components["RA"].pres_ext     = 1.0 * this._sinus;
      // this._model.components["COR"].pres_ext    = 0.8 * this._sinus;
      this._model.components["AA"].pres_ext     = 0.5 * this._sinus;
      this._model.components["AARCH"].pres_ext  = 0.5 * this._sinus;
      this._model.components["VCII"].pres_ext   = 0.5 * this._sinus;
      this._model.components["APC"].pres_ext    = 0.5 * this._sinus;
      this._model.components["PV"].pres_ext     = 0.5 * this._sinus;
      this._model.components["LL"].pres_ext     = 0.3 * this._sinus;
      this._model.components["LR"].pres_ext     = 0.3 * this._sinus;

      this._model.components["CHEST_L"].pres_ext= 0.3 * this._sinus;
      this._model.components["CHEST_R"].pres_ext= 0.3 * this._sinus;
    
      // update counter
      this._comp_counter += this._model.modeling_stepsize;
    }
    
    // Apply respiratory support
    let total_time_vent =  this._model.components['Ventilator'].t_in + this._model.components['Ventilator'].t_ex;

    if (this._resp_counter <= (this.ratio_resp * total_time_vent) && this._comp_counter >= (this.ratio_comp/this.f_comp)){
      this._model.components['Ventilator'].is_enabled  = true; 
      // update counter
      this._resp_counter += this._model.modeling_stepsize;
    }
      
    if (this._resp_counter >= (this.ratio_resp * total_time_vent)){
      this._model.components['Ventilator'].is_enabled  = false;
    }
  
    // reset counters 
    if (this._comp_counter >= (this.ratio_comp/this.f_comp) && this._resp_counter >= (this.ratio_resp * total_time_vent)){
      this._comp_counter = 0;
      this._resp_counter = 0;
    }
  }
}
