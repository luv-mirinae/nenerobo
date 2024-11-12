/**
 * @file Nenerobo Chatbot AI module
 * @author luv-mirinae
 * @version 1.0.0-alpha
 * @license AGPL-3.0
 */

'use strict';

const API_KEY = '';

const show = (prompt) => {
  const response = requestHandler(requestBuilder(prompt));
  if (!response) {
    Log.e(`AI Error: response is null or empty`);
    return '오류가 발생했습니다.';
  } else {
    return response;
  }
};

const requestBuilder = (prompt) => {
  const request = {
    serviceKey: API_KEY,
    body: JSON.parse(FileStream.read('/sdcard/StarLight/projects/nenerobo/data/gemini/request.json')),
  };
  if (!request.body) {
    return null;
  }
  request.body.contents[2].parts[0].text = prompt;
  return request;
};

const requestHandler = (request) => {
  const URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=';
  const response = Java.type('org.jsoup.nodes.Document');
  let responseBody = null;
  let result = null;

  if (!request) {
    return null;
  }

  // Jsoup POST
  try {
    response = Jsoup.connect(URL + request.serviceKey)
      .ignoreContentType(true)
      // .ignoreHttpErrors(true)
      .method(Connection.Method.POST)
      .header('Content-Type', 'text/plain')
      .requestBody(JSON.stringify(request.body))
      .execute();
    responseBody = JSON.parse(response.body());
  } catch (error) {
    Log.error(`AI Error: Jsoup POST error, ${error}`);
    return null;
  }
  if (!responseBody) {
    return null;
  }
  switch (responseBody.candidates[0].finishReason) {
    // normal
    case 'STOP':
      result = responseBody.candidates[0].content.parts[0].text.slice(0, -2);
      break;
    // failed (NSFW)
    case 'SAFETY':
      result = '흐음... 곤란한 질문이네.';
      break;
    // failed (error)
    default:
      result = '지금은 대화할 수 없어.';
      break;
  }
  return result;
};

exports.show = show;
