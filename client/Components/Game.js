import React, { useState, useContext, useEffect } from 'react';
import SocketContext from '../context/SocketContext';
import ScoreBoard from './ScoreBoard'

const Game = () => {

  const [isFellow, setIsFellow] = useState(false);
  const [groupInfo, setGroupInfo] = useState({});
  const [id, setId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [gameName, setGameName] = useState('');
  const [groupColor, setGroupColor] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState('');
  const socket = useContext(SocketContext);

  socket.off("Logged in as fellow").on("Logged in as fellow", (groupId, group, personId, gameName) => {
    console.log('LOGGED IN AS FELLOW');
    setIsFellow(true);
    setId(personId);
    setGroupId(groupId);
    setCurrentIndex(group.currentGame);
    setGameName(gameName);
    setGroupColor(group.color);
    setGroupInfo({ ...group });
  })

  socket.off("Logged in as student").on("Logged in as student", (groupId, group, personId, gameName) => {
    console.log("Logged in as student");
    setId(personId);
    setGroupId(groupId);
    setCurrentIndex(group.currentGame);
    setGameName(gameName);
    setGroupColor(group.color);
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

  socket.off("winner").on("winner", (winner) => {
    console.log('Game.js/winner: ', winner);
    setWinner(winner);
  });

  const startGame = (id, groupId) => {
    socket.emit('requestGame', ({ id, groupId, gameName }))
  }

  const nextChallenge = (id, groupId, gameName) => {
    socket.emit("nextChallenge", ({ id, groupId, gameName }))
  }
  const endGame = !winner ? `Congrats Team ${groupColor}! Waiting for other teams to finish...⌛` : winner;
  return (
    <div>
      {gameStarted ?
        <div>
          {gameEnded ?
            <div className="challengeBox"><h3>{endGame}</h3></div>
            :
            <div className="challengeBox"><h2 >Lets Go Team {groupColor}!</h2>
              <h3>Current Challenge:</h3>
              {(groupInfo.games) && JSON.stringify(groupInfo.games[currentIndex])}
              <br></br>
              {isFellow && <button onClick={() => nextChallenge(id, groupId, gameName)}>Next Challenge</button>}
            </div>
          }
          <ScoreBoard gameName={gameName} />
        </div>
        :
        <div>
          <h1>Welcome to Team {groupColor}! Sit back and relax until {groupInfo.fellow && 'your fellow'} starts the game.</h1>
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
