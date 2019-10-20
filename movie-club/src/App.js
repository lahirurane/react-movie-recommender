import React, { Suspense } from 'react';

import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Landing from './components/Landing';
import Personalized from './components/Personalized';
import Movie from './components/Movie';

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense
          fallback={
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          }
        >
          <div className="full-page">
            <Switch>
              <Route exact path="/" component={Landing} push={true} />

              <Route exact path="/my-page" component={Personalized} push={true} />
              <Route exact path="/movie" component={Movie} push={true} />
            </Switch>
          </div>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
