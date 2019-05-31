const Model = require('@kelpjs/next/model');

class Profile extends Model {
  static get $schema() {
    return {
      fullname : Model.TYPES.STRING,
      email    : Model.TYPES.STRING,
      homepage : Model.TYPES.STRING,
      github   : Model.TYPES.STRING,
      twitter  : Model.TYPES.STRING,
    };
  }
  static associate(models) {
    Profile.belongsTo(models.User);
  }
}

module.exports = Profile;
