'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _core = require('../plugins/core');

var _core2 = _interopRequireDefault(_core);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _schema2 = require('./schema');

var _schema3 = _interopRequireDefault(_schema2);

var _state = require('./state');

var _state2 = _interopRequireDefault(_state);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Debug.
 *
 * @type {Function}
 */

var debug = (0, _debug2.default)('slate:stack');

/**
 * Methods that are triggered on events and can change the state.
 *
 * @type {Array}
 */

var EVENT_HANDLER_METHODS = ['onBeforeInput', 'onBlur', 'onFocus', 'onCopy', 'onCut', 'onDrop', 'onKeyDown', 'onPaste', 'onSelect'];

/**
 * Methods that accumulate an updated state.
 *
 * @type {Array}
 */

var STATE_ACCUMULATOR_METHODS = ['onBeforeChange', 'onChange'];

/**
 * Default properties.
 *
 * @type {Object}
 */

var DEFAULTS = {
  plugins: [],
  schema: new _schema3.default()
};

/**
 * Stack.
 *
 * @type {Stack}
 */

var Stack = function (_ref) {
  _inherits(Stack, _ref);

  function Stack() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, Stack);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Stack.__proto__ || Object.getPrototypeOf(Stack)).call.apply(_ref2, [this].concat(args))), _this), _this.render = function (state, editor, props) {
      debug('render');
      var plugins = _this.plugins.slice().reverse();
      var children = void 0;

      for (var i = 0; i < plugins.length; i++) {
        var plugin = plugins[i];
        if (!plugin.render) continue;
        children = plugin.render(props, state, editor);
        props.children = children;
      }

      return children;
    }, _this.renderPortal = function (state, editor) {
      debug('renderPortal');
      var portals = [];

      for (var i = 0; i < _this.plugins.length; i++) {
        var plugin = _this.plugins[i];
        if (!plugin.renderPortal) continue;
        var portal = plugin.renderPortal(state, editor);
        if (portal == null) continue;
        portals.push(portal);
      }

      return portals;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Stack, [{
    key: 'kind',


    /**
     * Get the kind.
     *
     * @return {String}
     */

    get: function get() {
      return 'stack';
    }

    /**
     * Invoke `render` on all of the plugins in reverse, building up a tree of
     * higher-order components.
     *
     * @param {State} state
     * @param {Editor} editor
     * @param {Object} children
     * @param {Object} props
     * @return {Component}
     */

    /**
     * Invoke `renderPortal` on all of the plugins, building a list of portals.
     *
     * @param {State} state
     * @param {Editor} editor
     * @return {Array}
     */

  }], [{
    key: 'create',


    /**
     * Constructor.
     *
     * @param {Object} properties
     *   @property {Array} plugins
     *   @property {Schema|Object} schema
     *   @property {Function} ...handlers
     */

    value: function create(properties) {
      var plugins = resolvePlugins(properties);
      var schema = resolveSchema(plugins);
      return new Stack({ plugins: plugins, schema: schema });
    }
  }]);

  return Stack;
}(new _immutable.Record(DEFAULTS));

/**
 * Mix in the event handler methods.
 *
 * @param {State} state
 * @param {Editor} editor
 * @param {Mixed} ...args
 * @return {State|Null}
 */

var _loop = function _loop(i) {
  var method = EVENT_HANDLER_METHODS[i];
  Stack.prototype[method] = function (state, editor) {
    debug(method);

    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    for (var k = 0; k < this.plugins.length; k++) {
      var plugin = this.plugins[k];
      if (!plugin[method]) continue;
      var next = plugin[method].apply(plugin, args.concat([state, editor]));
      if (next == null) continue;
      assertState(next);
      return next;
    }

    return state;
  };
};

for (var i = 0; i < EVENT_HANDLER_METHODS.length; i++) {
  _loop(i);
}

/**
 * Mix in the state accumulator methods.
 *
 * @param {State} state
 * @param {Editor} editor
 * @param {Mixed} ...args
 * @return {State|Null}
 */

var _loop2 = function _loop2(i) {
  var method = STATE_ACCUMULATOR_METHODS[i];
  Stack.prototype[method] = function (state, editor) {
    debug(method);

    if (method == 'onChange') {
      state = this.onBeforeChange(state, editor);
    }

    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    for (var k = 0; k < this.plugins.length; k++) {
      var plugin = this.plugins[k];
      if (!plugin[method]) continue;
      var next = plugin[method].apply(plugin, args.concat([state, editor]));
      if (next == null) continue;
      assertState(next);
      state = next;
    }

    return state;
  };
};

for (var i = 0; i < STATE_ACCUMULATOR_METHODS.length; i++) {
  _loop2(i);
}

/**
 * Assert that a `value` is a state object.
 *
 * @param {Mixed} value
 */

function assertState(value) {
  if (_state2.default.isState(value)) return;
  throw new Error('A plugin returned an unexpected state value: ' + value);
}

/**
 * Resolve a schema from a set of `plugins`.
 *
 * @param {Array} plugins
 * @return {Schema}
 */

function resolveSchema(plugins) {
  var rules = [];

  for (var i = 0; i < plugins.length; i++) {
    var plugin = plugins[i];
    if (plugin.schema == null) continue;
    var _schema = _schema3.default.create(plugin.schema);
    rules = rules.concat(_schema.rules);
  }

  var schema = _schema3.default.create({ rules: rules });
  return schema;
}

/**
 * Resolve an array of plugins from `properties`.
 *
 * In addition to the plugins provided in `properties.plugins`, this will
 * create two other plugins:
 *
 * - A plugin made from the top-level `properties` themselves, which are
 * placed at the beginning of the stack. That way, you can add a `onKeyDown`
 * handler, and it will override all of the existing plugins.
 *
 * - A "core" functionality plugin that handles the most basic events in Slate,
 * like deleting characters, splitting blocks, etc.
 *
 * @param {Object} props
 * @return {Array}
 */

function resolvePlugins(props) {
  var _props$plugins = props.plugins,
      plugins = _props$plugins === undefined ? [] : _props$plugins,
      overridePlugin = _objectWithoutProperties(props, ['plugins']);

  var corePlugin = (0, _core2.default)(props);
  return [overridePlugin].concat(_toConsumableArray(plugins), [corePlugin]);
}

/**
 * Export.
 *
 * @type {Stack}
 */

exports.default = Stack;