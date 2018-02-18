import React, { Component } from 'react';
import { func, bool, number, string } from 'prop-types';

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
export default class LoadComponent extends Component {
  static defaultProps = {
    base: './',
    delay: 250,
    loadingComponent: null,
    shouldLoad: null,
    timeout: null,
  };

  static propTypes = {
    base: string,
    delay: number,
    loadingComponent: func,
    path: string.isRequired,
    shouldLoad: bool,
    timeout: number,
  };

  state = { moduleToLoad: null, pastDelay: false, loadTimeout: false, loadError: false };

  componentDidMount() {
    this.mounted = true;
    const { base, path } = this.props;

    this.handleLoadComponent({ base, path, shouldLoad: this.shouldLoad() });
  }

  componentWillReceiveProps({ base, path, shouldLoad }) {
    if (path === this.props.path && this.state.moduleToLoad) return;

    clearTimeout(this.delay);
    clearTimeout(this.timeout);

    this.handleLoadComponent({ base, path, shouldLoad: this.shouldLoad(shouldLoad) });
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

  handleLoadComponent = ({ base, path, shouldLoad }) => {
    if (this.mounted === false || shouldLoad === false) return null;

    // start timers
    this.delay = this.delayTimer();
    if (this.props.timeout) (this.timeout = this.timeoutTimer());

    return this.props.load()
      .then((component) => {
        if (this.mounted === false) return;
        const moduleToLoad = component.default !== undefined
          ? component.default
          : component[path];

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
