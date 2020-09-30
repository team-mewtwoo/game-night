import React from 'react';

const GroupScore = (props) => {
  return (
    <div className='green userscore'>
      <div> {props.groupColor}: </div>
      <div> {props.groupStatus} </div>
    </div>
  );
};

export default GroupScore;
