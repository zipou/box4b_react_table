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

  _updateSortField(field) {
    let {sortDir} = this.state;
    this.setState({
      sortField : field,
      sortDir : (sortDir) ? (sortDir === "ASC") ? "DESC" : "ASC" : "ASC"
    })
    ;
  }

  _handleSorting() {
    let {sortField, sortDir, list} = this.state;
    if ( ! sortField) return list;
    return list.sort((el1, el2) => {
      let cField = sortField.split(".");
      if (cField.length === 1) {
        let val =  (el1[sortField] > el2[sortField]) ?  -1 : 1;
        return (sortDir === "DESC") ? val : -1*val;
      } else {
        let one = sortField.split('.').reduce((a, b) => a[b], el1);
        let two = sortField.split('.').reduce((a, b) => a[b], el2);
        let val =  (one > two) ?  -1 : 1;
        return (sortDir === "DESC") ? val : -1*val;
      }
    })
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
    list = this._handleSorting()
    return (
      <Col>
        {panelTitle && <h2 style={{textAlign: "left"}}>{panelTitle}</h2>}
          {(list && list.length > 0) && <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover" style={{overflow : "visible"}}>
            <thead>
              <tr style={{borderColor: "#d9edf7", backgroundColor: "#c4e3f3", color : "#31708f"}}>
                {multiSelect && <td></td>}
                {fields.map((field, index)=>{
                  let classe = (colClasses && colClasses[field]) ? colClasses[field] : "";
                  return <td style={{cursor: "pointer"}} className={classe} key={index+field} onClick={this._updateSortField.bind(this, field)}>
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
                        let classe = (colClasses && colClasses[field]) ? colClasses[field] : "";
                        return <td className={classe} style={{cursor: "pointer"}} key={rowIndex + "_" + index}  onClick={(onRowClick) ? onRowClick.bind(this, list[rowIndex]) : null}>{this._getValueFromField(field, row)}</td>
                      })}
                    </tr>
                  )
                })}
            </tbody>
          </table></div>}
        {(list && list.length == 0) &&  <Alert bsStyle="warning">{emptyLabel}</Alert>}
      </Col>
    )
  }
}
