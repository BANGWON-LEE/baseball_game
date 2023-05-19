import React, { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/component.scss";

import io from "socket.io-client";
import GroundBase from "./ground/GroundBase";
import TopBar from "./ground/TopBar";
import GameProceed from "./ground/GameProceed";
import ChoiceNumberPad from "./ground/ChoiceNumberPad";
import MyOutNumOrAttackNum from "./ground/MyOutOrAttackNum";

const socket = io("http://localhost:5000");
export const SocketContext = createContext;

interface BtnType {
  num: Line[];
}

interface Line {
  no1: string;
  no2: string;
  no3: string;
}

const numObject: BtnType = {
  num: [
    {
      no1: "1",
      no2: "2",
      no3: "3",
    },
    {
      no1: "4",
      no2: "5",
      no3: "6",
    },
    {
      no1: "7",
      no2: "8",
      no3: "9",
    },
    {
      no1: "",
      no2: "0",
      no3: "",
    },
  ],
};

const Ground: React.FC = () => {
  const [searchParams] = useSearchParams();
  const teamName = searchParams.get("team");
  // console.log('팀이름', teamName)
  const teamOriginId: any = searchParams.get("id");
  const roomId: any = searchParams.get("no");
  const [teamReady, setTeamReady] = useState<string[]>([]);
  // const [teamTurn, setTeamTurn] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<number>(1);
  const [cntText, setCntText] = useState<string>("");
  const [homeTeamScore, setHomeTeamScore] = useState<number>(0);
  const [awayTeamScore, setAwayTeamScore] = useState<number>(0);
  const [gameRound, setGameRound] = useState<number>(1);
  const [rivalTeamName, setRivalTeamName] = useState<string>("");
  const [rivalAttackNum, setRivalAttackNum] = useState<string[]>([]);
  const [myNumArray, setMyNumArray] = useState<string[]>([]); // 숫자 배열
  interface Score {
    [key: string]: any;
  }
  const [checkRivalScore, setCheckRivalScore] = useState<Score>({});

  useEffect(() => {
    socket.emit("joinRoom", roomId);
    socket.emit("teamName", { room: roomId, teamName });
  }, []);

  // 새로고침 경고 관련 코드
  useEffect(() => {
    window.addEventListener("beforeunload", (event) => {
      // 표준에 따라 기본 동작 방지
      event.preventDefault();
      // Chrome에서는 returnValue 설정이 필요함
      event.returnValue = "게임이 초기화 될 수 있습니다.";
    });
  });

  useEffect(() => {
    // socket.emit('teamName', teamName);
    // socket.emit('teamName', { room: roomId, teamName })
    socket.emit("joinRoom", roomId);
    const joinReady = "true";
    socket.emit("joinReady", { room: roomId, joinReady });
    socket.emit("teamName", { room: roomId, teamName });
    // const checkSocket = () =>{

    socket.on("responseTeamName", (data) => {
      console.log("팀보기", data);
      if (teamName !== data.teamName) {
        setRivalTeamName(data.teamName);
      }
    });
    socket.on("gameScore", (data) => {
      // console.log('teamF', data)
      setAwayTeamScore(data.homeTeamScore);
    });
    socket.on("Attack", (data) => {
      // console.log('teamF', data)
      setRivalAttackNum(data.determineMyAttackNum);
    });
    socket.on("teamReady", (data) => {
      console.log("teamReady", data.readySignal);
      setTeamReady(teamReady.concat(data.readySignal));
    });
    // socket.on('situation', (data) => {
    //     console.log('situation', data)
    //     setMatchResultMessage(data);

    // });
    socket.on("round", (data) => {
      console.log("round", data.gameRound);
      setGameRound(data.gameRound);
    });

    socket.on("rivalOutNum", (data) => {
      // console.log('rivalOutNum', Object.keys(data))
      // 유저별(url id 기준) 자신의 아웃 넘버를 구별하여 가져오는 문장
      let key: any = Object.keys(data.myScore);
      let value: any = Object.values(data.myScore);
      // setCheckRivalScore(data)
      setCheckRivalScore({ ...checkRivalScore, [key]: value });
    });
  });

  //   console.log('checkRivalScore', checkRivalScore[gameRound - Math.floor(gameRound) === 0 ? '1.5':'1'])

  const gameStart = (): void => {
    if (gameStatus === 2) {
      if (
        myNumArray[0] === "" ||
        myNumArray[1] === "" ||
        myNumArray[2] === "" ||
        (cntText <= "0" && cntText > "15")
      ) {
        alert("알맞은 숫자를 입력해주세요");
        return;
      }
    }
    setGameStatus(gameStatus + 1);
  };

  const selectNum = (event: any): void => {
    const numberChoice = event.currentTarget.value;

    setCntText(cntText.concat(numberChoice));
  };

  const deleteNum = (): void => {
    setCntText("");
    if (myNumArray.length === 1 && myNumArray[0] === cntText) {
      myNumArray.pop();
    }
  };

  const [determineMyOutNum, setDetermineMyOutNum] = useState<string[]>([]);

  const [determineMyAttackNum, setDetermineMyAttackNum] = useState<string[]>(
    []
  );

  let myScore: Score = {};

  useEffect(() => {
    if (determineMyAttackNum) {
      socket.emit("Attack", { room: roomId, determineMyAttackNum });
    }
    if (determineMyOutNum) {
      // 유저의 num(아웃 넘버)를 구부해주기 위한 작업
      // setCheckMyScore
      // ((prevState) => ({
      //     ...prevState,
      //     [teamOriginId]: determineMyOutNum,
      //   }));
      myScore[teamOriginId] = determineMyOutNum;
      socket.emit("rivalOutNum", { room: roomId, myScore });
    }
  }, [determineMyAttackNum, determineMyOutNum]);

  const [gameSetCnt, setGameSetCnt] = useState<number>(0);
  const [matchHitCnt, setMatchHitCnt] = useState<number>(0);
  const [matchBallCnt, setMatchBallCnt] = useState<number>(0);
  const [matchStrikeCnt, setMatchStrikeCnt] = useState<number>(0);
  const [attackAction, setAttackAction] = useState<boolean>(false);

  //20230324 내 공격 번호를 상대방의 번호와 비교하는 작업 필요, 내 공격번호와 내 번호를 비교하지 않게!!
  useEffect(() => {
    const gameNumArray: Array<number> = [0, 1, 2];
    let checkHitCnt: number = 0;
    let strikeCnt = 0;
    let totalStrikeCnt = 0;
    let ballCount: number = 0;
    let resultBallCnt: number = 0;

    setMatchHitCnt(0);
    setMatchStrikeCnt(0);
    setMatchBallCnt(0);

    gameSetCnt === 3 && socket.emit("round", { room: roomId, gameRound });
    console.log("attackAction", attackAction);
    gameNumArray?.map((el) => {
      console.log("rival to 3", rivalAttackNum);
      console.log("rival to 2", determineMyAttackNum[el]);

      if (
        checkRivalScore?.[
          gameRound - Math.floor(gameRound) === 0 ? "1.5" : "1"
        ]?.[0].indexOf(rivalAttackNum?.[el]) !== -1 &&
        rivalAttackNum?.indexOf(rivalAttackNum?.[el]) === el
      ) {
        ballCount += 1;
        setMatchBallCnt(ballCount);
      }

      if (
        rivalAttackNum?.[el] ===
          checkRivalScore?.[
            gameRound - Math.floor(gameRound) === 0 ? "1.5" : "1"
          ]?.[0]?.[el] &&
        rivalAttackNum?.[el] !== undefined
      ) {
        console.log("측정1", rivalAttackNum[el]);
        console.log(
          "측정2",
          checkRivalScore?.[
            gameRound - Math.floor(gameRound) === 0 ? "1.5" : "1"
          ]?.[el]
        );

        checkHitCnt += 1;
        setMatchHitCnt(checkHitCnt);
        if (checkHitCnt % 3 === 0 && checkHitCnt > 0) {
          setHomeTeamScore(checkHitCnt);
          socket.emit("gameScore", { room: roomId, homeTeamScore });
        }
      }

      if (
        rivalAttackNum?.[el] !==
          checkRivalScore?.[
            gameRound - Math.floor(gameRound) === 0 ? "1.5" : "1"
          ]?.[0]?.[el] &&
        rivalAttackNum?.[el] !== undefined
      ) {
        strikeCnt += 1;
        console.log("스트라이크", strikeCnt);
        totalStrikeCnt = strikeCnt - ballCount;
        setMatchStrikeCnt(totalStrikeCnt);
      }
    });
    setAttackAction(false);

    // if(matchHitCnt === 3){
    //     alert('게임이 끝났습니다.')
    //     if(homeTeamScore > awayTeamScore){
    //         alert(`${teamName}이 승리했습니다.`);
    //     }else if(homeTeamScore < awayTeamScore){
    //         alert(`너네 야구단팀이 승리했습니다.`);
    //     }else if(homeTeamScore === awayTeamScore){
    //         alert("무승부 입니다.")
    //     }`
    // }

    // setMatchResultMessage(`${matchHitCnt} 안타!!` )
    // ScoreCheck(matchHitCnt)
    // setMatchHitCnt(0);
  }, [rivalAttackNum, checkRivalScore, attackAction]);

  return (
    <div className="total_back">
      <TopBar
        teamName={teamName}
        homeTeamScore={homeTeamScore}
        awayTeamScore={awayTeamScore}
        gameRound={gameRound}
        rivalTeamName={rivalTeamName}
      />
      <div className="total_back_inner">
        <p className="total_back_situation">
          {matchHitCnt > 0
            ? matchHitCnt + "안타"
            : matchStrikeCnt > 0
            ? matchStrikeCnt + "스트라이크 "
            : null}
          {matchHitCnt === 0 && matchBallCnt > 0 && matchBallCnt + "볼"}
        </p>
        <div className="ground_back">
          <div className="ground_back_position">
            <GroundBase />
            {gameStatus === 1 && rivalTeamName !== undefined && (
              <button className="game_start" onClick={gameStart}>
                게임시작
              </button>
            )}
            <div className="game_ground">
              <div
                className={` ${
                  (myNumArray.length !== 3 && gameStatus === 2) ||
                  (gameStatus === 3 && !determineMyOutNum)
                    ? "game_pad"
                    : "game_pad_second"
                }`}
              >
                <div className="game_pad_inner">
                  {gameStatus === 2 ? (
                    <>
                      <h2>아웃 카운트 입력</h2>
                      <MyOutNumOrAttackNum myNumArray={myNumArray} />
                    </>
                  ) : gameStatus === 3 ? (
                    <>
                      <h2>나의 아웃 카운트</h2>
                      <MyOutNumOrAttackNum myNumArray={determineMyOutNum} />
                      <h2>공격 카운트 입력</h2>
                      <MyOutNumOrAttackNum myNumArray={myNumArray} />
                    </>
                  ) : null}
                  {gameStatus === 2 && myNumArray.length !== 3 ? (
                    <ChoiceNumberPad
                      deleteNum={deleteNum}
                      cntText={cntText}
                      setCntText={setCntText}
                      selectNum={selectNum}
                      myNumArray={myNumArray}
                      numObject={numObject.num}
                      />
                  ) : null}
                  {gameStatus === 3 && teamReady[1] !== undefined ? (
                    <ChoiceNumberPad
                      deleteNum={deleteNum}
                      cntText={cntText}
                      setCntText={setCntText}
                      selectNum={selectNum}
                      myNumArray={myNumArray}
                      numObject={numObject.num}
                    />
                  ) : gameStatus === 3 &&
                    myNumArray.length === 3 &&
                    teamReady[0] === undefined ? (
                    <h4>
                      상대방이 아웃카운트를 정하고 있습니다. 잠시만 기다려주세요
                    </h4>
                  ) : null}
                  {gameStatus === 2 || gameStatus === 3 ? (
                    <GameProceed
                      gameStatus={gameStatus}
                      setGameStatus={(newState: number | null) => {
                        if (newState !== null) {
                          setGameStatus(newState);
                        }
                      }}
                      setGameRound={(newState: number | null) => {
                        if (newState !== null) {
                          setGameRound(newState);
                        }
                      }}
                      determineMyOutNum={determineMyOutNum}
                      setDetermineMyOutNum={setDetermineMyOutNum}
                      setDetermineMyAttackNum={setDetermineMyAttackNum}
                      cntText={cntText}
                      setCntText={setCntText}
                      setGameSetCnt = {setGameSetCnt}
                      myNumArray={myNumArray}
                      setMyNumArray={(newState: string[] | null) => {
                        if (newState !== null) {
                          setMyNumArray(newState);
                        }
                      }}
                      roomId={roomId}
                      teamReady={teamReady}
                      teamOriginId={teamOriginId}
                      gameSetCnt={gameSetCnt}
                      setMatchHitCnt={(newState: number | null) => {
                        if (newState !== null) {
                          setMatchHitCnt(newState);
                        }
                      }}
                      setMatchStrikeCnt={(newState: number | null) => {
                        if (newState !== null) {
                          setMatchStrikeCnt(newState);
                        }
                      }}
                      setMatchBallCnt={(newState: number | null) => {
                        if (newState !== null) {
                          setMatchBallCnt(newState);
                        }
                      }}
                      rivalTeamName={rivalTeamName}
                      gameRound={gameRound}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ground;