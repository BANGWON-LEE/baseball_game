export const joinRoomApi = async (roomUserCntUpdate :any) => {

   const response = await fetch(`http://localhost:5000/api/room/join`, {
      method: 'PUT', // 또는 'PATCH'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomUserCntUpdate),
    });
    const data = await response.json();
    return data;
}

export const checkRoomUserCntApi = async () => {

   const response = await fetch(`http://localhost:5000/api/room/user`, {
      method: 'GET', // 또는 'PATCH'
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(roomUserCntUpdate),
    });
    const data = await response.json();
    return data;
}


// export const updateRoomStageStep = async () => {

//   const response = await fetch(`http://localhost:5000/api/room/stage`, {
//      method: 'PUT', // 또는 'PATCH'
//      headers: {
//        'Content-Type': 'application/json',
//      },
//      body: JSON.stringify(roomUserCntUpdate),
//    });
//    const data = await response.json();
//    return data;
// }