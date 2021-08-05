/* eslint-disable */
class ECG {
  constructor(_model) {
    this._model = {};

    this.ecg_signal = 0;
    this.measured_heartrate = 0;

    this._prev_p_signal = 0;
    this._prev_t_signal = 0;
    this._prev_qrs_signal = 0;

    this._sa_node_period = 0;
    this._sa_node_counter = 0;

    this._vent_escape_period = 0;
    this._vent_escape_counter = 0;
    this._vent_escape_running = false;

    this._pq_time_counter = 0;
    this._pq_running = false;

    this._qrs_time_counter = 0;
    this._qrs_running = false;

    this._qt_time_counter = 0;
    this._qt_running = false;

    this._ventricle_is_refractory = false;

    this._measured_heartrate_time_counter = 0;
    this._measured_heartrate_qrs_counter = 0;

    this._model = _model;
    this._update_timer = 0;

    this.ecg_update_interval = 0.015;
    this.q_interval = 0;
    this.q_interval_counter = 0;
    this.r_interval = 0;
    this.r_interval_counter = 0;
    this.s_interval = 0;
    this.s_interval_counter = 0;

    // shape the ventricular qrs
    this.qrs_vent_escape_time = 0.35;
    this._qrs_vent_escape_time_counter = 0;
    this._qrs_vent_escape_running = false;

    this.amp_q_vent = 0;
    this.width_q_vent = 10.0;
    this.skew_q_vent = 1;

    this.amp_r_vent = 10;
    this.width_r_vent = 15.0;
    this.skew_r_vent = 1.1;

    this.amp_s_vent = -3.5;
    this.width_s_vent = 10;
    this.skew_s_vent = 5;

    //
    this.block_qrs = false;
    this.block_counter = 3;
    this.block_after_beats = 3;
    this.pq_addition = 0;

    this.qt_addition = 0;
    this.qt_multiplier = 1.5;

    this.driftValue = 0;
    this.driftCounter = 0;

    this.rhythm_parameter = 0;
  }

  qtc() {
    if (this.heart_rate > 0) {
      return (
        (this.qt_time + this.qt_addition) * Math.sqrt(60.0 / this.heart_rate)
      );
    } else {
      return (this.qt_time + this.qt_addition) * Math.sqrt(60.0 / 10.0);
    }
  }
  modelStep() {
    if (this.is_enabled) {
      this.modelCycle();
    }
  }

  modelCycle() {
    // the ecg is updated every modeling_interval and not every modeling_stepsize
    // for performance reasons
    if (this._update_timer >= this.ecg_update_interval) {
      this._update_timer = 0;
      // this.updateECG(this.ecg_update_interval);
    }
    this._update_timer += this._model.modeling_stepsize;

    this.updateECG(this._model.modeling_stepsize);
  }

  setRhythmProperties() {
    switch (this.rhythm_type) {
      case 0: // sinus rhythm
        this.block_counter = 0;
        this.block_qrs = false;
        this.pq_addition = 0;
        this.qt_addition = 0;
        this.svt_multiplier = 1;
        this.venticular_escape_rate = 0;
        break;
      case 1: // AV block 1
        this.pq_addition = 0.5 * this.pq_time;
        this.block_counter = 0;
        this.block_qrs = false;
        this.qt_addition = 0;
        this.svt_multiplier = 1;
        this.venticular_escape_rate = 0;
        break;
      case 2: // AV block II - type 1 (wenckeback)
        if (this.block_counter < this.block_after_beats) {
          this.pq_addition = 0.4 * this.pq_time * this.block_counter;
        } else {
          this.block_qrs = true;
          this.pq_addition = 0;
          this.block_counter = 0;
          this.qt_addition = 0;
          this.svt_multiplier = 1;
          this.venticular_escape_rate = 0;
          this.block_after_beats = parseInt(this.rhythm_parameter);
        }
        break;
      case 3: // AV block II - type 2
        if (this.block_counter >= this.block_after_beats) {
          this.block_qrs = true;
          this.pq_addition = 0;
          this.block_counter = 0;
          this.qt_addition = 0;
          this.svt_multiplier = 1;
          this.venticular_escape_rate = 0;
        }
        break;
      case 4: // complete heartblock
        this.block_qrs = true;
        this.pq_addition = 0;
        this.block_counter = 0;
        this.qt_addition = 0;
        this.svt_multiplier = 1;
        this.venticular_escape_rate = parseInt(this.rhythm_parameter);
        break;
      case 5: // long qt
        this.block_counter = 0;
        this.block_qrs = false;
        this.pq_addition = 0;
        this.qt_addition = 0;
        this.svt_multiplier = 1;
        this.venticular_escape_rate = 0;
        this.qt_time = parseFloat(this.rhythm_parameter);
        this.qt_addition = this.qt_multiplier * this.qt_time;
        break;
      case 6: // vt
        break;
      case 7: // vf
        break;
      case 8: // svt
        this.block_counter = 0;
        this.block_qrs = false;
        this.pq_addition = 0;
        this.qt_addition = 0;
        this.svt_multiplier = 1;
        this.venticular_escape_rate = 0;
        this.heart_rate = parseInt(this.rhythm_parameter);
        break;
      case 9: // ischemia
        break;
    }
  }

  updateECG(model_interval) {
    // determine rhythm properties
    this.setRhythmProperties();

    // calculate the corrected qt time
    this.cqt_time = this.qtc() - this.qrs_time;

    // calculate the sa_node_time in seconds depending on the heartrate
    if (this.heart_rate > 0) {
      this._sa_node_period = 60 / this.heart_rate;
    } else {
      this._sa_node_period = 6000000000;
    }

    if (this.venticular_escape_rate > 0) {
      this._vent_escape_period = 60 / this.venticular_escape_rate;
    } else {
      this._vent_escape_period = 6000000000;
    }

    // has the sa node period elapsed
    if (this._sa_node_counter > this._sa_node_period) {
      this._sa_node_counter = 0;
      this._pq_running = true;
      this.ncc_atrial = 0;
    }

    // has the ventricular escape period elapsed
    if (this._vent_escape_counter > this._vent_escape_period) {
      this._vent_escape_counter = 0;
      if (this._ventricle_is_refractory === false) {
        this.q_interval_vent = this.qrs_vent_escape_time * 0;
        this.r_interval_vent = this.qrs_vent_escape_time * 0.56667;
        this.s_interval_vent = this.qrs_vent_escape_time * 0.43333;
        this._qrs_vent_escape_running = true;
        this.ncc_ventricular = 0;
        this._measured_heartrate_qrs_counter += 1;
      }
    }

    // has the pq time elapsed?
    if (this._pq_time_counter > this.pq_time + this.pq_addition) {
      this._pq_time_counter = 0;
      this._pq_running = false;
      if (
        this._ventricle_is_refractory === false &&
        this._qrs_vent_escape_running === false &&
        this.block_qrs === false
      ) {
        this.q_interval = this.qrs_time / 3;
        this.r_interval = this.qrs_time / 3;
        this.s_interval = this.qrs_time / 3;
        this._qrs_running = true;
        this.ncc_ventricular = 0;
        this._measured_heartrate_qrs_counter += 1;
        // reset the ventricular escape counter
        this._vent_escape_counter = 0;
        this.block_counter += 1;
      }
      if (this.block_qrs === true) {
        this.block_qrs = false;
      }
    }

    if (this._measured_heartrate_qrs_counter > 5) {
      this.measured_heartrate =
        60 /
        (this._measured_heartrate_time_counter /
          this._measured_heartrate_qrs_counter);
      this._measured_heartrate_qrs_counter = 0;
      this._measured_heartrate_time_counter = 0;
    }

    // has the qrs time elapsed?
    if (this._qrs_time_counter > this.qrs_time) {
      this._qrs_time_counter = 0;
      this.ecg_signal = 0;
      this._qrs_running = false;
      this._qt_running = true;
      this._ventricle_is_refractory = true;
    }

    // has the ventricular qrs time elapsed
    if (this._qrs_vent_escape_time_counter > this.qrs_vent_escape_time) {
      this._qrs_vent_escape_time_counter = 0;
      this._qrs_vent_escape_running = false;
      // start the qt time
      this._qt_running = true;
      // set the ventricle refractory
      this._ventricle_is_refractory = true;
    }

    // has the qt time elapsed?
    if (this._qt_time_counter > this.cqt_time) {
      this._qt_time_counter = 0;
      this._qt_running = false;
      this._ventricle_is_refractory = false;
    }

    // increase the counters
    this._measured_heartrate_time_counter += model_interval;
    this._vent_escape_counter += model_interval;

    this._sa_node_counter += model_interval;
    // only increase the timers when running
    if (this._pq_running) {
      this._pq_time_counter += model_interval;
      this.buildDynamicPWave();
    }
    if (this._qrs_running) {
      this._qrs_time_counter += model_interval;
      this.buidlDynamicQRSWave();
    }
    if (this._qrs_vent_escape_running) {
      this._qrs_vent_escape_time_counter += model_interval;
      this.buidlDynamicQRSWaveVentricular();
    }
    if (this._qt_running) {
      this._qt_time_counter += model_interval;
      this.buildDynamicTWave();
    }

    if (
      this._pq_running === false &&
      this._qrs_running === false &&
      this._qt_running === false &&
      this._qrs_vent_escape_running === false
    ) {
      this.ecg_signal = 0;
    }

    this._model.components.ECG["ecg_signal"] = this.ecg_signal;
    this._model.components.ECG["measured_heartrate"] = this.measured_heartrate;
  }
  buildDynamicPWave() {
    let duration = this._model.components.ECG["pq_time"];
    let amp_p = this._model.components.ECG["amp_p"];
    let width_p = this._model.components.ECG["width_p"];
    let skew_p = this._model.components.ECG["skew_p"];

    let new_p_signal =
      amp_p *
      Math.exp(
        -width_p *
          (Math.pow(this._pq_time_counter - duration / skew_p, 2) /
            Math.pow(duration, 2))
      );
    let delta_p = new_p_signal - this._prev_p_signal;
    this.ecg_signal += delta_p;
    this._prev_p_signal = new_p_signal;
  }
  buidlDynamicQRSWaveVentricular() {
    let new_qrs_signal = 0;

    // do the q wave
    if (this._qrs_vent_escape_time_counter < this.q_interval_vent) {
      new_qrs_signal =
        this.amp_q_vent *
        Math.exp(
          -this.width_q_vent *
            (Math.pow(
              this._qrs_vent_escape_time_counter -
                this.q_interval_vent / this.skew_q_vent,
              2
            ) /
              Math.pow(this.q_interval_vent, 2))
        );
    }

    // do the r wave
    if (
      this._qrs_vent_escape_time_counter > this.q_interval_vent &&
      this._qrs_vent_escape_time_counter <
        this.q_interval_vent + this.r_interval_vent
    ) {
      new_qrs_signal =
        this.amp_r_vent *
        Math.exp(
          -this.width_r_vent *
            (Math.pow(
              this._qrs_vent_escape_time_counter -
                this.q_interval_vent -
                this.r_interval_vent / this.skew_r_vent,
              2
            ) /
              Math.pow(this.r_interval_vent, 2))
        );
    }

    // do the s wave
    if (
      this._qrs_vent_escape_time_counter >
        this.q_interval_vent + this.r_interval_vent &&
      this._qrs_vent_escape_time_counter <
        this.q_interval_vent + this.r_interval_vent + this.s_interval_vent
    ) {
      new_qrs_signal =
        this.amp_s_vent *
        Math.exp(
          -this.width_s_vent *
            (Math.pow(
              this._qrs_vent_escape_time_counter -
                this.q_interval_vent -
                this.r_interval_vent -
                this.s_interval_vent / this.skew_s_vent,
              2
            ) /
              Math.pow(this.s_interval_vent, 2))
        );
    }

    let delta_qrs = new_qrs_signal - this._prev_qrs_signal;
    this.ecg_signal += delta_qrs;
    this._prev_qrs_signal = new_qrs_signal;
  }
  buidlDynamicQRSWave() {
    let new_qrs_signal = 0;
    // do the q wave
    if (this._qrs_time_counter < this.q_interval) {
      new_qrs_signal =
        this.amp_q *
        Math.exp(
          -this.width_q *
            (Math.pow(
              this._qrs_time_counter - this.q_interval / this.skew_q,
              2
            ) /
              Math.pow(this.q_interval, 2))
        );
    }

    // do the r wave
    if (
      this._qrs_time_counter > this.q_interval &&
      this._qrs_time_counter < this.q_interval + this.r_interval
    ) {
      new_qrs_signal =
        this.amp_r *
        Math.exp(
          -this.width_r *
            (Math.pow(
              this._qrs_time_counter -
                this.q_interval -
                this.r_interval / this.skew_r,
              2
            ) /
              Math.pow(this.r_interval, 2))
        );
    }

    // do the s wave
    if (
      this._qrs_time_counter > this.q_interval + this.r_interval &&
      this._qrs_time_counter <
        this.q_interval + this.r_interval + this.s_interval
    ) {
      new_qrs_signal =
        this.amp_s *
        Math.exp(
          -this.width_s *
            (Math.pow(
              this._qrs_time_counter -
                this.q_interval -
                this.r_interval -
                this.s_interval / this.skew_s,
              2
            ) /
              Math.pow(this.s_interval, 2))
        );
    }

    let delta_qrs = new_qrs_signal - this._prev_qrs_signal;
    this.ecg_signal += delta_qrs;
    this._prev_qrs_signal = new_qrs_signal;
  }
  buildDynamicTWave() {
    let duration = this.cqt_time;
    let amp_t = this._model.components.ECG["amp_t"];
    let width_t = this._model.components.ECG["width_t"];
    let skew_t = this._model.components.ECG["skew_t"];

    let new_t_signal =
      amp_t *
      Math.exp(
        -width_t *
          (Math.pow(this._qt_time_counter - duration / skew_t, 2) /
            Math.pow(duration, 2))
      );
    let delta_t = new_t_signal - this._prev_t_signal;
    this.ecg_signal += delta_t;
    this._prev_t_signal = new_t_signal;
  }
}
