import React, { Component, Fragment } from 'react';
import LoadIt from './loadit.sym';

const styles = {
  list: {
    textAlign: 'left',
  },
};

const stats = [
  {
    id: 1,
    name: 'Peter Schmeichel',
    cleanSheets: 128,
    appearances: 310,
    goals: 1,
    assists: 3,
    videoUrl: 'https://www.youtube.com/embed/tp-i0IOyFRQ',
  },
  {
    id: 2,
    name: 'Tony Adams',
    cleanSheets: 115,
    appearances: 255,
    goals: 12,
    assists: 9,
    videoUrl: 'https://www.youtube.com/embed/2bfVQgVV1IM',
  },
  {
    id: 3,
    name: 'Alan Shearer',
    appearances: 441,
    goals: 280,
    assists: 64,
    videoUrl: 'https://www.youtube.com/embed/Owbw1VSJ-zg',
  },
  {
    id: 4,
    name: 'Ryan Giggs',
    appearances: 632,
    goals: 109,
    assists: 162,
    videoUrl: 'https://www.youtube.com/embed/qUyI2xuv2-g',
  },
  {
    id: 5,
    name: 'Dennis Bergkamp',
    appearances: 315,
    goals: 87,
    assists: 94,
    videoUrl: 'https://www.youtube.com/embed/zw8RaB_ioRs',
  },
];

export default class Stats extends Component {
  state = { shouldLoadVideo: false };

  handleLoadVideoClick() {
    this.setState({ shouldLoadVideo: true });
  }

  render () {
    let ughKey = 0;
    const { id } = this.props;

    if (id === null) return null;
    const legend = stats.filter(s => s.id === id)[0];

    const { shouldLoadVideo } = this.state;

    return (
      <Fragment>
        <h2>{legend.name}</h2>
        <ul style={styles.list}>
          {Object.keys(legend).map(key => {
            if (key === 'id') return null;
            return <li key={ughKey += 1}><b>{key}</b>: {legend[key]}</li>
          })}
        </ul>

        {!shouldLoadVideo &&
          <button onClick={() => this.handleLoadVideoClick()}>Load video</button>
        }

        <LoadIt
          url={legend.videoUrl}
          shouldLoad={shouldLoadVideo}
          load={() => import('./YouTube')}
          loadingComponent={() => <p>Loading</p>}
        />
      </Fragment>
    );
  }
}
