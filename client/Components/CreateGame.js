import React, { useState, useRef, useContext } from 'react';
import SocketContext from '../context/SocketContext';
import GroupsTable from './GroupsTable'

const CreateGame = () => {
  const [hostName, setHostName] = useState('');
  const [groupNum, setGroup] = useState('');
  const [games, setGames] = useState([]);
  const [groups, setGroups] = useState({});
  const socket = useContext(SocketContext);


  socket.on("generateGameInfo", (groups, hostKey) => {
    setGroups({ ...groups })
  })



  const onGroupTextChange = (e) => {
    setGroup(e.target.value);
  };

  const onHostNameTextChange = (e) => {
    setHostName(e.target.value);
  };

  const onGameTextChange = (e, i) => {
    const gameClone = [...games];
    gameClone[i] = e.target.value;
    setGames(gameClone);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!groupNum || !hostName) return;

    socket.emit('createGroups', { groupNum, hostName, games });
  };
  const groupsTable = Object.keys(groups).map(groupId => <GroupsTable groupId={groupId} color={groups[groupId].color} />)
  return (
    <div>
      <br />
      <h2>Create Game</h2>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Host Name" onChange={(e) => onHostNameTextChange(e)} />
        <input type="text" placeholder="Number of Groups" onChange={(e) => onGroupTextChange(e)} />
        <input type="text" placeholder="Enter Challenge #1" onChange={(e) => onGameTextChange(e, 0)} />
        <input type="text" placeholder="Enter Challenge #2" onChange={(e) => onGameTextChange(e, 1)} />
        <button type="submit">Create Groups!</button>
      </form>

      {groupsTable}
    </div>
  );
};

export default CreateGame;
