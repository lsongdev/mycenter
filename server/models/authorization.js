const Model = require('@kelpjs/next/model');

class Authorization extends Model {
  static get $schema() {
    return {
      token : {
        type: Model.TYPES.STRING, allowNull: false,
      },
    };
  }
  static associate(models) {
    Authorization.belongsTo(models.User);
    Authorization.belongsTo(models.Application, { as: 'app' });
  }
}

module.exports = Authorization;
