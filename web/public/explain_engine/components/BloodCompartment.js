/* eslint-disable */

class BloodCompartment {
  
  // units of the gas compartment
  // pressure in mmHg
  // volume in litres
  // concentration in mmol/l

  constructor(_model) {
    // all properties starting with an underscore are local and private
    // declare a reference to the global model which is injected in this class
    this._model = _model;

    // declare the state variables which are not in the model definition file
    this.pres = 0;
    this.pres_recoil = 0;
    this.pres_ext = 0;
    this.pres_cont = 0;

    // elastances
    this.el = 0;
    this.el_max_fac = 1;
    this.el_min_fac = 1;
    this.vol_u_fac= 1;
    this.el_k1_fac = 1;
    this.el_act = 0

    // compounds
    this.compound_names = []
    this._no_compounds = 0

    // set the fractional atp use to zero as the metabolism model will take care of that.
    this.fvatp = 0

    this.initialized = false
    
  }

  calcElastance() {
    
    // calculate the base elastance
    let el_base = this.el_min * this.el_min_fac;

    // calculate the second nonlinear factor
    let nonlin_fac = this.el_k1 * this.el_k1_fac * Math.pow((this.vol - this.vol_u), 2);
    
    // calculate the contraction (=varying elastance) 
    let el_cont = (this.el_max * this.el_max_fac * this.el_act) 

    // return the sum of all factors
    return el_base + nonlin_fac + el_cont;

  }

  calcPressure() {

    // calculate the current elastance
    this.el = this.calcElastance()

    // return the current pressure as a sum of the recoil pressure, the external and container pressure
    this.pres_recoil = (this.vol - (this.vol_u * this.vol_u_fac)) * this.el

    // return the sum of all the pressures
    return (this.pres_recoil + this.pres_ext + this.pres_cont);

  }

  volIn(dvol, comp_from) {

    // add blood from the compartment stored in comp_from
    this.vol += dvol;

    // guard against negative volumes
    if (this.vol < 0) {
      this.vol = 0;
    }

    // mix the blood
    this.calcCompoundsConcentrations(dvol, comp_from)
  
  }


  volOut(dvol) {

    // guard against negative volumes
    this.vol -= dvol;
    if (this.vol < 0) {
      this.vol = 0;
    }

  }

  calcCompoundsConcentrations(dvol, comp_from) {
    // mix the blood compounds
    for (let i = 0; i < this.no_compounds; i++) {   
      const currentCompound = this.compound_names[i]
      let cc_to = this[currentCompound]
      const cc_from = comp_from[currentCompound]

      const inflow = (cc_from - cc_to) * dvol
      if (this.vol > 0) {
        cc_to = (cc_to * this.vol + inflow) / this.vol
      } else {
        cc_to = 0
      }
      
      this[currentCompound] = cc_to
    }
  }

  modelStep() {
    if (this.is_enabled) {
      
      // calculate the new blood compartment composition
      if (!this.initialized) {
        this._model.components.Blood.initializeBloodCompartment(this)
      }
      
      // calculate the pressure
      this.pres = this.calcPressure();
    }
  }
}
