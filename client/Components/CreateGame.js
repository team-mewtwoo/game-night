import React, { useState, useRef, useContext } from 'react';
import SocketContext from '../context/SocketContext';
import GroupsTable from './GroupsTable'

const CreateGame = () => {
  const [hostName, setHostName] = useState('');
  const [gameName, setGameName] = useState('');
  const [groupNum, setGroup] = useState('');
  const [groupPassword, setPassword] = useState('')
  const [games, setGames] = useState([]);
  const [groups, setGroups] = useState({});
  const socket = useContext(SocketContext);
  const [masterKey, setMasterKey] = useState("");
  const [mainGameName, setMainGameName] = useState("");


  socket.on("generateGameInfo", (groups, masterKey, gameName) => {
    setGroups({ ...groups });
    setMasterKey(masterKey);
    setMainGameName(gameName);
  })
  const onHostNameTextChange = (e) => {
    setHostName(e.target.value);
  };

  const onGameNameTextChange = (e) => {
    setGameName(e.target.value);
  }
  const onGroupTextChange = (e) => {
    setGroup(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const onGameTextChange = (e, i) => {
    const gameClone = [...games];
    gameClone[i] = e.target.value;
    setGames(gameClone);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!groupNum || !hostName) return;

    socket.emit('createGroups', { groupNum, hostName, games, groupPassword, gameName });
  };
  const groupsTable = Object.keys(groups).map(groupId => <GroupsTable groupId={groupId} color={groups[groupId].color} />)
  return (
    <div>
      <br />
      <h2>Create Game</h2>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Host Name" onChange={(e) => onHostNameTextChange(e)} />
        <input type="text" placeholder="Game Name" onChange={(e) => onGameNameTextChange(e)} />
        <input type="text" placeholder="Number of Groups" onChange={(e) => onGroupTextChange(e)} />
        <input type="text" placeholder="Secret Password" onChange={(e) => onPasswordChange(e)} />
        <input type="text" placeholder="Enter Challenge #1" onChange={(e) => onGameTextChange(e, 0)} />
        <input type="text" placeholder="Enter Challenge #2" onChange={(e) => onGameTextChange(e, 1)} />
        <button type="submit">Create Groups!</button>
      </form>
      {mainGameName && <div>Game Name: {mainGameName}</div>}
      {masterKey && <div>Master Key: {masterKey}</div>}
      {groupsTable}
    </div>
  );
};

export default CreateGame;
