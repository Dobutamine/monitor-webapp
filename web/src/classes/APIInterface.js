/* eslint-disable */
import axios from 'axios'

// eslint-disable-next-line no-unused-vars
const testId = '736c3752-2339-4b80-a93e-bac2a4d358da'
// eslint-disable-next-line no-unused-vars
const testDateStart = '2021-02-22T10:00'

const apiRequestIdBody = {
  id: ''
}

const apiRequestBody = {
  command: '',
  id: '',
  mdn: '',
  name: '',
  dob_start: '',
  dob_end: '',
  bed_label: '',
  date_start: '',
  date_stop: '',
  duration: '',
  wave_ids: [],
  numeric_ids: [],
  alert_ids: [],
  enumerations_ids: []
}
// id: str
//     hr: float
//     sat_pre: float
//     sat_post: float
//     resp_rate: float
//     etco2: float
//     pfi: float
//     temp: float
//     abp_syst: float
//     abp_diast: float

// const serverAddress = 'http://104.248.207.9:3450/api/neo'

const serverAddressGetData = 'http://127.0.0.1:2340/getdata'
const serverAddressSetData = 'http://127.0.0.1:2340/setdata'
const serverAddressReqId = 'http://127.0.0.1:2340/reqid'
const serverAddressRemoveId = 'http://127.0.0.1:2340/removeid'

// const websocketGetData = 'ws://localhost:2340/ws_get'
// const websocketSetData = 'ws://localhost:2340/ws_set'

const websocketGetData = 'ws://104.248.90.19:8080/ws_get'
const websocketSetData = 'ws://104.248.90.19:8080/ws_set'

// const serverAddressGetData = 'http://104.248.90.19:2340/getdata'
// const serverAddressSetData = 'http://104.248.90.19:2340/setdata'
// const serverAddressReqId = 'http://104.248.90.19:2340/reqid'
// const serverAddressRemoveId = 'http://104.248.90.19:2340/removeid'

class APIInterface {
  ws_get = null
  ws_set = null

  constructor () {
    // open a get data websocket
    
  }

  openGetSocket () {
    // open a get data socket
    this.ws_get = new WebSocket(websocketGetData)

    // attach an event handler to catch the response
    this.ws_get.onmessage = this.onmessage
  }

  getData(id) {
    const newRequest = apiRequestBody

    newRequest.id = id

    this.ws_get.send(newRequest)
  }


  openSetSocket () {
    // open a set data socket
    this.ws_set = new WebSocket(websocketSetData)

    // attach an event handerl to catch the response
  }

  sendData(newData) {
    this.ws_set(newData)

  }

  

  onmessage = (ev) => {
    console.log(ev)
  }


  // removeId (newId) {
  //   const newRequest = apiRequestIdBody
  //   newRequest.id = newId
  //   return axios.post(serverAddressRemoveId, newRequest, newRequest)
  // }

  // requestId (newId) {
  //   const newRequest = apiRequestIdBody
  //   newRequest.id = newId
  //   return axios.post(serverAddressReqId, newRequest, newRequest)
  // }

}

export default APIInterface
