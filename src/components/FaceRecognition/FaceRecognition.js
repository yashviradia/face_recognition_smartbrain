import React from 'react';

const FaceRecognition = ({ imageUrl }) => {
    return (
      <div className='center ma'>
        <div className='absolute ma2'>
          <img alt="source" src={imageUrl} width="500px" height="auto"/>
        </div>
      </div> 
    );
}

export default FaceRecognition;