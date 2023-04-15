import React, { useState, createContext, useEffect } from "react";
import { Link, useRoutes } from "react-router-dom";
import "../styles/component.scss";

import io from "socket.io-client";
export const socket = io("localhost:5000");

export const SocketContext = createContext;

const Enter: React.FC = () => {

  interface BtnType
  {
      num : Line[];
  }

  interface Line
  {
      no: string;
      // no2: string;
      // no3: string;
  };

  const numObject : BtnType = {
  num:[
    {no:'1'},
    {no:'2'},
    {no:'3'},
    
    ]  
  }

  // useEffect(() =>  {
    

  // });

  const EnterRoom = () =>{

    
    return(
      <div className="project_title_change">
      {numObject.num.map((num : Line) => (
        console.log('dfd',num['no']),
        <Link key={"room " + num['no']} to={`/room?no=${num['no']}`}>
          <button className="project_title_change_team_name">{num['no'] +"번 방"}</button>          
        </Link>
        ))
      }
      </div>
    )
  }


  return (
    <div className="main_back">
      <div className="main_block">
        <div className="project_title">
          <h1>Baseball Game</h1>
          <EnterRoom />
        </div>
      </div>
    </div>
  );
};

export default Enter;
