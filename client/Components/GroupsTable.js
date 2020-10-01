import React from 'react';


function GroupTable({ groupId, color }) {
  return (<div>
    <p ><b>{color}</b></p>
    <p>Group ID:{groupId}</p>
  </div >)
}
export default GroupTable