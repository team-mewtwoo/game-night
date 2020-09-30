import React, { useState, useContext } from 'react';
import SocketContext from '../context/SocketContext';





const Game = () => {

  const [isFellow, setIsFellow] = useState(false);
  const [groupInfo, setGroupInfo] = useState({});
  const [id, setId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
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


  const nextChallenge = (id, groupId) => {
    socket.emit("nextChallenge", ({ id, groupId }))
  }

  socket.on("Winner", winner => {
    console.log(winner);
  })

  return (
    <div>
      <h1>Current Challenge:</h1>
      {(groupInfo.games) && JSON.stringify(groupInfo.games[currentIndex])}
      <br></br>
      {isFellow && <button onClick={() => nextChallenge(id, groupId)}>Next Challenge</button>}
    </div>
  );
};

export default Game;
