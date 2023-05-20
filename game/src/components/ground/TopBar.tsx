import { useRecoilState } from "recoil";
import { gameRoundGlobal } from "../../recoil/atoms";

type TopBarProps = {
   teamName: string | null;
   homeTeamScore: number;
   awayTeamScore: number;
   // gameRound: number;
   rivalTeamName: string | null;
};

const TopBar = (props: TopBarProps) => {

   const [gameRound, setGameRound] = useRecoilState<number | null>(gameRoundGlobal);


   return (
   <div className="game_board">
      <div className="game_board_game_round">
      <p className="game_board_game_round_text">
         {Math.floor(gameRound!)}회{" "}
         {gameRound! - 0.5 < Math.floor(gameRound!) ? " 초" : " 말"}
      </p>
      </div>
      <div className="game_board_detail">
      <div className="game_board_detail_home">
         <span className="game_board_detail_team home-team">
            {props.teamName}
         </span>
         <span className="game_board_detail_score home-team">
            {props.homeTeamScore}
         </span>
      </div>
      <span className="game_board_detail_vs">VS</span>
      <div className="game_board_detail_away">
         <span className="game_board_detail_score away-team">
            {props.awayTeamScore}
         </span>
         <span className="game_board_detail_team away-team">
            {props.rivalTeamName}
         </span>
      </div>
      </div>
   </div>
);
};

export default TopBar;
