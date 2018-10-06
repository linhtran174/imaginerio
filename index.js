const path = require('path');
const express = require('express');
const compression = require('compression');
const enforce = require('express-sslify');
const bp = require("fast-json-body");
const upload = require("multer")({dset: "/data/temp"});

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
app.get('/imageCollector', (req, res) => {
	res.end(collector);
});

// app.post('/submitImage', (req, res, next)=>{
//   bp(req, (err, body)=>{
//     if (err) throw err;
//     req.imageMeta = body;
//     next();
//   });
// })

app.post("/submitImage", upload.single("image"));

images = JSON.parse(fs.readFileSync("data/imageMeta.json"));

app.post('/submitImage', (req, res)=>{
  let name = req.file.originalname.split(".");
  let ext = name[1];
  name = name[0];
  // let now = (new Date).toISOString().splice(0, 16);
  let imageId = name + "_" + Date.now() + "." + ext;

  // console.log(req.body, req.file);
  req.body["imageId"] = imageId;
  images.push(req.body);
  
  fs.writeFile("data/images/" + imageId, req.file.buffer, {flag: "w+"}, (err)=>{
    if (err) {
      res.status(404).json(err);
      console.log(err);
      return;
    }
    res.status(200).send()
  });
})

let _prevSize = 0;
setInterval(()=>{
  if(images.length != _prevSize){
    _prevSize = images.length;
    fs.writeFile("data/imageMeta.json", JSON.stringify(images),()=>{});
  }
}, 1000)

app.listen(port, function () {
  console.log('App is running on:' + port);
});
