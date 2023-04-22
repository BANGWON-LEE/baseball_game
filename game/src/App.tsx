import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './components/Main';
import Ground from './components/Ground';
import Enter from './components/Enter';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { RecoilRoot } from 'recoil';

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          {/* <Route  element={<Enter />} path="/" /> */}
          <Route  element={<Main />} path="/" />
          <Route  element={<Ground />} path="/game" />
        </Routes>
      </BrowserRouter> 
    </RecoilRoot>
  );
}

export default App;
