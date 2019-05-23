import { FlexPlugin } from 'flex-plugin';
import React from 'react';
import IncomingVideoComponent from './IncomingVideoComponent';

const PLUGIN_NAME = 'VideoPlugin';

export default class VideoPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    const videoChannel = flex.DefaultTaskChannels.createDefaultTaskChannel("video", (task) => task.taskChannelUniqueName === "video");
    videoChannel.icons = {
      active: 'Video',
      list: {
        Assigned:  'Video',
        Canceled:  'Video',
        Completed: 'Video',
        Pending:   'Video',
        Reserved:  'Video',
        Wrapping:  'Video'
      },
      main: 'Video'
    };
    videoChannel.addedComponents = [
      {
        target: "TaskCanvasTabs",
        sortOrder: 1,
        align: "start",
        component: <IncomingVideoComponent manager={manager} icon="Video" iconActive="Video" key="IncomingVideoComponent" />
      }
    ];

    flex.TaskChannels.register(videoChannel);
  }
}
