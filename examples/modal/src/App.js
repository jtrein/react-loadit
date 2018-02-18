import React, { Component } from 'react';
import LoadIt from './loadit.sym';

import Modal from './Modal';
import logo from './logo.svg';
import './App.css';
import Prem from './img/prem.jpg';
import Bergkamp from './img/dennis-bergkamp.png';
import Schmeichel from './img/peter-schmeichel.png';
import Shearer from './img/alan-shearer.png';
import Giggs from './img/ryan-giggs.png';
import Adams from './img/tony-adams.png';

const styles = {
  h1: { color: 'white' },
  listItemImg: {
    maxWidth: '100%',
    cursor: 'pointer',
  },
  listWrap: {
    display: 'flex',
    listStyle: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    margin: 0,
    padding: 0,
  },
};

class App extends Component {
  state = { legendId: null };

  handleClick(legendId) {
    this.setState({ legendId });
  }

  render() {
    const { legendId } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 style={styles.h1}>React LoadIt</h1>
        </header>

        <img className="App-intro__img" src={Prem} alt="Premier League official logo" />

        <p className="App-intro">
          Click on a legend. Legends don't like components loaded up-front. They told me so.
        </p>
        <ul style={styles.listWrap}>
          <li onClick={() => this.handleClick(1)}>
            <img style={styles.listItemImg} src={Schmeichel} alt="Schmeichel" />
          </li>
          <li onClick={() => this.handleClick(2)}>
            <img style={styles.listItemImg} src={Adams} alt="Adams" />
          </li>
          <li onClick={() => this.handleClick(3)}>
            <img style={styles.listItemImg} src={Shearer} alt="Shearer" />
          </li>
          <li onClick={() => this.handleClick(4)}>
            <img style={styles.listItemImg} src={Giggs} alt="Giggs" />
          </li>
          <li onClick={() => this.handleClick(5)}>
            <img style={styles.listItemImg} src={Bergkamp} alt="Bergkamp" />
          </li>
        </ul>

        {this.state.legendId && (
          <Modal>
            <LoadIt id={legendId} load={() => import('./Stats')} />
          </Modal>
        )}
      </div>
    );
  }
}

export default App;
