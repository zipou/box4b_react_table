"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require("react-bootstrap");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyTable = function (_React$Component) {
  _inherits(MyTable, _React$Component);

  function MyTable(props) {
    _classCallCheck(this, MyTable);

    var _this = _possibleConstructorReturn(this, (MyTable.__proto__ || Object.getPrototypeOf(MyTable)).call(this, props));

    _this.state = {
      list: props.list,
      sortField: null,
      sortDir: "ASC",
      selected: {}
    };
    return _this;
  }

  _createClass(MyTable, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        list: nextProps.list
      });
    }
  }, {
    key: "_getFilteredValue",
    value: function _getFilteredValue(field, el, row) {
      var filters = this.props.filters;

      return filters && filters[field] ? filters[field](el ? el : row) : el;
    }
  }, {
    key: "_getValueFromField",
    value: function _getValueFromField(field, value) {
      var array = field.split(".");
      if (array.length == 1) {
        return this._getFilteredValue(field, value[array[0]], row);
      } else {
        var val = value[array[0]];
        array.shift();
        return this._getValueFromField(array.length == 1 ? array[0] : array.join("."), val);
      }
    }
  }, {
    key: "_handleSorting",
    value: function _handleSorting(field) {
      var sortDir = this.state.sortDir ? this.state.sortDir === "ASC" ? "DESC" : "ASC" : "ASC";
      var list = this.state.list.sort(function (el1, el2) {
        var cField = field.split(".");
        if (cField.length === 1) {
          var val = el1[field] > el2[field] ? -1 : 1;
          return sortDir === "DESC" ? val : -1 * val;
        } else {
          var one = field.split('.').reduce(function (a, b) {
            return a[b];
          }, el1);
          var two = field.split('.').reduce(function (a, b) {
            return a[b];
          }, el2);
          var _val = one > two ? -1 : 1;
          return sortDir === "DESC" ? _val : -1 * _val;
        }
      });
      this.setState({
        sortField: field,
        sortDir: sortDir,
        list: list
      });
    }
  }, {
    key: "_handleSelect",
    value: function _handleSelect(row, event) {
      var checked = event.target.checked;
      var selected = this.state.selected;

      if (checked) {
        selected[row.id] = row;
      } else {
        delete selected[row.id];
      }
      this.setState({
        selected: selected
      });
      if (this.props.onSelect) {
        this.props.onSelect(selected);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          fields = _props.fields,
          labels = _props.labels,
          filters = _props.filters,
          labelPrefix = _props.labelPrefix,
          onRowClick = _props.onRowClick,
          panelTitle = _props.panelTitle,
          multiSelect = _props.multiSelect,
          emptyLabel = _props.emptyLabel;
      var list = this.state.list;

      return _react2.default.createElement(
        _reactBootstrap.Col,
        null,
        panelTitle && _react2.default.createElement(
          "h2",
          { style: { textAlign: "left" } },
          panelTitle
        ),
        list && list.length > 0 && _react2.default.createElement(
          _reactBootstrap.Table,
          { striped: true, bordered: true, hover: true },
          _react2.default.createElement(
            "thead",
            null,
            _react2.default.createElement(
              "tr",
              { style: { borderColor: "#d9edf7", backgroundColor: "#c4e3f3", color: "#31708f" } },
              multiSelect && _react2.default.createElement("td", null),
              fields.map(function (field, index) {
                return _react2.default.createElement(
                  "td",
                  { style: { cursor: "pointer" }, key: index + field, onClick: _this2._handleSorting.bind(_this2, field) },
                  _react2.default.createElement(
                    "span",
                    { style: { fontSize: 16 } },
                    labels && labels[field] ? labels[field] : (labelPrefix ? labelPrefix : "") + field
                  )
                );
              })
            )
          ),
          _react2.default.createElement(
            "tbody",
            null,
            list && list.map(function (row, rowIndex) {
              return _react2.default.createElement(
                "tr",
                { key: "row" + rowIndex },
                multiSelect && _react2.default.createElement(
                  "td",
                  { key: rowIndex + "_select" },
                  _react2.default.createElement("input", { type: "checkbox", onChange: _this2._handleSelect.bind(_this2, row) })
                ),
                fields.map(function (field, index) {
                  return _react2.default.createElement(
                    "td",
                    { style: { cursor: "pointer" }, key: rowIndex + "_" + index, onClick: onRowClick ? onRowClick.bind(_this2, list[rowIndex]) : null },
                    _this2._getValueFromField(field, row)
                  );
                })
              );
            })
          )
        ),
        list && list.length == 0 && _react2.default.createElement(
          _reactBootstrap.Alert,
          { bsStyle: "warning" },
          emptyLabel
        )
      );
    }
  }]);

  return MyTable;
}(_react2.default.Component);

MyTable.propTypes = {
  list: _react2.default.PropTypes.array,
  fields: _react2.default.PropTypes.array,
  labels: _react2.default.PropTypes.object,
  filters: _react2.default.PropTypes.object,
  onRowClick: _react2.default.PropTypes.func,
  panelTitle: _react2.default.PropTypes.string,
  emptyLabel: _react2.default.PropTypes.string,
  multiSelect: _react2.default.PropTypes.bool
};
exports.default = MyTable;
