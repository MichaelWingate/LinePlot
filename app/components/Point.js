var React = require('react');
var d3 = require("d3");
var ReactDOM = require("react-dom");
var _ = require("underscore");

var Point = React.createClass({
  getInitialState: function() {
    return{
      display: false,
    }
  },
  componentDidMount: function() {
    this.setEvents();
  },
  componentDidUpdate: function() {
    this.setEvents();
  },
  setEvents: function() {
    var node = ReactDOM.findDOMNode(this);
    d3.select(node).on("mouseover", this.onMouseOver);
    d3.select(node).on("mouseout", this.onMouseOut);
  },
  onMouseOver: function() {
    this.setState({display: true});
  },
  onMouseOut: function() {
    this.setState({display: false});
  },
  render: function() {
    var props=this.props;
    return (
      <g>
        {this.state.display ?
          <g><rect x={props.x-15} y={props.y-40} width={30} height={30} fill="white" stroke="black"/>
            <text x={props.x-10} y={props.y-20}>{this.props.data.ID}</text></g>
          : null}
        <circle cx={props.x} cy={props.y} stroke={"black"} strokeWidth={props.border} stroke={props.strokeColor} fill={props.color} r={props.size} />
      </g>
    )
  }
});

module.exports = Point;
