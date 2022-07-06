import databaseCommon from './database.common.js';
import stages from '../stages/index.js';

class StageCommon {
  goTo(step) {
    return stages[step].action;
  }

  getStage(user) {
    if (databaseCommon[user]) {
      return databaseCommon[user].stage;
    }

    databaseCommon[user] = {
      stage: 0,
      items: [],
    };

    return databaseCommon[user].stage;
  }
}

export default StageCommon;
