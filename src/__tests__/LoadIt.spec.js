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
      console.log('OH HAI')
      if (loadFunc) {
        return loadFunc()
      } else { throw new Error('You did not provide a `loadFunc`!'); }
      throw error;
    })
);

const Component = () => <div>I am loaded!</div>

describe('LoadIt', () => {
  test('renders LoadIt component with load OK', async () => {
    const component = renderer.create(<LoadIt load={simulateLoad(300, () => Component)} />);
    await simulateLoad(500);
    expect(component.toJSON()).toMatchSnapshot();
  });

  // test('renders LoadIt with lazy loaded component', async () => {
  //   const load = await MuiMountWithContext(<LoadIt path="Home" />);
  //   await load.update();

  //   expect(load.state().moduleToLoad.name).toBe('Home');
  //   expect(load.find('ActionBar').length === 1).toBe(true);
  //   expect(load.html()).toContain('Orders');
  // });

  // test('renders LoadIt with lazy loaded component + base', async () => {
  //   const load = await MuiMountWithContext(<LoadIt base="./" path="Home" />);
  //   await load.update();

  //   expect(load.state().moduleToLoad.name).toBe('Home');
  //   expect(load.find('ActionBar').length === 1).toBe(true);
  //   expect(load.html()).toContain('Orders');
  // });

  // test('should not load component with shouldLoad={false}', async () => {
  //   const load = await MuiMountWithContext(<LoadIt path="Home" shouldLoad={false} />);
  //   await load.update();

  //   expect(load.state().moduleToLoad).toBe(null);
  //   expect(load.find('ActionBar').length === 1).toBe(false);
  //   expect(load.html()).toBe(null);
  // });

  // test('renders LoadIt with delay for loading component', async () => {
  //   const load = await MuiMountWithContext(<LoadIt path="Home" delay={500} />);
  //   await load.update();

  //   expect(load.state().moduleToLoad.name).toBe('Home');
  //   expect(load.find('ActionBar').length === 1).toBe(true);
  //   expect(load.html()).toContain('Orders');

  //   load.unmount();
  // });

  // test('renders load error if wrong path given', async () => {
  //   const load = await MuiMountWithContext(<LoadIt path="Wrong" loadingComponent={Loading} />);
  //   await load.update();
  //   await load.update();
  //   expect(load.html()).toContain('<div>Load error</div>');
  // });

  // test('renders LoadIt with timeout for loading component', async () => {
  //   const load = await MuiMountWithContext(<LoadIt path="Home" timeout={500} />);
  //   await load.update();

  //   expect(load.state().moduleToLoad.name).toBe('Home');
  //   expect(load.find('ActionBar').length === 1).toBe(true);
  //   expect(load.html()).toContain('Orders');

  //   load.unmount();
  // });
});
