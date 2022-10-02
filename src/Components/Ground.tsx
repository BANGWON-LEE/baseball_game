import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import '../styles/component.scss'

const Ground: React.FC = () => {

    const [searchParams] = useSearchParams();
    const teamName = searchParams.get('team');
    const [gameStatus, setGameStatus] = useState<Number>(0)
    const gameStart = () :void => {
        setGameStatus(+1)
    }



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
                </div>
            </div>
        </div>
    )
}

export default Ground;