importPackage(org.jsoup);

exports.show = (message, replier) => {
  // 양식화된 날씨 정보(String)
  var info = getWeatherInfo(message, replier);
  if (!info) {
    replier.reply('날씨를 조회할 수 없습니다.');
    Log.error(`[E] 날씨 API 오류: 날씨를 조회할 수 없습니다.`);
    return;
  }
  replier.reply(info);
};

const getWeatherInfo = (message, replier) => {
  // Jsoup GET으로 요청하여 응답받은 객체의 Body
  var response = requestHandler(requestBuilder(message, replier));
  if (!response) {
    return null;
  }
  replier.reply(JSON.stringify(response));
};

const requestBuilder = (message, replier) => {
  var date = new Date();
  var locationXY = getLocationXY(message, replier);
  Api.replyRoom('_lab', JSON.stringify(locationXY));
  var request = {
    serviceKey: getServiceKey(),
    base_date: getBaseDate(date),
    base_time: getBaseTime(date),
    nx: null,
    ny: null,
    dataType: 'JSON',
    pageNo: '1',
    numOfRows: '1000',
  };
  if (!request.nx || !request.ny) {
    return null;
  }
  return request;
};

const requestHandler = (request) => {
  var url = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
  var response = org.jsoup.nodes.Document;
  var responseBody = null;

  Api.replyRoom('_lab', JSON.stringify(request));
  if (!request) {
    return null;
  }
  url += '?serviceKey=' + request.serviceKey;
  url += '&pageNo=' + request.pageNo;
  url += '&numOfRows=' + request.numOfRows;
  url += '&dataType=' + request.dataType;
  url += '&base_date=' + request.base_date;
  url += '&base_time=' + request.base_time;
  url += '&nx=' + request.nx;
  url += '&ny=' + request.ny;

  // Jsoup GET
  try {
    response = Jsoup.connect(url).ignoreContentType(true).method(Connection.Method.GET).execute();
    responseBody = JSON.parse(response.body());
  } catch (error) {
    Log.error(`[E] Jsoup GET error: ${error}`);
    return null;
  }
  return responseBody;
};

const getServiceKey = () => {
  var keys = JSON.parse(FileStream.read(_util.getFilePath() + 'secret/api-key.json'));
  var key = null;
  if (!keys || keys === 'null') {
    return null;
  }
  return keys.publicData.weather.encoded;
};

const getBaseDate = (date) => {
  return date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
};

const getBaseTime = (date) => {
  if (date.getHours().toString().padStart(2, '0') === '00') {
    return date.getMinutes() >= 40 ? '0030' : '2330';
  } else {
    if (date.getMinutes() >= 40) {
      return date.getHours().toString().padStart(2, '0') + '30';
    } else {
      return (date.getHours() - 1).toString().padStart(2, '0') + '30';
    }
  }
};

const getLocationXY = (message, replier) => {
  var _util = require('util');
  var cities = JSON.parse(FileStream.read(_util.getFilePath() + 'weather/city.json'));
  var duplicated = null;
  var city = {
    state: null,
    city: null,
    x: null,
    y: null,
  };
  var element = null;
  city.city = cityNameStandardize(message);
  if (city.city === 'duplicated') {
    duplicated = `중복되거나 모호한 도시 이름입니다.\n`;
    duplicated += `${duplicatedCityNames[0]}, ${duplicatedCityNames[1]}은 강원고성 또는 전남고성으로 입력해주세요.\n`;
    duplicated += `${duplicatedCityNames[2]}는 광주시 또는 광주광역시로 입력해주세요.`;
    replier.reply(duplicated);
    return null;
  }
  for (element of cities) {
    if (element.city === city.city) {
      city = element;
    }
  }
  return city;
};

const cityNameStandardize = (cityName) => {
  var resultCityName = null;
  var duplicatedCityNames = ['고성', '고성군', '광주'];
  switch (cityName) {
    case '서울':
    case '서울시':
    case '서울특별시':
      resultCityName = '서울특별시';
      break;
    case '부산':
    case '부산광역시':
      resultCityName = '부산광역시';
      break;
    case '대구':
    case '대구광역시':
      resultCityName = '대구광역시';
      break;
    case '인천':
    case '인천광역시':
      resultCityName = '인천광역시';
      break;
    case '광주':
    case '광주광역시':
      resultCityName = '광주광역시';
      break;
    case '대전':
    case '대전광역시':
      resultCityName = '대전광역시';
      break;
    case '울산':
    case '울산광역시':
      resultCityName = '울산광역시';
      break;
    case '세종':
    case '세종시':
    case '세종특별자치시':
      resultCityName = '세종특별자치시';
      break;
    default:
      break;
  }
  if (!!resultCityName) {
    return resultCityName;
  }
  if (duplicatedCityNames.includes(cityName)) {
    return 'duplicated';
  }
};
