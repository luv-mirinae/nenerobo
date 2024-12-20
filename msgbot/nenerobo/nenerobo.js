/**
 * @file Nenerobo Chatbot Main
 * @author luv-mirinae
 * @version 1.0.0-alpha
 * @license AGPL-3.0
 */

'use strict';

// Load current bot
const bot = BotManager.getCurrentBot();
bot.setCommandPrefix('/');

/** @class */
// Load Java classes

/** @module */
// Load modules
const _util = require('util');
const _ai = require('ai');

/** @constant */
// Global constants
// rooms = { ...{ isActive: boolean, count: number } }
const rooms = {
  'DEBUG ROOM': {
    isActive: true,
    count: 0,
  },
  TEST: {
    isActive: false,
    count: 0,
  },
};
// ADMIN_NAME = string
const ADMIN_NAME = 'DEBUG SENDER';
// BOT_NAME = string
const BOT_NAME = '네로';
// COMMANDS = [ ...string ]
const COMMANDS = ['정보'];
// DEBUG_MODE = boolean
const DEBUG_MODE = true;
// LOG_FILE_PATH = string
const LOG_FILE_PATH = '/sdcard/msgbot/Bots/nenerobo/message_logs';

/** @var */
// Global variables

/** @function */
// Listen all messages
const onMessage = (message) => {
  const resultCheckRoom = _util.checkRoom(message.room, rooms);
  if (DEBUG_MODE) {
    Log.debug(`resultCheckRoom: ${JSON.stringify(resultCheckRoom)}`);
  }
  if (message.isGroupChat) {
    // Group chat
    if (resultCheckRoom.isExists) {
      _util.messageLogging(FileStream, LOG_FILE_PATH, message);
      autoRead(message);
    }
  }
};
// Listen command messages
const onCommand = (message) => {
  const resultCheckRoom = _util.checkRoom(message.room, rooms);
  if (message.isGroupChat) {
    // Group chat
    if (resultCheckRoom.isExists) {
      if (rooms[message.room].isActive && !!message.command && message.command === BOT_NAME) {
        if (COMMANDS.findIndex((command) => command === message.args[0]) >= 0) {
          commonActions(message);
          groupChatActions(message);
        } else {
          commonAIActions(message);
        }
      }
    }
  } else {
    // 1:1 chat
    if (!!message.command && message.command === BOT_NAME) {
      if (COMMANDS.findIndex((command) => command === message.args[0]) >= 0) {
        if (message.author.name === ADMIN_NAME) {
          SingleChatAdminActions(message);
        }
        commonActions(message);
        SingleChatActions(message);
      } else {
        commonAIActions(message);
      }
    }
  }
};
// Mark as read
const autoRead = (message) => {
  const MARK_AS_READ_COUNT = 100;
  rooms[message.room].count++;
  if (rooms[message.room].count >= MARK_AS_READ_COUNT) {
    message.markAsRead();
    rooms[message.room].count = 0;
    if (DEBUG_MODE) {
      Log.debug(`autoRead(): ${message.room}`);
    }
  }
};
/**
 * Common Bot Actions
 */
const commonActions = (message) => {
  if (message.args[0] === '정보' && message.args.length === 1) {
    message.reply(_util.getDeviceStatus(Device).text);
  }
};
const commonAIActions = (message) => {
  let prompt = ``;
  message.args.forEach((element) => {
    prompt += `${element} `;
  });
  prompt = prompt.trimEnd();
  const response = _ai.showGPT(FileStream, prompt);
  if (DEBUG_MODE) {
    Log.debug(`_ai.showGPT(): ${JSON.stringify(response)}`);
  }
  message.reply(response.text);
};
/**
 * GroupChat Bot Actions
 */
const groupChatActions = (message) => {};
/**
 * SingleChat Bot Actions
 */
const SingleChatActions = (message) => {};
const SingleChatAdminActions = (message) => {};

// Add listeners
bot.addListener(Event.MESSAGE, onMessage);
bot.addListener(Event.COMMAND, onCommand);
