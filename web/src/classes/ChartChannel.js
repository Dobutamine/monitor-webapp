/* eslint-disable */
import * as PIXI from 'pixi.js'

class ChartChannel {
  dataY1 = []
  dataX = []
  dataUpdateInterval = 0.025
  dataPointsPerUpdate = 5
  dataInterval = 0.005
  dataArrayLength = 0
  dataCursor = 0
  width = 1000
  height = 100
  perfImprover = 2
  perfImproverCounter = 1
  chartDrawingInterval = 0.02
  chartDrawingCounter = 0
  channelNo = 1
  connected = true
  color = '0xff0000'
  xOffset = 50
  yOffset = 0
  zoom = 1
  min = 1000
  tempMinY = 1000
  max = -1000
  tempMaxY = -1000
  tempMin
  gridEnabled = false
  richText = null
  source1 = ''
  autoscale = true
  minY = 0
  maxY = 100
  maxLimit = 100
  minLimit = 0
  squeeze = 0.75
  visible = true


  constructor (stage, channel_no, configuration, dataUpdateInterval, dataPointsPerUpdate, width) {
    this.stage = stage
    this.label = configuration.curveLabel
    this.connected = configuration.connected
    this.source1 = configuration.sourceCurve
    this.timeframe = configuration.timeframe
    this.perfImprover = configuration.performance
    this.channelNo = channel_no
    this.color = configuration.color
    this.zoom = configuration.zoom
    this.gridEnabled = configuration.grid
    this.graphic1 = new PIXI.Graphics()
    this.cursor = new PIXI.Graphics()
    this.grid = new PIXI.Graphics()
    this.autoscale = configuration.autoscale
    this.minY = configuration.minY
    this.maxY = configuration.maxY
    this.limiterMax = configuration.limiterMax
    this.limiterMin = configuration.limiterMin
    this.squeezeFactor = configuration.squeezeFactor
    this.visible = true

    this.stage.addChild(this.grid)
    this.stage.addChild(this.graphic1)
    this.stage.addChild(this.cursor)
    
    this.dataUpdateInterval = dataUpdateInterval * this.perfImprover
    this.dataPointsPerUpdate = dataPointsPerUpdate
    this.dataInterval = this.dataUpdateInterval / this.dataPointsPerUpdate
    this.dataArrayLength = parseInt((this.timeframe / this.dataInterval))
    this.dataY1 = [this.dataArrayLength].fill(0)
    this.dataY2 = [this.dataArrayLength].fill(0)
    this.width = width
    let stepsizeX = (this.width - this.xOffset) / this.dataArrayLength
    for (let x = this.xOffset; x < this.width; x = x + stepsizeX) {
      this.dataX.push(x)
    }
    this.drawGrid()
    this.drawLabel()
  }

  drawLabel () {
    if (this.richText) {
      this.stage.removeChild(this.richText)
    }
  
    const style = new PIXI.TextStyle({
        fontFamily: ['Roboto', 'Arial'],
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fill: this.color, // gradient
        stroke: this.color,
        strokeThickness: 0,
        dropShadow: false,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
    });

    this.richText = new PIXI.Text(this.label, style);
    this.richText.x = 10
    this.richText.y = 10
    this.stage.addChild(this.richText)

  }
  drawGrid () {
    if (this.gridEnabled) {
      if (this.grid) {
        this.grid.clear()
      }
      this.grid.lineStyle(1, this.color, 0.5)

      const step = this.height / 4
      for (let i = 0; i < this.height; i = i + step) {
        this.grid.moveTo(0, this.yOffset - i)
        let stitcher = true
        for (let x = 0; x < this.width; x = x + 2) {
          if (stitcher) {
            this.grid.lineStyle(1, this.color, 0.5)
            this.grid.moveTo(x, this.yOffset - i)
            this.grid.lineTo(x + 2, this.yOffset - i)
            stitcher = false
          } else {
            this.grid.lineStyle(1, '0x000000', 0.5)
            this.grid.moveTo(x, this.yOffset - i)
            this.grid.lineTo(x + 2, this.yOffset - i)
            stitcher = true
          }
          
        }    
      }
    } else {
      this.grid.clear()
    }

  }
  switchOffChannel () {
    this.channelNo = 0
    this.updateSize(this.width, this.height)
  }

  updateConfiguration (configuration) {
    console.log(configuration)
    this.label = configuration.curveLabel
    this.connected = configuration.connected
    this.source1 = configuration.sourceCurve
    this.timeframe = configuration.timeframe
    this.perfImprover = configuration.performance
    this.channelNo = configuration.channelNo
    this.color = configuration.color
    this.zoom = configuration.zoom
    this.gridEnabled = configuration.grid
    this.autoscale = configuration.autoscale
    this.minY = configuration.minY
    this.maxY = configuration.maxY
    this.limiterMax = configuration.limiterMax
    this.limiterMin = configuration.limiterMin
    this.squeezeFactor = configuration.squeezeFactor

    this.setChannelColor(this.color)
    this.updateSize(this.width, this.height)

  }

  setChannelColor (channelColor) {

    this.color = channelColor.replace('#','0x')
    this.drawGrid()
    this.drawLabel()

    this.updateSize(this.width, this.height)
  }

  setChannelNo (channelNo) {
    this.channelNo = channelNo
    this.updateSize(this.width, this.height)
  }

  updateSize(width, height) {
    this.width = width
    this.height = height
    // reshape the dataX
    this.dataX = []
    let stepsizeX = (this.width - this.xOffset) / this.dataArrayLength
    for (let x = this.xOffset; x < this.width; x = x + stepsizeX) {
      this.dataX.push(x)
    }
    this.yOffset = (this.height * this.channelNo) - 30
    this.richText.y = this.yOffset - this.height / 1.5
    this.drawGrid()
  }

  update (newData) {
    if (this.perfImproverCounter >= this.perfImprover) {
      this.perfImproverCounter = 0
      if (newData) {
        
        this.maxLimit = newData[0][this.limiterMax]
        this.minLimit = 0
        if (this.limiterMin != 'zero') {
          this.minLimit = newData[0][this.limiterMin]
        }
        

        for (let index = 0; index < this.dataPointsPerUpdate; index++) {
          if (this.dataCursor > this.dataArrayLength) {
            this.dataCursor = 0
          }
          const yValue = newData[index][this.source1]
          if (this.connected) {
            this.dataY1[this.dataCursor] = yValue
          } else {
            this.dataY1[this.dataCursor] = 0
          }
          

           // find the min and max
           if (yValue > this.tempMaxY) {
            this.tempMaxY = yValue
          }
          if (yValue < this.tempMinY) {
            this.tempMinY = yValue
          }

          if (this.dataCursor === parseInt(this.dataArrayLength / 4)) {
            this.calcScaling()
          }
          
          this.dataCursor += 1

         
        }
      }
  
      if (this.chartDrawingCounter > this.chartDrawingInterval * this.perfImprover) {
        this.chartDrawingCounter = 0
        this.drawChannel()
      }
      this.chartDrawingCounter += this.dataUpdateInterval
    }
    this.perfImproverCounter += 1
  }

  calcScaling () {
    if (this.autoscale) {
      this.max = this.tempMaxY
      this.min = this.tempMinY
    } else {
      this.max = this.maxY
      this.min = this.minY
    }
    
    this.tempMaxY = -10000
    this.tempMinY = 10000
    
    // we now have to maximal values and minimal values
    // the height is 100 pixels, so the scaling is
    // max-min
    let minMax = Math.abs(this.max - this.min)
    this.factor = (minMax / (this.height * this.squeeze)) / this.zoom

    this.offset = this.min / this.factor
  } 

  drawChannel () {

    this.graphic1.clear()
    this.cursor.clear ()

    let minMax = Math.abs(this.max - this.min)
    if (this.maxLimit) {
      this.squeeze = 0.75 * ((this.maxLimit - this.minLimit) / this.squeezeFactor)
      if (this.squeeze > 1) {
        this.squeeze = 1
      }
    }


    this.factor = (minMax / (this.height * this.squeeze)) / this.zoom

    this.graphic1.lineStyle(2, this.color)
    this.graphic1.moveTo(this.xOffset, this.yOffset - this.dataY1[0]/ this.factor + this.offset)


    this.cursor.lineStyle(0, this.color)
    this.cursor.beginFill('0x000000')

    for (let cursor = 0; cursor < this.dataArrayLength; cursor++) {
      this.graphic1.lineTo(this.dataX[cursor], this.yOffset - this.dataY1[cursor]/ this.factor + this.offset)
    }

    this.cursor.drawRect(this.dataX[this.dataCursor], this.yOffset - this.height, 20, this.height)
    this.cursor.endFill()

  }

}

export default ChartChannel
