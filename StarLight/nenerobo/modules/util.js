/**
 * @file Nenerobo Chatbot Util module
 * @author luv-mirinae
 * @version 1.0.0-alpha
 * @license AGPL-3.0
 */

const messageTokenizer = (message) => {
  const messageArray = message.split(' ');
  // result = { command: ?string, message: ?string[] }
  let result = {
    command: null,
    message: [],
  };
  // '/cmd lorem ipsum' | result.command: '/cmd', result.message: [ lorem, ipsum ]
  if (messageArray.length > 0 && messageArray[0].startsWith('/')) {
    result.command = messageArray[0];
    if (messageArray.length > 1) {
      for (let index = 1; index < messageArray.length; index++) {
        result.message.push(messageArray[index]);
      }
    }
    // 'lorem ipsum' | result.command: null, result.message: [ lorem, ipsum ]
  } else if (messageArray.length > 0) {
    for (let index = 0; index < messageArray.length; index++) {
      result.message.push(messageArray[index]);
    }
  }
  return result;
};

const getDeviceStatus = () => {
  const status = {
    getBatteryLevel: Device.getBatteryLevel(),
    getBatteryTemperature: Device.getBatteryTemperature(),
    isCharging: Device.isCharging(),
  };
  return (
    `◈ 기기 정보 ◈\n\n` +
    `🔋 배터리 잔량: ${status.getBatteryLevel}%\n` +
    `🌡️ 배터리 온도: ${Math.floor(status.getBatteryTemperature / 100)} ℃\n` +
    `⚡ 충전 상태: ${status.isCharging ? '충전 중' : '방전 중'}`
  );
};

const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${hour}:${minute}:${second}`;
};

const isFileExists = (path) => {
  return !!FileStream.read(path);
};

exports.messageTokenizer = messageTokenizer;
exports.getDeviceStatus = getDeviceStatus;
exports.getCurrentDate = getCurrentDate;
exports.getCurrentTime = getCurrentTime;
exports.isFileExists = isFileExists;
