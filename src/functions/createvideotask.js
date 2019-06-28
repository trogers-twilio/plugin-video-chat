/**
Be sure to set
TWILIO_WORKSPACE_SID
TWILIO_VIDEO_WORKFLOW_SID
TWILIO_SYNC_SERVICE_SID
**/


function createTask(client, workspace, workflow, taskAttributes) {
  return new Promise((resolve, reject) => {
    client.taskrouter.workspaces(workspace).tasks
    .create({
        attributes: JSON.stringify(taskAttributes),
        workflowSid: workflow,
        taskChannel: 'video'
    })
    .then(task => resolve(task))
    .catch((error) => reject(error))
  })
}

function createSyncDoc(client, syncService, roomName, taskSid, phoneNumber) {
  return new Promise((resolve, reject) => {
    client.sync.services(syncService)
    .documents
    .create({
      data: {
        taskSid: taskSid,
        phoneNumber: phoneNumber
      },
      ttl: 3600,
      uniqueName: roomName
    })
    .then(document => {
      resolve(document);
    })
    .catch(error => {
      reject(error)
    })
  })
}

exports.handler = function(context, event, callback) {

  const workspace = context.TWILIO_WORKSPACE_SID;
  const workflow = context.TWILIO_VIDEO_WORKFLOW_SID;
  const syncService = context.TWILIO_SYNC_SERVICE_SID;
  const { roomName, customerName } = event;

  let client = context.getTwilioClient();

  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  createTask(client, workspace, workflow, {
    name: customerName,
    url: context.DOMAIN_NAME,
    flexWorker: decodeURI(event.worker),
    phoneNumber: event.phoneNumber,
    videoChatRoom: roomName
  })
  .then(task => {
    createSyncDoc(client, syncService, roomName, task.sid, event.phoneNumber).then(() => {
      response.setBody(task.sid);
      callback(null, response);
    })
  })
  .catch((error) => {
    callback(error)
  });
};