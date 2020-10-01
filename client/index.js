import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import CreateGame from './Components/CreateGame';
import JoinGame from './Components/JoinGame';
import SocketContext from './context/SocketContext';
import io from 'socket.io-client';
import '../assets/styles/style.css';

// const socket = io.connect('http://localhost:3333');
const socket = io();

ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <Router>
      <Switch>
        <Route exact path="/">
          <div className="buttonContainer">
            <h2 className="createFont">🍻 CODESMITH GAME NIGHT 🍻</h2>
            <Link to="/createGame">
              <button>Create Game</button>
            </Link>
            <Link to="/joinGame">
              <button>Join Game</button>
            </Link>
          </div>
        </Route>
        <Route path="/createGame">
          <Link to="/">
            <button>Home</button>
          </Link>
          <CreateGame />
        </Route>
        <Route path="/joinGame">
          <Link to="/">
            <button>Home</button>
          </Link>
          <JoinGame />
        </Route>
      </Switch>
    </Router>
  </SocketContext.Provider>,
  document.getElementById('app')
);
