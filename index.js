const path = require('path');
const express = require('express');
const compression = require('compression');
const enforce = require('express-sslify');
const bp = require("fast-json-body");
const upload = require("multer")({dset: "/data/temp"});
const cors = require("cors");
const sharp = require('sharp');
const utils = require("./utils.js")
const isProduction = false;//process.env.NODE_ENV === 'production';

let app = express();

if (isProduction) {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(compression());

let port = process.env.PORT || 8080;

app.use(cors())
// app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'dist/collector')));

fs = require('fs');

index = fs.readFileSync('./dist/index.html');
app.get('/', (req, res) => {
  res.end(index);
});

// testPage = fs.readFileSync("./dist/testNewUI.html")
app.get('/test', (req, res)=>{
  res.end(fs.readFileSync("./dist/oldTayHo_home.html"));
})

// collector = fs.readFileSync('src/collector/index.html');
app.get('/imageCollector', (req, res) => {
  fs.readFile("dist/collector/image.html", (err, data)=>{
    if(err) res.end(err);
    else res.end(data);
  })
});

app.get('/mapCollector', (req, res) => {
  fs.readFile("dist/collector/map.html", (err, data)=>{
    if(err) res.end(err);
    else res.end(data);
  })
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

  var i = req.body;
  if(isNaN(i.year_est) || isNaN(i.year_source)){
    res.status(404).send("Year must be a number");
    return;
  }
  i.type = "image";
  i["imageId"] = imageId;
  i["index"] = images.length;
  i.status = "pending";

  sharp(req.file.buffer).metadata().then(m=>{
    i.width = m.width;
    i.height = m.height;
    images.push(i);
    _data_changed = true;
  })
  
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
var cache = {}
app.use("/getImage/scaled/:name/:x", (req, res)=>{
  // console.log(req.params);
  var x = Math.floor(req.params.x - 0);
  var name = req.params.name;
  if(cache[name+x]){res.end(cache[name+x]); return;}

  fs.readFile("data/images/"+name, (err, data)=>{
    if(err){
      console.log(err)
      res.status(404).send(err);
    }
    sharp(data)
    .resize(x)
    .toBuffer()
    .then(data=>{
      cache[name+x] = data;
      res.end(data);
    })
  })
})


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


// app.post("/mapSubmission/tempImage", upload.single())
// app.post("/mapSubmission/tempImage", (req, res)=>{
//   let name = req.file.originalname.split(".");
//   let ext = name[1];
//   name = name[0];
//   let imageId = name + "_" + Date.now() + "." + ext;
//   req.send(imageId);
// })



app.post("/submitMap", upload.single("map"))
app.post("/submitMap", (req, res)=>{
  let name = req.file.originalname.split(".");
  let ext = name[1];
  name = name[0];
  // let now = (new Date).toISOString().splice(0, 16);
  let imageId = name + "_" + Date.now() + "." + ext;

  var i = req.body;
  if(isNaN(i.year_est) || isNaN(i.year_source)){
    res.status(404).send("Year must be a number");
    return;
  }
  i.type = "map"
  i["imageId"] = imageId;
  i["index"] = images.length;
  i.status = "pending";

  sharp(req.file.buffer).metadata().then(m=>{
    i.width = m.width;
    i.height = m.height;
    images.push(i);
    _data_changed = true;
  })
  
  fs.writeFile("data/images/" + imageId, req.file.buffer, {flag: "w+"}, (err)=>{
    if (err) {
      res.status(404).json(err);
      console.log(err);
      return;
    }
    res.status(200).send()
  });
})

app.listen(port, function () {
  console.log('App is running on:' + port);
});
