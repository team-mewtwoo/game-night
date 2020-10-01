import React, { useState, useContext, useEffect } from 'react';
import SocketContext from '../context/SocketContext';
import ScoreBoard from './ScoreBoard'

const Game = () => {

  const [isFellow, setIsFellow] = useState(false);
  const [groupInfo, setGroupInfo] = useState({});
  const [id, setId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [gameName, setGameName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [players, setPlayers] = useState([]);
  const socket = useContext(SocketContext);

  socket.off("Logged in as fellow").on("Logged in as fellow", (groupId, group, personId, gameName) => {
    console.log('LOGGED IN AS FELLOW');
    setIsFellow(true);
    setId(personId);
    setGroupId(groupId);
    setCurrentIndex(group.currentGame);
    setGameName(gameName);
    setGroupInfo({ ...group });
  })

  socket.off("Logged in as student").on("Logged in as student", (groupId, group, personId, gameName) => {
    console.log("Logged in as student");
    setId(personId);
    setGroupId(groupId);
    setCurrentIndex(group.currentGame);
    setGameName(gameName);
    setGroupInfo({ ...group });
  })

  socket.off("Next Challenge").on("Next Challenge", () => {
    console.log('NEXTTT!@');
    setCurrentIndex(currentIndex + 1)
  })

  socket.off("playerJoined").on('playerJoined', (playersArr) => {
    const arr = playersArr.map((element, index) => {
      return (<Player key={`Player${index}`} fullName={element.fullName} index={index} />);
    });
    setPlayers(arr);
  })




  socket.off("startGame").on('startGame', () => {
    console.log('Game.js/startGame')
    setGameStarted(true);
  });

  socket.off("endGame").on('endGame', () => {
    console.log('Game.js/endGame')
    setGameEnded(true);
  })


  const startGame = (id, groupId) => {
    socket.emit('requestGame', ({ id, groupId, gameName }))
  }

  const nextChallenge = (id, groupId, gameName) => {
    socket.emit("nextChallenge", ({ id, groupId, gameName }))
  }

  return (
    <div>
      {gameStarted ? <div>
        {gameEnded ?
          <div className="challengeBox"><h5 >Congrats! Your team has finished! Waiting for other teams to finish...⌛</h5> </div>
          :
          <div className="challengeBox"><h3 className="createFont">Current Challenge</h3>
            {(groupInfo.games) && JSON.stringify(groupInfo.games[currentIndex])}
            <br></br>
            {isFellow && <button onClick={() => nextChallenge(id, groupId, gameName)}>Next Challenge</button>}</div>
        }
        <ScoreBoard gameName={gameName} />
      </div> : <div><h1>You're Registered! Sit back and relax until {groupInfo.fellow && 'your fellow'} starts the game.</h1>
          <br></br>
          {isFellow && <><br></br><button onClick={() => startGame(id, groupId, gameName)}>Start Game</button></>}
        </div>
      }
      <div className="waitingRoom">
        {players}
      </div>
    </div>
  )
}

const Player = ({ fullName, index }) => {
  return (<p className="player">{index + 1}. { fullName}</p>);
}

export default Game;
