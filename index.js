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
// app.use(express.static(path.join(__dirname, 'node_modules')));
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

images = JSON.parse(fs.readFileSync("data/imageMeta.json"));

var imageByEra = [];
var eras = require('./src/js/eras.js');
for(i in eras){
  imageByEra[i] = [];
}

images.forEach((image, index)=>{
  for(var i = 0; i < eras.length; i++){
    var e = eras[i];
    if(image.year_est >= e.dates[0] && image.year_est <= e.dates[1]){
      imageByEra[i].push(index);
      break;
    }
  }
});

// console.log(images, imageByEra);

app.post("/submitImage", upload.single("image"));
app.post('/submitImage', (req, res)=>{
  let name = req.file.originalname.split(".");
  let ext = name[1];
  name = name[0];
  // let now = (new Date).toISOString().splice(0, 16);
  let imageId = name + "_" + Date.now() + "." + ext;

  // console.log(req.body, req.file);
  req.body["imageId"] = imageId;
  req.body["index"] = images.length;
  req.body.status = "pending";
  images.push(req.body);
  _data_changed = true;
  
  fs.writeFile("data/images/" + imageId, req.file.buffer, {flag: "w+"}, (err)=>{
    if (err) {
      res.status(404).json(err);
      console.log(err);
      return;
    }
    res.status(200).send()
  });
})




app.get("/imageMeta/:era", (req, res)=>{
  // console.log(req.params.era);
  if(req.params.era == -1){
    res.json(images);
    return;
  }

  var temp = []
  imageByEra[req.params.era].forEach(
    i=>temp.push(images[i])
  )
  res.json(temp);
})

let imageReviewPage = fs.readFileSync("dist/imageReview_1103mcnbb592hd7302jslc.html");
app.get("/imageReview/120342osxbs39sjslkf399", (req, res)=>{
  res.end(imageReviewPage);
})


app.use("/getImage/", express.static(path.join(__dirname, 'data/images')));

app.get("/discardImage/:index", (req, res)=>{
  let index = req.params.index;
  images[index].status = "discarded";
  _data_changed = true;
  res.end();
})


app.post("/modifyImage/:index", (req, res)=>{
  let index = req.params.index;

  bp(req, (err, body)=>{
    if (err) {console.log(err); return;}    
    _data_changed = images[index].description != body.description||
    images[index].caption != body.caption||
    images[index].year_source != body.year_source||
    images[index].year_est != body.year_est;

    images[index].description = body.description;
    images[index].caption = body.caption;
    images[index].year_source = body.year_source;
    images[index].year_est = body.year_est;
    res.end()
  });
  
})

app.get("/publishImage/:index", (req, res)=>{
  let index = req.params.index;
  images[index].status = "published";
  _data_changed = true;
  res.end();
})


let _data_changed = false;
setInterval(()=>{
  if(_data_changed){
    _data_changed = false;
    fs.writeFile("data/imageMeta.json", JSON.stringify(images),()=>{});
  }
}, 1000)





app.listen(port, function () {
  console.log('App is running on:' + port);
});
