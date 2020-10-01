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
  const [inputBoxes, setInputBoxes] = useState([]);
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
    console.log(games)
    const gameClone = [...games];
    gameClone[i] = e.target.value;
    setGames(gameClone);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!groupNum || !hostName) return;

    socket.emit('createGroups', { groupNum, hostName, games, groupPassword, gameName });
  };

  const addInputBox = () => {
    const input = <InputBox key={`InputBox${games.length}`} onGameTextChange={onGameTextChange} index={games.length} />;
    const newInputBoxes = inputBoxes.concat([input]);
    setInputBoxes(newInputBoxes);
  }

  const groupsTable = Object.keys(groups).map(groupId => <GroupsTable groupId={groupId} color={groups[groupId].color} />)
  return (
    <div className="createGameContainer">
      <br />
      <h2 className="createFont">Create Game</h2>
      <form className="createForm" onSubmit={onSubmit}>
        <input className="inputField" type="text" placeholder="Host Name" onChange={(e) => onHostNameTextChange(e)} />
        <input className="inputField" type="text" placeholder="Game Name" onChange={(e) => onGameNameTextChange(e)} />
        <input className="inputField" type="text" placeholder="Number of Groups" onChange={(e) => onGroupTextChange(e)} />
        <input className="inputField" type="text" placeholder="Secret Password" onChange={(e) => onPasswordChange(e)} />
        {inputBoxes}
        <button type="button" className="add" value="+" onClick={() => addInputBox()}>Add Question</button>
        <button type="submit">Create Groups!</button>
      </form>
      {mainGameName && <div>Game Name: {mainGameName}</div>}
      {masterKey && <div>Master Key: {masterKey}</div>}
      {groupsTable}
    </div>
  );
};

const InputBox = ({ onGameTextChange, index }) => {
  return (
    <input className="inputField" type="text" placeholder="Enter Challenge" onChange={(e) => onGameTextChange(e, index)} />
  );
}
export default CreateGame;
