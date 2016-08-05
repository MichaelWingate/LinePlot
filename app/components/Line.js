var React = require('react');
var d3 = require("d3");
var ReactDOM = require("react-dom");
var _ = require("underscore");

var Line = React.createClass({
  getInitialState: function() {
    return{
      display: false,
      locked: false,
    }
  },
  componentDidMount: function() {
    this.setEvents(true);
  },
  componentDidUpdate: function() {
    this.setEvents(false);
  },
  setEvents: function(mount) {
    var node = ReactDOM.findDOMNode(this);
    d3.select(node).on("mouseover", this.onHover);
    d3.select(node).on("mouseout", this.onMouseOut);
    d3.select(node).on("mousedown", this.click);
  },
  onHover: function() {
    this.setState({display: true});
  },
  onMouseOut: function() {
    if(!this.state.locked) {
      this.setState({display: false});
    }
  },
  click: function() {
    this.setState({locked: !this.state.locked});
  },
  render: function() {
    var props = this.props;

    if(this.state.display) {
        var lineStyle = {
        fill: 'none',
        strokeWidth: '3px',
        opacity: '1'
      };
    }
    else {
      var lineStyle = {
        fill: 'none',
        strokeWidth: '3px',
        opacity: '0'
      };
    }

    return(
      <path style={lineStyle} d={props.path} stroke={props.color}/>
    )
  },
});

module.exports = Line;
