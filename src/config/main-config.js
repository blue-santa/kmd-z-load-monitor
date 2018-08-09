const path = require('path');
const bodyParser = require('body-parser');

module.exports = {
  init(app, express) {
    app.set(bodyParser.urlencoded({ extended: true }));
  }
}
