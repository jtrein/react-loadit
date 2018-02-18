import React, { Component, Fragment } from 'react';

export default class YouTube extends Component {
  state = { videoLoaded: false };

  handleVideoLoad() {
    this.setState({ videoLoaded: true });
  }

  render() {
    const { videoLoaded } = this.state;
    const { url } = this.props;
    return (
      <Fragment>
        {videoLoaded === false &&
          <div>Loading video...</div>
        }
        <iframe
          width="560"
          height="315"
          src={url}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Football legends playing football in the past."
          onLoad={() => this.handleVideoLoad()}
        ></iframe>
      </Fragment>
    )
  }
}
