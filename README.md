# A Video Chat Plugin for Flex

## Table of Contents
* [Summary](#summary)  
* [API Keys](#api_keys)  
* [Twilio Functions](#twilio_functions)  
  * [Account SID and Auth Token](#account_sid_auth_token)  
  * [Environment Variables](#environment_variables)  
* [Setup](#setup)  
* [Development](#development)  
* [Deploy](#deploy)  

## <a name="summary" />Summary
This plugin allows you to accept video channel tasks in Flex. Its a demo only plugin and not yet ready for production code, but could be a starting place. To see an example implementation for the client side (allowing a customer to initiate a video chat from your website), review the repo here:

[https://github.com/trogers-twilio/site-video-chat-client](https://github.com/trogers-twilio/site-video-chat-client)

## <a name="api_keys" />API Keys
In order to generate a token capable of creating or joining a video room, it's necessary to use an API Key. If you don't already have an API Key created, or you would like to create a dedicated key for this use case, in the Twilio Console navigate to Runtime -> API Keys. Create a new key and note the SID and Secret. These will be used later when setting up our Twilio Functions.

## <a name="twilio_functions" />Twilio Functions
Currently it requires several hosted functions, which are stored in `src/functions`. These functions have comments at the top that describe the environment variables they need. Please deploy them into your environment and set the variables before trying to use the plugin.

Once you've recieved your domain for your hosted functions, please add it to `public/appConfig.js`.

#### <a name="account_sid_auth_token" />Account SID and Auth Token
The function for generating tokens to create/join video rooms requires use of the Account SID. Be sure the "Enable ACCOUNT_SID and AUTH_TOKEN" option is checked in Runtime -> Functions -> Configure in the Twilio console.

#### <a name="environment_variables" />Environment Variables
The following environment variables are used by either the token generating function or the video task creation function. Each variable must exist and be populated with a valid value for this plugin to operate. Please create/configure as necessary in Runtime -> Functions -> Configure in the Twilio Console:

* TWILIO_API_KEY_SID
  * The SID of the API Key you want to use for generating tokens
* TWILIO_API_KEY_SECRET
  * The secret for the API Key
* TWILIO_SYNC_SERVICE_SID
  * The SID of the Sync Service to use when creating a Sync Doc
* TWILIO_WORKSPACE_SID
  * The SID of the TaskRouter workspace to use for routing video interactions
* TWILIO_VIDEO_WORKFLOW_SID
  * The SID of the TaskRouter workflow to use for routing video interactions

## <a name="setup" />Setup

Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards install the dependencies by running `npm install`:

```bash
cd plugin-video

# If you use npm
npm install
```
## <a name="development" />Development

In order to develop locally, you can use the Webpack Dev Server by running:

```bash
npm start
```

This will automatically start up the Webpack Dev Server and open the browser for you. Your app will run on `http://localhost:8080`. If you want to change that you can do this by setting the `PORT` environment variable:

```bash
PORT=3000 npm start
```

When you make changes to your code, the browser window will be automatically refreshed.

## <a name="deploy" />Deploy

Once you are happy with your plugin, you have to bundle it, in order to deply it to Twilio Flex.

Run the following command to start the bundling:

```bash
npm run build
```

Afterwards, you'll find in your project a `build/` folder that contains a file with the name of your plugin project. For example `plugin-example.js`. Take this file and upload it into the Assets part of your Twilio Runtime.

Note: Common packages like `React`, `ReactDOM`, `Redux` and `ReactRedux` are not bundled with the build because they are treated as external dependencies so the plugin will depend on Flex which would provide them globally.
