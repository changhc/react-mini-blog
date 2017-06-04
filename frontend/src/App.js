import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import MainPage from './MainPage';
import Edit from './Edit';
import Post from './Post';
import NoMatch from './NoMatch';

const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/page/:pageNo" component={MainPage} />
        <Route path="/new-post" component={Edit} />
        <Route path="/edit/:postId" component={Edit} />
        <Route path="/post/:postId" component={Post} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </Router>
);

export default App;
