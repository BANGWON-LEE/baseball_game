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
  // let storedData : any;
  // const [storedData, setStoredData] = useState<any>(0)
  // const [roomFullCnt, setRoomFullCnt] = useState<number>(0)
  // const [roomNum1, setRoomNum1] = useState<number>(0)
  // useEffect(() =>  {
   
  //   socket.on('1', (data) => {
  //     console.log('data',data)
  //     // if(data === 1 && roomNum1Status === 1){
  //       // roomNum1Status = roomNum1Status + data;
        
  //       console.log('roomNum1Status', data)
  //       setRoomNum1(data)
  //       // data = 0;
  //       // }
        
  //       setStoredData(localStorage.getItem("roomFullCnt1"));
  //     })
      
  //     // return () => {
  //       //   socket.off("roomFullCnt");
  //   // };  
    
  // },[]);
  
  // useEffect(() => {
  //   if(Number(storedData) <= 2){
  //   let roomNum1Status : number = 0;
  //   console.log('roomNum1', roomNum1)
  //   console.log('storeData', storedData)
  //   roomNum1Status = Number(storedData) + roomNum1
  //   console.log('로로로', roomNum1Status)
  //   localStorage.setItem(`roomFullCnt1`, JSON.stringify(roomNum1Status));
  //   // setRoomNum1(roomNum1Status)
  //   }
  // },[storedData])

  // console.log('storedData', storedData)

  const EnterRoom = () =>{

    
    return(
      <div className="project_title_change">
      {numObject.num.map((num : Line) => (
        console.log('dfd',num['no']),
        <Link key={"room " + num['no']} to={`/room?no=${num['no']}`} >
          {/* { num['no'] === '1' && storedData === 2 ? null : */}
          <button className="project_title_change_team_name"  >{num['no'] +"번 방"}</button>          
          {/* } */}
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


/// 로컬 스토로지 활용해서, 방에 들어와 있는 인원 수 체크 하여 disabled 하기