const Model = require('@kelpjs/next/model');

class Timeline extends Model {
  static get $schema() {
    return {
      content: { type: Model.TYPES.STRING, allowNull: false, }
    };
  }
  static associate(models) {
    Timeline.belongsTo(models.User);
  }
}

module.exports = Timeline;
