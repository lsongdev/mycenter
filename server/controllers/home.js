import response from '@kelpjs/next/response';
import Controller from '@kelpjs/next/controller';

class Home extends Controller {
  async index() {
    return response
      .create()
      .html('index');
  }
}

module.exports = Home;
