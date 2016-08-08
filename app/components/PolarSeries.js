var React = require('react');
var d3 = require("d3");
var ReactDOM = require("react-dom");
var _ = require("underscore");
var Chart = require("./Chart");
var Axis = require("./Axis");
var Point = require("./Point");
var IconPoint = require("./IconPoint");
var Line = require("./Line");

var polarX = function(r,i,theta) {
  return(r*Math.cos(i*theta));
};
var polarY = function(r,i,theta) {
  return(r*Math.sin(i*theta));
};
var PolarSeries = React.createClass({
  getInitialState: function() {
    return({
      selection: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      areaSelecting: false,
      zoomTransform: null
    })
  },
  getDefaultProps: function(){
    return {
      title: "",
      colors: d3.scaleOrdinal(d3.schemeCategory10),
      selectedLine: [],
    }
  },
  selectPoints: function(left,right,top,bottom) {
    this.setState({
      selection: {
        left: left,
        right: right,
        top: top,
        bottom: bottom,
      },
      areaSelecting: true,
    });
  },
  unSelectPoints: function() {
    this.setState({
      selection: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      areaSelecting: false,
    });
  },
  zoomGraph: function(transform) {
    this.setState({zoomTransform: transform});
  },
  render: function() {
    var props = this.props;

    var xRadius = (props.width-props.padding-props.padding)/2;
    var yRadius = (props.height - props.padding-props.padding)/2;
    var radiusMin = d3.min([xRadius,yRadius]);

    var rMin = d3.min(props.data, function(value) {return value[props.measurement]});
    var rMax = d3.max(props.data, function(value) {return value[props.measurement]});
    var radiusRange = [50,radiusMin];

    var radiusScale = d3.scaleLinear()
      .domain([rMin,rMax])
      .range(radiusRange);

    var data = [];
    var theta = 2*Math.PI / props.data.length;
    props.data.map(function(value,i) {
      var cx = polarX(radiusScale(value[props.measurement]),i,theta);
      var cy = polarY(radiusScale(value[props.measurement]),i,theta);
      var values = {cx: cx, cy: cy, data: value};
      data.push(values);
    })

    var xMin = d3.min(data, function(value) {return Math.abs(value.cx);});
    var xMax = d3.max(data, function(value) {return Math.abs(value.cx);});
    var yMin = d3.min(data, function(value) {return Math.abs(value.cy);});
    var yMax = d3.max(data, function(value) {return Math.abs(value.cy);});

    var xRange = [props.padding, props.width-props.padding];
    var yRange = [props.height - props.padding, props.padding];

    if(this.state.zoomTransform != null) {
      var kT = this.state.zoomTransform.k;
      var xT = this.state.zoomTransform.x;
      var yT = this.state.zoomTransform.y;
      var xRange = xRange.map(function(point,i){
        return(point*kT+xT);
      });
      var yRange = yRange.map(function(point,i){
        return(point*kT+yT);
      });
    }

    var xScale = d3.scaleLinear()
      .domain([-xMax,xMax])
      .range(xRange);

    var yScale = d3.scaleLinear()
      .domain([-yMax,yMax])
      .range(yRange);

    var leftSelect = this.state.selection.left;
    var rightSelect = this.state.selection.right;
    var topSelect = this.state.selection.top;
    var bottomSelect = this.state.selection.bottom;

    var ids = [];
    var selecting = this.state.areaSelecting;
    var points = data.map(function(value,i) {
      var x = xScale(value.cx);
      var y = yScale(value.cy);
      var strokeColor = "black";
      var size = 20;
      if(selecting) {
        if(x >= leftSelect && x <= rightSelect && y <= topSelect && y >= bottomSelect){
          strokeColor = "red";
          ids.push(value.data[props.id]);
        }
      }
      if(props.selectedPoints != []) {
        props.selectedPoints.map(function(id,i){
          if(id[props.id] == value.data[props.id]) {
            size = 30;
          }
        })
      }
      if(props.icons) {
        if(value.data["Weather"] == "Sunny") {var image = "/sunny.png";}
        else if(value.data["Weather"] == "Mostly Sunny") {var image = "/Mostly sunny.png";}
        else if(value.data["Weather"] == "Partly Cloudy") {var image = "/partly cloudy.png";}
        else if(value.data["Weather"] == "Mostly Cloudy") {var image = "/cloudy.png";}
        else if(value.data["Weather"] == "Rain") {var image = "/rainy.png";}
        else if(value.data["Weather"] == "Thunderstorms") {var image = "/thunderstorms.png";}
        var renderPoint = <IconPoint x={x} y={y} key={i} size={size} image={image} strokeColor={strokeColor} data={value.data}/>;
      }
      else {
        var radius = size/4;
        var renderPoint = <Point x={x} y={y} key={i} color="black" strokeColor={strokeColor} size={radius} border={radius/3} data={value.data}/>;
      }
      return(<g key={i}>{renderPoint}</g>)
    });

    var xAxis = <line x1={xRange[0]} x2={xRange[1]} y1={yScale(0)} y2={yScale(0)} stroke="black" strokeWidth={2} />;
    var yAxis = <line x1={xScale(0)} x2={xScale(0)} y1={yRange[0]} y2={yRange[1]} stroke="black" strokeWidth={2} />;

    return(
      <Chart width={props.width} height={props.height} selectBins={this.selectPoints} unSelect={this.unSelectPoints} displaySelected={props.displaySelected}
        selectedIDs={ids} selectIDs={props.displaySelected} zoomGraph={this.zoomGraph}>
        {xAxis}{yAxis}
        {points}
      </Chart>
    )
  }
});

module.exports = PolarSeries;
