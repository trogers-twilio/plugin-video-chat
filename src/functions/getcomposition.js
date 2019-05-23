const request = require('request');

exports.handler = function(context, event, callback) {
  const compositionSid = event.compositionSid || null;

  if (null === compositionSid) {
      throw new Error("compositionSid must be provided");
  }

  const client = context.getTwilioClient();

  const uri = `https://video.twilio.com/v1/Compositions/${compositionSid}/Media`;

    client.request({
         method: 'GET',
        uri: uri
    })
    .then(response =>{
        const mediaLocation = JSON.parse(response.body).redirect_to;
        // console.log(mediaLocation);
        var r = request(mediaLocation)
        r.on('response', (res) => {
            let response = new Twilio.Response();
            response.setStatusCode(302);
            response.appendHeader('Location', res.request.uri.href);
            callback(null, response);
        });
    })
    .catch(error =>{
        console.log("Error fetching /Media resource " + error);
        callback(null, error)
    });
};