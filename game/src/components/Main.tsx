import React, { useState, createContext, useEffect } from "react";
import { Link, useRoutes } from "react-router-dom";
import '../styles/component.scss'

import io from "socket.io-client";
export const socket = io('localhost:5000');

export const SocketContext = createContext ;

const Main: React.FC = () => {


  const [teamName, setTeamName] = useState<string>('');
  const [resultName, setResultName] = useState<Boolean>(false)
  const [rivalNameCheck, setRivalNameCheck] = useState<Boolean>(false);
  const [teamId, setTeamId] = useState<number>(2);
  let forTurnDivide : number = 0
  const registerTeam = () : void => {
    socket.emit('teamName', teamName);
    // socket.emit('teamName', teamName);
    // if(teamId === undefined){
    //   setTeamId(teamId-0.5)
    // } else {
    //   setTeamId(teamId-1)
    // }

    // forTurnDivide += 0.5;
    // setTeamId(teamId - forTurnDivide)
    // console.log('teamID', teamId);
    setResultName(true);
    setRivalNameCheck(true);
  }
  const changeTeamName = () : void => {
    setResultName(false);
    setTeamName('')
  }

  const [rivalTeamName, setRivalTeamName] = useState<string[]>([]);
  useEffect(() =>  {
    console.log('socket', socket)
    // socket.emit('add user', nickname);
    if(rivalNameCheck=== true && teamName){
    const checkSocket = async() =>{
      socket.on('responseTeamName', (data) => {
          console.log('teamF', data)
          if(teamName !== data){
              setRivalTeamName(rivalTeamName.concat(data));
          }
      });
    }
    checkSocket();
  }
  setRivalNameCheck(false);

  },[teamName, rivalNameCheck]);

  console.log('rivalTeamName', rivalTeamName)

  return(
    <div className="main_back">
      <div className="main_block">
        <div className="project_title">
          <h1>Baseball Game</h1>
          {resultName === true &&
          <>
            <h5>{teamName}</h5>
            <div className="project_title_change">
              <button onClick={changeTeamName} className="project_title_change_team_name">
                팀명 변경하기
              </button>
            </div>
          </>
          }
        </div>
        <div className="project_content">
          <div>
            {resultName === false &&
              <>
                <input 
                  type="text" 
                  placeholder="팀명을 입력하세요." 
                  className="project_content_title"   
                  onChange={(e) => setTeamName(e.target.value)} 
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      registerTeam();
                    }
                  }}
                />
                <button onClick={()=>registerTeam()} className="project_content_btn">
                  등록
                </button>
              </> 
            }
          </div>
        </div>
        <div className="project_bottom">
        {resultName === true &&
          <Link to={`/game?team=${teamName}&id=${rivalTeamName[0] === undefined ? 1 : 1.5}`}>
            <button className="btn_game_start">
              게임시작
            </button>
          </Link>
        }
        </div>
      </div>
    </div>
  )
  
}

export default Main;