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
const _Jsoup = importClass(org.jsoup.Jsoup);

/** @module */
// Load modules
const _util = require('util');

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
const COMMANDS = ['지금'];
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
          // Demo: Show current date and time
          if (message.args[0] === '지금' && message.args.length === 1) {
            currentDateTime(message);
          }
        } else {
          // TODO: Execute AI function
        }
      }
    }
  } else {
    // 1:1 chat
    if (message.author.name === ADMIN_NAME && !!message.command && message.command === BOT_NAME) {
      if (COMMANDS.findIndex((command) => command === message.args[0]) >= 0) {
        // Demo: Show current date and time
        if (message.args[0] === '지금' && message.args.length === 1) {
          currentDateTime(message);
        }
      } else {
        // TODO: Execute AI function
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
/** Bot actions */
// Demo: Show current date and time
const currentDateTime = (message) => {
  const getCurDateResult = _util.getCurrentDate();
  const getCurTimeResult = _util.getCurrentTime();
  if (DEBUG_MODE) {
    Log.debug(`currentDateTime(): ${JSON.stringify(getCurDateResult)}\n${JSON.stringify(getCurTimeResult)}`);
  }
  message.reply(`${getCurDateResult.date} ${getCurTimeResult.time}`);
};

// Add listeners
bot.addListener(Event.MESSAGE, onMessage);
bot.addListener(Event.COMMAND, onCommand);
