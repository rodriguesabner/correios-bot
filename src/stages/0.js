import databaseCommon from '../common/database.common.js';
import { options0 } from '../menu/index.js';
import database from '../common/database.common.js';

const internalDb = {
  counter: 0,
};

function checkTime() {
  const now = new Date();
  const hours = now.getHours();
  let ret;

  if (hours >= 18 && hours < 24) {
    ret = 'Boa noite,';
  } else if (hours >= 12 && hours < 18) {
    ret = 'Boa tarde,';
  } else if (hours >= 0 && hours < 12) {
    ret = 'Bom dia,';
  }

  return ret;
}

function execute(user, msg, contato) {
  const greeting = checkTime();
  let options = '';

  if (msg === 'sair') {
    internalDb.counter = 0;

    return [{
      message: 'Solicitação finalizada com sucesso',
      order: 0,
    }, {
      message: 'Ah, tô por aqui de bobeira, só me chamar quando precisar 😎',
      order: 1,
    }];
  }

  if (internalDb.counter === 1) {
    if (!options0[msg]) {
      return [{
        message: 'Não entendi... Escolha um dos itens acima ou digite *sair* para cancelar a operação.',
        order: 0,
      }];
    }

    const step = parseInt(msg, 10);
    databaseCommon[user].stage = step;
    internalDb.counter = 0;
    return { redirect: true, step, user };
  }

  Object.keys(options0).forEach((value) => {
    const element = options0[value];
    options += `${value} - ${element.description} \n`;
  });

  internalDb.counter += 1;

  return [{
    message: `${greeting} ${contato}, para que eu possa te ajudar, escolha uma opção abaixo`,
    order: 0,
  }, {
    message: options,
    order: 1,
  }];
}

export default {
  execute,
};
