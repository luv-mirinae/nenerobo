/**
 * 명령어 목록
 * @param {String} botName 봇 이름
 * @param {Object} replier 응답 객체
 */
exports.usage = (botName, replier) => {
  var resultMsg = '[네네로보 명령어]\n\n';
  resultMsg += '▼ 아래 버튼을 클릭하세요. ▼\n' + '\u200b'.repeat(500) + '\n';
  resultMsg += `${botName} 명령어\n사용 가능한 명령어 목록을 표시합니다.\n\n`;
  resultMsg += `${botName} 상태\n배터리와 온도 상태를 보여줍니다.\n\n`;
  replier.reply(resultMsg);
};
