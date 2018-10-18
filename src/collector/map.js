
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    $("#myModal").style.display = "none";
}

// When the user clicks anywhere outside of the $("#myModal"), close it
window.onclick = function(event) {
    if (event.target == $("#myModal")) {
        $("#myModal").style.display = "none";
    }
}

var $ = function (thing){
    return document.querySelector(thing);
} 

$("#uploadMap").onclick = (e)=>{
    e.preventDefault();
    $("#mapImage").click();
}

var panzoomCtrl;
$("#mapImage").onchange = (e)=>{
    $("#myModal").style.display = "block";

    var files = e.srcElement.files;
    var reader = new FileReader();
    reader.onload = (f)=>{
        $("#mapImg").src = f.target.result;
        // m.attach({
        //     thumb: "#mapSelectFeatureThumb",
        //     large: f.target.result,
        //     largeWrapper: "mapSelectFeatureZoom"
        // })
        if(panzoomCtrl){
            panzoomCtrl.dispose();
            $("#mapImg").style.transform = ""
        }
        panzoomCtrl = panzoom($("#mapImg"), {
            smoothScroll: false
        })
        panzoomCtrl.pause();
        selectFeaturePoint.start();
    }
    reader.readAsDataURL(files[0]);

    document.querySelector("#uploadImageName").innerHTML =
    files[0].name;
}


$("#panzoomSelectPointToggle").onclick = (e)=>{
    toggleZoomSelect("click")
}

document.onkeydown = (e)=>{
    e.stopPropagation();
    e.preventDefault();
    if (e.code == "Space") toggleZoomSelect("keyPress")
    if (e.code == "Escape") selectFeaturePoint.start();
}

function toggleZoomSelect(source){
    // console.log("toggle from", source);
    var button = $("#panzoomSelectPointToggle");
    if(button.innerHTML == "CLICK TO SELECT FEATURE POINT (SPACEBAR)"){
        $("#mapSelectFeatureWrapper").style.cursor = "crosshair";
        panzoomCtrl.pause();
        selectFeaturePoint.resume();
        button.innerHTML = "CLICK TO PAN AND ZOOM (SPACEBAR)";
    }
    else{
        $("#mapSelectFeatureWrapper").style.cursor = "move";
        panzoomCtrl.resume();
        selectFeaturePoint.pause();
        button.innerHTML = "CLICK TO SELECT FEATURE POINT (SPACEBAR)";
    }
} 

var selectFeaturePoint = {
    secondPoint : null,
    firstPoint : null,
    start: function(){
        // console.log(this)
        selectFeaturePoint.firstPoint = null;
        selectFeaturePoint.secondPoint = null;
        selectFeaturePoint.setClickEvent();
    },
    pause: function(){
        $("#mapImg").onclick = null;
    },
    resume: function(){
        selectFeaturePoint.setClickEvent();
    },
    setClickEvent: function(){
        $("#mapImg").onclick = (e)=>{
            if(selectFeaturePoint.firstPoint){
                selectFeaturePoint.secondPoint = [e.offsetX, e.offsetY]; 
            }
            else if(selectFeaturePoint.secondPoint){
                selectFeaturePoint.firstPoint = [e.offsetX, e.offsetY];
            }
            else{
                // var temp = selectFeaturePoint.firstPoint;
                // selectFeaturePoint.firstPoint = selectFeaturePoint.secondPoint;
                // selectFeaturePoint.secondPoint = temp;
                selectFeaturePoint.onFinish([selectFeaturePoint.firstPoint, selectFeaturePoint.secondPoint])
            }
        }
    },
    onFinish : function (){}
}

$("#cancelSelectPoint").onclick = selectFeaturePoint.start;