import React from 'react';
import { videoConfig } from '../config/video-config';
import './VideoPlayer.css';

const VideoPlayer = ({ videoId }) => {
  const videoSrc = videoConfig.videoSources[videoId];
  
  return (
    <video 
      className="case-video"
      autoPlay 
      loop 
      muted 
      playsinline
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
};

export default VideoPlayer; 