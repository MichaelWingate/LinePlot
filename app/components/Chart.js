var React = require('react');
var d3 = require("d3");
var ReactDOM = require("react-dom");
var _ = require("underscore");

var Chart = React.createClass({
  getInitialState: function() {
    return{
      moveActive: false,
      firstPoint: {
        x: 0,
        y: 0,
      },
      secondPoint: {
        x: 0,
        y: 0,
      },
      zoomTransforms: []
    }
  },
  componentDidMount: function() {
    this.setEvents(true);
  },
  componentDidUpdate: function() {
    this.setEvents(false);
  },
  setEvents: function(mount) {
    var svgNode = ReactDOM.findDOMNode(this.refs.svg);
    d3.select(svgNode).on("mousedown", this.onMouseDown);
    d3.select(svgNode).on("mousemove", this.onMouseMove);
    d3.select(svgNode).on("mouseup", this.onMouseUp);
    d3.select(svgNode).on("contextmenu", this.onRightClick);
    var zoom = d3.zoom()
      .scaleExtent([1,10])
      .on("zoom", this.onZoom);
    d3.select(svgNode).call(zoom);
    if(mount) {
      var allTransforms = this.state.zoomTransforms;
      allTransforms.push(d3.zoomTransform(svgNode));
      this.state.zoomTransforms = allTransforms;
    }
  },
  onRightClick: function(e) {
    d3.event.preventDefault();
  },
  onZoom: function(e) {
    var svgNode = ReactDOM.findDOMNode(this.refs.svg);
    var newZoom = d3.zoomTransform(svgNode);

    var allTransforms = this.state.zoomTransforms;
    if(this.state.zoomTransforms[this.state.zoomTransforms.length -1].k > newZoom.k) {
      allTransforms.pop();
      var oldZoom = this.state.zoomTransforms[this.state.zoomTransforms.length-1];
      newZoom.x = oldZoom.x;
      newZoom.y = oldZoom.y;
    }
    else {
      allTransforms.push(newZoom);
    }
    this.props.zoomGraph(newZoom);
    this.setState({zoomTransforms: allTransforms});
  },
  onMouseDown: function(e) {
    var svgNode = ReactDOM.findDOMNode(this.refs.svg);
    var coords = d3.mouse(svgNode);
    this.setState({ moveActive: true,
                    firstPoint: {x:coords[0], y:coords[1]},
                    secondPoint: {x:coords[0], y:coords[1]}});
  },
  onMouseMove: function(e) {
    var svgNode = ReactDOM.findDOMNode(this.refs.svg);
    var coords = d3.mouse(svgNode);
    if(this.state.moveActive) {
      this.setState({secondPoint: {x:coords[0], y:coords[1]}});
      if(this.state.firstPoint.x > this.state.secondPoint.x) {
        var left = this.state.secondPoint.x;
        var right = this.state.firstPoint.x;
      }
      else{
        var left = this.state.firstPoint.x;
        var right = this.state.secondPoint.x;
      }
      if(this.state.firstPoint.y > this.state.secondPoint.y) {
        var top = this.state.firstPoint.y;
        var bottom = this.state.secondPoint.y;
      }
      else {
        var top = this.state.secondPoint.y;
        var bottom = this.state.firstPoint.y;
      }
      this.props.selectBins(left,right,top,bottom);
    }
  },
  onMouseUp: function(e) {
    this.setState({moveActive: false});
    if(this.state.firstPoint.x == this.state.secondPoint.x && this.state.firstPoint.y == this.state.secondPoint.y) {
      this.props.unSelect();
    }
    this.props.selectIDs(this.props.selectedIDs);
  },

  render: function() {
    if( this.state.firstPoint.x > this.state.secondPoint.x) {
      var left = this.state.secondPoint.x;
    }
    else {
      var left = this.state.firstPoint.x;
    }
    if(this.state.firstPoint.y > this.state.secondPoint.y) {
      var top = this.state.secondPoint.y;
    }
    else {
      var top = this.state.firstPoint.y;
    }
    var width = Math.abs(this.state.firstPoint.x - this.state.secondPoint.x);
    var height = Math.abs(this.state.firstPoint.y - this.state.secondPoint.y);

/*    var zoom = this.state.zoomTransform;
    if(zoom != null) {
      var transform = `translate(${zoom.x},${zoom.y}) scale(${zoom.k})`;
    } else{var transform = null;}*/

    return(
      <svg ref="svg" width={this.props.width} height={this.props.height} style={{display: 'inline'}} >
      <g>
        {this.props.children}
      </g>
        {this.state.moveActive ? <rect x={left} y={top} fillOpacity="0.5" width={width} height={height} fill="#7063FF"/> : null}
      </svg>
    );
  }
});

module.exports = Chart;
