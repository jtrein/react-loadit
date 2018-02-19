const React = require('react');
const renderer = require('react-test-renderer');

const LoadIt = require('../../dist').default;

// fixture for a "loading..." component on delay, timeout or error
const Loading = (loadProps) => {
  const { loadError, loadTimeout, pastDelay } = loadProps;
  if (loadError) {
    return <div>Load error</div>;
  } else if (pastDelay && !loadTimeout) {
    return <div>Loading&hellip;</div>;
  } else if (loadTimeout) {
    return <div>Taking longer than usual&hellip;</div>;
  }
  return null;
};

const simulateNetwork = (delay) => (
  new Promise(resolve => {
    setTimeout(resolve, delay);
  })
);

const simulateLoad = (delay, loadFunc, error) => (
  () => simulateNetwork(delay)
    .then(() => {
      if (loadFunc) {
        return loadFunc()
      } else { throw new Error('You did not provide a `loadFunc`!'); }
      throw error;
    })
);

const LoadThisComponent = () => <div>I am loaded!</div>

describe('LoadIt', () => {
  test('renders LoadIt component with load OK', async () => {
    const component = renderer.create(<LoadIt load={simulateLoad(300, () => LoadThisComponent)} />);
    await simulateNetwork(400);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
