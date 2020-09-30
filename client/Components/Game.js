import React, { useState, useContext } from 'react';
import SocketContext from '../context/SocketContext';
import ScoreBoard from './ScoreBoard'




const Game = () => {

  const [isFellow, setIsFellow] = useState(false);
  const [groupInfo, setGroupInfo] = useState({});
  const [id, setId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const socket = useContext(SocketContext);



  socket.on("Logged in as fellow", (groupId, group, personId) => {
    console.log('LOGGED IN AS FELLOW');
    setIsFellow(true);
    setId(personId);
    setGroupId(groupId);
    setCurrentIndex(group.currentGame);
    setGroupInfo({ ...group });

  })
  socket.on("Logged in as student", (groupId, group, personId) => {
    console.log("Logged in as student");
    setId(personId);
    setGroupId(groupId);
    setCurrentIndex(group.currentGame);
    setGroupInfo({ ...group });
  })

  socket.on("Next Challenge", () => {
    console.log('NEXTTT!@');
    setCurrentIndex(currentIndex + 1)
  })

  const startGame = (id, groupId) => {
    socket.emit('requestGame', ({ id, groupId }))
  }

  socket.on('startGame', (groupId, startTime) => {
    console.log('Game.js/startGame')
    setGameStarted(true);
  });

  const nextChallenge = (id, groupId) => {
    socket.emit("nextChallenge", ({ id, groupId }))
  }

  socket.on('endGame', () => {
    console.log('Game.js/endGame')
    setGameEnded(true);
  })

  return (
    <div>
      {gameStarted ? <div>
        {gameEnded ?
          <div>Game Ended</div> :
          <div><h1>Current Challenge:</h1>
            {(groupInfo.games) && JSON.stringify(groupInfo.games[currentIndex])}
            <br></br>
            {isFellow && <button onClick={() => nextChallenge(id, groupId)}>Next Challenge</button>}</div>
        }
        <ScoreBoard />
      </div> : <div><h1>Waiting for Fellow To Start Game</h1>
          <br></br>
          {isFellow && <button onClick={() => startGame(id, groupId)}>Start Game</button>}
        </div>
      }
    </div>
  );
};

export default Game;
