import React from "react";
import {Panel, Button, Table, Col, Alert} from "react-bootstrap";

export default class MyTable extends React.Component {

  static propTypes= {
    list : React.PropTypes.array,
    fields : React.PropTypes.array,
    labels : React.PropTypes.object,
    filters : React.PropTypes.object,
    onRowClick : React.PropTypes.func,
    panelTitle : React.PropTypes.string,
    emptyLabel : React.PropTypes.string,
    multiSelect : React.PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state={
      list: props.list,
      sortField: null,
      sortDir: "ASC",
      selected: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list : nextProps.list
    })
  }

  _getFilteredValue(field, el, row) {
    let {filters} = this.props;
    return (filters && filters[field]) ? filters[field]((el) ? el : row) : el;
  }

  _getValueFromField(field, value) {
    let array = field.split(".");
    if (array.length == 1) {
      return this._getFilteredValue(field, value[array[0]], value);
    }
    else {
      let val = value[array[0]];
      array.shift();
      return this._getValueFromField((array.length == 1) ? array[0] : array.join("."), val);
    }
  }

  _handleSorting(field) {
    let sortDir = (this.state.sortDir) ? (this.state.sortDir === "ASC") ? "DESC" : "ASC" : "ASC";
    let list = this.state.list.sort((el1, el2) => {
      let cField = field.split(".");
      if (cField.length === 1) {
        let val =  (el1[field] > el2[field]) ?  -1 : 1;
        return (sortDir === "DESC") ? val : -1*val;
      } else {
        let one = field.split('.').reduce((a, b) => a[b], el1);
        let two = field.split('.').reduce((a, b) => a[b], el2);
        let val =  (one > two) ?  -1 : 1;
        return (sortDir === "DESC") ? val : -1*val;
      }
    })
    this.setState({
      sortField: field,
      sortDir: sortDir,
      list: list
    });
  }

  _handleSelect(row, event) {
    let checked=event.target.checked;
    let {selected} = this.state;
    if (checked) {
      selected[row.id] = row;
    } else {
      delete selected[row.id];
    }
    this.setState({
      selected
    });
    if (this.props.onSelect) {
      this.props.onSelect(selected);
    }
  }

  render() {
    let {fields, labels, filters, labelPrefix, onRowClick, panelTitle, multiSelect, emptyLabel, colClasses} = this.props;
    let {list} = this.state;
    return (
      <Col>
        {panelTitle && <h2 style={{textAlign: "left"}}>{panelTitle}</h2>}
          {(list && list.length > 0) && <Table striped bordered hover>
            <thead>
              <tr style={{borderColor: "#d9edf7", backgroundColor: "#c4e3f3", color : "#31708f"}}>
                {multiSelect && <td></td>}
                {fields.map((field, index)=>{
                  let classe = (colClasses && colClasses[field]) ? colClasses[field] : "";
                  return <td style={{cursor: "pointer"}} className={classe} key={index+field} onClick={this._handleSorting.bind(this, field)}>
                      <span style={{fontSize:16}}>{(labels && labels[field]) ? labels[field] : ((labelPrefix) ? labelPrefix : "") + field}</span>
                    </td>
                })}
              </tr>
            </thead>
            <tbody>
                {list && list.map((row, rowIndex) =>{
                  return(
                    <tr key={"row"+rowIndex}>
                      {multiSelect && <td key={rowIndex + "_select"}><input type="checkbox" onChange={this._handleSelect.bind(this, row)}></input></td>}
                      {fields.map((field, index)=>{
                        return <td style={{cursor: "pointer"}} key={rowIndex + "_" + index}  onClick={(onRowClick) ? onRowClick.bind(this, list[rowIndex]) : null}>{this._getValueFromField(field, row)}</td>
                      })}
                    </tr>
                  )
                })}
            </tbody>
          </Table>}
        {(list && list.length == 0) &&  <Alert bsStyle="warning">{emptyLabel}</Alert>}
      </Col>
    )
  }
}
