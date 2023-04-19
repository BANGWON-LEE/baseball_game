import React, { useState, createContext, useEffect } from "react";
import { Link, useRoutes, useNavigate } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const roomId : any  = searchParams.get('no');
  const stage : any  = searchParams.get('stage');
  
  // const [connectedClients, setConnectedClients] = useState(0);

  
  const navigate = useNavigate();
  
  const userCnt : number = 1;
  const removeUserCnt : number = -1;

  const handleDisconnect = () => {
    socket.emit('userCnt', { room: roomId, userCnt: removeUserCnt });
  };


  const [userCntCheck, setUserCntCheck] = useState<number[]>([])
  const [roomNumCheck, setRoomNumCheck] = useState<string>('')
  const [roomChoiceStage, setRoomChoiceStage] = useState<Boolean>(false)

  useEffect(() => {
    // console.log('유즈이펙트 횟수');
    socket.emit('joinRoom', roomId);
    // main 입장시 방에 있는 인원 체크
    socket.emit('userCnt', { room: null, userCnt: 0 });
  
    socket.on('disconnect', handleDisconnect);
  

    socket.on('visitorCount', (data) => {
      console.log('visitor', data.visitorCount?.['1'])
      setUserCntCheck(data.visitorCount)
      setRoomNumCheck(data.room)

      // if(data.visitorCount?.['1'] >= 1 && roomChoiceStage === false && stage !== '1' ){
      //   console.log('뭐야')
      //   socket.emit('userCnt', { room: roomId, userCnt: removeUserCnt });
      // }

    });
    

 
    return () => {
      socket.off('disconnect', handleDisconnect);
    
 
    };
  },[]);


  
  let joinStep:number = 0; 
  // let resultJoinStep:number = 0;
  const [resultJoinStep, setResultJoinStep] = useState<number>(0)
  const registerTeam = () : void => {
    socket.emit('teamName', { room: roomId, teamName });

          joinStep += 1;
          console.log('더한 스텝', joinStep)
          socket.emit('joinStep', { room: roomId, joinStep });

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
      setRivalTeamName((rivalTeamName) => [...rivalTeamName, data.teamName])
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

  setRivalNameCheck(false);

  },[teamName, rivalNameCheck]);
  // console.log('resultJoin', resultJoinStep)
  // console.log('rivalTeamName', rivalTeamName.length)
  // console.log('userReady', userReady)




  console.log('스텝', resultJoinStep)



  
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
    {no:'3'}
    ]  
  }
  
  const EnterRoom = ({setRoomChoiceStage, roomNumCheck, userCntCheck}:any) =>{

   

      const joinRoom = ({roomNum}:any) => {

        if( userCntCheck['1'] === 1 && stage !== '1' ){
          console.log('하늘하늘ㄴ')
          // socket.emit('userCnt', { room: roomNum, userCnt: removeUserCnt });
          // console.log('!!!!@@@@')
          // navigate(-1);
          // setRoomChoiceStage(false)
          return
        }


        setRoomChoiceStage(true)
        socket.emit('userCnt', { room: roomNum, userCnt });
   
        
        setSearchParams({ no: roomNum, stage:'1' })
      }

      console.log('userCntCheck', userCntCheck['1'])

    return( 
      <>
      {numObject.num.map((num : Line) => (
       console.log('dfd',num['no']), 
      <div key={"room " + num['no']} className="project_title_change">
          <button className="project_title_change_team_name" onClick={() => joinRoom({roomNum : num['no']})}   >{num['no'] +"번 방"}</button>          
      </div>
        ))
    }
    </> 
    )
  }



  interface GameBtnType{
    userReady: string,
    rivalTeamName : string[],
    roomId : string,
    teamName : string,
    joinStep : number

  }
  


  const GameStart = ({userReady, rivalTeamName, roomId, teamName}: GameBtnType) =>{

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

  const moveBack = () => {
    socket.emit('userCnt', { room: roomId, userCnt: removeUserCnt });
    navigate(-1);
    setRoomChoiceStage(false)
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
            { roomChoiceStage === false && stage !== '1' &&
            <EnterRoom setRoomChoiceStage={setRoomChoiceStage} roomNumCheck={roomNumCheck} userCntCheck={userCntCheck} />
            }
            {resultName === false && stage === '1'&&
              <>
                <div>
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
                  {rivalTeamName.length === 0 &&
                  <p>
                    팀명을 입력해주세요
                  </p>
                  }
                  <div>
                    <button onClick={()=>moveBack()} className="project_back_btn">
                      뒤로 가기
                    </button>
                  </div>
                </div> 
              </>
            }
          </div>
        </div>
        <div className="project_bottom">
          <GameStart userReady={userReady} rivalTeamName={rivalTeamName} roomId={roomId} teamName={teamName} joinStep={joinStep} />
        </div>
      </div>
    </div>
  )
  
}

export default Main;