import React from "react";
import '../styles/component.scss'

const Ground: React.FC = () => {

  return(
    <div className="total_back">
        <div className="game_board">
            <div className="game_board_detail">
                <div className="game_board_detail_home">
                    <span className="game_board_detail_team home-team">우리 야구단</span>
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
                <div className="ground_back_position_location">
                    <div className="ground_back_position_location_first-base">

                    </div>
                    <div className="ground_back_position_location_second-base">
                        
                    </div>
                    <div className="ground_back_position_location_third-base">
                        
                    </div>
                    <div className="ground_back_position_location_last-base">
                        
                    </div>
                    <div className="ground_back_position_location_pitcher-base">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
  
}

export default Ground;