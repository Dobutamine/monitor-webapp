/* eslint-disable */

class Blood {
  constructor(_model) {
    // hold a reference to all the model components
    this._model = _model;

    this.compound_names  = []
    this.no_compounds = 0

    this.initialized = false

  }

  modelStep() {
    if (this.is_enabled) {
      // if enabled do a model step. This does not do anything at this point as most routines of this model are actually called by the blood compartments
      this.modelCycle();
    }
  }

  modelCycle() {}

  calcBloodComposition(comp) {
    this.calcEnergyUse(comp)
  }

  initializeBloodCompartment (comp) {
    // in this routine we initialize a the blood compartments with the compounds stored in the blood model
    // build compound name array
    if (!this.initialized) {
      Object.keys(this.compounds).forEach( compound => {
        this.compound_names.push(compound)
      })
      this.no_compounds = this.compound_names.length
      this.initialized = true
    }
    
      // iterate over all the compounds names stored in the blood model
      this.compound_names.forEach(compound => {
        comp[compound] = this.compounds[compound]
      })

      // pass the compound names to the blood compartment
      comp.compound_names = [...this.compound_names]
      comp.no_compounds = this.no_compounds

      // flag that the blood compartment is initialized
      comp.initialized = true

  }
}
