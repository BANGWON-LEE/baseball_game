import { atom } from "recoil"

export const rivalTeamNameState = atom({
   key: 'rivalTeamNameState',
   default: '',
 });

 export const rivalTeamScoreState = atom({
   key: 'rivalTeamScoreState',
   default: 0,
 });


 export const roomUserCntState = atom({
  key: 'roomUserCntState',
  default: [
    {
      room_no: '',
      user_cnt:''
    }
  ],
});