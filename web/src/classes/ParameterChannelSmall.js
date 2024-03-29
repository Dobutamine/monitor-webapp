/* eslint-disable */
import * as PIXI from "pixi.js";

class ParameterChannelSmall {
  stage = null;
  value = null;
  label = null;
  alarmUpper = null;
  alarmLower = null;
  caption = "";
  lowerAlarm = 0;
  upperAlarm = 100;
  mmhg = true;
  factor = 1;
  decimals = 0;
  alarmEnabled = false;
  alarmState = false;
  redAlarmState = false;
  prevRedAlarmState = false;
  prevAlarmState = false;
  redAlarmEnabled = true;
  width = 100;
  visible = true;
  styleLabel = null;
  styleValue = null;
  styleAlarm = null;
  source1 = "";
  source2 = "";
  dataPointsPerUpdate = 5;
  fontSizeLabel = 12;
  fontSizeValue = 72;
  fontSizeAlarms = 10;
  fontFactorLabel = 1;
  fontFactorValue = 1;
  fontFactorAlarms = 1;
  meanValue = 0;

  constructor(
    stage,
    channel_no,
    configuration,
    dataUpdateInterval,
    dataPointsPerUpdate,
    width
  ) {
    this.stage = stage;
    this.width = width;
    this.dataPointsPerUpdate = dataPointsPerUpdate;
    this.channelNo = channel_no;
    this.color = configuration.color;
    this.source1 = configuration.source1;
    this.source2 = configuration.source2;
    this.visible = configuration.connected;
    this.lowerAlarm = configuration.lowerAlarm;
    this.upperAlarm = configuration.upperAlarm;
    this.alarmEnabled = configuration.alarmEnabled;
    this.caption = configuration.label;
    this.styleLabel = new PIXI.TextStyle({
      fontFamily: ["Roboto", "Arial"],
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: "normal",
      fill: this.color, // gradient
      stroke: this.color,
      strokeThickness: 0,
      dropShadow: false,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round"
    });

    this.label = new PIXI.Text(this.caption, this.styleLabel);

    this.styleValue = new PIXI.TextStyle({
      fontFamily: ["Roboto", "Arial"],
      fontSize: 72,
      fontStyle: "normal",
      fontWeight: "normal",
      fill: this.color, // gradient
      stroke: this.color,
      strokeThickness: 0,
      dropShadow: false,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round"
    });

    this.value = new PIXI.Text("-", this.styleValue);
    this.value.channelNo = this.channelNo;

    this.styleAlarm = new PIXI.TextStyle({
      fontFamily: ["Roboto", "Arial"],
      fontSize: 8,
      fontStyle: "normal",
      fontWeight: "normal",
      fill: this.color, // gradient
      stroke: this.color,
      strokeThickness: 0,
      dropShadow: false,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round"
    });
    this.alarmLower = new PIXI.Text("10", this.styleAlarm);
    this.alarmUpper = new PIXI.Text("100", this.styleAlarm);

    this.stage.addChild(this.label);
    this.stage.addChild(this.value);
    this.stage.addChild(this.alarmLower);
    this.stage.addChild(this.alarmUpper);
  }
  updateConfiguration(newconfig) {
    this.upperAlarm = newconfig.upperAlarm;
    this.lowerAlarm = newconfig.lowerAlarm;
    this.alarmEnabled = newconfig.alarmEnabled;
    this.color = newconfig.color;
    this.source1 = newconfig.source1;
    this.source2 = newconfig.source2;
    this.caption = newconfig.label;
    this.label.text = this.caption;
    this.visible = newconfig.visible;
    this.styleLabel.fill = this.color;
    this.mmhg = newconfig.mmhg;
    if (this.mmhg) {
      this.factor = 1;
      this.decimals = 0;
    } else {
      this.factor = 0.1333;
      this.decimals = 1;
    }

    this.alarmLower.text = this.lowerAlarm;
    this.alarmUpper.text = this.upperAlarm;
    this.styleAlarm.fill = this.color;

    this.styleValue.fill = this.color;

    if (!this.alarmEnabled) {
      this.styleAlarm.fill = "#000000";
    }

    this.updateSize(this.width, this.height);
  }
  updateSize(width, height) {
    this.width = width;
    this.height = height;
    this.yOffset = this.height * (this.channelNo - 6) - 30;

    this.label.x = this.width / 2;
    this.label.y = this.yOffset - this.height / 1.5;
    this.value.y = this.yOffset - this.height / 1.75;
    this.value.x = 25 + this.width / 2;

    this.alarmUpper.x = this.width / 2;
    this.alarmLower.x = this.width / 2;

    this.alarmUpper.y = this.yOffset - this.height / 2;
    this.alarmLower.y = this.yOffset - this.height / 2.5;

    if (this.source2 != "") {
      this.fontSizeValue = 28;
    } else {
      this.fontSizeValue = 42;
    }

    if (this.height > 100) {
      this.fontFactorLabel = 0.75;
      this.fontFactorValue = 0.75;
      this.fontFactorAlarms = 0.75;
    }

    if (this.height > 75) {
      this.fontFactorLabel = 1;
      this.fontFactorValue = 1;
      this.fontFactorAlarms = 1;
    }

    if (this.height > 50 && this.height < 75) {
      this.fontFactorLabel = 1.5;
      this.fontFactorValue = 1.5;
      this.fontFactorAlarms = 1.5;
    }

    if (this.height > 25 && this.height < 50) {
      this.fontFactorLabel = 2;
      this.fontFactorValue = 2;
      this.fontFactorAlarms = 2;
    }

    this.styleLabel.fontSize = parseInt(
      this.fontSizeLabel / this.fontFactorLabel
    );
    this.styleValue.fontSize = parseInt(
      this.fontSizeValue / this.fontFactorValue
    );
    this.styleAlarm.fontSize = parseInt(
      this.fontSizeAlarms / this.fontFactorAlarms
    );

    this.label.text = this.caption;
    this.alarmLower.text = this.lowerAlarm;
    this.alarmUpper.text = this.upperAlarm;
  }

  update(data) {
    if (!this.visible) {
      this.currentValue = "-";
      this.value.text = "-";
      return;
    }
    if (this.source1 != "empty") {
      if (this.source2 != "") {
        this.currentValue =
          data[this.dataPointsPerUpdate - 1][this.source1] * this.factor;
        this.currentValue2 =
          data[this.dataPointsPerUpdate - 1][this.source2] * this.factor;
        this.meanValue = parseInt(
          (2 * this.currentValue2 + this.currentValue) / 3
        );
        if (isNaN(this.currentValue)) {
          this.value.text = "-";
        } else {
          this.value.text =
            this.currentValue.toFixed(this.decimals) +
            "/" +
            this.currentValue2.toFixed(this.decimals) +
            "\n (" +
            this.meanValue.toFixed(this.decimals) +
            ")";
        }
      } else {
        const value =
          data[this.dataPointsPerUpdate - 1][this.source1] * this.factor;
        this.currentValue = value;
        if (isNaN(value)) {
          this.value.text = "-";
        } else {
          if (this.label.text === "Temp") {
            this.value.text = value.toFixed(1);
          } else {
            this.value.text = value.toFixed(this.decimals);
          }
        }
      }
    } else {
      // now we have to change to state to empty and make sure the alarms are turned off
      this.value.text = "";
      this.alarmUpper.text = "";
      this.alarmLower.text = "";
      this.label.text = "";
      this.alarmEnabled = false;
    }

    if (!this.alarmEnabled) {
      this.styleAlarm.fill = "#000000";
      // console.log(this.source1)
    }
  }
  checkAlarm(blinker) {
    // current alarm state
    this.alarmState = false;
    this.redAlarmState = false;

    let alarmChange = {
      yellow: 0,
      red: 0
    };

    if (this.currentValue < this.lowerAlarm) {
      this.alarmState = true;
    }

    if (this.currentValue > this.upperAlarm) {
      this.alarmState = true;
    }

    if (this.alarmState === true && this.prevAlarmState === false) {
      // increase the counter
      alarmChange.yellow = 1;
    }
    if (this.alarmState === false && this.prevAlarmState === true) {
      // decrease the counter
      alarmChange.yellow = -1;
    }

    if (this.redAlarmEnabled) {
      if (this.currentValue < this.lowerAlarm - this.lowerAlarm * 0.15) {
        this.redAlarmState = true;
      }

      if (this.currentValue > this.upperAlarm + this.upperAlarm * 0.15) {
        this.redAlarmState = true;
      }

      if (this.redAlarmState === true && this.prevRedAlarmState === false) {
        // increase the counter
        alarmChange.red = 1;
      }
      if (this.redAlarmState === false && this.prevRedAlarmState === true) {
        // decrease the counter
        alarmChange.red = -1;
      }
    }

    this.prevAlarmState = this.alarmState;
    this.prevRedAlarmState = this.redAlarmState;

    if (this.alarmEnabled && this.alarmState === true) {
      if (blinker) {
        this.styleValue.fill = this.color;
      } else {
        this.styleValue.fill = "#000000";
      }
    } else {
      this.styleValue.fill = this.color;
    }

    if (this.alarmEnabled) {
      return alarmChange;
    } else {
      return { yellow: 0, red: 0 };
    }
  }
}

export default ParameterChannelSmall;
