let metaserver = window.location.origin;
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    $("#myModal").style.display = "none";
}

// When the user clicks anywhere outside of the $("#myModal"), close it
window.onclick = function(event) {
    console.log("Windows: ", event)
    if (event.target == $("#myModal")) {
        // $("#myModal").style.display = "none";
    }
}

var $ = function (thing){
    return document.querySelector(thing);
} 

$("#uploadMap").onclick = (e)=>{
    e.preventDefault();
    $("#mapImage").click();
}

var tempImageId;
var mapImg = $("#mapImg").getContext("2d");
$("#mapImage").onchange = (e)=>{
    $("#myModal").style.display = "block";

    var files = e.srcElement.files;
    var fd = new FormData();
    fd.append("image", files[0]);
    send("POST", metaserver+"/mapSubmission/tempImage", fd, (req)=>{
        console.log(req)
    })

    var featurePoints, matchPoints;

    matchFeaturePoint.onFinish = (points)=>{
        matchPoints = points;
        $("#form-matchPoints").value = JSON.stringify(matchPoints);

        var t = linearTransform(featurePoints, matchPoints);
        var r = (new FileReader())
        r.onload = ()=>{
            // L.imageOverlay(
            //     r.result,
            //     [ t([0,0]), t([$("#mapImg").width, $("#mapImg").height])]
            // ).addTo(leafletMap);

            // L.imageOverlay(
            //     r.result,
            //     [[21.042209, 105.841998],
            // [21.073249, 105.811477]]
            // ).addTo(leafletMap);
    
        }
        r.readAsDataURL(files[0]);
    }

    selectFeaturePoint.onFinish = (points)=>{
        $("#myModal").style.display = "none";
        featurePoints = points;
        $("#form-featurePoints").value = JSON.stringify(featurePoints);
        
        matchFeaturePoint.start();
    }
    selectFeaturePoint.start(files[0]);
    $("#uploadImageName").innerHTML =
    files[0].name;
}

function linearTransform(featurePoints, matchPoints){
    var offset = [
        matchPoints[0][0] - featurePoints[0][0],
        matchPoints[0][1] - featurePoints[0][1]
    ];
    var o = function (arr){  
        return [arr[0]+offset[0], arr[1]+offset[1]];
    };

    var a1 = o(featurePoints[0]);
    var b1 = o(featurePoints[1]);
    var a2 = matchPoints[0];
    var b2 = matchPoints[1];
    var scale = [
        (a1[0] - b1[0]) / (a2[0] - b2[0])
    ]
    var scale = function (arr){
        
    }

    return function(point){
    };
}

$("#panzoomSelectPointToggle").onclick = (e)=>{
    selectFeaturePoint.toggleZoomSelect("click")
}

document.onkeydown = (e)=>{
    if (e.code == "Space"){
        e.stopPropagation();
        e.preventDefault();
        selectFeaturePoint.toggleZoomSelect("keyPress")   
    }
    if (e.code == "Escape"){
        e.stopPropagation();
        e.preventDefault();
        selectFeaturePoint.cancelSelectPoint();
    }
}

var selectFeaturePoint = {
    featurePoints : [],
    panzoomCtrl : null,
    mapFile : null,
    bitmapFile : null, 
    start: function(mapFile){
        var t = selectFeaturePoint;
        t.mapFile = mapFile;

        createImageBitmap(mapFile).then(
            bm => {
                t.bitmapFile = bm;
                // $("#mapImg").style.width = bm.width+"px";
                // $("#mapImg").style.height = bm.height+"px";
                $("#mapImg").width = bm.width
                $("#mapImg").height = bm.height
                mapImg.drawImage(bm, 0, 0, bm.width, bm.height, 0, 0, bm.width, bm.height);
            },
            (err)=>{console.log(err)}
        );
        // console.log(this)
        if(t.panzoomCtrl){
            t.panzoomCtrl.dispose();
            $("#mapImg").style.transform = ""
        }
        t.panzoomCtrl = panzoom($("#mapImg"), {
            smoothScroll: false
        })
        t.panzoomCtrl.pause();
        t.featurePoints = [];
        t.setClickEvent();
    },
    pause: function(){
        $("#mapImg").onclick = null;
    },
    resume: function(){
        var t = selectFeaturePoint;
        t.setClickEvent();
    },
    setClickEvent: function(){
        var t = selectFeaturePoint;
        $("#mapImg").onclick = function(e){
            
            var x = e.offsetX, y = e.offsetY;
            switch(t.featurePoints.length){
                case 0:
                t.featurePoints[0] = [x, y];
                mapImg.markPoint(x, y, $("#mapImg").width*0.005)
                break;

                case 1:
                t.featurePoints[1] = [x, y];
                mapImg.markPoint(x, y, $("#mapImg").width*0.005)
                break;

                case 2:
                t.featurePoints[2] = [x, y];
                mapImg.markPoint(x, y, $("#mapImg").width*0.005)
                t.onFinish(t.featurePoints)
            }
        }
    },
    toggleZoomSelect: function(source){
        var t = selectFeaturePoint;
        // console.log("toggle from", source);
        var button = $("#panzoomSelectPointToggle");
        if(button.innerHTML == "CLICK TO SELECT FEATURE POINT (SPACEBAR)"){
            $("#mapSelectFeatureWrapper").style.cursor = "crosshair";
            t.panzoomCtrl.pause();
            t.resume();
            button.innerHTML = "CLICK TO PAN AND ZOOM (SPACEBAR)";
        }
        else{
            $("#mapSelectFeatureWrapper").style.cursor = "move";
            t.panzoomCtrl.resume();
            t.pause();
            button.innerHTML = "CLICK TO SELECT FEATURE POINT (SPACEBAR)";
        }
    },
    cancelSelectPoint: function(){
        var t = selectFeaturePoint;
        t.featurePoints = [];
        var button = $("#panzoomSelectPointToggle");
        $("#mapSelectFeatureWrapper").style.cursor = "crosshair";
        t.panzoomCtrl.pause();
        t.resume();
        button.innerHTML = "CLICK TO PAN AND ZOOM (SPACEBAR)";
        mapImg.drawImage(t.bitmapFile, 0, 0);
        // $("#mapImg").style.transform = "";
    },
    onFinish : function (){}
}

$("#cancelSelectPoint").onclick = selectFeaturePoint.cancelSelectPoint;
// 
// canvasContext.arc(x,y, radius, startAndle, endAngle);
mapImg.markPoint = function(x,y, width){
    mapImg.fillStyle = 'rgb(158, 255, 66)';

    mapImg.fillRect(x-3*width, y-width/2, 2*width, width)
    mapImg.fillRect(x+width, y-width/2, 2*width, width)
    mapImg.fillRect(x-width/2, y-3*width, width, 2*width)
    mapImg.fillRect(x-width/2, y+width, width, 2*width)
    mapImg.beginPath()
    mapImg.arc(x, y, width/4, 0, 2*Math.PI)
    mapImg.stroke();
    mapImg.closePath();
    mapImg.beginPath()
    mapImg.arc(x, y, width, 0, Math.PI*2)
    mapImg.stroke();
    mapImg.closePath();
}



var leafletMap = L.map("map", {
    center: [21.055160, 105.827277],
    maxBounds: [[21.092327, 105.772103], [21.016277, 105.888311]],
    zoom: 15,
    minZoom: 14,
    maxZoom: 18,
    doubleClickZoom: false
})


let base = L.tileLayer(
    'http://images.vietbando.com/ImageLoader/GetImage.ashx?LayerIds=VBD&Level={z}&X={x}&Y={y}'
).addTo(leafletMap);

let editableLayer = new L.FeatureGroup();
leafletMap.addLayer(editableLayer);

var matchFeaturePoint = {
    matchPoints : [],
    icon : L.icon({ 
        // className: 'cone-guidepoint-big',
        // shadownUrl: 'sniper.png',
        iconUrl: 'img/sniper.png',
        iconSize: [40, 40] 
    }),
    start : function(){
        var t = matchFeaturePoint;
        t.matchPoints = []
        t.setMapEvent()
    },
    setMapEvent: function(){
        var t = matchFeaturePoint;

        t.getPoint(()=>{
            console.log("Done 1st ")
            t.getPoint(()=>{
                console.log("Done 2nd")
                t.getPoint();
            })
        });
    },
    getPoint: function(callback){
        var t = matchFeaturePoint;
        var n = t.matchPoints.length;

        var name = ['1st', '2nd', '3rd'];
        L.drawLocal.draw.handlers.marker.tooltip.start = 
        'Click to match the ' + name[n] + ' feature point';
        
        var tooling = new L.Draw.Marker(leafletMap, { icon: t.icon });
        tooling.enable();
        leafletMap.on('draw:created', (e)=>{
            leafletMap.off('draw:created');
            tooling.disable();
            editableLayer.addLayer(e.layer);
            coords = e.layer.getLatLng();
            coords = [coords.lat, coords.lng];

            t.matchPoints.push(coords);
            if(t.matchPoints.length == 3){
                t.onFinish(t.matchPoints)
                return;
            }
            callback()
        });
    },
    onFinish: function(){}
}

function send(method, server, thing, onload, onerror){
    var xhr = new XMLHttpRequest();
    xhr.open(method, server, true);
    xhr.onload = onload;
    xhr.onerror = onerror;
    xhr.send(thing);
}

var rqip = document.querySelectorAll("input.required")
rqip.forEach((i, index, arr)=>{
    i.addEventListener("change", ()=>{
        var count = 0;
        rqip.forEach((i)=>{
            if(i.value) count++;
        })
        if(count == 6){
            $('.sidebar--submit').classList.remove('disabled');
        }
    })
}) 

$('.sidebar--submit').onclick = (e)=>{
    e.preventDefault();

    send("POST", metaserver + "/submitMap/", 
    new FormData($(".sidebar--form")), ()=>{
        $('.success-message').classList.add('show');

        setTimeout(function () {
          $('.success-message').classList.remove('show');
        }, 3000);
    
        editableLayer.clearLayers();
    
        // Clear form
        document.querySelectorAll('.sidebar--input, .sidebar--textarea').forEach(function (input) {
          input.value = '';
        });
    
        // Return submit button back to disabled state
        $('.sidebar--submit').classList.add('disabled');
    },
    ()=>{
        $('.error-message > .message-response').textContent = e.responseText || 'There was an error submitting the map to the server.';
        $('.error-message').classList.add('show');

        setTimeout(function () {
        $('.error-message').classList.remove('show');
        }, 3000);
    })
}
