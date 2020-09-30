import React from 'react';


function GroupTable({ groupId, color }) {
  return (<ul>
    <li>Group:{color}</li>
    <li>Group ID:{groupId}</li>
  </ul>)
}
export default GroupTable