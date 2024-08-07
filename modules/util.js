/**
 * @typedef {Object} msgCount 채팅방의 메시지 카운트를 저장하는 객체
 * @property {Number} _sweet 이름이 _sweet인 채팅방
 * @property {Number} _bakery 이름이 _bakery인 채팅방
 * @property {Number} _tofu 이름이 _tofu인 채팅방
 * @property {Number} _lab 이름이 _lab인 채팅방
 */
var msgCount = {
  _sweet: 0,
  _bakery: 0,
  _tofu: 0,
  _lab: 0,
};

/**
 * 메시지 토큰화
 * @param {String} msg 전달받은 메시지
 * @returns {String[]?}
 */
exports.msgTokenizer = (msg) => {
  return !!msg ? msg.split(' ') : null;
};

/**
 * 배터리, 온도 상태
 * @param {Object} replier 응답 객체
 */
exports.neneroboStatus = (replier) => {
  var status = {
    batteryLevel: Device.getBatteryLevel(),
    batteryStatus: Device.isCharging(),
    batteryTemp: Math.floor(Device.getBatteryTemperature() / 10),
  };

  var resultMsg = `[네네로보 상태]\n\n`;
  resultMsg += `배터리: ${status.batteryLevel}% (${status.batteryStatus ? '충전 중' : '방전 중'})\n`;
  resultMsg += `온도: ${status.batteryTemp}℃`;

  replier.reply(resultMsg);
};

/**
 * 메시지 자동 읽음 처리
 * @param {String} room 방 이름
 * @param {Object} replier 응답 객체
 */
exports.autoRead = (room, replier) => {
  var roomList = Object.getOwnPropertyNames(msgCount);
  var maxCount = 300;
  if (roomList.includes(room)) {
    msgCount[room]++;
    if (msgCount[room] >= maxCount) {
      replier.markAsRead();
      msgCount[room] = 0;
      Log.info(`[I] ${room}방의 모든 메시지를 읽음 처리했습니다.`);
    }
  } else {
    Log.error(`[E] 메시지를 읽음 처리할 채팅방 ${room}을(를) 찾을 수 없습니다.`);
  }
};
