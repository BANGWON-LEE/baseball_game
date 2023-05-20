import React, { useState, createContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import '../styles/component.scss'
import {useRecoilState} from "recoil"
import io from "socket.io-client";
import { checkRoomUserCntApi, joinRoomApi } from "../api/room";
import { resultJoinStepGlobal, roomChoiceStageGlobal, roomUserCntState } from "../recoil/atoms";
import GameStart from "./main/GameStart";
import EnterRoom from "./main/EnterRoom";
export const socket = io('localhost:5000');

export const SocketContext = createContext ;

const Main: React.FC = () => {

  const [teamName, setTeamName] = useState<string>('');
  const [resultName, setResultName] = useState<Boolean>(false)
  const [rivalNameCheck, setRivalNameCheck] = useState<Boolean>(false);
  // const [teamId, setTeamId] = useState<number>(2);
  const [searchParams, setSearchParams] = useSearchParams();
  const roomId : any  = searchParams.get('no');
  const stage : any  = searchParams.get('stage');
  
  const navigate = useNavigate();
  const location = useLocation();
  const removeUserCnt : number = -1;

  const [roomChoiceStage, setRoomChoiceStage] = useRecoilState<boolean>(roomChoiceStageGlobal)
  const [roomUserCnt, setRoomUserCnt] = useRecoilState(roomUserCntState)  

  async function getRoomUserCnt(){
    // 방정보를 불러오는 함수
    console.log('시작')
    const roomUserCntApi = await checkRoomUserCntApi();
    console.log('roomUserCntApi',roomUserCntApi);
    setRoomUserCnt(roomUserCntApi)
  }

  useEffect(() => {
    // 게임 방 입장 시, 세션에 저장된 방번호를 가져와 페이지 이동을 방지함
    console.log('navi1')
    const handleBackButton = () => {
      const sessionRoomId = sessionStorage.getItem('roomId')
      console.log('navi2',`${roomId}` )
      navigate(`${location.pathname}?no=${sessionRoomId}&stage=${1}`);
      
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  },[navigate]);

  // url로 접속 시에 알림을 한 번만 띄우도록 하기 위한 변수
  let renderCnt = 1;
  useEffect(()  => {
    
    // 방에 접속한 인원수 체크를 위함
    if(roomId !== 'null' && roomId !== null){

      if (roomChoiceStage === false && renderCnt === 1  ) {
        renderCnt+=1
        console.log('유즈이펙트 횟수',   renderCnt);
        alert('로비를 통해서 방에 접속해주세요.');
        navigate('/')
      }
    }else{
      navigate('/')
    }

    getRoomUserCnt()

    socket.emit('joinRoom', roomId);
    // window.addEventListener("unload", handleDisconnect);

    // socket.on('disconnect',);
  
    // const handleVisitorCount = (data: any) => {
    //   console.log('방방ㅂ아')
    //   if (data.visitorCount === 2) {
    //     alert('방에 참여 인원이 모두 찼습니다.');
    //     return
    //   }
    // };
    // socket.on('visitorCount', handleVisitorCount);
  
    // return () => {
    //   // socket.off('disconnect', handleDisconnect);
    //   socket.off('visitorCount', handleVisitorCount);

    // };
  },[roomId,  removeUserCnt])

  console.log('roomUserCnt',roomUserCnt)
  
  let joinStep:number = 0; 
  // let resultJoinStep:number = 0;
  
  const registerTeam = () : void => {
    socket.emit('teamName', { room: roomId, teamName });

      joinStep += 1;
      console.log('더한 스텝', joinStep)
      socket.emit('joinStep', { room: roomId, joinStep });

      setResultName(true);
      setRivalNameCheck(true);
    }

        
  // const changeTeamName = () : void => {
  //   // 팀 이름을 수정할 때마다, 작동하는 코드. 이 코드를 작성하지 않으면 팀이름을 변경할 때마다 방문자 수가 늘어난다.
  //   // const newRivalTeamArray = rivalTeamName.slice(0, rivalTeamName.length - 1);
  //   // setRivalTeamName(newRivalTeamArray)

  //   setRivalTeamName(prevArray => {
  //     const newRivalTeamArray = Array.from(prevArray); 
  //     newRivalTeamArray.splice(newRivalTeamArray.length - 1, 1);
  //     return newRivalTeamArray;
  //   });
  //   setResultName(false);
  //   setTeamName('')
  // }

  
  const [rivalTeamName, setRivalTeamName] = useState<string[]>([]);
  const [userReady, setUserReady]= useState<string>('false');  

  const [resultJoinStep, setResultJoinStep] = useRecoilState<number>(resultJoinStepGlobal)


  useEffect(() =>  {

    socket.on('joinReady', (data) => {
      console.log('접속준비', data)
      setUserReady(data.joinReady)
  });

  // 팀이름 변경을 위한 함수
  const handleResponseTeamName = (data: any) => {
    setRivalTeamName((prevRivalTeamName) => [...prevRivalTeamName, data.teamName]);
  };


    // socket.emit('add user', nickname);
    if(rivalNameCheck=== true && teamName){
    // const checkSocket = () =>{
      socket.on('responseTeamName', handleResponseTeamName);

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

  return () => {
    // 팀이름 변경시 배열의 길이를 줄이고, 다시 늘릴 때, 값이 누적되지 않기 위한 관리 코드
    if(teamName === rivalTeamName[1] && rivalTeamName.length > 2){
    socket.off('responseTeamName', handleResponseTeamName);
    }
  };

  },[teamName, rivalNameCheck]);

 
  const moveBack = () => {
    // socket.emit('userCnt', { room: roomId, userCnt: removeUserCnt });
    let joinCnt = -1;

    const roomUserCntUpdate = {'room_no' : roomId, 'user_cnt' : joinCnt}
    joinRoomApi(roomUserCntUpdate);
    sessionStorage.removeItem('roomId')
    navigate('/');
    setRoomChoiceStage(false)
  }
  console.log('지금 접속자 수', rivalTeamName)
  return(
    <div className="main_back">
      <div className="main_block">
        <div className="project_title">
          <h1>Baseball Game</h1>
          {resultName === true &&
          <>
            <h5>{teamName}</h5>
            {/* <div className="project_title_change">
              <button onClick={()=>changeTeamName()} className="project_title_change_team_name">
                팀명 변경하기
              </button>
            </div> */}
          </>
          }
        </div>
        <div className="project_content">
          <div>
            { roomChoiceStage === false && stage !== '1' && 
            <EnterRoom getRoomUserCnt={getRoomUserCnt} />
            }
            {resultName === false && stage === '1'&& roomId !== 'null' &&
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
                {
                rivalTeamName.length === 1 &&  <p>상대팀을 기다려주세요</p>
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