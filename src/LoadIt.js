import React, { Component } from 'react';
import { func, bool, number, string } from 'prop-types';

export default class LoadIt extends Component {
  static defaultProps = {
    delay: 250,
    loadingComponent: null,
    shouldLoad: null,
    timeout: null,
  };

  static propTypes = {
    delay: number,
    load: func.isRequired,
    loadingComponent: func,
    shouldLoad: bool,
    timeout: number,
  };

  state = { moduleToLoad: null, pastDelay: false, loadTimeout: false, loadError: false };

  componentDidMount() {
    this.mounted = true;

    this.handleLoadComponent(this.shouldLoad());
  }

  componentWillReceiveProps({ shouldLoad }) {
    if (this.state.moduleToLoad) return;

    clearTimeout(this.delay);
    clearTimeout(this.timeout);

    this.handleLoadComponent(this.shouldLoad(shouldLoad));
  }

  componentWillUnmount() {
    clearTimeout(this.delay);
    if (this.props.timeout) clearTimeout(this.timeout);

    this.mounted = false;
    this.delayTimer = false;
    this.timeoutTimer = false;
  }

  shouldLoad = (shouldLoad = this.props.shouldLoad) => {
    if (shouldLoad === null) return true;
    return shouldLoad;
  }

  delayTimer() {
    return setTimeout(() => {
      this.setState({ pastDelay: true });
    }, this.props.delay);
  }

  timeoutTimer() {
    return setTimeout(() => {
      this.setState({ loadTimeout: true });
    }, this.props.timeout);
  }

  handleLoadComponent = (shouldLoad) => {
    if (this.mounted === false || shouldLoad === false) return null;

    // start timers
    this.delay = this.delayTimer();
    if (this.props.timeout) (this.timeout = this.timeoutTimer());

    const { load } = this.props;
    const doLoad = Array.isArray(load) ? load[0] : load;

    return doLoad()
      .then((component) => {
        if (this.mounted === false) return;

        // @todo error msg handling
        // @todo let user have more control via render prop,
        // as this makes assumptions about the type of module being loaded
        const moduleToLoad = component && component.__esModule && component.default
          ? component.default
          : component[load[1]];

        // e.g. tests
        if (!moduleToLoad) return component;

        if (this.props.timeout) this.loadTimeout = false;
        if (this.mounted === false) return;

        this.setState({ moduleToLoad, pastDelay: false, loadTimeout: false }, () => {
          clearTimeout(this.delay);
          if (this.props.timeout) clearTimeout(this.timeout);
        });
      })
      .catch((err) => {
        this.setState(
          { loadError: err },
          () => { throw err; },
        );
      });
  }

  loaderStatusCheck = () => (
    this.state.loadError === false
      && this.state.pastDelay === false
      && this.state.loadTimeout === false
  )

  loading = () => {
    const { pastDelay, loadError, loadTimeout } = this.state;
    const { shouldLoad } = this.props;
    return (
      this.props.loadingComponent && shouldLoad
        ? this.props.loadingComponent({ pastDelay, loadError, loadTimeout })
        : null
    );
  }

  render() {
    // single-out `...rest` as `moduleToLoad` props
    const {
      delay,
      loadingComponent,
      shouldLoad,
      timeout,
      ...rest
    } = this.props;

    const { moduleToLoad } = this.state;

    return moduleToLoad !== null && this.loaderStatusCheck()
      ? React.createElement(moduleToLoad, {...rest})
      : React.createElement(this.loading);
  }
}
