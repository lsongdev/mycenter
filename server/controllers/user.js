import crypto        from 'crypto';
import Response      from '@kelpjs/next/response';
import Controller    from '@kelpjs/next/controller';

import User          from '../models/user';
import Timeline      from '../models/timeline';
import Invitation    from '../models/invitation';
import Application   from '../models/application';
import Authorization from '../models/authorization';

class UserController extends Controller {
  async index(params) {
    const response = new Response();
    const user = await User.findOne({ where: params });
    if (!user) return 404;
    const timelines = await user.getTimelines({
      order: [
        ['createdAt', 'DESC']
      ]
    });
    return response
      .json(timelines)
      .html('home', { timelines });
  }
  async user(user) {
    if (!user) return 401;
    const { id, username } = user;
    const profile = await user.getProfile();
    const u = profile.toJSON();
    u.id = id;
    u.username = username;
    delete u.UserId;
    return u;
  }
  async join() {
    const response = new Response();
    return response.html('join');
  }
  async invite(body) {
    const response = new Response();
    let invitation = await Invitation.findOne({ where: body });
    if (invitation) {
      const msg = 'already exist';
      return response
        .status(400)
        .text(msg)
        .json({ msg })
        .html('error', { msg });
    }
    body.code = crypto.randomBytes(16).toString('hex');
    invitation = await Invitation.create(body);
    return response.redirect(`/signup?code=${invitation.code}`);
  }
  async signup(query) {
    const response = new Response();
    return response.html('signup', query);
  }
  async create(body) {
    const { code } = body;
    const invitation = await Invitation.findOne({ where: { code } });
    const response = new Response();
    if (!invitation) {
      const msg = 'invitation is required';
      return response
        .status(422)
        .text(msg)
        .json({ msg })
        .html('error', { msg });
    }
    if (invitation.status) {
      const msg = 'already use';
      return response
        .status(400)
        .text(msg)
        .json({ msg })
        .html('error', { msg });
    }
    body.salt = crypto.randomBytes(16).toString('hex');
    const sha256 = crypto.createHmac('sha256', body.salt);
    body.password = sha256.update(body.password).digest('hex');
    const user = await User.create(body);
    invitation.status = true;
    await invitation.save();
    console.log('create user:', user);
    return response.redirect('/login');
  }
  async login() {
    const response = new Response();
    return response.html('login');
  }
  async auth(body, ajax, headers) {
    const response = new Response();
    const { username } = body;
    const app = await Application.findByPk(1);
    if (!app) {
      const msg = 'app does not exists';
      return response
        .status(404)
        .text(msg)
        .json({ msg })
        .html('error', { msg });
    }
    const user = await User.findOne({ where: { username } });
    if (!user) {
      const msg = 'user does not exists';
      return response
        .status(404)
        .text(msg)
        .json({ msg })
        .html('error', { msg });
    }
    const sha256 = crypto.createHmac('sha256', user.salt);
    const password = sha256.update(body.password).digest('hex');
    if (password !== user.password) {
      const msg = 'password does not match';
      return response
        .status(401)
        .text(msg)
        .json({ msg })
        .html('error', { msg });
    }
    const token = crypto.randomBytes(16).toString('hex');
    const session = await user.createSession({ token });
    await session.setApp(app);
    await session.save();
    response
      .json({ token })
      .cookie('token', session.token);
    if (!ajax && headers['content-type'] !== 'application/json')
      response.redirect(`/${user.username}`);
    return response;
  }
  async logout(query, cookies) {
    if (!Object.keys(query).length) {
      const { token } = cookies;
      query.token = token;
    }
    const session = await Authorization.findOne({ where: query });
    return session.destroy();
  }
  async timeline(body, user) {
    if (!user) return 403; // res.status(403).send('login required');
    const timeline = await Timeline.create(body);
    user.addTimeline(timeline);
    const response = new Response();
    return response.redirect(`/${user.username}`);
  }
  async setting(user) {
    const response = new Response();
    if (!user) return response.status(404);
    const profile = await user.getProfile();
    const sessions = await user.getSessions({ include: 'app' });
    return response
      .json({ sessions, profile })
      .html('setting', { sessions, profile: profile || {} });
  }
  async profile(user, body) {
    const profile = await user.updateProfile(body);
    const response = new Response();
    return response
      .status(200)
      .json(profile)
      .redirect('/settings');
  }
}

module.exports = UserController;
