<template>
    <q-card>
        <div :class="chartClass" :id="id"></div>
        <q-resize-observer @resize="onResize" />
  </q-card>
</template>

<script>
/* eslint-disable */
import {
  lightningChart, Themes, AxisScrollStrategies, AxisTickStrategies, ColorRGBA, SolidFill, AppDeploymentLicenseInformation, emptyFill, EmptyFill
} from '@arction/lcjs'

export default {
    props: {
        chartNo: {
            required: true,
            type: String
        }
    },
    data () {
        return {
            id: '',
            chartXY: null,
            chartClass: 'rectangle',
            chartXAxis: null,
            chartYAxis: null,
            chartLineSeries1: null,
            chartLineSeries2: null,
            chartLineSeries3: null,
            chartLineSeries4: null,
            chartLineSeries5: null,
            chartLineSeries6: null,
            chartData1: [],
            chartData2: [],
            chartData3: [],
            chartData4: [],
            chartData5: [],
            chartData6: [],
            data_pos_counter: 0,
            dataFrame: 5.0,
            height: '100px'
        }
    },
    methods: {
        drawChart (data) {
            this.chartLineSeries1.clear()
            this.chartLineSeries2.clear()
            this.chartLineSeries3.clear()
            this.chartLineSeries4.clear()
            this.chartLineSeries5.clear()
            this.chartLineSeries6.clear()
            
            let samples = 0
            if (data) {
                samples = parseInt(this.dataFrame / 0.005)
                data.forEach(data => {
          
                    if (this.chartData1.length < samples) {
                        this.chartData1.push({ x: this.data_pos_counter, y: data.ecg_signal })
                        this.chartData2.push({ x: this.data_pos_counter, y: data.sat_signal })
                        this.chartData3.push({ x: this.data_pos_counter, y: data.abp_signal })
                        this.chartData4.push({ x: this.data_pos_counter, y: data.etco2_signal })
                        this.chartData5.push({ x: this.data_pos_counter, y: data.abp_signal })
                        this.chartData6.push({ x: this.data_pos_counter, y: data.etco2_signal })
                    } else {
                        this.chartData1[this.data_pos_counter] = { x: this.data_pos_counter, y: data.ecg_signal }
                        this.chartData2[this.data_pos_counter] = { x: this.data_pos_counter, y: data.sat_signal }
                        this.chartData3[this.data_pos_counter] = { x: this.data_pos_counter, y: data.abp_signal }
                        this.chartData4[this.data_pos_counter] = { x: this.data_pos_counter, y: data.etco2_signal }
                        this.chartData5[this.data_pos_counter] = { x: this.data_pos_counter, y: data.abp_signal }
                        this.chartData6[this.data_pos_counter] = { x: this.data_pos_counter, y: data.etco2_signal }
                    }

                    this.data_pos_counter += 1 
                    if (this.data_pos_counter > samples) {
                        this.data_pos_counter = 0
                    }
                })
                this.chartLineSeries1.add(this.chartData1)
                this.chartLineSeries2.add(this.chartData2)
                this.chartLineSeries3.add(this.chartData3)
                this.chartLineSeries4.add(this.chartData4)
                this.chartLineSeries5.add(this.chartData5)
                this.chartLineSeries6.add(this.chartData6)
            }
        },
        onResize (size) {  
            if (this.chart) {
                if (size) {
                    this.chart.engine.renderFrame(size.width, this.height)
                }    
            }
        },
        buildChart () {
            const lcjs = lightningChart('0001-0f544-ff4da-13d27-27adc-57692-8feb5-71b65-ba948-ce67f-3e8c5-7ae78-a8034-b8f28-00100-00c8f-4375e')
            
            this.chartXY = lcjs.ChartXY({
                container: this.id,
                theme: Themes.dark,
                disableAnimations: false,
                responsive: true,
                maintainAspectRatio: true
            })

            this.chartXY.onResize((chart, width, height, engineWidth, engineHeight) => {
                console.log('Chart resized', 'width', width, 'height', height, 'engineWidth', engineWidth, 'engineHeight', engineHeight)
            })
            
            // configure the chart without border or title
            this.chartXY.setTitle('')
            this.chartXY.setTitleMarginTop(0)
            this.chartXY.setTitleFillStyle(emptyFill)
            this.chartXY.setPadding({ top: 0, bottom: 0, left: 0, right: 0 })

            // configure the x-axis
            this.chartXAxis = this.chartXY.getDefaultAxisX()
            this.chartXAxis.setAnimationZoom(undefined)
            this.chartXAxis.setScrollStrategy(AxisScrollStrategies.fitting)
            this.chartXAxis.setTickStrategy(AxisTickStrategies.Empty)
            this.chartXAxis.setTitleFillStyle(EmptyFill)
            this.chartXAxis.setAxisInteractionZoomByDragging(false)
            this.chartXAxis.setAxisInteractionZoomByWheeling(false)
            this.chartXAxis.setAxisInteractionPanByDragging(false)
            this.chartXAxis.setStrokeStyle((style) => style.setThickness(0))

            // configure the y-axis
            this.chartYAxis = this.chartXY.getDefaultAxisY()
            this.chartYAxis.setAnimationZoom(undefined)
            this.chartYAxis.setScrollStrategy(AxisScrollStrategies.fitting)
            this.chartYAxis.setTickStrategy(AxisTickStrategies.Empty)
            this.chartYAxis.setTitleFillStyle(EmptyFill)
            this.chartYAxis.setAxisInteractionZoomByDragging(false)
            this.chartYAxis.setAxisInteractionZoomByWheeling(false)
            this.chartYAxis.setAxisInteractionPanByDragging(false)
            this.chartYAxis.setStrokeStyle((style) => style.setThickness(0))

            // configure a dataserie
            this.chartLineSeries1 = this.chartXY.addLineSeries()
            this.chartLineSeries1.setCursorEnabled(false)
            this.chartLineSeries1.setStrokeStyle((style) => style.setThickness(2))
            this.chartLineSeries1.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(200, 0, 0) })))

            this.chartLineSeries2 = this.chartXY.addLineSeries()
            this.chartLineSeries2.setCursorEnabled(false)
            this.chartLineSeries2.setStrokeStyle((style) => style.setThickness(2))
            this.chartLineSeries2.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) })))

            this.chartLineSeries3 = this.chartXY.addLineSeries()
            this.chartLineSeries3.setCursorEnabled(false)
            this.chartLineSeries3.setStrokeStyle((style) => style.setThickness(2))
            this.chartLineSeries3.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(200, 0, 0) })))

            this.chartLineSeries4 = this.chartXY.addLineSeries()
            this.chartLineSeries4.setCursorEnabled(false)
            this.chartLineSeries4.setStrokeStyle((style) => style.setThickness(2))
            this.chartLineSeries4.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) })))

            this.chartLineSeries5 = this.chartXY.addLineSeries()
            this.chartLineSeries5.setCursorEnabled(false)
            this.chartLineSeries5.setStrokeStyle((style) => style.setThickness(2))
            this.chartLineSeries5.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) })))

            this.chartLineSeries6 = this.chartXY.addLineSeries()
            this.chartLineSeries6.setCursorEnabled(false)
            this.chartLineSeries6.setStrokeStyle((style) => style.setThickness(2))
            this.chartLineSeries6.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) })))

            
        },
        buildEventHandler () {
            this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
                if (message.data.target === 'monitor') {
                    this.drawChart(message.data.data)
                }
            })
        }
    },
    mounted () {
        this.buildChart()
        this.buildEventHandler()
        this.onResize()

    },
    beforeMount () {
        this.id = 'lightning' + this.chartNo
    },
    beforeDestroy () {
        this.chart.dispose()
        this.chart = undefined
        this.chartXAxis = undefined
        this.chartYAxis = undefined
    }
}
</script>

<style>

</style>