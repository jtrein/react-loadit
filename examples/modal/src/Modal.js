import React, { Component, Fragment } from 'react';

const styles = {
  button: {
    background: '#38003c',
    borderRadius: '3px',
    padding: '12px',
    position: 'absolute',
    right: '12px',
    top: '12px',
    cursor: 'pointer',
    color: 'white',
  },
  modal: {
    display: 'block',
    width: '600px',
    maxWidth: '100%',
    maxHeight: '100%',
    padding: '24px',
    position: 'fixed',
    overflowY: 'auto',
    zIndex: 100,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    boxShadow: '0 0 60px 10px rgba(0, 0, 0, 0.9)',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 50,
    background: 'rgba(0, 0, 0, 0.6)',
  },
};

export default class Modal extends Component {
  state = { closeModal: false };

  visibilityFlag = false;

  componentDidUpdate(_, { closeModal }) {
    this.visibilityFlag = true;
  }

  handleClose() {
    this.visibilityFlag = false;
    this.setState({ closeModal: true });
  }

  render() {
    if (this.state.closeModal && this.visibilityFlag === false) {
      return null;
    }

    const { children } = this.props;

    return (
      <Fragment>
        <div style={styles.overlay} />
        <div style={styles.modal}>
          <button style={styles.button} onClick={() => this.handleClose()}>&#x2573;</button>
          {children}
        </div>
      </Fragment>
    )
  }
};
