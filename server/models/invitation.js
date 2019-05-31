const Model = require('@kelpjs/next/model');

class Invitation extends Model {
  static get $schema() {
    return {
      source: { type: Model.TYPES.STRING, allowNull: false, },
      code  : { type: Model.TYPES.STRING, allowNull: false, },
      status: {
        type: Model.TYPES.BOOLEAN,
        defaultValue: 0
      }
    };
  }
}

module.exports = Invitation;
