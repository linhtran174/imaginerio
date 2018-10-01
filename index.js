const path = require('path');
const express = require('express');
const compression = require('compression');
const enforce = require('express-sslify');

const isProduction = false;//process.env.NODE_ENV === 'production';

let app = express();

if (isProduction) {
  app.use(compression());
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

let port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'src/collector')));

fs = require('fs');

index = fs.readFileSync('./dist/index.html');
app.get('/', (req, res) => {
  res.end(index);
});

collector = fs.readFileSync('src/collector/index.html');
app.get('/collector', (req, res) => {
	res.end(collector);
});

app.listen(port, function () {
  console.log('App is running on:' + port);
});
