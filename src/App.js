import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Layouts from './components/Layouts';
import Home from './components/Home';
import TemplateEdit from './components/TemplateEdit';
import HtmlCode from './components/HtmlCode';
import Templates from './components/Templates';
// eslint-disable-next-line
import PageNotFound from './components/404';

class App extends Component {

  render() {
    return (
      <Router>
          <div>
              <Switch>
                <Route exact path="/" component={ () => <Redirect to="layouts" /> } />
                <Route exact path="/layouts" component={ Layouts } />
                <Route exact path="/create-a-template/version/:v" component={ Home } />
                <Route exact path="/templates" component={ Templates } />
                <Route exact path="/template/edit/:id" component={ TemplateEdit } />
                <Route exact path="/template/html/:id" component={ HtmlCode } />
                <Route component={ PageNotFound } />
              </Switch>
          </div>
      </Router>
    );
  }

}

export default App