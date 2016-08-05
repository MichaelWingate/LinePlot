var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');
var $ = require('jquery');
var LinePlot = require('./components/LinePlot');

var LinePlotApp = React.createClass({
  getInitialState: function() {
    return({
      data: [],
      ids: [],
      selected: [],
      height: 800,
      width: 800,
      icons: false,
      style: "normal",
      y: "Temp",
    })
  },
  componentWillMount: function(){
    $.ajax({
        type: "GET",
        url: "temps.csv",
        dataType: "text",
        async: false,
        success: function(allText) {
          var allTextLines = allText.split(/\r\n|\n/);
          var headers = allTextLines[0].split(',');
          var lines = [];

          for (var i=1; i<allTextLines.length; i++) {
              var data = allTextLines[i].split(',');
              if (data.length == headers.length) {

                  var tarr = {};
                  for (var j=0; j<headers.length; j++) {
                      tarr[headers[j]] = data[j];
                  }
                  lines.push(tarr);
              }
          }
          this.setState({data: lines})
        }.bind(this)
     });
  },
  displaySelected: function(ids) {
    this.setState({ids: ids});
  },
  rowClick: function(value) {
    var newSelected = [];

    var found = false;
    this.state.selected.map(function(selection) {
      if(selection.ID == value.ID) {
        found = true;
      }
      else {
        newSelected.push(selection);
      }
    })
    if(found != true) {
      newSelected.push(value);
    }
    this.setState({selected: newSelected});
  },
  iconChange: function(e) {
    if(e.currentTarget.value == "false") {
      var value = false;
    }
    if(e.currentTarget.value == "true") {
      var value = true;
    }
    this.setState({icons: value});
  },
  styleChange: function(e) {
    this.setState({style: e.currentTarget.value});
  },
  yChange: function(e) {
    this.setState({y: e.currentTarget.value});
  },
  onSubmit: function(event) {
    event.preventDefault();
    var height = Number(ReactDOM.findDOMNode(this.refs.height).value);
    var width = Number(ReactDOM.findDOMNode(this.refs.width).value);

    this.setState({
      height: height,
      width: width,
    });
  },
  render: function(){
    var state = this.state;
    var rowClick = this.rowClick;
    if(this.state.ids.length == 0) {
      var tableData = this.state.data;
    }
    else {
      var tableData = this.state.data.filter(function(value) {
        value.ID
        var found = false;
        state.ids.map(function(id) {
          if(value.ID == id) {
            found = true;
          }
        })
        return found;
      });
    }
    return(
      <div>
      <div style={{float: 'left'}} className="table">
        <table>
          <tbody>
          <tr><th>ID</th><th>Date</th><th>Temp</th><th>Location</th><th>Weather</th></tr>
            {tableData.map(function(value,i) {
              var style = {};
              state.selected.map(function(selection) {
                if(value.ID == selection.ID) {
                  style = {backgroundColor: 'red'};
                }
              })
              return (<tr onClick={this.rowClick.bind(this,value)} style={style} key={i}><td>{value.ID}</td><td>{value.Date}</td><td>{value.Temp}</td><td>{value.Location}</td><td>{value.Weather}</td></tr>);
            }.bind(this))}
          </tbody>
        </table>
      </div>
      <div style={{float: 'right'}}  className="chart">
        {this.state.data != [] ? <LinePlot height={this.state.height} width={this.state.width} data={this.state.data} xMeasurement={"Date"} yMeasurement={this.state.y} id={"ID"} group={"Location"}
          displaySelected={this.displaySelected} pointSelected={this.state.selected} icons={this.state.icons} style={this.state.style}/> : null}
      </div>
      <div style={{clear: 'right', float: 'right'}} className="form">
        <form onSubmit={this.onSubmit}>
          Height: <input type="text" ref="height" defaultValue={this.state.height} /><br/>
          Width: <input type="text" ref="width" defaultValue={this.state.width} /><br/>
          Icons: <br/><input type="radio" name="icons" value="false" checked={!this.state.icons} onChange={this.iconChange}/>None <br/>
                    <input type="radio" name="icons" value="true" checked={this.state.icons} onChange={this.iconChange}/>Icons <br/>
          Style: <br/><input type="radio" name="style" value="normal" checked={this.state.style == "normal"} onChange={this.styleChange}/>Normal <br/>
                      <input type="radio" name="style" value="cumulative" checked={this.state.style == "cumulative"} onChange={this.styleChange}/>Cumulative <br/>
                      <input type="radio" name="style" value="categorical" checked={this.state.style == "categorical"} onChange={this.styleChange}/>Categorical <br/>
                      <input type="radio" name="style" value="polar" checked={this.state.style == "polar"} onChange={this.styleChange}/>Polar <br/>
          yMeasurement: <br/><input type="radio" name="y" value="Temp" checked={this.state.y == "Temp"} onChange={this.yChange}/>Temperature <br />
                        <input type="radio" name="y" value="Weather" checked={this.state.y == "Weather"} onChange={this.yChange}/>Weather <br/>
          <input type="submit" value="Submit" />
        </form>
      </div>
      </div>
    )
  }
});

ReactDOM.render(<LinePlotApp />, app);
