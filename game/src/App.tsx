import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import Ground from './components/Ground';
import Enter from './components/Enter';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route  element={<Enter />} path="/" />
          <Route  element={<Main />} path="/room" />
          <Route  element={<Ground />} path="/game" />
        </Routes>
      </BrowserRouter> 
  );
}

export default App;
