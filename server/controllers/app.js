import crypto from 'crypto';
import Response from '@kelpjs/next/response';
import Controller from '@kelpjs/next/controller';

const Application   = require('../models/application');
const Authorization = require('../models/authorization');

class App extends Controller {
  async index() {
    const response = new Response();
    const apps = await Application.findAll();
    return response
      .json(apps)
      .html('app/index', { apps });
  }
  async create(body) {
    const response = new Response();
    body.secret = crypto.randomBytes(16).toString('hex');
    const app = await Application.create(body);
    return response.redirect(`/app/${app.id}`);
  }
  async remove(params) {
    const { id } = params;
    const app = await Application.findByPk(id);
    return app.destroy();
  }
  async app(params) {
    const { id } = params;
    return Application.findByPk(id);
  }
  async auth(user, query) {
    const response = new Response();
    const app = await Application.findOne({
      where: { id: query.client_id }
    });
    if (!app) return response
      .status(404)
      .text('app not found');
    return response.html('app/auth', { app });
  }
  async accept(query, user) {
    const response = new Response();
    if (!user) return response
      .status(403)
      .text('login required');
    // eslint-disable-next-line
    const { client_id } = query;
    const token = crypto.randomBytes(16).toString('hex');
    const app = await Application.findByPk(client_id);
    const auth = await Authorization.create({ token });
    await auth.setApp(app);
    await user.addSession(auth);
    return response.redirect(`${app.callback}?code=${auth.id}`);
  }
  async token(query) {
    // eslint-disable-next-line
    const { client_id, client_secret, code } = query;
    const app = await Application.findOne({ where: { id: client_id } });
    const auth = await Authorization.findOne({ where: { id: code } });
    // eslint-disable-next-line
    if (app && app.secret === client_secret && auth) {
      return auth;
    }
    return 401;
  }
}

module.exports = App;
