[![Build Status](https://travis-ci.org/jtrein/react-loadit.svg?branch=master)](https://travis-ci.org/jtrein/react-loadit)

# React LoadIt
Simple, tiny React component lazy-loader. Splits your React app at defined points at the component-level, so there's no unnecessary code delivered.

*Published from a part of a private project I wrote. Thought I'd share it with you.*

PS - If you're looking for a full-on, feature-rich version, I would use [react-loadable](https://github.com/jamiebuilds/react-loadable).

## Install
`yarn add react-loadit`

 > * The build is CommonJS and works also with `import/export` using Babel.

## Usage

Example of conditionally loading inside a modal.

```js
<div>
  {this.state.clicked && (
    <Modal>
      <LoadIt {...otherProps} load={() => import('./OtherComponent')} />
    </Modal>
  )}
</div>
```

### Webpack ideal setup

```js
// webpack.config.js

// ...

// for dynamic imports this takes care of
// grouping loaded chunks, to load only *once*
// NOTE: Webpack 4 might negate the need for this
new CommonsChunkPlugin({
  minChunks: 2,
  children: true,
  deepChildren: true,
  async: true,
}),

// ...
```

## Demo

Run `yarn && yarn start` from a directory inside `./examples`.

> *Dependencies: You'll need to install `create-react-app` globally.

## API

### `load`

*func|arr, **required***
* *Default export: `() => import(...)`*
* *Named (single) export: `[() => import('./Exported'), 'SomeExport']`*
  * *@todo - multiple named exports?*

A component to dynamically load.

**Default export**

```js
<LoadIt load={() => import('./LoadMe')} />
```

**Named export**

```js
<LoadIt load={[ () => import('./LoadMe'), 'LoadThisExport' ]} />
```

### `loadingComponent`

*func: (obj) => element*

```js
const renderLoading = ({ loadError, loadTimeout, pastDelay }) => {
  if (loadError) {
    return <div>Load error</div>;
  } else if (pastDelay && !loadTimeout) {
    return <LoadingSkeleton />;
  } else if (loadTimeout) {
    return <div>Taking awhile...</div>;
  }
  return null;
};
```

Return an optional component to show while loading. Passes an object to be used to create a more complex loading component (e.g. load fails).

* `loadError` (*bool*) - `true` if load failed.
* `loadTimeout` (*bool*) - `true` if `timeout` prop is set and timeout length has past.
* `pastDelay` (*bool*) - `true` if `delay` is set and delay time has past.

### `delay`

*int (default: 250)*

```js
<LoadIt delay={200} loadingComponent={...} ... />
```

Good to use for components that are taking awhile (> ~200ms) to load (possibly on a slow connection, or the component is large in size). Use with `loadingComponent`.

The basic idea is to show nothing until this delay has past, then showing a spinner or message to the effect of "loading...". Research has shown the user will perceive the app as being faster if no spinner is shown before 200ms. Makes sense.

### `timeout`

*int*

```js
<LoadIt timeout={10000} loadingComponent={...} ... />
```

Good to use for components that are taking their time 🐢 to load (possibly on a slow connection, or the component is large in size). Use with `loadingComponent`.

### `shouldLoad`

*bool*

```js
<LoadIt shouldLoad={this.state.data.length && true} ... />
```

This is optional and simply an opportunity to avoid nesting the component inside if/else logic inside of `render()`. This will load the core `<LoadIt />`, but not dynamically load the desired file, or loading views, until the logic returns `true`.

This pattern can be helpful in a situation where you want to show a wrapping component.

## Running tests

Pull the repo and run `yarn && yarn test`.
