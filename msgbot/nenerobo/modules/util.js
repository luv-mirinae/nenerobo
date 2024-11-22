/**
 * @file Nenerobo Chatbot Util Module
 * @author luv-mirinae
 * @version 1.0.0-alpha
 * @license AGPL-3.0
 */

'use strict';

/** @function */
// Check is room exists
const checkRoom = (room, rooms) => {
  const result = {
    isExists: false,
  };
  const roomNames = Object.getOwnPropertyNames(rooms);
  roomNames.forEach((element) => {
    if (element === room) {
      result.isExists = true;
    }
  });
  return result;
};
// Return current date (yyyy-mm-dd)
const getCurrentDate = () => {
  const result = {
    date: null,
  };
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  result.date = `${year}-${month}-${day}`;
  return result;
};
// Return current time (HH:MM:SS)
const getCurrentTime = () => {
  const result = {
    time: null,
  };
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  result.time = `${hour}:${minute}:${second}`;
  return result;
};
// Check is file exists
const checkFileExists = (FileStream, path) => {
  const result = {
    isExist: false,
  };
  if (!!FileStream.read(path)) {
    result.isExist = true;
  }
  return result;
};
// Logging messages
const messageLogging = (FileStream, path, message) => {
  const room = message.room;
  const fullPath = `${path}/${room}/${this.getCurrentDate().date}.csv`;
  if (!this.checkFileExists(FileStream, fullPath).isExist) {
    FileStream.write(fullPath, `date,id,name,message\n`);
  }
  let _message = `"${this.getCurrentDate().date} ${this.getCurrentTime().time}"`;
  _message += `,"${message.author.hash}"`;
  _message += `,"${message.author.name}"`;
  _message += `,"${message.content.replace(/(\r\n|\n|\r)/gm, '¶')}"\n`;

  FileStream.append(fullPath, _message);
};

exports.checkRoom = checkRoom;
exports.getCurrentDate = getCurrentDate;
exports.getCurrentTime = getCurrentTime;
exports.checkFileExists = checkFileExists;
exports.messageLogging = messageLogging;
