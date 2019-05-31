const Model = require('@kelpjs/next/model');

class Application extends Model {
  static get $schema() {
    return {
      name       : { type: Model.TYPES.STRING, allowNull: false, },
      secret     : { type: Model.TYPES.STRING, allowNull: false, },
      callback   : { type: Model.TYPES.STRING, allowNull: false, },
    };
  }
  static associate(models) {
    Application.hasMany(models.Authorization);
  }
}

module.exports = Application;
