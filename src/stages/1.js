import moment from 'moment';
import database from '../common/database.common.js';
import OrderCommon from '../common/order.common.js';
import 'moment/locale/pt-br.js';

moment.locale('pt-br');

const internalDb = {
  counter: 0,
  trackingCode: null,
  name: null,
};

async function execute(user, msg) {
  if (msg === 'sair') {
    database[user].stage = 0;
    return [{ message: 'Operação finalzada com sucesso, a encomenda não foi cadastrada.', order: 0 }];
  }

  if (msg && msg !== '1') {
    if (internalDb.counter === 0) {
      internalDb.trackingCode = msg.toUpperCase();
      internalDb.counter += 1;
      return [{ message: 'Agora dê um apelido para esta encomenda', order: 0 }];
    }

    if (internalDb.counter === 1) {
      internalDb.name = msg;
      database[user].items.push(internalDb);
      internalDb.counter += 1;
      return [{ message: 'Encomenda cadastrada com sucesso! Deseja consultar o status agora?', order: 0 }];
    }

    if (internalDb.counter === 2) {
      if (msg === 'sim') {
        database[user].stage = 0;
        internalDb.counter = 0;

        const orderCommon = new OrderCommon();
        const { catOrder, statusOrder } = await orderCommon.searchOrder(internalDb.trackingCode);

        return [{
          message: catOrder,
          order: 0,
        }, {
          message: statusOrder,
          order: 1,
        }, {
          message: 'Feito, qualquer coisa só dar um toque 😉',
          order: 2,
        }];
      }
    }

    internalDb.counter = 0;
    database[user].stage = 0;
    return [{ message: 'Belezinha, qualquer coisa é só me chamar 🤖', order: 0 }];
  }

  return [{
    message: 'Legal! Agora digite o código de rastreio por favor',
    order: 0,
  }];
}

export default {
  execute,
};
