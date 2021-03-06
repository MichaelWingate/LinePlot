var React = require('react');
var d3 = require("d3");
var ReactDOM = require("react-dom");
var _ = require("underscore");
var LineSeries = require("./LineSeries");
var CumulativeSeries = require("./CumulativeSeries");
var CategoricalSeries = require("./CategoricalSeries");
var PolarSeries = require("./PolarSeries");

var LinePlot = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    data: React.PropTypes.array.isRequired,
    xMeasurement: React.PropTypes.string.isRequired,
    yMeasurement: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    group: React.PropTypes.string.isRequired,
  },
  getDefaultProps: function() {
    return{
      icons: false,
    }
  },
  render: function() {
    var props = this.props;
    var yMeasurement = props.yMeasurement;
    if(yMeasurement == "Weather" && (props.style == "cumulative" || props.style == "normal")) {
      var newData = [];
      props.data.map(function(value,i) {
        if(value[props.yMeasurement] == "Sunny") {
          value.weatherNum = 2;
        }
        else if(value[props.yMeasurement] == "Mostly Sunny") {
          value.weatherNum = 1;
        }
        else if(value[props.yMeasurement] == "Partly Cloudy") {
          value.weatherNum = 0;
        }
        else if(value[props.yMeasurement] == "Mostly Cloudy") {
          value.weatherNum = -1;
        }
        else if(value[props.yMeasurement] == "Rain" || value[props.yMeasurement] == "Thunderstorms") {
          value.weatherNum = -2;
        }
      })
      yMeasurement="weatherNum";
    }
    else if(yMeasurement == "Weather" && (props.style == "polar")) {
      var newData = [];
      props.data.map(function(value,i) {
        if(value[props.yMeasurement] == "Sunny") {
          value.weatherNum = 5;
        }
        else if(value[props.yMeasurement] == "Mostly Sunny") {
          value.weatherNum = 4;
        }
        else if(value[props.yMeasurement] == "Partly Cloudy") {
          value.weatherNum = 3;
        }
        else if(value[props.yMeasurement] == "Mostly Cloudy") {
          value.weatherNum = 2;
        }
        else if(value[props.yMeasurement] == "Rain" || value[props.yMeasurement] == "Thunderstorms") {
          value.weatherNum = 1;
        }
      })
      yMeasurement="weatherNum";
    }
    if(props.style == "normal") {
      var lineSeries = <LineSeries data={props.data} width={props.width} height={props.height} padding={50} xMeasurement={props.xMeasurement} yMeasurement={yMeasurement} id={props.id} group={props.group}
        displaySelected={props.displaySelected} selectedPoints={props.pointSelected} icons={props.icons} />;
    }
    else if(props.style == "cumulative") {
      var lineSeries = <CumulativeSeries data={props.data} width={props.width} height={props.height} padding={50} xMeasurement={props.xMeasurement} yMeasurement={yMeasurement} id={props.id} group={props.group}
        displaySelected={props.displaySelected} selectedPoints={props.pointSelected} icons={props.icons} />
    }
    else if(props.style == "categorical") {
      var lineSeries = <CategoricalSeries data={props.data} width={props.width} height={props.height} padding={50} xMeasurement={props.xMeasurement} yMeasurement={yMeasurement} id={props.id}
        displaySelected={props.displaySelected} selectedPoints={props.pointSelected} icons={props.icons} />
    }
    else if(props.style == "polar") {
      var lineSeries = <PolarSeries data={props.data}  width={props.width} height={props.height} padding={50} measurement={yMeasurement} id={props.id} displaySelected={props.displaySelected}
        selectedPoints={props.pointSelected} icons={props.icons} />
    }
    return(
      <g>{lineSeries}</g>
    )
  }
});

module.exports = LinePlot;
