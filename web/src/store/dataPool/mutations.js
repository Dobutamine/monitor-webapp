/* eslint-disable */
export function id(state, value) {
  state.id = value;
}

export function heartrate(state, value) {
  state.heartrate = value;
}

export function satPre(state, value) {
  state.satPre = value;
}

export function satPost(state, value) {
  state.satPost = value;
}


export function respRate(state, value) {
  state.respRate = value;
}


export function etco2(state, value) {
  state.etco2 = value;
}

export function temp(state, value) {
  state.temp = value;
}

export function pfi(state, value) {
  state.pfi = value;
}

export function cvp(state, value) {
  state.cvp = value;
}


export function abpSyst(state, value) {
  state.abpSyst = value;
}

export function abpDiast(state, value) {
  state.abpDiast = value;
}


export function papSyst(state, value) {
  state.papSyst = value;
}

export function papDiast(state, value) {
  state.papDiast = value;
}


export function imageName(state, value) {
  state.imageName = value;
}

export function resusState(state, value) {
  state.resusState = value;
}

export function rhythmType(state, value) {
  state.rhythmType = value;
}

export function intubated(state, value) {
  state.intubated = value;
}

export function rhythmParameter(state, value) {
  state.rhythmParameter = value;
}

export function compressionsFrequency(state, value) {
  state.compressionsFrequency = value;
}

export function alarmOverride(state, value) {
  state.alarmOverride = value;
}

export function alarmEnabled(state, value) {
  state.alarmEnabled = value;
}

export function channelConfigChanged(state, value) {
  state.channelConfigChanged = value;
}

export function channelConfigurations(state, newConfig) {
  state.channelConfigurations = newConfig;
}

export function ResetAlarmCounter(state) {
  state.alarmCounter = 0;
}

export function IncreaseAlarmCounter(state, value) {
  state.alarmCounter += value;
}

export function DecreaseAlarmCounter(state, value) {
  state.alarmCounter -= value;
}

export function ResetRedAlarmCounter(state) {
  state.redAlarmCounter = 0;
}

export function IncreaseRedAlarmCounter(state, value) {
  state.redAlarmCounter += value;
}

export function DecreaseRedAlarmCounter(state, value) {
  state.redAlarmCounter -= value;
}

export function blinkerState(state, value) {
  state.blinkerState = value;
}

export function configurationUpdateCounter (state, value) {
  state.configurationUpdateCounter = value;
}

export function apiUrl (state, value) {
  state.apiUrl = value;
}

export function apiWebSocketUrl (state, value) {
  state.apiWebSocketUrl = value;
}
