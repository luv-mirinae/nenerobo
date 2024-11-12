/**
 * @file Nenerobo Chatbot Main
 * @author luv-mirinae
 * @version 1.0.0-alpha
 * @license AGPL-3.0
 */

'use strict';

/**
 * Import Java packages and classes
 * @class
 */
importClass(org.jsoup.Connection);
importClass(org.jsoup.Jsoup);

// Load project modules
const moduleUtil = require('modules/util');
const moduleAI = require('modules/ai');

// Rooms
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

// Bot name
const BOT_NAME = '/네로';

// Command List
const COMMANDS = ['상태'];

// Chat log directory
const LOG_FILE_PATH = '/sdcard/StarLight/projects/nenerobo/message_logs';

function onMessage(event) {
  moduleUtil.messageLogging(LOG_FILE_PATH, event);
  autoRead(event);
  const messages = moduleUtil.messageTokenizer(event.message);
  const roomNameArray = Object.getOwnPropertyNames(rooms);
  if (event.room.isGroupChat && roomNameArray.includes(event.room.name) && rooms[event.room.name].isActive) {
    // 그룹 채팅방에서 명령어 수신
    if (messages.command === BOT_NAME) {
      if (COMMANDS.findIndex((command) => command === messages.message[0]) >= 0) {
        // Execute command function
        if (messages.message.length === 1 && messages.message[0] === '상태') {
          event.room.send(moduleUtil.getDeviceStatus());
        }
      } else {
        // COMMANDS에 없는 명령어는 Gemini AI 호출로 간주한다.
        let prompt = '';
        messages.message.forEach((element) => {
          prompt += element + ' ';
        });
        prompt = prompt.trimEnd();
        // TODO: Show AI
        event.room.send(moduleAI.show(prompt));
        prompt = '';
      }
    }
  }
  if (!event.room.isGroupChat) {
    // 일반 채팅방에서 명령어 수신
    if (messages.command === BOT_NAME) {
    }
  }
}

function onStartCompile() {
  // Message logging
  const roomNames = Object.getOwnPropertyNames(rooms);
  roomNames.forEach((element) => {
    if (!moduleUtil.isFileExists(`${LOG_FILE_PATH}/${element}/${moduleUtil.getCurrentDate()}.csv`)) {
      FileStream.write(`${LOG_FILE_PATH}/${element}/${moduleUtil.getCurrentDate()}.csv`, `date,id,name,message,\n`);
    }
  });
}

// Auto read
const autoRead = (event) => {
  const room = event.room.name;
  const MARK_AS_READ_COUNT = 100;
  rooms[room].count++;
  if (rooms[room].count >= MARK_AS_READ_COUNT) {
    event.room.markAsRead();
    rooms[room].count = 0;
    Log.i(`${room}방의 모든 메시지를 읽음 처리했습니다.`);
  }
};
