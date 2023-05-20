import { atom } from "recoil"

export const rivalTeamNameState = atom<string>({
   key: 'rivalTeamNameState',
   default: '',
 });

 export const rivalTeamScoreState = atom<number>({
   key: 'rivalTeamScoreState',
   default: 0,
 });

 interface roomUserCntStateType {
    room_no : string;
    user_cnt : string;
 }

 export const roomUserCntState = atom<roomUserCntStateType[]>({
  key: 'roomUserCntState',
  default: [
    {
      room_no: '',
      user_cnt:''
    }
  ],
});

export const myTeamOriginId = atom<string | null>({
  key: 'myTeamOriginId',
  default: '',
});

export const matchHitCntGlobal = atom<number>({
  key: 'matchHitCntGlobal',
  default: 0,
});


export const matchBallCntGlobal = atom<number>({
  key: 'matchBallCntGlobal',
  default: 0,
});



export const matchStrikeCntGlobal = atom<number>({
  key: 'matchStrikeCntGlobal',
  default: 0,
});

export const determineMyAttackGlobal = atom<string[]>({
  key: 'determineAttackGlobal',
  default: ['','',''],
});

export const determineMyOutGlobal = atom<string[]>({
  key: 'determineMyOutGlobal',
  default: ['','',''],
});

export const gameRoundGlobal = atom<number | null >({
  key: 'gameRoundGlobal',
  default: 1,
});

export const myNumArrayGlobal = atom<string[] | null>({
  key: 'myNumArrayGlobal',
  default: ['','',''],
});

export const cntTextGlobal = atom<string>({
  key: 'cntTextGlobal',
  default: '',
});

export const gameStatusGlobal = atom<number | null>({
  key: 'gameStatusGlobal',
  default: 1,
});

export const gameSetCntGlobal = atom<number>({
  key: 'gameSetCntGlobal',
  default: 0,
});

export const resultJoinStepGlobal = atom<number>({
  key: 'resultJoinStepGlobal',
  default: 0,
});

export const roomChoiceStageGlobal = atom<boolean>({
  key: 'roomChoiceStageGlobal',
  default: false,
});
