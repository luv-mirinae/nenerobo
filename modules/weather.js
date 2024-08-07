importPackage(org.jsoup);

const _file = require('file');

exports.show = (replier, city) => {
  if (isDuplicatedCityName(replier, city)) {
    return;
  }
  replier.reply(getWeather(city));
};

const getWeather = (city) => {
  var date = new Date();
  var currentDate = date.getFullYear().toString() + (date.getMonth() + 1).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0');
  var currentTime = null;
  var location = locationStandardize(city);
  var cityXYCode = getCityXYCode(location, city);
  var request = null;
  var response = null;
  if (date.getHours().toString().padStart(2, '0') === '00') {
    currentTime = '2330';
  } else {
    if (date.getMinutes() >= 40) {
      currentTime = date.getHours().toString().padStart(2, '0') + '30';
    } else {
      currentTime = (date.getHours() - 1).toString().padStart(2, '0') + '30';
    }
  }
  if (!cityXYCode || !cityXYCode.x || !cityXYCode.y) {
    return '날씨 정보를 조회할 수 없습니다.';
  }
  request = {
    serviceKey: '',
    pageNo: '1',
    numOfRows: '1000',
    dataType: 'JSON',
    base_date: currentDate,
    base_time: currentTime,
    nx: cityXYCode.x,
    ny: cityXYCode.y,
  };
  response = weatherHandler(request);

  var baseTime = response.response.body.items.item[1].baseTime; // 예보 발표 시각
  var fcstTime = response.response.body.items.item[1].fcstTime; // 기준 시각
  var rainPerHour = response.response.body.items.item[13].fcstValue; // 시간당 강수량
  var temperature = response.response.body.items.item[25].fcstValue; // 기온
  var humidity = response.response.body.items.item[31].fcstValue; // 습도
  var windSpeed = response.response.body.items.item[55].fcstValue; // 풍속

  var resultString = '[실시간 날씨 정보]\n\n';
  resultString += '위치: ' + cityXYCode.state + ' ' + cityXYCode.city + '\n';
  resultString += '기온: ' + temperature + '℃\n';
  resultString += '시간당 강수량: ' + rainPerHour + '\n';
  resultString += '습도: ' + humidity + '%\n';
  resultString += '풍속: ' + windSpeed + 'm/s\n\n';
  resultString += '예보 발표 시각: ' + baseTime.slice(0, 2) + ':' + baseTime.slice(2, 4) + '\n';
  resultString += '예보 기준 시각: ' + fcstTime.slice(0, 2) + ':' + fcstTime.slice(2, 4);

  return resultString;
};

const weatherHandler = (request) => {
  var url = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst';
  var document = org.jsoup.nodes.Document;
  var response = null;

  url += '?serviceKey=' + request.serviceKey;
  url += '&pageNo=' + request.pageNo;
  url += '&numOfRows=' + request.numOfRows;
  url += '&dataType=' + request.dataType;
  url += '&base_date=' + request.base_date;
  url += '&base_time=' + request.base_time;
  url += '&nx=' + request.nx;
  url += '&ny=' + request.ny;

  try {
    document = Jsoup.connect(url).ignoreContentType(true).method(Connection.Method.GET).execute().body();
    response = JSON.parse(document);
    return response;
  } catch (error) {
    Log.error('[E] 날씨 API request 실패\n예외 메시지: ' + error);
    return null;
  }
};

const locationStandardize = (city) => {
  var location = {
    state: null,
    city: null,
  };
  switch (city) {
    case '서울':
    case '서울특별시':
      location.city = '서울특별시';
      break;
    case '부산':
    case '부산광역시':
      location.city = '부산광역시';
      break;
    case '대구':
    case '대구광역시':
      location.city = '대구광역시';
      break;
    case '인천':
    case '인천광역시':
      location.city = '인천광역시';
      break;
    case '광주':
    case '광주광역시':
      location.city = '광주광역시';
      break;
    case '대전':
    case '대전광역시':
      location.city = '대전광역시';
      break;
    case '울산':
    case '울산광역시':
      location.city = '울산광역시';
      break;
    case '세종':
    case '세종시':
    case '세종특별자치시':
      location.city = '세종특별자치시';
      break;
    default:
      break;
  }
  return location;
};

const isDuplicatedCityName = (replier, city) => {
  var flag = false;
  switch (city) {
    case '고성':
    case '고성군':
    case '광주':
      flag = true;
      break;
    default:
      flag = false;
  }
  if (flag) {
    replier.reply(
      '중복된 도시 이름은 아래와 같이 입력해주세요.\n\n' +
        '- 강원특별자치도 고성군: 강원고성\n' +
        '- 전라남도 고성군: 전남고성\n' +
        '- 경기도 광주시: 광주시' +
        '- 광주광역시: 광주광역시'
    );
  }
  return flag;
};

const getCityXYCode = (locationParam, city) => {
  var location = locationParam;
  var cities = JSON.parse(FileStream.read(_file.getPath() + 'weather/city.json'));
  var cityElement = null;
  var result = {
    state: null,
    city: null,
    x: null,
    y: null,
  };
  switch (city) {
    case '강원고성':
      location.state = '강원특별자치도';
      location.city = '고성군';
      break;
    case '전남고성':
      location.state = '전라남도';
      location.city = '고성군';
    default:
      break;
  }
  if (!cities || cities === 'null') {
    Log.error('[E] city.json 파일을 읽을 수 없습니다.');
    return null;
  }
  if (!location.state) {
    location.state = '';
  }
  if (!location.city) {
    if (city === '이어도') {
      location.city = '';
    }
    location.city = city;
  }
  for (cityElement of cities) {
    if (location.city === '') {
      if (cityElement.state === location.state || cityElement.city === location.city) {
        result.state = cityElement.state;
        result.city = cityElement.city;
        result.x = cityElement.x;
        result.y = cityElement.y;
      }
    } else {
      if (cityElement.state === location.state || String(cityElement.city).includes(location.city)) {
        result.state = cityElement.state;
        result.city = cityElement.city;
        result.x = cityElement.x;
        result.y = cityElement.y;
      }
    }
  }
  return result;
};
