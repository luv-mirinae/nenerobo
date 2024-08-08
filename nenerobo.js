/**
 * @author luv-mirinae
 * @license MIT @see LICENSE
 *
 * Compatible with MessengerBot version >= v0.7.34a
 * Using MessengerBot API Level 1
 */

//@ts-nocheck (vscode)

'use strict';

// 전역 변수 설정
const scriptName = 'nenerobo';
const botName = '!네네로보';

// 모듈 로드
const _manual = require('manual');
const _util = require('util');
const _weather = require('weather');

/**
 * @param {String} room 채팅방 이름
 * @param {String} msg 전달된 메시지
 * @param {String} sender 메시지 전송자
 * @param {Boolean} isGroupChat 그룹채팅방 여부
 * @param {Object} replier 응답 객체
 * @param {Object} imageDB 이미지 객체
 * @param {String} packageName 메시지를 수신할 메신저 앱의 패키지명
 * @param {Boolean} isMention 멘션 포함 여부
 * @param {BigInt} logId 고유 로그 ID
 * @param {BigInt} channelId 고유 채널 ID
 * @param {String?} userHash 유저 해시
 */
const response = (room, msg, sender, isGroupChat, replier, imageDB, packageName, isMention, logId, channelId, userHash) => {
  var messages = _util.msgTokenizer(msg);
  if (isGroupChat) {
    _util.autoRead(room, replier);
    if (!!messages && messages[0] === botName) {
      // 그룹 채팅방에서 명령어를 포함한 메시지 수신 시 실행
      // !네네로보 명령어
      if (messages.length === 2 && messages[1] === '명령어') {
        _manual.usage(botName, replier);
      }
      // !네네로보 상태
      if (messages.length === 2 && messages[1] === '상태') {
        _util.neneroboStatus(replier);
      }
      // !네네로보 날씨 [지역]
      if (messages.length === 3 && messages[1] === '날씨') {
        _weather.show(messages[2], replier);
      }
    } else {
      // 그룹 채팅방에서 일반 메시지 수신 시 실행
    }
  }
};
