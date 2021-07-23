
class MonitorEmulator { 
    constructor (_model) {
        this._model = _model
        this.is_enabled = true
        this.update_counter = 0
        this.update_frequency = 0.005

        this.send_counter = 0
        this.send_frequency = 5

        this.time = 0
        this.setHeartrate = 125
        this.heartrate = 125
        this.prevHeartrate = 0

        this.satPre = 98
        this.setSatPre = 98
        this.prevSatPre = 0

        this.satPost = 95
        this.setSatPost = 95
        this.prevSatPost = 0

        this.satVen = 80

        this.respRate = 35
        this.setRespRate = 35
        this.prevRespRate = 0

        this.etco2 = 45
        this.setEtco2 = 45
        this.prevEtco2 = 0

        this.abpSyst = 70
        this.setAbpSyst = 70
        this.prevAbpSyst = 0

        this.abpDiast = 45
        this.setAbpDiast = 45
        this.prevAbpDiast = 0
        
        this.pfi = 1.5
        this.temp = 37.1
        this.cvp = 4
        this.papSyst = 40
        this.papDiast = 20
        this.imageNo = 0
        this.resusState = 0
        this.rhythmType = 0
        this.rhythmParameter = 0
        this.curveSqueeze = 1

        this.driftDirectionCounter = 0
        this.driftCounter = 0
        this.driftDirection = 1
        this.driftValue = 0

        
        
        this.data = []
    }

    modelStep() {
        if (this.is_enabled) {
            if (this.update_counter >= this.update_frequency) {
                this.update_counter = 0
                this.modelCycle()
            }
            this.update_counter += this._model.modeling_stepsize
        }
    }

    startMechanicalVentilator () {

    }

    setNewData (data) {
        this.setHeartrate = data.heartrate
        this.setSatPre = data.satPre
        this.setSatPost = data.satPost
        this.satVen = data.satVen
        this.setRespRate = data.respRate
        this.setEtco2 = data.etco2
        this.pfi = data.pfi
        this.temp = data.temp
        this.setAbpSyst = data.abpSyst
        this.setAbpDiast = data.abpDiast
        this.pfi = data.pfi
        this.temp = data.temp
        this.cvp = data.cvp
        this.papSyst = data.papSyst
        this.papDiast = data.papDiast
        this.imageNo = data.imageNo
        this.resusState =data.resusState
        this.rhythmType = data.rhythmType
        this.rhythmParameter = data.rhythmParameter
        this.curveSqueeze = data.curveSqueeze

        if (this.setHeartrate != this.prevHeartrate) {
            this.heartrate = this.setHeartrate
        }

        if (this.setSatPre != this.prevSatPre) {
            this.satPre = this.setSatPre
        }

        if (this.setSatPost != this.prevSatPost) {
            this.satPost = this.setSatPost
        }

        if (this.setAbpSyst != this.prevAbpSyst) {
            this.abpSyst = this.setAbpSyst
        }

        if (this.setAbpDiast != this.prevAbpDiast) {
            this.abpDiast = this.setAbpDiast
        }

        if (this.setRespRate != this.prevRespRate) {
            this.respRate = this.setRespRate
        }

        if (this.setEtco2 != this.prevEtco2) {
            this.etco2 = this.setEtco2
        }

        
        // update the model
        // this._model.components.ECG.heart_rate = parseInt(this.heartrate)
        // this._model.components.Breathing.setRespRate(parseInt(this.respRate))

        this.prevHeartrate = this.setHeartrate
        this.prevSatPre = this.setSatPre
        this.prevSatPost = this.setSatPost
        this.prevAbpSyst = this.abpSyst
        this.prevAbpDiast = this.abpDiast
        this.prevEtco2 = this.etco2
        this.prevRespRate = this.respRate
        
    }

    modelCycle() {
        this.time += this.update_frequency2
        this.data.push({
            'time': this.time,
            'heartrate': parseInt(this.heartrate),
            'satPre': parseInt(this.satPre),
            'satPost': parseInt(this.satPost),
            'respRate': parseInt(this.respRate),
            'etco2': parseInt(this.etco2),
            'pfi': this.pfi,
            'temp': this.temp,
            'abpSyst': parseInt(this.abpSyst),
            'abpDiast': parseInt(this.abpDiast),
            'ecg_signal': this._model.components.ECG.ecg_signal,
            'abp_signal': this._model.components.AA.pres,
            'sat_signal': this._model.components.AD.pres,
            'resp_signal': this._model.components.ALL.vol,
            'etco2_signal': this._model.components.NCA.pco2
        })

        if (this.driftCounter > 1) {
            this.driftCounter = 0
            this.driftValue = (Math.random() / 150)
        }
        this.driftCounter += this.update_frequency

        if (this.driftDirectionCounter > 1) {
            this.driftDirectionCounter = 0
            if (Math.random() >= 0.5) {
                this.driftDirection = 1
            } else {
                this.driftDirection = -1
            }
        }
        this.driftDirectionCounter += this.update_frequency


        let newHeartrate = this.heartrate + (this.driftValue * this.driftDirection)
        if (newHeartrate < 0) {
            newHeartrate = 0
        }
        if (Math.abs(this.setHeartrate - newHeartrate) < (0.05 * this.setHeartrate)) {
            this.heartrate = newHeartrate
        } 
        

        let newSatPre = this.satPre + (this.driftValue / 5 * this.driftDirection)
        if (newSatPre > 100) {
            newSatPre = 100
        }
        if (Math.abs(this.setSatPre - newSatPre) < 0.05 * this.setSatPre) {
            this.satPre = newSatPre
        } 

        let newSatPost = this.satPost + (this.driftValue / 4 * this.driftDirection)
        if (newSatPost > 100) {
            newSatPost = 100
        }
        if (Math.abs(this.setSatPost - newSatPost) < 0.05 * this.setSatPost) {
            this.satPost = newSatPost
        } 

        let newRespRate = this.respRate + (this.driftValue * 1.5 * this.driftDirection)
        if (newRespRate < 0) {
            newRespRate = 0
        }
        if (Math.abs(this.setRespRate - newRespRate) < 0.10 * this.setRespRate) {
            this.respRate = newRespRate
        } 

        let newAbpSyst = this.abpSyst + (this.driftValue / 2 * this.driftDirection)
        if (newAbpSyst < 0) {
            newAbpSyst = 0
        }
        if (Math.abs(this.setAbpSyst - newAbpSyst) < 0.05 * this.setAbpSyst) {
            this.abpSyst = newAbpSyst
        } 

        let newAbpDiast = this.abpDiast + (this.driftValue / 2 * this.driftDirection)
        if (newAbpDiast < 0) {
            newAbpDiast = 0
        }
        if (Math.abs(this.setAbpDiast - newAbpDiast) < 0.05 * this.setAbpDiast) {
            this.abpDiast = newAbpDiast
        } 

        let newEtCO2 = this.etco2 + (this.driftValue / 2 * this.driftDirection)
        if (newEtCO2 < 0) {
            newEtCO2 = 0
        }
        if (Math.abs(this.setEtco2 - newEtCO2) < 0.05 * this.setEtco2) {
            this.etco2 = newEtCO2
        } 
        

        this._model.components.ECG.heart_rate = parseInt(this.heartrate)
        this._model.components.Breathing.setRespRate(parseInt(this.respRate))

        if (this.send_counter >= this.send_frequency) {
            this.send_counter = 0
            sendMessage('data', 'monitor', null, this.data, null)
            this.data = []
        }
        this.send_counter += 1
    }

    sendMessage (type, target, action, data, return_tag) {
        postMessage({
          type,
          target,
          action,
          data,
          return_tag
        });
      };
}
