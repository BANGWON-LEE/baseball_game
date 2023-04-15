import React, { useState, createContext, useEffect } from "react";
import { Link, useRoutes } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import '../styles/component.scss'

import io from "socket.io-client";
export const socket = io('localhost:5000');

export const SocketContext = createContext ;

const Main: React.FC = () => {


  const [teamName, setTeamName] = useState<string>('');
  const [resultName, setResultName] = useState<Boolean>(false)
  const [rivalNameCheck, setRivalNameCheck] = useState<Boolean>(false);
  const [teamId, setTeamId] = useState<number>(2);
  const [searchParams] = useSearchParams();
  const roomId : any  = searchParams.get('no');

  useEffect(() => {
    socket.emit('joinRoom', roomId);

  },[])
  
  let joinStep:number = 0; 
  // let resultJoinStep:number = 0;
  const [resultJoinStep, setResultJoinStep] = useState<number>(0)
  const registerTeam = () : void => {
    socket.emit('teamName', { room: roomId, teamName });
    // socket.emit('teamName', teamName);
    // if(teamId === undefined){
    //   setTeamId(teamId-0.5)
    // } else {
    //   setTeamId(teamId-1)
    // }

    // forTurnDivide += 0.5;
    // setTeamId(teamId - forTurnDivide)
    // console.log('teamID', teamId);
    // if(userReady === 'true'){
      joinStep += 1;
      console.log('더한 스텝', joinStep)
      socket.emit('joinStep', { room: roomId, joinStep });
    // }
    setResultName(true);
    setRivalNameCheck(true);
  }
  
  const changeTeamName = () : void => {
    setResultName(false);
    setTeamName('')
  }

  
  const [rivalTeamName, setRivalTeamName] = useState<string[]>([]);
  const [userReady, setUserReady]= useState<string>('false');  
  useEffect(() =>  {
    console.log('socket main', socket)

    socket.on('joinReady', (data) => {
      console.log('접속준비', data)
      setUserReady(data.joinReady)

  });


    // socket.emit('add user', nickname);
    if(rivalNameCheck=== true && teamName){
    // const checkSocket = () =>{
    socket.on('responseTeamName', (data) => {
        console.log('보자보자', data.teamName)
        console.log('보자보자 이름', teamName)
        // if(teamName === data.teamName){
          
            // setRivalTeamName(rivalTeamName.concat(data.teamName));
            setRivalTeamName((rivalTeamName) => [...rivalTeamName, data.teamName])
        // }
    });

    socket.on('joinStep', (data) => {
      console.log('조인스텝', typeof(data.joinStep))
      console.log('조인스텝 vv', data.joinStep)
      // let joinStep : number = 1;
      console.log('소켓 더한 스텝', joinStep)
      joinStep += data.joinStep
      setResultJoinStep(joinStep)
  });

    }
    // checkSocket();
  // }
  setRivalNameCheck(false);

  },[teamName, rivalNameCheck]);
  console.log('resultJoin', resultJoinStep)
  console.log('rivalTeamName', rivalTeamName.length)
  console.log('userReady', userReady)

  interface BtnType{
    userReady: string,
    rivalTeamName : string[],
    roomId : string,
    teamName : string,
    joinStep : number

  }

  console.log('스텝', resultJoinStep)

  const GameStart = ({userReady, rivalTeamName, roomId, teamName}: BtnType) =>{

    return(
      <>
      { userReady=== 'false' && rivalTeamName.length === 2 && resultJoinStep === 2 ?
        <Link to={`/game?no=${roomId}&team=${teamName}&id=1`}>
          <button className="btn_game_start">
            게임시작
          </button>
        </Link>
      : userReady === 'true' && rivalTeamName.length >= 2 && resultJoinStep === 1 ?
      <Link to={`/game?no=${roomId}&team=${teamName}&id=1.5`}>
          <button className="btn_game_start">
            게임시작
          </button>
        </Link>
      : rivalTeamName.length === 1 &&  <p>상대팀을 기다려주세요</p> }
    </>
    )
  }


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
        {rivalTeamName.length === 0 && 
          <p>
            팀명을 입력해주세요
          </p>
        }
       <GameStart userReady={userReady} rivalTeamName={rivalTeamName} roomId={roomId} teamName={teamName} joinStep={joinStep} />
        </div>
      </div>
    </div>
  )
  
}

export default Main;