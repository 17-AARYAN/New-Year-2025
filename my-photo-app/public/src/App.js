import React, { useState } from 'react';
import Camera from './Camera';
import './App.css';

function App() {
  const [showCamera, setShowCamera] = useState(false);

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  return (
    <div className="App">
      <div className="background">
        <img src="/assets/cartoons.gif" alt="background" />
      </div>
      <div className="content">
        {!showCamera ? (
          <button onClick={handleOpenCamera}>Click Photo</button>
        ) : (
          <Camera onClose={handleCloseCamera} />
        )}
      </div>
    </div>
  );
}

export default App;
