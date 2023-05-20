import React, { useState } from "react";
import io from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import {useRecoilState} from "recoil"
import { cntTextGlobal, determineMyAttackGlobal, determineMyOutGlobal, gameRoundGlobal, gameSetCntGlobal, gameStatusGlobal, matchBallCntGlobal, matchHitCntGlobal, matchStrikeCntGlobal, myNumArrayGlobal, myTeamOriginId } from "../../recoil/atoms";
const socket = io("http://localhost:5000");

type GameProceedType = {
  roomId:string;
  teamReady:Array<string>
  determineMyOutNum:string[]  
  rivalTeamName:string
}

const GameProceed = (props : GameProceedType) => {
  const [searchParams] = useSearchParams();
  const [teamOriginId, setTeamOriginId] = useRecoilState<string | null>(myTeamOriginId)
  setTeamOriginId(searchParams.get("id"))


  const [matchHitCnt, setMatchHitCnt] = useRecoilState<number>(matchHitCntGlobal)
  const [matchStrikeCnt, setMatchStrikeCnt] =useRecoilState<number>(matchStrikeCntGlobal)
  const [matchBallCnt, setMatchBallCnt] =useRecoilState<number>(matchBallCntGlobal)
  const [determineMyAttackNum, setDetermineMyAttackNum] = useRecoilState<string[]>(determineMyAttackGlobal)
  const [gameRound, setGameRound] = useRecoilState<number | null>(gameRoundGlobal);
  const [myNumArray, setMyNumArray] = useRecoilState<string[] | null>(myNumArrayGlobal); // 숫자 배열
  const [gameSetCnt, setGameSetCnt] = useRecoilState<number>(gameSetCntGlobal);

  const determineAttackNum = () => {
    setDetermineMyAttackNum(JSON.parse(JSON.stringify(myNumArray)));
    setGameSetCnt(gameSetCnt + 1);
    // setAttackAction(true)
    if (gameSetCnt === 3) {
      setGameRound(gameRound !== null ? gameRound + 0.5 : null );
      // setAttackTeam(props.rivalTeamName);
   
      setMatchHitCnt(0);
      setMatchStrikeCnt(0);
      setMatchBallCnt(0);
      // props.setMatchBallCnt(0);
      setGameSetCnt(0);
    }
    myNumArray!.length = 0;
  };
  
  const [determineMyOutNum, setDetermineMyOutNum] = useRecoilState<string[]>(determineMyOutGlobal)
  const [gameStatus, setGameStatus] = useRecoilState<number | null>(gameStatusGlobal);

   const determineOutNum = () => {
      setDetermineMyOutNum(JSON.parse(JSON.stringify(myNumArray)))
      setMyNumArray([])
      setGameStatus(gameStatus != null ? gameStatus + 1 : null);
      const readySignal = 'true'
      socket.emit('teamReady', {room: props.roomId, readySignal });
  }

  const [cntText, setCntText] = useRecoilState<string>(cntTextGlobal);

  const toNextNum = (): void => {
    // 자신이 원하는 숫자를 입력 후, 다음 숫자를 입력하기 위한 함수

    if (parseInt(cntText) > 0 && parseInt(cntText) <= 15 && cntText !== "" && cntText[0] !== "0") {
      if (
        myNumArray?.length === 0 ||
        myNumArray?.length === 1 ||
        myNumArray?.length === 2
      ) {
        setMyNumArray(myNumArray.concat(cntText));
        setCntText("");
      }
    } else {
      alert("숫자는 1이상 15이하의 숫자만 입력이 가능하며, 일의 자리 숫자는 0부터 시작할 수 없습니다.");
      setCntText("");
      return;
    }
  };

  const toPrevNum = (): void => {
    // 자신이 입력한 숫자를 수정하기 위한 함수

    if (myNumArray?.length === 3) {
      setCntText(myNumArray[2]);
      if (cntText === "" && myNumArray[2] !== "") {
        myNumArray.pop();
      }
    } else if (myNumArray?.length === 2) {
     setCntText(myNumArray[1]);
      if (cntText === "" && myNumArray[1] !== "") {
        myNumArray.pop();
      }
    } else if (myNumArray?.length === 1) {
      setCntText(myNumArray[0]);
      if (cntText === "" && myNumArray[0] !== "") {
        myNumArray.pop();
      }
    }
  };

  return (
    <div className="game_pad_num_line">
      {myNumArray?.length !== 3 && (
        <button
          className="game_pad_num_line_info_register"
          onClick={() => toPrevNum()}
        >
          이전
        </button>
      )}
      {myNumArray!.length < 3 && (
        <button
          className="game_pad_num_line_info_register"
          onClick={() => toNextNum()}
        >
          다음
        </button>
      )}
      {myNumArray?.length === 3 &&
      props.teamReady[0] === undefined &&
      teamOriginId === "1" ? (
        <button
          className="game_pad_num_line_info_register"
          onClick={() =>
            props.determineMyOutNum.length !== 3 &&
            props.teamReady[0] === undefined &&
            teamOriginId === "1"
              ? determineOutNum()
              : alert("상대방을 기다려주세요1.")
          }
        >
          등록
        </button>
      ) : null}
      {myNumArray?.length === 3 &&
      props.teamReady[1] === undefined &&
      teamOriginId === "1.5" ? (
        <button
          className="game_pad_num_line_info_register"
          onClick={() =>
            props.determineMyOutNum.length !== 3 &&
            props.teamReady[0] !== undefined &&
            teamOriginId === "1.5"
              ? determineOutNum()
              : alert("상대방을 기다려주세요2.")
          }
        >
          등록
        </button>
      ) : null}
      {myNumArray?.length === 3 && props.teamReady[1] !== undefined ? (
        <button
          className="game_pad_num_line_info_register"
          onClick={() =>
            props.determineMyOutNum.length === 3 &&
            teamOriginId ===  (gameRound !== null ? gameRound?.toString() : null) 
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
