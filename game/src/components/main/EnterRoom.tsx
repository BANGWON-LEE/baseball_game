import { useRecoilState } from "recoil";
import { checkRoomUserCntApi, joinRoomApi } from "../../api/room";
import { roomChoiceStageGlobal, roomUserCntState } from "../../recoil/atoms";
import { useNavigate, useSearchParams } from "react-router-dom";

   interface getEnterRoomUserCntType {
      // roomNum : number,
      getRoomUserCnt : () => void
   }

   
  interface BtnType
  {
      num : Line[];
  }
  
  interface Line
  {
      no: string;
      // no2: string;
      // no3: string;
  };

  const numObject : BtnType = {
  num:[
    {no:'1'},
    {no:'2'},
    {no:'3'}
    ]  
  }

const EnterRoom = ({ getRoomUserCnt}:getEnterRoomUserCntType) =>{

   const [roomUserCnt, setRoomUserCnt] = useRecoilState(roomUserCntState) 
   const navigate = useNavigate();
   const [roomChoiceStage, setRoomChoiceStage] = useRecoilState<boolean>(roomChoiceStageGlobal)
   const [searchParams, setSearchParams] = useSearchParams();

   const getEnterRoomUserCnt =async(roomNum:any) => {
      // 방에 입장 시도 할 때 실행되는 함수
      let joinCnt = 1;
      console.log('getEnter 시작')
      console.log('isUserCntFull 시작', roomNum)
      const roomUserCntApi = await checkRoomUserCntApi();
      console.log('getEnter roomUserCntApi 시작',roomUserCntApi);
      // setRoomUserCnt(roomUserCntApi)
  
      const isUserCntFull = roomUserCntApi.some(
        (user: any) => user['room_no'] === roomNum && user['user_cnt'] === '2',
      );
    
      if (isUserCntFull) {
        alert('인원이 모두 입장했으므로 입장 하실 수 없습니다.');
        getRoomUserCnt()
        navigate('/')
        return;
      }
  
      setRoomChoiceStage(true)
  
      const roomUserCntUpdate = {'room_no' : roomNum, 'user_cnt' : joinCnt}
      joinRoomApi(roomUserCntUpdate);    
      setSearchParams({ no: roomNum, stage:'1' })
      sessionStorage.setItem('roomId', roomNum)
    }

   const joinRoom = ({roomNum}:any) => {
     getEnterRoomUserCnt(roomNum)
   }


 return( 
   <div>
     <div className="room-refresh">
       <button className="room-refresh_btn" onClick={()=>getRoomUserCnt()}>새로고침</button>
     </div>
     <div  className="project-block btn-block">
     {numObject.num.map((num : Line) => ( 
     <div key={"room " + num['no']} className="project_title_change">
       <button className="project_title_change_team_name room-btn" onClick={() => joinRoom({roomNum : num['no']})}   >{num['no'] +"번 방"}</button>          
     </div>
       ))
     }
     </div>
     <div  className="project-block">
     {
     roomUserCnt.map((user:any, num:number) => (
     <div key={'userCnt'+num} className={`project-block_user-cnt${user['room_no']}`}>
       {user['user_cnt']}명 입장
     </div>
     ))
     }
     </div>
   
 </div> 
 )
}

export default EnterRoom;