import React, { Component } from 'react';
import TopHeader from './Header';

import pageNotFoundImg from '../images/404.jpg';

class Templates extends Component {

  render() {
    return (
      <div>
        <div className="row top-header width100per">
          <TopHeader page={ '404' } />
        </div>
        <div className="row padding-t-100">
          <div className="col-md-12 img-404-wrap">
              <img src={ pageNotFoundImg } alt="Page not found." />
          </div>
        </div>
      </div>
    );
  }

}

export default Templates;
