import stage0 from './0.js';
import stage1 from './1.js';
import stage2 from './2.js';
import stage3 from './3.js';

const stages = {
  0: {
    name: 'Boas Vindas',
    action: stage0,
  },
  1: {
    name: 'Cadastro',
    action: stage1,
  },
  2: {
    name: 'Consulta',
    action: stage2,
  },
  3: {
    name: 'Exclusão',
    action: stage3,
  },
};

export default stages;
