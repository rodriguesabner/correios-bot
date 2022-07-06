import database from '../common/database.common.js';
import OrderCommon from '../common/order.common.js';

const internalDb = {
  counter: 0,
  trackingCode: null,
};

async function execute(user, msg) {
  if (msg === 'sair') {
    database[user].stage = 0;
    internalDb.counter = 0;

    return [{
      message: 'Solicitação finalizada com sucesso',
      order: 0,
    }, {
      message: 'Não esquece, tô aqui qualquer coisa, só dar um toque 😉',
      order: 1,
    }];
  }

  if (internalDb.counter === 1) {
    const inputIndex = parseInt(msg, 10);
    const choosed = database[user].items.find((item, index) => index === inputIndex);

    if (choosed) {
      internalDb.trackingCode = choosed.trackingCode;
    } else {
      return [{
        message: 'Não achei esse item... Escolha um dos itens acima ou digite *sair* para cancelar a operação.',
        order: 0,
      }];
    }

    const orderCommon = new OrderCommon();
    const { catOrder, statusOrder } = await orderCommon.searchOrder(internalDb.trackingCode);
    internalDb.counter = 0;
    database[user].stage = 0;

    return [{
      message: 'Por favor, aguarde alguns segundos...',
      order: 0,
    }, {
      message: catOrder,
      order: 1,
    }, {
      message: statusOrder,
      order: 2,
    }, {
      message: 'Feito, qualquer coisa só dar um toque 😉',
      order: 3,
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
      url: 'https://i0.statig.com.br/bancodeimagens/6d/vq/xb/6dvqxbgk7oxn4e2s7bkulenlx.jpg',
    }, {
      message: 'Você ainda não tem encomendas cadastradas',
      order: 0,
    }];
  }

  return [{
    message: 'Escolha o número do item que você deseja consultar',
    order: 0,
  }, {
    message: items,
    order: 1,
  }];
}

export default {
  execute,
};
