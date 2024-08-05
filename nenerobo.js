/**
 * @author luv-mirinae
 * @license MIT @see LICENSE
 */

'use strict';

const scriptName = 'nenerobo';
const botName = '네네로보';

/**
 * 메시지 카운트
 * @typedef {Object} msgCount
 * @property {Number} _sweet  이름이 _sweet인 채팅방
 * @property {Number} _lab    이름이 _lab인 채팅방
 */
var msgCount = {
  _sweet: 0,
  _lab: 0,
};

importPackage(org.jsoup);

const response = (room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) => {
  autoRead(room, replier);
};

const autoRead = (room, replier) => {
  var roomList = Object.getOwnPropertyNames(msgCount);
  var MARK_AS_READ_MSG_COUNT = 300;
  if (roomList.includes(room)) {
    msgCount[room]++;
    //
    replier.reply(msgCount[room]);
    if (msgCount[room] >= MARK_AS_READ_MSG_COUNT) {
      replier.markAsRead(room);
      msgCount[room] = 0;
      Log.info(`[INFO] ${room}방의 메시지 읽음 처리됨`);
    }
  } else {
    Log.error(`[ERROR] 메시지를 읽을 방 ${room}을(를) 찾을 수 없습니다.`);
  }
};
