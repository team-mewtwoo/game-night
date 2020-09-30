import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import CreateGame from './components/CreateGame';
import JoinGame from './components/JoinGame';
import SocketContext from './context/SocketContext';
import io from 'socket.io-client';
import '../assets/styles/style.css';

const socket = io.connect('http://localhost:3333');

ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <Router>
      <Link to='/'>
        <button>Home</button>
      </Link>

      <Switch>
        <Route exact path='/'>
          <Link to='/createGame'>
            <button>Create Game</button>
          </Link>
          <Link to='/joinGame'>
            <button>Join Game</button>
          </Link>
        </Route>
        <Route path='/createGame'>
          <CreateGame />
        </Route>
        <Route path='/joinGame'>
          <JoinGame />
        </Route>
      </Switch>
    </Router>
  </SocketContext.Provider>,
  document.getElementById('app')
);
