import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// route components
import AppContainer from '../../ui/App.jsx';
import Home from '../../ui/containers/Index.jsx';
import Vote from '../../ui/containers/Vote.jsx';
import CreatePoll from '../../ui/containers/CreatePoll.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={Home} />
      <Route path="/vote/:id" component={Vote}/>
      <Route path="/create" component={CreatePoll}/>
    </Route>
  </Router>
);