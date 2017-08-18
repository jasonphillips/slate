'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _reactPortal = require('react-portal');

var _reactPortal2 = _interopRequireDefault(_reactPortal);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _stack = require('../models/stack');

var _stack2 = _interopRequireDefault(_stack);

var _propTypes3 = require('../utils/prop-types');

var _propTypes4 = _interopRequireDefault(_propTypes3);

var _noop = require('../utils/noop');

var _noop2 = _interopRequireDefault(_noop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:editor');

/**
 * Event handlers to mix in to the editor.
 *
 * @type {Array}
 */

var EVENT_HANDLERS = ['onBeforeInput', 'onBlur', 'onFocus', 'onCopy', 'onCut', 'onDrop', 'onKeyDown', 'onPaste', 'onSelect'];

/**
 * Plugin-related properties of the editor.
 *
 * @type {Array}
 */

var PLUGINS_PROPS = [].concat(EVENT_HANDLERS, ['placeholder', 'placeholderClassName', 'placeholderStyle', 'plugins', 'schema']);

/**
 * Editor.
 *
 * @type {Component}
 */

var Editor = function (_React$Component) {
  _inherits(Editor, _React$Component);

  /**
   * When constructed, create a new `Stack` and run `onBeforeChange`.
   *
   * @param {Object} props
   */

  /**
   * Property types.
   *
   * @type {Object}
   */

  function Editor(props) {
    _classCallCheck(this, Editor);

    var _this = _possibleConstructorReturn(this, (Editor.__proto__ || Object.getPrototypeOf(Editor)).call(this, props));

    _initialiseProps.call(_this);

    _this.tmp = {};
    _this.state = {};

    // Create a new `Stack`, omitting the `onChange` property since that has
    // special significance on the editor itself.

    var onChange = props.onChange,
        rest = _objectWithoutProperties(props, ['onChange']); // eslint-disable-line no-unused-vars


    var stack = _stack2.default.create(rest);
    _this.state.stack = stack;

    // Resolve the state, running `onBeforeChange` first.
    var state = stack.onBeforeChange(props.state, _this);
    _this.cacheState(state);
    _this.state.state = state;

    // Create a bound event handler for each event.

    var _loop = function _loop(i) {
      var method = EVENT_HANDLERS[i];
      _this[method] = function () {
        var _this$state$stack;

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var next = (_this$state$stack = _this.state.stack)[method].apply(_this$state$stack, [_this.state.state, _this].concat(args));
        _this.onChange(next);
      };
    };

    for (var i = 0; i < EVENT_HANDLERS.length; i++) {
      _loop(i);
    }
    return _this;
  }

  /**
   * When the `props` are updated, create a new `Stack` if necessary, and
   * run `onBeforeChange`.
   *
   * @param {Object} props
   */

  /**
   * Default properties.
   *
   * @type {Object}
   */

  /**
   * Cache a `state` in memory to be able to compare against it later, for
   * things like `onDocumentChange`.
   *
   * @param {State} state
   */

  /**
   * Programmatically blur the editor.
   */

  /**
   * Programmatically focus the editor.
   */

  /**
   * Get the editor's current schema.
   *
   * @return {Schema}
   */

  /**
   * Get the editor's current state.
   *
   * @return {State}
   */

  /**
   * When the `state` changes, pass through plugins, then bubble up.
   *
   * @param {State} state
   */

  _createClass(Editor, [{
    key: 'render',


    /**
     * Render the editor.
     *
     * @return {Element}
     */

    value: function render() {
      var props = this.props,
          state = this.state;
      var stack = state.stack;

      var children = stack.renderPortal(state.state, this).map(function (child, i) {
        return _react2.default.createElement(
          _reactPortal2.default,
          { key: i, isOpened: true },
          child
        );
      });

      debug('render', { props: props, state: state });

      var tree = stack.render(state.state, this, _extends({}, props, { children: children }));
      return tree;
    }
  }]);

  return Editor;
}(_react2.default.Component);

/**
 * Mix in the property types for the event handlers.
 */

Editor.propTypes = {
  autoCorrect: _propTypes2.default.bool,
  autoFocus: _propTypes2.default.bool,
  className: _propTypes2.default.string,
  onBeforeChange: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onDocumentChange: _propTypes2.default.func,
  onSelectionChange: _propTypes2.default.func,
  placeholder: _propTypes2.default.any,
  placeholderClassName: _propTypes2.default.string,
  placeholderStyle: _propTypes2.default.object,
  plugins: _propTypes2.default.array,
  readOnly: _propTypes2.default.bool,
  role: _propTypes2.default.string,
  schema: _propTypes2.default.object,
  spellCheck: _propTypes2.default.bool,
  state: _propTypes4.default.state.isRequired,
  style: _propTypes2.default.object,
  tabIndex: _propTypes2.default.number };
Editor.defaultProps = {
  autoFocus: false,
  autoCorrect: true,
  onChange: _noop2.default,
  onDocumentChange: _noop2.default,
  onSelectionChange: _noop2.default,
  plugins: [],
  readOnly: false,
  schema: {},
  spellCheck: true };

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.componentWillReceiveProps = function (props) {
    var stack = _this2.state.stack;

    // If any plugin-related properties will change, create a new `Stack`.

    for (var _i = 0; _i < PLUGINS_PROPS.length; _i++) {
      var prop = PLUGINS_PROPS[_i];
      if (props[prop] == _this2.props[prop]) continue;

      var onChange = props.onChange,
          rest = _objectWithoutProperties(props, ['onChange']); // eslint-disable-line no-unused-vars


      stack = _stack2.default.create(rest);
      _this2.setState({ stack: stack });
    }

    // Resolve the state, running the before change handler of the stack.
    var state = stack.onBeforeChange(props.state, _this2);
    _this2.cacheState(state);
    _this2.setState({ state: state });
  };

  this.cacheState = function (state) {
    _this2.tmp.document = state.document;
    _this2.tmp.selection = state.selection;
  };

  this.blur = function () {
    var state = _this2.state.state.transform().blur().apply();

    _this2.onChange(state);
  };

  this.focus = function () {
    var state = _this2.state.state.transform().focus().apply();

    _this2.onChange(state);
  };

  this.getSchema = function () {
    return _this2.state.stack.schema;
  };

  this.getState = function () {
    return _this2.state.state;
  };

  this.onChange = function (state) {
    if (state == _this2.state.state) return;
    var tmp = _this2.tmp,
        props = _this2.props;
    var stack = _this2.state.stack;
    var onChange = props.onChange,
        onDocumentChange = props.onDocumentChange,
        onSelectionChange = props.onSelectionChange;
    var document = tmp.document,
        selection = tmp.selection;


    state = stack.onChange(state, _this2);
    onChange(state);
    if (state.document != document) onDocumentChange(state.document, state);
    if (state.selection != selection) onSelectionChange(state.selection, state);
  };
};

for (var i = 0; i < EVENT_HANDLERS.length; i++) {
  var property = EVENT_HANDLERS[i];
  Editor.propTypes[property] = _propTypes2.default.func;
}

/**
 * Export.
 *
 * @type {Component}
 */

exports.default = Editor;