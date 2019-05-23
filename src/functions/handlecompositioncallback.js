function turnRoomSidIntoRoomName(client, roomSid) {
  return new Promise((resolve, reject) => {
    client.video.rooms(roomSid).fetch().then(room => {
      console.log("turnRoomSidIntoRoomName", room);
      resolve(room.uniqueName);
    }).catch(err => {
      reject(err);
    })
  })
}

function loadSyncMapDataByRoomName(client, syncService, roomName) {
  return new Promise((resolve, reject) => {
    client.sync.services(syncService).documents(roomName).fetch().then(doc => {
      console.log("loadSyncMapDataByRoomName", doc);
      resolve(doc.data);
    }).catch(err => {
      reject(err);
    })
  })
}

exports.handler = function(context, event, callback) {
  let response = new Twilio.Response();
  response.setStatusCode(204);

  switch (event.StatusCallbackEvent) {
    case 'composition-available':
      const roomSid = event.RoomSid;
      const compositionSid = event.CompositionSid;
      const syncService = context.TWILIO_SYNC_SERVICE_SID;
      const client = context.getTwilioClient();
      turnRoomSidIntoRoomName(client, roomSid)
      .then(roomName => {
        loadSyncMapDataByRoomName(client, syncService, roomName)
        .then((docData) => {
          console.log(docData);
          let url = `https://${context.DOMAIN_NAME}/recordcompositionintohubspot?startedOn=${docData.startedOn}&endedOn=${docData.endedOn}&phoneNumber=${docData.phoneNumber}&taskSid=${docData.taskSid}&compositionSid=${compositionSid}`;
          console.log(url);
          client.request({
            method: 'GET',
            uri: url
          })
          setTimeout(() => {
            callback(null,response)
          }, 1000)
        })
      })
    break;
    default:
      callback(null,response);
    break;
  }
}