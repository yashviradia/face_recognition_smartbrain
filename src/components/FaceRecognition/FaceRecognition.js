import React from 'react';
import './FaceRecognition.css';

export default function FaceRecognition({imageUrl}) {
  return (
    <div className='center ma'>
        <div className='absolute ma2'>
          <img id="inputimage" alt="" src={imageUrl} width="500px" height="auto"/>
          {/* <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div> */}
        </div>
    </div> 
  );
}