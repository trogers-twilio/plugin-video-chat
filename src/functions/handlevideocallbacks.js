exports.handler = function(context, event, callback) {
  // get configured twilio client
    const client = context.getTwilioClient();

    // setup an empty success response
    let response = new Twilio.Response();
    response.setStatusCode(204);

    // switch on the event type
    switch(event.StatusCallbackEvent) {
        case 'room-ended':

            let promises = [];

            promises.push(getSyncMapPromise(context, event, client));
            promises.push(getCompositionPromise(context, event, client));

            Promise.all(promises).then(() => {
                console.log('room ended complete');
                callback(null, response);
            }).catch(err => {
                console.log(err);
                callback(null, err);
            });

        break;
        default:
            callback(null, response);
        break;
    }
};

function getSyncMapPromise(context, event, client) {
    return new Promise((resolve, reject) => {
        const startedOn = (new Date(event.Timestamp).getTime() - event.RoomDuration);
        client.sync.services(context.TWILIO_SYNC_SERVICE_SID).documents(event.RoomName).fetch().then(doc => {
            let data = doc.data;
            data.roomDuration = event.RoomDuration;
            data.startedOn = new Date(startedOn).toISOString();
            data.endedOn = event.Timestamp;
            client.sync.services(context.TWILIO_SYNC_SERVICE_SID).documents(event.RoomName)
            .update({
                data: data
            }).then(doc => {
                resolve();
            }).catch(err => {
                reject(err);
            })
        }).catch(err => reject(err));
    });
}

function getCompositionPromise(context, event, client) {
    return new Promise((resolve, reject) => {
        client.video.compositions
        .create({
            roomSid: event.RoomSid,
            audioSources: '*',
            videoLayout: {
                grid : {
                    video_sources: ['*']
                }
            },
            statusCallback: `https://${context.DOMAIN_NAME}/handlecompositioncallback`,
            format: 'mp4'
        })
        .then(composition =>{
            resolve();
        })
        .catch(err => {
            reject();
        });
    })
}