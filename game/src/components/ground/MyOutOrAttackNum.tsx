
const MyOutNumOrAttackNum = ({ myNumArray }: any) => {
   return (
     <div className="game_pad_second_inner">
       <div className="game_pad_second_inner_text">{myNumArray[0]}</div>
       <div className="game_pad_second_inner_text">{myNumArray[1]}</div>
       <div className="game_pad_second_inner_text">{myNumArray[2]}</div>
     </div>
   );
 };
 
 export default MyOutNumOrAttackNum