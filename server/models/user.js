const Model = require('@kelpjs/next/model');
const Profile = require('./profile');

class User extends Model {
  static get $schema() {
    return {
      username: { type: Model.TYPES.STRING, allowNull: false, unique: 'username' },
      password: { type: Model.TYPES.STRING, allowNull: false, },
      salt    : { type: Model.TYPES.STRING, allowNull: false, },
    };
  }
  static associate(models) {
    User.hasOne(models.Profile);
    User.hasMany(models.Timeline);
    User.hasMany(models.Authorization, { as: 'Sessions' });
  }
  async updateProfile(body) {
    let profile = await this.getProfile();
    if (!profile) {
      profile = await Profile.create(body);
      return this.setProfile(profile);
    }
    return profile.update(body);
  }
}

module.exports = User;
