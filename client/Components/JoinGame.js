import React, { useState, useRef, useContext } from 'react';
import SocketContext from '../context/SocketContext';
import Game from './Game'

const JoinGame = () => {
  const [gameName, setGameName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [fullName, setFullName] = useState('');
  const [hostKey, setHostKey] = useState('');
  const [isInGame, setIsInGame] = useState(false);
  const socket = useContext(SocketContext);

  const onChangeGameName = (e) => {
    setGameName(e.target.value);

  };

  const onChangeFullName = (e) => {
    setFullName(e.target.value);

  };

  const onChangeGroupId = (e) => {
    setGroupId(e.target.value);

  };

  const onChangeHostKey = (e) => {
    setHostKey(e.target.value)

  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!groupId) return;
    socket.emit('joinGroup', { groupId, fullName, hostKey, gameName });
  };
  socket.on("Logged In", () => {
    setIsInGame(true);
  })

  return (
    <div>
      {!isInGame ?
          <div className="createGameContainer">
            <br />
            <h3 className="createFont">Join Game</h3>
            <form className="createForm" onSubmit={onSubmit}>
              <input className="inputField" type="text" placeholder="Game Name" onChange={(e) => onChangeGameName(e)} />
              <input className="inputField" type="text" placeholder="Group Id" onChange={(e) => onChangeGroupId(e)} />
              <input className="inputField" type="text" placeholder="Full Name" onChange={(e) => onChangeFullName(e)} />
              <input className="inputField" type="text" placeholder="Host Key (optional)" onChange={(e) => onChangeHostKey(e)} />
              <button className="inputField" type="submit">Join Game!</button>
            </form>
          </div>
        : <Game />
      }

    </div>
  );
};

export default JoinGame;
