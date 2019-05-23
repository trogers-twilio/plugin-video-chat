exports.handler = function(context, event, callback) {
  const phoneNumber = event.phoneNumber;
  const taskSid = event.taskSid;
  const compositionSid = event.compositionSid;
  const client = context.getTwilioClient();
  const url = `https://api.hubapi.com/contacts/v1/search/query?q=${phoneNumber}&hapikey=${context.HUBSPOT_API_KEY}&Offset=2`;

  client.request({
    method: 'GET',
    uri: url
  }).then(response => {
    let resp = JSON.parse(response.body);
    if (resp.total > 1) {
      callback(null, "Too many records");
    }

    const vid = resp.contacts[0].vid;
    const flexWorker = resp.contacts[0].properties.flexworker.value;

    // console.log("vid", vid);
    // console.log("flexWorker", flexWorker);

    const postUrl = `https://api.hubapi.com/engagements/v1/engagements?hapikey=${context.HUBSPOT_API_KEY}`;
    const postBody = {
      engagement: {
        active: true,
        ownerId: 1,
        type: "MEETING"
      },
      associations: {
        contactIds: [vid]
      },
      metadata: {
        startTime: new Date(event.startedOn).getTime(),
        endTime: new Date(event.endedOn).getTime(),
        body: `New Video Call. Review Recording: https://${context.DOMAIN_NAME}/getcomposition?compositionSid=${compositionSid}`,
        title: "New Video Meeting"
      }
    };

    // console.log(JSON.stringify(postBody));

    const request = require('request');

    request({
        method: 'POST',
        uri: postUrl,
        body: postBody,
        json: true
    }, (err, res, body) => {
        // console.log(res)
        if (err) {
            // console.log(err);
            callback(null, err);
        }
        // console.log(body)
        callback(null, body);
    });
  })
}