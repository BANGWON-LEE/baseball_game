import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import Ground from './components/Ground';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

const App: React.FC = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route  element={<Main />} path="/" />
          <Route  element={<Ground />} path="/game" />
        </Routes>
      </BrowserRouter> 
  );
}

export default App;
