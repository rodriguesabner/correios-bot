import { create } from '@wppconnect-team/wppconnect';
import StageCommon from './common/stage.common.js';
import RulesCommon from './common/rules.common.js';

const sessionName = 'bot-correios';
let wppInstance = null;
const stageManager = new StageCommon();
const rulesManager = new RulesCommon();

// wppconnect doc
// https://wppconnect.io/wppconnect/pages/Getting%20Started/creating-client.html

create({
  session: sessionName,
  puppeteerOptions: {
    userDataDir: `./tokens/${sessionName}`,
  },
  logQR: true,
  statusFind: (statusSession, session) => {
    console.log('Status Session: ', statusSession);
    console.log('Session name: ', session);
  },
})
  .then((client) => {
    wppInstance = client;
    start(client);
  });

function start() {
  wppInstance.onAnyMessage(async (message) => {
    if (
      rulesManager.rulesActive === true
        && rulesManager.allowedContacts().includes(message.from)
        && message.self === 'in'
    ) {
      await prepareAnswers(message);
    } else if (rulesManager.rulesActive === false) {
      await prepareAnswers(message);
    }
  });
}

async function prepareMessage(answers, message) {
  answers.sort((a, b) => a.order - b.order);

  let counter = 1;
  for (const answer of answers) {
    setTimeout(() => {
      sendMessage(answer, message);
    }, 1000 * counter);

    counter += 1;
  }
}

async function sendMessage(answer, message) {
  if (answer?.type === 'sticker') {
    await wppInstance.sendImageAsSticker(message.from, answer.url);
  }

  if (answer.message) {
    await wppInstance.sendText(message.from, answer.message);
  }
}

async function prepareAnswers(message) {
  const step = stageManager.getStage(message.from);

  const answers = await stageManager.goTo(step).execute(
    message.from,
    message.body.toLowerCase(),
    message.sender.name,
  );

  if (Array.isArray(answers)) {
    await prepareMessage(answers, message);
  } else if (answers.redirect === true) {
    const ret = await stageManager.goTo(answers.step).execute(answers.user);
    await prepareMessage(ret, message);
  }
}
