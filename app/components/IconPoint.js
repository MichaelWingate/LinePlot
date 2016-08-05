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
    var x = props.x-props.size/2;
    var y = props.y-props.size/2;
    //<text x={x+1} y={y+(props.size)} style={{fontFamily: 'FontAwesome', fontSize: `${props.size}px`}}>{'\uf083'}</text>
    //<text className="material-icons" x={x+1} y={y+(props.size)} style={{fontSize: `${props.size}px`}}>&#xe3dd;</text>
    return (
      <g>
      {this.state.display ?
        <g><rect x={props.x-15} y={props.y-45} width={30} height={30} fill="white" stroke="black"/>
          <text x={props.x-10} y={props.y-25}>{this.props.data.ID}</text></g>
        : null}
      <rect x={x} y={y+5} width={props.size+2} height={props.size+2} style={{fill: 'white'}} stroke={props.strokeColor} strokeWidth={2}/>
      <image x={x+1} y={y+6} width={props.size} height={props.size} href={props.image} />
      </g>
    )
  }
});

module.exports = Point;
