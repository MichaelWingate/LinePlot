var React = require('react');
var d3 = require("d3");
var ReactDOM = require("react-dom");
var _ = require("underscore");
var Chart = require("./Chart");
var Axis = require("./Axis");
var Point = require("./Point");
var IconPoint = require("./IconPoint");

var LineSeries = React.createClass({
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

    var objData = _.groupBy(props.data, props.group);
    var groups = _.uniq(_.pluck(props.data,props.group));
    var data = [];
    groups.map(function(group,i){
      data[i] = objData[groups[i]];
    })

    var dateParse = d3.timeParse("%m-%d-%y");
    var yMax = [];
    var yMin = [];
    var xMin = [];
    var xMax = [];
    data.map(function(group,i) {
      yMin[i] = d3.min(props.data, function(value) {return value[props.yMeasurement];});
      yMax[i] = d3.max(props.data, function(value) {return value[props.yMeasurement];});
      xMin[i] = d3.min(props.data, function(value) {return dateParse(value[props.xMeasurement]);});
      xMax[i] = d3.max(props.data, function(value) {return dateParse(value[props.xMeasurement]);});
    })
    var actualYMax = d3.max(yMax);
    var actualYMin = d3.min(yMin);
    var actualXMax = d3.max(xMax);
    var actualXMin = d3.min(xMin);

    if(this.state.zoomTransform != null) {
      var kT = this.state.zoomTransform.k;
      var xT = this.state.zoomTransform.x;
      var yT = this.state.zoomTransform.y;
      var xRange = [(props.padding*kT)+xT,((props.width-props.padding)*kT)+xT];
      var yRange = [((props.height-props.padding)*kT)+yT,(props.padding*kT)+yT];
    }
    else {
      var xRange = [props.padding, props.width - props.padding];
      var yRange = [props.height - props.padding, props.padding];
    }
    var xScale = d3.scaleTime()
      .domain([actualXMin,actualXMax])
      .range(xRange);

    var yScale = d3.scaleLinear()
      .domain([actualYMin, actualYMax])
      .range(yRange);


    var leftSelect = this.state.selection.left;
    var rightSelect = this.state.selection.right;
    var topSelect = this.state.selection.top;
    var bottomSelect = this.state.selection.bottom;

    var points = [];
    var circles = [];
    var allCircles = [];
    var ids = [];
    var selecting = this.state.areaSelecting;
    data.map(function(group,j) {
      points[j] = [];
      circles[j] = group.map(function(value,i) {
        var x = xScale(dateParse(value[props.xMeasurement]));
        var y = yScale(value[props.yMeasurement]);
        var color = props.colors(j);
        var strokeColor = "black";
        var size = 20;
        points[j].push({x:x,y:y});
        if(selecting) {
          if(x >= leftSelect && x <= rightSelect && y <= topSelect && y >= bottomSelect){
            strokeColor = "red";
            ids.push(value[props.id]);
          }
        }
        if(props.selectedPoints != []) {
          props.selectedPoints.map(function(id,i){
            if(id[props.id] == value[props.id]) {
              size = 30;
            }
          })
        }
        if(props.icons) {
          if(value["Weather"] == "Sunny") {var image = "/sunny.png";}
          else if(value["Weather"] == "Mostly Sunny") {var image = "/Mostly sunny.png";}
          else if(value["Weather"] == "Partly Cloudy") {var image = "/partly cloudy.png";}
          else if(value["Weather"] == "Mostly Cloudy") {var image = "/cloudy.png";}
          else if(value["Weather"] == "Rain") {var image = "/rainy.png";}
          else if(value["Weather"] == "Thunderstorms") {var image = "/thunderstorms.png";}
          var renderPoint = <IconPoint x={x} y={y} key={j+" - "+i} size={size} image={image} strokeColor={strokeColor} data={value}/>;
        }
        else {
          var radius = size/4;
          var renderPoint = <Point x={x} y={y} key={j + " - " + i} color={color} strokeColor={strokeColor} size={radius} border={radius/3} data={value}/>;
        }
        return(
          <g key={j+" - "+i}>{renderPoint}</g>
        )
      });
      allCircles = allCircles.concat(circles[j]);
    })

    var lineStyle = {
      fill: 'none',
      strokeWidth: '3px'
    };

    var lines = data.map(function(group,j) {
      var path = d3.line()
      .x(function(d) {return d.x;})
      .y(function(d) {return d.y;})
      .curve(d3.curveLinear)
      (points[j]);

      return(
        <path ref={"line" + j} style={lineStyle} d={path} stroke={props.colors(j)} key={j}/>
      )
    })

    var legend = groups.map(function(group,i){
      var transform = `translate(-50,${20*i})`;
      var legendLabel = group.charAt(0).toUpperCase() + group.slice(1);
      return (<g key={i} transform={transform}><circle transform={`translate(-10,-5)`} r={7} fill={props.colors(i)} />
      <text fill={props.colors(i)}>{legendLabel}</text></g>)
    });


    var xLabel = props.xMeasurement.charAt(0).toUpperCase() + props.xMeasurement.slice(1);
    var yLabel = props.yMeasurement.charAt(0).toUpperCase() + props.yMeasurement.slice(1);
    var yTransform = `translate(${props.padding}, 0)`;
    var xTransform = `translate(0, ${props.height - props.padding})`;
    var legendTransform = `translate(${props.width-props.padding}, ${props.padding})`;
    return(
      <Chart width={props.width} height={props.height} selectBins={this.selectPoints} unSelect={this.unSelectPoints} displaySelected={props.displaySelected}
      selectedIDs={ids} selectIDs={props.displaySelected} zoomGraph={this.zoomGraph}>
        <Axis orient={"bottom"} scale={xScale} transform={xTransform} width={props.width} height={props.height} label={xLabel} />
        <Axis orient={"left"} scale={yScale} transform={yTransform} width={props.width} height={props.height} label={yLabel} />
          {lines}
          {allCircles}
          <g transform={legendTransform}>{legend}</g>
      </Chart>
    )
  }
});

module.exports = LineSeries;
