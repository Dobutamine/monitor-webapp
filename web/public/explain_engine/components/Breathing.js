/* eslint-disable */

class Breathing {
  constructor(_model) {
    this._model = _model;
    this._amp = 8.0;
    this._temp_min_volume = 10000;
    this._temp_max_volume = -10000;
    this._volume_time_counter = 0;
    this._breath_timer_period = 0;
    this._breath_timer_counter = 0;

    this.tidal_volume = 0;
    this.minute_volume = 0;
    this.resp_rate_scripted = 30

    this.ampFactor = 1
    this.apneaFactor = 1
    this.durationFactor = 1

    this.spont_breath_started = false
  }

  setRespRate (new_resprate, breath_duration = 1000) {
    this.resp_rate_scripted = new_resprate
    this.breath_duration = breath_duration
  }

  calculateVolumes() {
    // calculate the tidal and minute volumes
    this.tidal_volume = this._temp_max_volume - this._temp_min_volume;
    this.minute_volume = this.tidal_volume * this.spont_resp_rate;

    // max and mins
    this._temp_min_volume = 10000;
    this._temp_max_volume = -10000;

    // reset the volumes counter
    this._volume_time_counter = 0;
  }

  generateMuscleSignal() {
    return (-this._amp * this.ampFactor * this.apneaFactor * Math.exp(-25 * (Math.pow(this._breath_timer_counter - (this.breath_duration * this.durationFactor) / 2, 2) / Math.pow(this.breath_duration * this.durationFactor, 2))));
  }

  vtrrController() {
    // calculate the spontaneous resp rate depending on the target minute volume (from ANS) and the set vt-rr ratio
    this.spont_resp_rate = Math.sqrt(
      this.target_minute_volume / this.vtrr_ratio
    );

    // calculate the target tidal volume depending on the target resp rate and target minute volume (from ANS)
    this.target_tidal_volume = this.target_minute_volume / this.spont_resp_rate;
  }

  startBreath() {
    // 

    this.ampFactor = Math.random() + 0.5

    this.durationFactor = Math.random() + 0.5

    this.spont_breath_started = true
    // calculate the current tidal and minute volume
    this.calculateVolumes();

    // has the target tidal volume been reached or exceeded?
    let d_tv = this.tidal_volume - this.target_tidal_volume;

    // calculate the breathing frequency
    this.measured_spont_breath_freq = 60 / this.measured_spont_breath_counter;
    this.measured_spont_breath_counter = 0;
    this.measured_spont_updater_counter = 0;

    // reset the breathing timer
    this._breath_timer_counter = 1;
  }

  modelStep() {
    if (this.is_enabled) {
      this.modelCycle();
    }
  }

  modelCycle() {

    // determine the breath timings
    this.spont_resp_rate = this.resp_rate_scripted

    if (this.spont_resp_rate > 0 && this.spont_breathing_enabled) {
      this._breath_timer_period = 60000 / this.spont_resp_rate;
    } else {
      this._breath_timer_period = 60000;
    }

    // calculate the respiratory rate and target tidal volume depending on the ANS
    this.vtrrController();

    // is it time for a new breath yet?
    if (this._breath_timer_counter > this._breath_timer_period) {
      this.startBreath();
    }

    // generate the muscle signal
    if (this.spont_resp_rate > 0 && this.spont_breathing_enabled) {
      this.resp_muscle_pressure = this.generateMuscleSignal();
    } else {
      this.resp_muscle_pressure = 0;
    }

    // transfer the respiratory muscle force to the chests
    this._model.components["CHEST_L"].pres_ext = this.resp_muscle_pressure;
    this._model.components["CHEST_R"].pres_ext = this.resp_muscle_pressure;

    // store the current volumes
    let volume = this._model.components["ALL"].vol + this._model.components["ALR"].vol;

    if (volume > this._temp_max_volume) {
      this._temp_max_volume = volume;
    }
    if (volume < this._temp_min_volume) {
      this._temp_min_volume = volume;
    }

    // calculate the volumes if not breathing quickly enough
    this._volume_time_counter += this._model.modeling_stepsize;
    if (this._volume_time_counter > 5.0) {
      this.calculateVolumes();
    }

    // increase the timers
    this._breath_timer_counter += this._model.modeling_stepsize * 1000;
  }
}
