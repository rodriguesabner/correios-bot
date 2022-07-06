import database from '../common/database.common.js';

const internalDb = {
  counter: 0,
  trackingCode: null,
};

function execute(user, msg) {
  if (msg === 'sair') {
    database[user].stage = 0;
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
    const inputIndex = parseInt(msg, 10);
    const newItems = database[user].items.filter((item, index) => index !== inputIndex);
    database[user].items = newItems;

    internalDb.counter = 0;
    database[user].stage = 0;

    return [{
      message: 'Encomenda excluída com sucesso',
      order: 0,
    }, {
      message: 'Até logo 🤖',
      order: 1,
    }];
  }

  let items = '';
  const existentOrders = database[user].items;
  if (existentOrders && existentOrders.length > 0) {
    existentOrders.forEach((value, index) => {
      items += `${index} - ${value.name}\n`;
    });

    internalDb.counter += 1;
  } else {
    internalDb.counter = 0;
    database[user].stage = 0;

    return [{
      type: 'sticker',
      url: 'https://i.giphy.com/media/RHInHY2dInc6uMI2ET/giphy.gif',
      order: 0,
    }, {
      message: 'Pô, mas você ainda nem cadastrou uma encomenda, vou te redirecionar pra o início, me chama de novo que a gente começa o processo de cadastro, blz?',
      order: 1,
    }];
  }

  return [{
    message: 'Escolha o número do item que você deseja excluir, caso queira cancelar, digite *sair*',
    order: 0,
  }, {
    message: items,
    order: 1,
  }];
}

export default {
  execute,
};
