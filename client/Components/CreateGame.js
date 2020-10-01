import React, { useState, useRef, useContext } from 'react';
import SocketContext from '../context/SocketContext';
import GroupsTable from './GroupsTable'

const CreateGame = () => {
  const [hostName, setHostName] = useState('');
  const [groupNum, setGroup] = useState('');
  const [games, setGames] = useState([]);
  const [groups, setGroups] = useState({});
  const socket = useContext(SocketContext);
  
  const [inputBoxes, setInputBoxes] = useState([]);
  
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
    console.log(games)
    const gameClone = [...games];
    gameClone[i] = e.target.value;
    setGames(gameClone);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!groupNum || !hostName) return;

    socket.emit('createGroups', { groupNum, hostName, games });
  };

  const addInputBox = () => {
    const input = <InputBox key={`InputBox${games.length}`} onGameTextChange={onGameTextChange} index={games.length} />;
    const newInputBoxes = inputBoxes.concat([input]);
    setInputBoxes(newInputBoxes);
  }

  const groupsTable = Object.keys(groups).map(groupId => <GroupsTable groupId={groupId} color={groups[groupId].color} />)
  return (
    <div>
      <br />
      <h2>Create Game</h2>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Host Name" onChange={(e) => onHostNameTextChange(e)} />
        <input type="text" placeholder="Number of Groups" onChange={(e) => onGroupTextChange(e)} />
        { inputBoxes }
        <button type="button" className="add" value="+" onClick={() => addInputBox()}>Add Question</button>
        <button type="submit">Create Groups!</button>
      </form>

      {groupsTable}
    </div>
  );
};

const InputBox = ({onGameTextChange, index}) => {
  return (
    <input type="text" placeholder="Enter Challenge" onChange={(e) => onGameTextChange(e, index)} />
  );
}
export default CreateGame;
