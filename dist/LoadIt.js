'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BASE_PATH_DEFAULT = './';

/**
* LoadComponent
*
* Code splits and lazy loads components from current component directory ("./").
* This reduces the entry chunk significantly and does not load paths the user never visits.
*
* The key factor to this is using "import()" (proposed to TC39 and currently at
* stage 3). There are alternatives, but webpack includes
* "import()" by default, which is amazingly helpful.
*
* Further reading: https://github.com/tc39/proposal-dynamic-import
* For status updates: https://github.com/babel/proposals
*
* Available props:
*  * path {str}    component path to load (i.e. Home)
*/

var LoadComponent = function (_Component) {
  _inherits(LoadComponent, _Component);

  function LoadComponent() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, LoadComponent);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LoadComponent.__proto__ || Object.getPrototypeOf(LoadComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = { moduleToLoad: null, pastDelay: false, loadTimeout: false, loadError: false }, _this.shouldLoad = function () {
      var shouldLoad = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props.shouldLoad;

      if (shouldLoad === null) return true;
      return shouldLoad;
    }, _this.handleLoadComponent = function (_ref2) {
      var base = _ref2.base,
          path = _ref2.path,
          shouldLoad = _ref2.shouldLoad;

      if (_this.mounted === false || shouldLoad === false) return null;

      // start timers
      _this.delay = _this.delayTimer();
      if (_this.props.timeout) _this.timeout = _this.timeoutTimer();

      // return import(`${base || BASE_PATH_DEFAULT}${path}.js`)
      return _this.props.load().then(function (component) {
        if (_this.mounted === false) return;
        var moduleToLoad = component.default !== undefined ? component.default : component[path];

        if (_this.props.timeout) _this.loadTimeout = false;
        if (_this.mounted === false) return;

        _this.setState({ moduleToLoad: moduleToLoad, pastDelay: false, loadTimeout: false }, function () {
          clearTimeout(_this.delay);
          if (_this.props.timeout) clearTimeout(_this.timeout);
        });
      }).catch(function (err) {
        _this.setState({ loadError: err }, function () {
          throw err;
        });
      });
    }, _this.loaderStatusCheck = function () {
      return _this.state.loadError === false && _this.state.pastDelay === false && _this.state.loadTimeout === false;
    }, _this.loading = function () {
      var _this$state = _this.state,
          pastDelay = _this$state.pastDelay,
          loadError = _this$state.loadError,
          loadTimeout = _this$state.loadTimeout;
      var shouldLoad = _this.props.shouldLoad;

      return _this.props.loadingComponent && shouldLoad ? _this.props.loadingComponent({ pastDelay: pastDelay, loadError: loadError, loadTimeout: loadTimeout }) : null;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  /**
   * share
   *
   * Share component resources (e.g. components lazy-loaded that you only want to be loaded once)
   * between LoadIt components.
   *
   * NOTE: This is an anti-pattern. Only use this if you haven't used webpack's (up to v3.*.*)
   * CommonsChunkPlugin (see README for instructions)
   * to group components loaded in more than one module into a bundle.
   *
   * @return {obj}    `get`: access data via key; `set`: provided an object, will cache the object for retrieval
   */


  _createClass(LoadComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.mounted = true;
      var _props = this.props,
          base = _props.base,
          path = _props.path;


      this.handleLoadComponent({ base: base, path: path, shouldLoad: this.shouldLoad() });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref3) {
      var base = _ref3.base,
          path = _ref3.path,
          shouldLoad = _ref3.shouldLoad;

      if (path === this.props.path && this.state.moduleToLoad) return;

      clearTimeout(this.delay);
      clearTimeout(this.timeout);

      this.handleLoadComponent({ base: base, path: path, shouldLoad: this.shouldLoad(shouldLoad) });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.delay);
      if (this.props.timeout) clearTimeout(this.timeout);

      this.mounted = false;
      this.delayTimer = false;
      this.timeoutTimer = false;
    }
  }, {
    key: 'delayTimer',
    value: function delayTimer() {
      var _this2 = this;

      return setTimeout(function () {
        _this2.setState({ pastDelay: true });
      }, this.props.delay);
    }
  }, {
    key: 'timeoutTimer',
    value: function timeoutTimer() {
      var _this3 = this;

      return setTimeout(function () {
        _this3.setState({ loadTimeout: true });
      }, this.props.timeout);
    }
  }, {
    key: 'render',
    value: function render() {
      // single-out `...rest` as `moduleToLoad` props
      var _props2 = this.props,
          base = _props2.base,
          delay = _props2.delay,
          loadingComponent = _props2.loadingComponent,
          path = _props2.path,
          shouldLoad = _props2.shouldLoad,
          timeout = _props2.timeout,
          rest = _objectWithoutProperties(_props2, ['base', 'delay', 'loadingComponent', 'path', 'shouldLoad', 'timeout']);

      var moduleToLoad = this.state.moduleToLoad;


      return moduleToLoad !== null && this.loaderStatusCheck() ? _react2.default.createElement(moduleToLoad, _extends({}, rest)) : _react2.default.createElement(this.loading);
    }
  }]);

  return LoadComponent;
}(_react.Component);

LoadComponent.defaultProps = {
  base: './',
  delay: 250,
  loadingComponent: null,
  shouldLoad: null,
  timeout: null
};
LoadComponent.propTypes = {
  base: _propTypes.string,
  delay: _propTypes.number,
  loadingComponent: _propTypes.func,
  path: _propTypes.string.isRequired,
  shouldLoad: _propTypes.bool,
  timeout: _propTypes.number
};

LoadComponent.share = function () {
  var shareCache = void 0;
  return {
    get: function get(key) {
      return shareCache[key];
    },
    set: function set(obj) {
      shareCache = obj;
    }
  };
};

exports.default = LoadComponent;