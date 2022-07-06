import moment from 'moment';
import api from './api.common.js';

class OrderCommon {
  async searchOrder(trackingCode) {
    let statusOrder = '';
    const { data } = await api.get(trackingCode);

    const { eventos } = data.objetos[0];
    const { tipoPostal } = data.objetos[0];

    if (eventos?.length > 0) {
      const lastUpdate = eventos[0];
      const destino = lastUpdate.unidadeDestino != null ? `Destino: ${lastUpdate.unidadeDestino.tipo} - ${lastUpdate.unidadeDestino.endereco.cidade} / ${lastUpdate.unidadeDestino.endereco.uf}\n` : null;

      statusOrder = `Status: ${lastUpdate.descricao}\n
Origem: ${lastUpdate.unidade.tipo} - ${lastUpdate.unidade.endereco.cidade} / ${lastUpdate.unidade.endereco.uf}\n
${destino != null ? destino : `Data: ${moment(lastUpdate.dtHrCriado).format('LLLL')}`}`;

      const catOrder = `Categoria: ${tipoPostal.categoria}`;

      return {
        statusOrder,
        catOrder,
      };
    }

    return {
      statusOrder: 'Nenhum registro encontrado',
      catOrder: '',
    };
  }
}

export default OrderCommon;
