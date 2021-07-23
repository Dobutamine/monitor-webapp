/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
class Metabolism {
  constructor (_model) {
    this._model = _model
  }

  modelStep () {
    if (this.is_enabled) {
      this.modelCycle()
    }
  }

  modelCycle () {
    // distribute the energy use of the model over the different compartments
    this.active_comps.forEach(act_comp => {
      this.calcEnergyUse(act_comp)
    })
  }

  calcEnergyUse (act_comp) {
    // find a reference the the compartment
    const comp = this._model.components[act_comp.comp]

    // find the stored fractional atp use
    const fvatp = act_comp.fvatp

    // get the local ATP need in molecules per second
    const atp_need = fvatp * this.atp_need

    // new we need to know how much molecules ATP we need in this step
    const atp_need_step = atp_need * this._model.modeling_stepsize

    // get the number of oxygen molecules available in this compartment in mmol
    let o2_molecules_available = comp.to2 * comp.vol

    // we state that 80% of these molecules are available for use (guess)
    const o2_molecules_available_for_use = 0.8 * o2_molecules_available

    // how many molecules o2 do we need to burn in this step as 1 mmol of o2 gives 5 mmol of ATP when processed by oxydative phosphorylation
    const o2_to_burn = atp_need_step / 5.0

    // how many needed ATP molecules can't be produced by aerobic respiration
    let anaerobic_atp = (o2_to_burn - o2_molecules_available_for_use / 4.0) * 5.0

    // if negative then there are more o2 molecules available than needed and shut down anaerobic fermentation
    if (anaerobic_atp < 0) {
      anaerobic_atp = 0
    }

    let o2_burned = o2_to_burn
    // if we need to burn more than we have then burn all available o2 molecules
    if (o2_to_burn > o2_molecules_available_for_use) {
      // burn all available o2 molecules
      o2_burned = o2_molecules_available_for_use
    }

    // as we burn o2 molecules we have to substract them from the total number of o2 molecules
    o2_molecules_available -= o2_burned

    // calculate the new TO2
    comp.to2 = o2_molecules_available / comp.vol
    // watch for negative concentrations
    if (comp.to2 < 0) {
      comp.to2 = 0
    }

    // we now know how much o2 molecules we've burnt so we also know how much co2 we generated depending on the respiratory quotient
    const co2_molecules_produced = o2_burned * this.resp_q

    // add the co2 molecules to the total co2 molecules
    comp.tco2 = (comp.tco2 * comp.vol + co2_molecules_produced) / comp.vol
    // watch for negative concentrations
    if (comp.tco2 < 0) {
      comp.tco2 = 0
    }
  }
}
