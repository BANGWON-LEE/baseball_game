import { Link } from "react-router-dom"
import { useRecoilState } from "recoil"
import { resultJoinStepGlobal } from "../../recoil/atoms"

interface GameBtnType{
   userReady: string,
   rivalTeamName : string[],
   roomId : string,
   teamName : string,
   joinStep : number

 }
 

const GameStart = ({userReady, rivalTeamName, roomId, teamName}: GameBtnType) =>{

   
  const [resultJoinStep, setResultJoinStep] = useRecoilState<number>(resultJoinStepGlobal)

   return(
     <>
     { userReady=== 'false' && rivalTeamName.length === 2 && resultJoinStep === 2 ?
       <Link to={`/game?no=${roomId}&team=${teamName}&id=1`}>
         <button className="btn_game_start">
           게임시작
         </button>
       </Link>
     : userReady === 'true' && rivalTeamName.length >= 2 && resultJoinStep === 1 &&
     <Link to={`/game?no=${roomId}&team=${teamName}&id=1.5`}>
         <button className="btn_game_start">
           게임시작
         </button>
       </Link>
      }
   </>
   )
 }

 export default GameStart