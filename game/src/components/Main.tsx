import React, { useState, createContext, useEffect } from "react";
import { Link, useRoutes, useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import '../styles/component.scss'
import {useRecoilState} from "recoil"
import io from "socket.io-client";
import { checkRoomUserCntApi, joinRoomApi } from "../api/room";
import { roomUserCntState } from "../recoil/atoms";
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
  const location = useLocation();
  
  const userCnt : number = 1;
  const removeUserCnt : number = -1;

  // const handleDisconnect = () => {
  //   // socket.emit('userCnt', { room: roomId, userCnt: removeUserCnt });
  //   let joinCnt = -1
  //   const roomUserCntUpdate = {'room_no' : roomId, 'user_cnt' : joinCnt}
  //   joinRoomApi(roomUserCntUpdate);
  // };
  const [roomChoiceStage, setRoomChoiceStage] = useState<Boolean>(false)
  const [roomUserCnt, setRoomUserCnt] = useRecoilState(roomUserCntState)  

  async function getRoomUserCnt(){
    console.log('시작')
    const roomUserCntApi = await checkRoomUserCntApi();
    console.log('roomUserCntApi',roomUserCntApi);
    setRoomUserCnt(roomUserCntApi)

  }

  const getEnterRoomUserCnt =async(roomNum:any) => {
        let joinCnt = 1;
    console.log('getEnter 시작')
    console.log('isUserCntFull 시작', roomNum)
    const roomUserCntApi = await checkRoomUserCntApi();
    console.log('getEnter roomUserCntApi 시작',roomUserCntApi);
    // setRoomUserCnt(roomUserCntApi)

    const isUserCntFull = roomUserCntApi.some(
      (user: any) => user['room_no'] === roomNum && user['user_cnt'] === '2',
  
    );
  
    console.log('getEnter isUserCntFull 시작',isUserCntFull);

    if (isUserCntFull) {
      alert('인원이 모두 입장했으므로 입장 하실 수 없습니다.');
      return;
    }

    setRoomChoiceStage(true)
      
    

    const roomUserCntUpdate = {'room_no' : roomNum, 'user_cnt' : joinCnt}
   joinRoomApi(roomUserCntUpdate);
    
    setSearchParams({ no: roomNum, stage:'1' })

  }


  useEffect(() => {
    const handleBackButton = () => {
      navigate(`${location.pathname}`);
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  useEffect(() => {
    // 방에 접속한 인원수 체크를 위함
    getRoomUserCnt();
    console.log('유즈이펙트 횟수');
    socket.emit('joinRoom', roomId);
    // window.addEventListener("unload", handleDisconnect);

  
    // socket.on('disconnect',);
  
    const handleVisitorCount = (data: any) => {
      console.log('방방ㅂ아')
      if (data.visitorCount === 2) {
        alert('방에 참여 인원이 모두 찼습니다.');
        return
      }
    };
    socket.on('visitorCount', handleVisitorCount);
  
 
  
    return () => {
      // socket.off('disconnect', handleDisconnect);
      socket.off('visitorCount', handleVisitorCount);

    };
  }, [roomId, socket, userCnt, removeUserCnt])

  console.log('roomUserCnt',roomUserCnt)
  
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
  
  const EnterRoom = ({setRoomChoiceStage,  roomUserCnt}:any) =>{

   

      const joinRoom = ({roomNum}:any) => {
 
        // getRoomUserCnt();
        // getRoomUserCnt();
        console.log('roomNum 시시작', roomNum)
         getEnterRoomUserCnt(roomNum)
        // console.log('user user', roomUserCnt);
        
        // socket.emit('userCnt', { room: roomNum, joinCnt });
        
        // const isUserCntFull = roomUserCnt.some(
        //   (user: any) => user['room_no'] === roomNum && user['user_cnt'] === '2'
        // );
      
        // if (isUserCntFull) {
        //   alert('인원이 모두 입장했으므로 입장 하실 수 없습니다.');
        //   return;
        // }
        // if( userCntCheck['1'] === 1 && stage !== '1' ){
        //   console.log('하늘하늘ㄴ')
        //   // socket.emit('userCnt', { room: roomNum, userCnt: removeUserCnt });
        //   // console.log('!!!!@@@@')
        //   // navigate(-1);
        //   // setRoomChoiceStage(false)
        //   return
        // }



      }


    return( 
      <div>
        
          <div className="room-refresh">
            <button className="room-refresh_btn" onClick={()=>getRoomUserCnt()}>새로고침</button>
          </div>
        <div  className="project-block btn-block">
        {numObject.num.map((num : Line) => (
          console.log('dfd',num['no']), 
        <div key={"room " + num['no']} className="project_title_change">
          <button className="project_title_change_team_name room-btn" onClick={() => joinRoom({roomNum : num['no']})}   >{num['no'] +"번 방"}</button>          
        </div>
          ))
        }
        </div>
        <div  className="project-block">
        {
        roomUserCnt.map((user:any) => (
        <div className={`project-block_user-cnt${user['room_no']}`}>
          {user['user_cnt']}명 입장
        </div>
        ))
        }
        </div>
      
    </div> 
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

  const RegisterTeamName = () => {
    return(
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
    )
  }
 
  const moveBack = () => {
    // socket.emit('userCnt', { room: roomId, userCnt: removeUserCnt });
    let joinCnt = -1;
    const roomUserCntUpdate = {'room_no' : roomId, 'user_cnt' : joinCnt}
    joinRoomApi(roomUserCntUpdate);
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
            <EnterRoom setRoomChoiceStage={setRoomChoiceStage} roomUserCnt={roomUserCnt} />
            }
            {resultName === false && stage === '1'&& 
             <RegisterTeamName/>
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