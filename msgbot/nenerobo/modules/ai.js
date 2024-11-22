/**
 * @file Nenerobo Chatbot AI Module
 * @author luv-mirinae
 * @version 1.0.0-alpha
 * @license AGPL-3.0
 */

'use strict';

/** @constant */
const API_KEY = {
  CHAT_GPT: 'PASTE YOUR API KEY HERE',
};
const TEMPLATE_FILES = {
  CHAT_GPT: '/sdcard/msgbot/Bots/nenerobo/templates/chatgpt/request.json',
};
const result = {
  text: '',
  responseBody: '',
};

/** @function */
const showGPT = (FileStream, prompt) => {
  const response = requestHandler(requestBuilder(FileStream, prompt));
  if (!response) {
    result.text = `오류가 발생했습니다.`;
  }
  return result;
};
// Build ChatGPT requestBody (JSON)
const requestBuilder = (FileStream, prompt) => {
  const request = {
    serviceKey: API_KEY.CHAT_GPT,
    body: JSON.parse(FileStream.read(TEMPLATE_FILES.CHAT_GPT)),
  };
  if (!request.body) {
    return false;
  }
  request.body.messages[1].content[0].text = prompt;
  return request;
};
// Request API (HTTP POST)
const requestHandler = (request) => {
  const URL = 'https://api.openai.com/v1/chat/completions';
  // File not found | Can't read file
  if (!request) {
    return false;
  }
  // Jsoup POST
  const response = org.jsoup.Jsoup.connect(URL)
    .ignoreContentType(true)
    .ignoreHttpErrors(true)
    .method(org.jsoup.Connection.Method.POST)
    .header('Content-Type', 'application/json')
    .header('Authorization', `Bearer ${request.serviceKey}`)
    .requestBody(JSON.stringify(request.body))
    .execute();
  const responseBody = JSON.parse(response.body());
  // API request failed
  if (!responseBody) {
    return false;
  }
  result.responseBody = responseBody;
  switch (responseBody.choices[0].finish_reason) {
    case 'stop':
      result.text = responseBody.choices[0].message.content;
      break;
    default:
      result.text = '지금은 대화할 수 없어.';
      break;
  }
  return true;
};

exports.showGPT = showGPT;
