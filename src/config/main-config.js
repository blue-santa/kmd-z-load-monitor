const path = require('path');
const bodyParser = require('body-parser');

module.exports = {
  init(app, express) {
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname + '/../views'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/assets', express.static(path.join(__dirname + '/../assets')));
  }
}
