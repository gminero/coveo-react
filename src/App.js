import React, { useEffect } from 'react';
import './App.css';
import CoveoSearchUI from './CoveoSearchUI/CoveoSearchUI';

function App() {

  return (
    <div className="App">
      <header className="App-header">
          Learn Coveo and React
      </header>
      <div>
        <CoveoSearchUI />
      </div>
    </div>
  );
}

export default App;
