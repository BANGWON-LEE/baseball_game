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

    // useEffect(() => {
    //     if(cntFirst[0] ||cntSecond[0] || cntThird[0]  === '0'){
    //         cntFirst.substring(1, 1)
            
    //     }  

    //     console.log('repl', cntFirst)
    // },[cntFirst, cntSecond, cntThird])

    const alertUser = (event: any) => {
        event.preventDefault();
        event.returnValue = "";
    }

    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, []);

    // const [outCntArray, setOutCntArray] = useState<String[]>()
    const outCntArray :any = []

    const ZeroRemove = (no: any):void =>{
        return no.replace('0', '')
    }
    
    const gameStart = () :void => {
        
        if(gameStatus === 2){
            if((cntFirst || cntSecond || cntThird) === '' || (cntFirst || cntSecond || cntThird) > '15' ){
                alert('알맞은 숫자를 입력해주세요');
                return
            }
            outCntArray.push(ZeroRemove(cntFirst))
            outCntArray.push(ZeroRemove(cntSecond))
            outCntArray.push(ZeroRemove(cntThird))
        }

        setGameStatus(gameStatus + 1)
    }
    
    const [choiceNum, setChoiceNum] = useState<string>('')
    const selectNum = (event:any) :void => {
        if(document.getElementById('input_first')?.focus){
        setCntFirst(cntFirst.concat(event.currentTarget.value))
        }
    }

    useEffect(() => {

    },[])





    console.log('확인 넘', cntFirst)

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
                                <input type="text"  
                                onChange={(e) => setCntFirst(e.target.value)} 
                                defaultValue={cntFirst} 
                                className="game_pad_text_insert" 
                                id="input_first"
                                onKeyPress={(e) => {
                                    if (e.key === 'Backspace') {
                                        // registerTeam();
                                    }
                                    }}
                            />
                                <input type="text" onChange={(e) => setCntSecond(e.target.value)} className="game_pad_text_insert" id="input_second"/>
                                <input type="text" onChange={(e) => setCntThird(e.target.value)} className="game_pad_text_insert" id="input_third"/>
                            </div>
                            <div className="game_pad_num_line">
                                <button className="btn_num" onClick={selectNum} value="1">1</button>
                                <button className="btn_num" onClick={selectNum}  value="2">2</button>
                                <button className="btn_num" onClick={selectNum}  value="3">3</button>
                            </div>
                            <div className="game_pad_num_line">
                                <button className="btn_num" onClick={selectNum}  value="4">4</button>
                                <button className="btn_num" onClick={selectNum}  value="5">5</button>
                                <button className="btn_num" onClick={selectNum}  value="6">6</button>
                            </div>
                            <div className="game_pad_num_line">
                                <button className="btn_num" onClick={selectNum} value="7">7</button>
                                <button className="btn_num" onClick={selectNum} value="8">8</button>
                                <button className="btn_num" onClick={selectNum} value="9">9</button>
                            </div>
                            <div className="game_pad_num_line">
                                <button className="btn_num" onClick={selectNum} value="0">0</button>
                            </div>
                        </>
                        }
                        {gameStatus === 2 ?
                        <div className="game_pad_num_line">
                            <button className="game_pad_num_line_info_register" onClick={gameStart}>등록</button>
                        </div>
                        : gameStatus === 3 ?
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