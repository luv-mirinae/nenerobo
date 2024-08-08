# nenerobo

nenerobo(네네로보)는 [메신저봇R](https://violetxf.gitbook.io/messengerbot)의 API를 사용하는 채팅봇입니다.

## How to use

### 설치 및 사용

1. 메신저봇R에서 이름이 nenerobo인 봇을 생성(레거시 API 사용)합니다.
2. 소스 코드 전체를 메신저봇의 디렉토리(예: `/sdcard/msgbot/Bots/`)에 복사합니다.
3. `Bots` 하위에 `nenerobo` 디렉토리가 존재해야 합니다.
4. `modules/util.js` 파일의 `msgCount` 객체의 Key를 채팅봇이 속한 채팅방으로, Value를 0으로 설정합니다. 예를 들어, 채팅봇이 속한 채팅방의 이름이 \_sweet와 \_lab이라면, 아래와 같이 설정합니다.
   ```js
   var msgCount = {
     _sweet: 0,
     _lab: 0,
   };
   ```
5. `modules/util.js` 파일의 `filePath` 상수를 현재 사용중인 봇 환경에 맞게 수정합니다. 기본값은 아래와 같이 설정되어 있습니다.

   ```js
   const filePath = '/sdcard/msgbot/Bots/nenerobo/files/';
   ...
   exports.getFilePath = () => {
     return filePath;
   };
   ```

6. 메신저봇 어플리케이션을 실행하여, nenerobo 봇을 컴파일합니다.
7. 전역 활성화 버튼과 nenerobo 활성화 토글 버튼을 클릭합니다.

### 파일/디렉토리 구조

> nenerobo > files > secret > api-key.json

네네로보의 기능이 정상적으로 동작하기 위해서는, API 키를 삽입해야 합니다.

```json
{
  "publicData": {
    "weather": {
      "plain": "",
      "encoded": ""
    }
    ...
  }
}
```

`publicData`는 공공데이터 API 키를 포함한 객체입니다. 각 하위 객체(`weather` 등)에는 `plain` 키와 `encoded` 키가 있습니다.

`plain` 키와 `encoded` 키의 값에 [공공데이터포털](https://www.data.go.kr/)에서 발급받은 키를 붙여넣으면 됩니다.<br><br>

> nenerobo > modules

네네로보의 기능을 정의한 모듈이 저장된 디렉토리입니다.<br><br>

> nenerobo > modules > util.js

`getFilePath()` 함수는 `files` 디렉토리의 절대 위치를 반환하는 모듈 함수입니다.

사용중인 환경에 맞게 `filePath` 상수를 수정하여 사용하세요.

```js
const filePath = '/sdcard/msgbot/Bots/nenerobo/files/';
...
exports.getFilePath = () => {
  return filePath;
};
```

> nenerobo > nenerobo.js

메신저 어플리케이션의 메시지를 수신하면 동작하는 네네로보의 메인 코드입니다.

## License

MIT
