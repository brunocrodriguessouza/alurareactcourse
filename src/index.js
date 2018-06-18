import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AutorBox from './Autor';
import LivroBox from './Livro';
import Home from './Home';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import './index.css';

ReactDOM.render(
  (<Router>
    <div>
      <App >
        <Switch>
        <Route exact={true} path='/' component={Home} />
        <Route path="/autor" component={AutorBox}/>
        <Route path="/livro" component={LivroBox}/>
        <Route path="/home" component={Home}/>
        <Redirect to="/"/>
        </Switch>
      </App>
    </div>
  </Router>),
  document.getElementById('root')
);

