/**
Be sure to set
TWILIO_API_KEY_SID
TWILIO_API_KEY_SECRET
**/

function sendResponse(data) {
  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  response.appendHeader("Content-Type", "application/json");
  response.setBody(data);
  return response;
}

exports.handler = function(context, event, callback) {

  const AccessToken = require('twilio').jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    context.ACCOUNT_SID,
    context.TWILIO_API_KEY_SID,
    context.TWILIO_API_KEY_SECRET
  );

  // Assign identity to the token
  token.identity = event.Identity || 'identity';

  // Grant the access token Twilio Video capabilities
  const grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string
  return callback(null, sendResponse({
      token: token.toJwt()
  }));

};