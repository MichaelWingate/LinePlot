var React = require('react');
var d3 = require("d3");
var ReactDOM = require("react-dom");
var _ = require("underscore");

var Axis = React.createClass({
  componentDidMount: function() {
    this.renderAxis();
  },
  componentDidUpdate: function() {
    this.renderAxis();
  },
  renderAxis: function() {
    var axisNode = ReactDOM.findDOMNode(this.refs.axis);
    var labelNode = ReactDOM.findDOMNode(this.refs.label);
    if(this.props.orient == "left"){
      var axis = d3.axisLeft(this.props.scale)
    }
    else if(this.props.orient == "bottom") {
      var axis = d3.axisBottom(this.props.scale);
    }
    d3.select(axisNode).call(axis);
  },
  render() {
    if(this.props.orient == "left"){
      var transform=`rotate(-90)translate(${-this.props.height/2},-30)`;
    }
    else {
      var transform=`translate(${this.props.width/2},35)`;
    }
    return(
      <g className="axisGroup" transform={this.props.transform} >
        <g className="axis" ref="axis" />
        <g className="axisLabel" ref="label">
          <text textAnchor="middle" transform={transform}>{this.props.label}</text>
        </g>
      </g>
    );
  }

});

module.exports = Axis;
