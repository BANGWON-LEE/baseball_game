import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import '../styles/component.scss'

const Ground: React.FC = () => {

    const [searchParams] = useSearchParams();
    const teamName = searchParams.get('team');
    const [gameStatus, setGameStatus] = useState<number>(1)
    const [cntFirst, setCntFirst] = useState<string>('')
    const [cntSecond, setCntSecond] = useState<string>('')
    const [cntThird, setCntThird] = useState<string>('')

    interface BtnType
        {
            num : Line[];
            // middle : LineMiddle[];
            // bottom : LineBottom[];
            // zero : LineFinish[];
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
        // middle:[
        //     {
        //         no1:'4',
        //         no2:'5',
        //         no3:'6'
        //     },
        // ],
        // bottom:[
        //     {
        //         no1:'7',
        //         no2:'8',
        //         no3:'9'
        //     },
        // ],
        // zero:[
        //     {no1:'0'}
        // ]
    };

    // const [myNumArray, setMyNumArray] = useState
    const  [myNumArray, setMyNumArray] =useState<string[]>([]) // 숫자 배열

    const gameStart = () : void => {
        
        if(gameStatus === 2){
            if((myNumArray[0] === '0' || myNumArray[1] === '0' || myNumArray[2] === '0') ||   (cntFirst <= '0'  &&  cntFirst > '15') ){
                alert('알맞은 숫자를 입력해주세요');
                return
            }
            // outCntArray.push(ZeroRemove(cntFirst))
            // outCntArray.push(ZeroRemove(cntSecond))
            // outCntArray.push(ZeroRemove(cntThird))
        }
        setGameStatus(gameStatus + 1)
    }

        // 새로고침 시에 등장할 경고문구
    const alertUser = (event: any) => {
        event.preventDefault();
        event.returnValue = "";
    }

    // 새로고침 시에 등장할 경고문구
    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
            window.removeEventListener("beforeunload", alertUser);
        };
        
    }, []);


    // 계산기 버튼 클릭시 보여지는 부분 정리
    // const [selectedNum, setSelectedNum] = useState<string>('')

    const selectNum = (event:any) :void => {
        const numberChoice = event.currentTarget.value

            setCntFirst(cntFirst.concat(numberChoice))
       
    }
    
    const toNextNum = () : void => {
        setMyNumArray(myNumArray.concat(cntFirst))
        setCntFirst('')
    }

    const toPrevNum = () : void => {
        // myNumArray.pop()
        if(myNumArray.length === 2){
            setCntFirst(myNumArray[1])
        } else if( myNumArray.length === 1 ){
            setCntFirst(myNumArray[0]) 
        }
      
        // setCntFirst('')
    }
    
    console.log('myNumArray', myNumArray)


    
    // useEffect(() => {
    //     console.log('selectedNum', selectedNum)
    //     if(selectedNum){

    //         if(cntFirst){
    //             setCntFirst(cntFirst.concat(selectedNum))
   
    //             if(cntFirst.length <= 2){
    //                 setCntFirst(cntFirst.substring(1))
    //                 // document.getElementById('insert_first')?.blur()
    //                 document.getElementById('insert_second')?.focus()
    //             } 
    //         } else if(cntSecond){
    //             setCntSecond(cntSecond.concat(selectedNum))
            
    //             if(cntSecond.length <= 2) {
    //                 setCntSecond(cntSecond.substring(1))
    //                 // document.getElementById('insert_second')?.blur()
    //                 document.getElementById('insert_third')?.focus()
    //             } 

    //         } 
    //     }

    // },[selectedNum])

    return(
        <div className="total_back">
            <div className="game_board">
                <div className="game_board_detail">
                    <div className="game_board_detail_home">
                        <span className="game_board_detail_team home-team">{teamName}</span>
                        <span className="game_board_detail_score home-team">1</span>
                    </div>
                    <span className="game_board_detail_vs">VS</span>
                    <div className="game_board_detail_away">
                        <span className="game_board_detail_score away-team">1</span>
                        <span className="game_board_detail_team away-team">너네 야구단</span>
                    </div>
                </div>
            </div>
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
                    <div className="game_pad">
                        {gameStatus === 2 &&
                            <h2>아웃 카운트 입력</h2>
                        }
                        {gameStatus === 3 &&
                            <h2>1회</h2>
                        }
                        {gameStatus !== 1 &&
                        <>
                            <div className="game_pad_text">
                                <input 
                                    type="text"  
                                    onChange={(e) => setCntFirst(e.target.value)} 
                                    defaultValue={cntFirst} 
                                    className="game_pad_text_insert" 
                                    id="input_first"
                                    readOnly
                                    placeholder="0"
                                    onKeyPress={(e) => {
                                    if (e.key === 'Backspace') {
                                        // registerTeam();
                                    }
                                    }}
                                />
                                {/* <input 
                                    type="text" 
                                    onChange={(e) => setCntSecond(e.target.value)} 
                                    defaultValue={cntSecond} 
                                    className="game_pad_text_insert" 
                                    id="input_second"
                                />
                                <input 
                                    type="text" 
                                    onChange={(e) => setCntThird(e.target.value)} 
                                    defaultValue={cntThird} 
                                    className="game_pad_text_insert" 
                                    id="input_third"
                                /> */}
                            </div>
                        { numObject.num.map((data) => (
                            <div className="game_pad_num_line">
                                {data.no1 !=="" && <button className="btn_num" onClick={selectNum} value={`${data.no1}`}>{ data.no1 }</button>}
                                    <button className="btn_num" onClick={selectNum} value={`${data.no2}`}>{data.no2}</button>
                                {data.no3 !== "" &&  <button className="btn_num" onClick={selectNum} value={`${data.no3}`}>{data.no3}</button>}
                            </div>
                            ))}
                        </>
                        }
                        {gameStatus === 2 ?
                        <div className="game_pad_num_line">
                            <button className="game_pad_num_line_info_register" onClick={() => toPrevNum()} >이전</button>
                            <button className="game_pad_num_line_info_register" onClick={() => toNextNum()} >다음</button>
                            <button className="game_pad_num_line_info_register" onClick={() => gameStart()}>등록</button>
                        </div>
                        : gameStatus === 3 ?
                        // 게임 중일 때 사용될 등록버튼
                        <div className="game_pad_num_line">
                            <button className="game_pad_num_line_info_register">등록</button>
                        </div>
                        : null }           
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ground;


// 221112 구현해야할 부분
// 백스페이스 버튼(번호 입력 중 수정을 위해) ---> pop으로 값 제거
// 