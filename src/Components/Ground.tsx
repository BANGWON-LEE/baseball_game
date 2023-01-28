import React, { createContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import '../styles/component.scss'
import closeBtn from "../asset/png/close_btn.png"
// import { parse } from "node:path/win32";

import io from "socket.io-client";
// import { SOCKET_URL } from "config";

const socket = io('http://localhost:5000');
export const SocketContext = createContext;


const Ground: React.FC = () => {

    const [searchParams] = useSearchParams();
    const teamName = searchParams.get('team');
    const [gameStatus, setGameStatus] = useState<number>(1)
    const [cntText, setCntText] = useState<string>('')
    const [homeTeamScore, setHomeTeamScore] = useState<number>(0)
    const [awayTeamScore, setAwayTeamScore] = useState<number>(0)
    const [gameRound, setGameRound] = useState<string>('1')
    const [rivalTeamName, setRivalTeamName] = useState<string>('');

    const  [myNumArray, setMyNumArray] = useState<string[]>([]) // 숫자 배열


    useEffect(() =>  {
        socket.emit('teamName', teamName);
  
           console.log('socket', socket)
       

        // socket.emit('add user', nickname);
        
        const checkSocket = async() =>{
            socket.on('responseTeamName', (data) => {
                console.log('teamF', data)
                if(teamName !== data){
                    setRivalTeamName(data);
                }
            });
        }

        checkSocket();

        // socket.on('user joined', (data) =>{
        //   setchats(chats.concat(`${data.username} joined`));
        // })
        // socket.on('user left', (data) => {
        //   setchats(chats.concat(`${data.username} left`));
        // });
        // socket.on('disconnect', () => {
        //   setIsConnected(false);
        // });
        // socket.on('new message', (data) => {
        //   setchats(chats.concat(`${data.username} : ${data.message}`));
        // });

      });
    



    const gameStart = () : void => {
        
        if(gameStatus === 2){
            if((myNumArray[0] === '' || myNumArray[1] === '' || myNumArray[2] === '') ||   (cntText <= '0'  &&  cntText > '15') ){
                alert('알맞은 숫자를 입력해주세요');
                return
            }
        }
        setGameStatus(gameStatus + 1)
    }

    // 새로고침 경고 관련 코드
    useEffect(() => {
        window.addEventListener('beforeunload', (event) => {
            // 표준에 따라 기본 동작 방지
            event.preventDefault();
            // Chrome에서는 returnValue 설정이 필요함
            event.returnValue = '게임이 초기화 될 수 있습니다.';
        });
    })


    // 계산기 버튼 클릭시 보여지는 부분 정리
    // const [selectedNum, setSelectedNum] = useState<string>('')

    const selectNum = (event:any) :void => {
        const numberChoice = event.currentTarget.value

        setCntText(cntText.concat(numberChoice))
    }
    
    const toNextNum = () : void => {
            console.log('cntText', cntText)


        if( (parseInt(cntText) > 0 &&  parseInt(cntText) <= 15) && cntText !== '' ){
            if( myNumArray.length === 0 || myNumArray.length === 1 || myNumArray.length === 2) {
                setMyNumArray(myNumArray.concat(cntText))
                setCntText('')
            }    
        } else {
            alert("숫자 1 이상의 15 이하의 번호를 입력해주세요")
            setCntText('')
            return
        }
    }

    const toPrevNum = () : void => {
        // myNumArray.pop()
        if(myNumArray.length === 3){
            setCntText(myNumArray[2])
            if(cntText === '' && myNumArray[2] !== '') {myNumArray.pop()}
        } else if(myNumArray.length === 2){
            setCntText(myNumArray[1])
            if(cntText === '' && myNumArray[1] !== '' ) {myNumArray.pop()}
        } else if( myNumArray.length === 1 ){
            setCntText(myNumArray[0]) 
            if(cntText === '' && myNumArray[0] !== '' ) {myNumArray.pop()}
        }
    }

    const deleteNum = () : void => {
        setCntText('')
        if(myNumArray.length === 1  && myNumArray[0] === cntText){
            myNumArray.pop();
        }
    }

    const [determineMyOutNum, setDetermineMyOutNum] = useState<string[]>([])
    const [rivalNum, setRivalNum] = useState<string[]>([])


    const rivalOutNumCreate = () =>{
        let rivalArr : string[] = []
        for(let i = 0; i<=2; i++){
            let randomNum = Math.floor(Math.random() * (15-1)+1).toString()
            rivalArr.push(randomNum)
            console.log('i-- 2', randomNum)
        }
        setRivalNum(rivalArr)
        return
    } 

    const determineOutNum = () => {
        // console.log('deter')
        setDetermineMyOutNum(JSON.parse(JSON.stringify(myNumArray)))
        // 난수 3개를 담기 위한 로직
        rivalOutNumCreate();
        setMyNumArray([])
        setGameStatus(gameStatus + 1)
    }


    const [determineMyAttackNum, setDetermineMyAttackNum] = useState<string[]>([])
    
    let gameSetCnt : number = 0;
    let matchResultCnt : number = 0;

    const determineAttackNum = () => {
        setDetermineMyAttackNum(JSON.parse(JSON.stringify(myNumArray)))
        gameSetCnt+=1
        
        // matchAttackNumAndOutNum();
        if(gameSetCnt === 5){
            setGameRound(gameRound+0.5);
            matchResultCnt = 0;
            gameSetCnt = 0;
        }
    }

    // const [matchResultCnt, setMatchResultCnt] = useState<number>(1);
    const [matchResultMessage, setMatchResultMessage] = useState<string>('');


    const ScoreCheck = (matchResultCnt:number) => {
        if(matchResultCnt === 4){
            if(gameRound === '1'){
                setHomeTeamScore(homeTeamScore + 1);
            }
        }
    }

    useEffect(() => {
    
        let ballCnt : number = 0;

        for(let i = 0; i<=2; i++){
            if(rivalNum[i] === determineMyAttackNum[i]){
         
                matchResultCnt += 1;
                setMatchResultMessage(`${matchResultCnt} 안타!!` )
                console.log('안타 카운트', matchResultCnt)
            } else if(rivalNum[i] !== determineMyAttackNum[i]){
                matchResultCnt += 1;
                // for(let j = 0; j< rivalNum.length; j++){
                //     if(determineMyAttackNum[j] === rivalNum[i]){
                //         ballCnt+=1;
                //     }
                // }
                setMatchResultMessage(`${matchResultCnt} 스트라이크` )
            } 
        }

        // if(matchResultCnt === 3){
        //     alert('게임이 끝났습니다.')
        //     if(homeTeamScore > awayTeamScore){
        //         alert(`${teamName}이 승리했습니다.`);
        //     }else if(homeTeamScore < awayTeamScore){
        //         alert(`너네 야구단팀이 승리했습니다.`);
        //     }else if(homeTeamScore === awayTeamScore){
        //         alert("무승부 입니다.")
        //     }
        // } 

        // setMatchResultMessage(`${matchResultCnt} 안타!!` )
        ScoreCheck(matchResultCnt)
        matchResultCnt = 0;

    },[determineAttackNum])
    
    // console.log('determineMyOutNum', determineMyOutNum)

    console.log('rivalNum', rivalNum)


    return(
        <div className="total_back">
            <TopBar teamName={teamName} homeTeamScore={homeTeamScore} awayTeamScore={awayTeamScore} gameRound={gameRound} rivalTeamName={rivalTeamName} />
            <div className="total_back_inner">
            <p className="total_back_situation">{determineMyAttackNum[0] !== undefined ? matchResultMessage : null}</p>
                <div className="ground_back">
                    <div className="ground_back_position">
                        <div className="ground_back_position_top-base"/>
                        <div className="player_located_first_base"/>
                        <div className="ground_back_position_right-base"/>
                        <div className="player_located_right_base"/>
                        <div className="ground_back_position_left-base"/>
                        <div className="player_located_left_base"/>
                        <div className="ground_back_position_home-base"/>
                        <div className="player_located_last_base home_color"/>
                        <div className="ground_back_position_pitcher-base"/>
                        {gameStatus === 1 &&
                            <button className="game_start" onClick={gameStart}>게임시작</button>
                        }
                        <div className="game_ground">
                            <div className={` ${(myNumArray.length !== 3 && gameStatus === 2) || gameStatus === 3 && !determineMyOutNum ? "game_pad" : "game_pad_second" }`}>
                                <div className="game_pad_inner">
                                    {gameStatus === 2 ?
                                    <>
                                        <h2>아웃 카운트 입력</h2>
                                        <MyOutNum myNumArray={myNumArray} />
                                    </>
                                        : gameStatus === 3 ?
                                        <>
                                            <h2>나의 아웃 카운트</h2>
                                            <MyOutNum myNumArray={determineMyOutNum} />
                                            <h2>공격 카운트 입력</h2>
                                            <MyAttackNum myNumArray={myNumArray} />
                                        </>
                                    : null
                                    }
                                    {(gameStatus === 2 && myNumArray.length !== 3 )  ?
                                        <ChoiceOutNumberPad deleteNum={deleteNum} cntText={cntText} setCntText={setCntText} selectNum={selectNum} myNumArray={myNumArray} />
                                        : null                        }
                                    { gameStatus === 3 ?
                                        <ChoiceAttackNumberPad deleteNum={deleteNum} cntText={cntText} setCntText={setCntText} selectNum={selectNum} myNumArray={myNumArray} />
                                    : null }           
                                    {gameStatus === 2 || gameStatus === 3 ?
                                    <div className="game_pad_num_line">
                                        {myNumArray.length !== 3  && <button className="game_pad_num_line_info_register" onClick={() => toPrevNum()}>이전</button>}
                                        {myNumArray.length < 3 && <button className="game_pad_num_line_info_register" onClick={() => toNextNum()}>다음</button>}
                                        {myNumArray.length === 3 && <button className="game_pad_num_line_info_register" onClick={()=> determineMyOutNum.length !== 3 ? determineOutNum() : determineAttackNum()}>등록</button>}
                                    </div>
                                    : null    
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ground;

const TopBar = ({teamName, homeTeamScore, awayTeamScore, gameRound, rivalTeamName}: any)  => { 


    return(
        <div className="game_board">
            <div className="game_board_game_round">
                <p className="game_board_game_round_text">
                    {Math.floor(gameRound)}회 {gameRound - gameRound !== 0 ? " 말" : " 초"}
                </p>
            </div>
            <div className="game_board_detail">
                <div className="game_board_detail_home">
                    <span className="game_board_detail_team home-team">{teamName}</span>
                    <span className="game_board_detail_score home-team">{homeTeamScore}</span>
                </div>
                <span className="game_board_detail_vs">VS</span>
                <div className="game_board_detail_away">
                    <span className="game_board_detail_score away-team">{awayTeamScore}</span>
                    <span className="game_board_detail_team away-team">{rivalTeamName}</span>
                </div>
            </div>
        </div>
    )
}

const ChoiceOutNumberPad = ({deleteNum, cntText, setCntText, selectNum, myNumArray}: any )  => {
    
    interface BtnType
        {
            num : Line[];
        }

    interface Line
        {
            no1: string;
            no2: string;
            no3: string;
        };


    const numObject: BtnType = {
        num:[
            {
                no1:'1',
                no2:'2',
                no3:'3'
            },
            {
                no1:'4',
                no2:'5',
                no3:'6'
            },
            {
                no1:'7',
                no2:'8',
                no3:'9'
            },
            {
                no1:'',
                no2:'0',
                no3:''
            },
        ],
    };
    
    return(
        <>
        <div className="game_pad_text">
            <input 
                type="text"  
                onChange={(e) => setCntText(e.target.value)} 
                defaultValue={cntText} 
                className="game_pad_text_insert" 
                id="input_first"
                readOnly
                placeholder="0"
                onKeyPress={(e) => {
                // if (e.key === 'Backspace') {
                //     // registerTeam();
                // }
                }}
            />
            <div className="game_pad_text_block">
                <button className="game_pad_text_block_btn" onClick={() => deleteNum()}>
                    <img src={closeBtn}  alt={'close'} className="game_pad_text_block_btn_icon" />
                </button>
            </div>
        </div>
    { numObject.num.map((data, index) => (
        <div className="game_pad_num_line" key={"btn_key" + index}>
            {data.no1 !=="" && <button className="btn_num" onClick={selectNum} value={`${data.no1}`} disabled={myNumArray.length === 3 ? true : false}>{ data.no1 }</button>}
                <button className="btn_num" onClick={selectNum} value={`${data.no2}`} disabled={myNumArray.length === 3 ? true : false} >{data.no2}</button>
            {data.no3 !== "" &&  <button className="btn_num" onClick={selectNum} value={`${data.no3}`} disabled={myNumArray.length === 3 ? true : false} >{data.no3}</button>}
        </div>
        ))}
    </>
    )
}

const ChoiceAttackNumberPad = ({deleteNum, cntText, setCntText, selectNum, myNumArray}: any )  => {
    
    interface BtnType
        {
            num : Line[];
        }

    interface Line
        {
            no1: string;
            no2: string;
            no3: string;
        };


    const numObject: BtnType = {
        num:[
            {
                no1:'1',
                no2:'2',
                no3:'3'
            },
            {
                no1:'4',
                no2:'5',
                no3:'6'
            },
            {
                no1:'7',
                no2:'8',
                no3:'9'
            },
            {
                no1:'',
                no2:'0',
                no3:''
            },
        ],
    };
    
    return(
        <>
        <div className="game_pad_second_text">
            <input 
                type="text"  
                onChange={(e) => setCntText(e.target.value)} 
                defaultValue={cntText} 
                className="game_pad_text_insert" 
                id="input_first"
                readOnly
                placeholder="0"
                onKeyPress={(e) => {
                // if (e.key === 'Backspace') {
                //     // registerTeam();
                // }
                }}
            />
            <div className="game_pad_second_text_block">
                <button className="game_pad_second_text_block_btn" onClick={() => deleteNum()}>
                    <img src={closeBtn}  alt={'close'} className="game_pad_second_text_block_btn_icon" />
                </button>
            </div>
        </div>
    { numObject.num.map((data, index) => (
        <div className="game_pad_second_num_line" key={"btn_key" + index}>
            {data.no1 !=="" && <button className="btn_num" onClick={selectNum} value={`${data.no1}`} disabled={myNumArray.length === 3 ? true : false}>{ data.no1 }</button>}
                <button className="btn_num" onClick={selectNum} value={`${data.no2}`} disabled={myNumArray.length === 3 ? true : false} >{data.no2}</button>
            {data.no3 !== "" &&  <button className="btn_num" onClick={selectNum} value={`${data.no3}`} disabled={myNumArray.length === 3 ? true : false} >{data.no3}</button>}
        </div>
        ))}
    </>
    )
}

const MyOutNum = ({myNumArray}: any) => {

    return(
        <div className="game_pad_second_inner">
            <div className="game_pad_second_inner_text">{myNumArray[0]}</div>
            <div className="game_pad_second_inner_text">{myNumArray[1]}</div>
            <div className="game_pad_second_inner_text">{myNumArray[2]}</div>
        </div>
    )
}


const MyAttackNum = ({myNumArray}: any) => {

    return(
        <div className="game_pad_second_inner">
            <div className="game_pad_second_inner_text">{myNumArray[0]}</div>
            <div className="game_pad_second_inner_text">{myNumArray[1]}</div>
            <div className="game_pad_second_inner_text">{myNumArray[2]}</div>
        </div>
    )
}

// 20221204 상대팀 랜덤 숫자 값까지 구함, 상대방 숫자 맞추게하는 로직 작성해야 함