import React, { useState, useEffect, useContext } from 'react';
import SocketContext from '../context/SocketContext';
import GroupScore from './GroupScore'

const ScoreBoard = ({ gameName }) => {
  const socket = useContext(SocketContext);
  const [groupsArr, setGroupsArr] = useState([]);

  useEffect(() => {
    socket.emit('getGroupsStatus', gameName);
  }, []);

  socket.off("groupFinished").on("groupFinished", (groupId, color, totalTime) => {
    const newGroupsArr = groupsArr.map(group => {
      if (group.color === color) {
        group.status = totalTime;
      }
      return group;
    });
    setGroupsArr(newGroupsArr);
    console.log(`Team ${color} is the best with a time of ${totalTime} 🚀 !!`);
  });

  socket.off("updateBoard").on("updateBoard", groups => {
    setGroupsArr([...groups]);
    console.log("Groups", groups);
  });

  const groups = groupsArr
    .map((group, i) => <GroupScore key={`Groups-${i}`}
      groupColor={group.color} groupStatus={group.status} />)
  return (
    <div id="scoreboard">
      <h3 className="green">Scoreboard</h3>
      {groups}
    </div>
  );
};

export default ScoreBoard;