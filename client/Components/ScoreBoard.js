import React, { useState, useEffect, useContext } from 'react';
import SocketContext from '../context/SocketContext';
import GroupScore from './GroupScore'

const ScoreBoard = () => {
  const socket = useContext(SocketContext);
  const [groupsArr, setGroupsArr] = useState([]);

  socket.on("Winner", (groupId, color, totalTime) => {
    console.log(`Team ${color} is the best with a time of ${totalTime} 🚀 !!`);
  })
  useEffect(() => {
    socket.emit('getGroupsStatus');
  }, [])

  socket.on("updateBoard", groupsArr => {
    setGroupsArr([...groupsArr]);
  })
  const groups = groupsArr.map((group, i) => <GroupScore key={`Groups-${i}`}
    groupColor={group.color} groupStatus={group.status} />)
  return (
    <div id="scoreboard">
      <h3 className="green">Scoreboard</h3>
      {groups}
    </div>
  );
};

export default ScoreBoard;