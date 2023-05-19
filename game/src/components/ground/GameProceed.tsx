import React, { useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

// import { SetStateAction,  } from "react";
type GameProceedType = {
  // setGameStatus: (newState: SetStateAction<number | null>) => void;
   gameStatus : number | null;
   setGameStatus : (newState: number | null) => void;
   setGameSetCnt : (newState : number ) => void;
   setDetermineMyOutNum : (newState : string[] ) => void;
   setDetermineMyAttackNum : (newState : string[]) => void;
   cntText:string;
   setCntText : (newState : string) => void;
   roomId:string;
   teamReady:Array<string>
   myNumArray:string[]
   setMyNumArray : (newState : string[] | null) => void
   determineMyOutNum:string[]
   teamOriginId:string
   gameSetCnt:number
   gameRound:number | null
   setGameRound : (newState: number | null) => void;
   rivalTeamName:string
   setMatchHitCnt : (newState : number | null) => void
   setMatchStrikeCnt : (newState : number | null) => void
   setMatchBallCnt : (newState : number | null) => void
}

const GameProceed = (props : GameProceedType) => {

  // const [attackTeam, setAttackTeam] = useState<string>("");

  const determineAttackNum = () => {
    props.setDetermineMyAttackNum(JSON.parse(JSON.stringify(props.myNumArray)));
    props.setGameSetCnt(props.gameSetCnt + 1);
    // setAttackAction(true)

    // gameBtn();
    // matchAttackNumAndOutNum();
    if (props.gameSetCnt === 3) {
      props.setGameRound(props.gameRound !== null ? props.gameRound + 0.5 : null );
      // setAttackTeam(props.rivalTeamName);
      props.setMatchHitCnt(0);
      props.setMatchStrikeCnt(0);
      props.setMatchBallCnt(0);
      props.setGameSetCnt(0);
    }
    props.myNumArray.length = 0;
  };
   
   const determineOutNum = () => {
       
      let teamId = 1;
      // console.log('deter')
      props.setDetermineMyOutNum(JSON.parse(JSON.stringify(props.myNumArray)))

      // 난수 3개를 담기 위한 로직
      // rivalOutNumCreate();
      props.setMyNumArray([])
      props.setGameStatus(props?.gameStatus != null ? props.gameStatus + 1 : null);
      const readySignal = 'true'
      socket.emit('teamReady', {room: props.roomId, readySignal });
      
      teamId += 0.5;
      
  }

  const toNextNum = (): void => {
   //  console.log("cntText", cntText);
   console.log('체크체크', props.myNumArray)

    if (parseInt(props.cntText) > 0 && parseInt(props.cntText) <= 15 && props.cntText !== "" && props.cntText[0] !== "0") {
      if (
        props.myNumArray.length === 0 ||
        props.myNumArray.length === 1 ||
        props.myNumArray.length === 2
      ) {
        props.setMyNumArray(props.myNumArray.concat(props.cntText));
        props.setCntText("");
      }
    } else {
      alert("숫자는 1이상 15이하의 숫자만 입력이 가능하며, 일의 자리 숫자는 0부터 시작할 수 없습니다.");
      props.setCntText("");
      return;
    }
  };

  const toPrevNum = (): void => {
    // myNumArray.pop()
    if (props.myNumArray.length === 3) {
      props.setCntText(props.myNumArray[2]);
      if (props.cntText === "" && props.myNumArray[2] !== "") {
        props.myNumArray.pop();
      }
    } else if (props.myNumArray.length === 2) {
     props.setCntText(props.myNumArray[1]);
      if (props.cntText === "" && props.myNumArray[1] !== "") {
        props.myNumArray.pop();
      }
    } else if (props.myNumArray.length === 1) {
      props.setCntText(props.myNumArray[0]);
      if (props.cntText === "" && props.myNumArray[0] !== "") {
        props.myNumArray.pop();
      }
    }
  };

  return (
    <div className="game_pad_num_line">
      {props.myNumArray.length !== 3 && (
        <button
          className="game_pad_num_line_info_register"
          onClick={() => toPrevNum()}
        >
          이전
        </button>
      )}
      {props.myNumArray.length < 3 && (
        <button
          className="game_pad_num_line_info_register"
          onClick={() => toNextNum()}
        >
          다음
        </button>
      )}
      {props.myNumArray.length === 3 &&
      props.teamReady[0] === undefined &&
      props.teamOriginId === "1" ? (
        <button
          className="game_pad_num_line_info_register"
          onClick={() =>
            props.determineMyOutNum.length !== 3 &&
            props.teamReady[0] === undefined &&
            props.teamOriginId === "1"
              ? determineOutNum()
              : alert("상대방을 기다려주세요1.")
          }
        >
          등록
        </button>
      ) : null}
      {props.myNumArray.length === 3 &&
      props.teamReady[1] === undefined &&
      props.teamOriginId === "1.5" ? (
        <button
          className="game_pad_num_line_info_register"
          onClick={() =>
            props.determineMyOutNum.length !== 3 &&
            props.teamReady[0] !== undefined &&
            props.teamOriginId === "1.5"
              ? determineOutNum()
              : alert("상대방을 기다려주세요2.")
          }
        >
          등록
        </button>
      ) : null}
      {props.myNumArray.length === 3 && props.teamReady[1] !== undefined ? (
        <button
          className="game_pad_num_line_info_register"
          onClick={() =>
            props.determineMyOutNum.length === 3 &&
            props.teamOriginId ===  (props.gameRound !== null ? props.gameRound?.toString() : null) 
              ? determineAttackNum()
              : alert("본인의 차례가 아니입니다.")
          }
        >
          등록
        </button>
      ) : null}
    </div>
  );
};

export default GameProceed;
