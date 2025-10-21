import React, { useEffect, useRef, useState } from 'react';

const SplashVideo = ({ onFinish }) => {
  const videoRef = useRef(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleEnded = () => {
      setShow(false);
      if (onFinish) onFinish();
    };
    const video = videoRef.current;
    if (video) video.addEventListener('ended', handleEnded);
    return () => {
      if (video) video.removeEventListener('ended', handleEnded);
    };
  }, [onFinish]);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <video
        ref={videoRef}
        src={require('../assets/splash.mp4')}
        autoPlay
        muted
        style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
      />
    </div>
  );
};

export default SplashVideo;
