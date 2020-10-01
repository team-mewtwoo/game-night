import React from 'react';

const GroupScore = (props) => {
  console.log("Group Score component", props);
  const status = isNaN(props.groupStatus) ? props.groupStatus : props.groupStatus + 1;
  return (
    <div className='green userscore'>
      <div> {props.groupColor}: </div>
      <div> {status} </div>
    </div>
  );
};

export default GroupScore;
