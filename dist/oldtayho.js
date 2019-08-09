$(document).ready(function() {
    "use strict";
    $(".map-tab").hide();
    $(".map-tab:first").show();
 
    $("ol.tabs li").click(function() {
    $("ol.tabs li").removeClass("map-active");
        $(this).addClass("map-active");
        $(".map-tab").hide();
        var activeTab = $(this).attr("rel");
        $("#"+activeTab).fadeIn();
    });
});

function navigateToMap(){
    var year = $(".map-active > a")[0].innerHTML;
    var url = window.location.origin;
    url += "/#en/"+year+"/14/21.0552263535956/105.82722187042236/all/";
    window.location.href = url;
}

function navigateToMapSection(){
    window.location.href = window.location.origin + "/test#map";
}

function navigateToImageContrib(){
    window.location.href = window.location.origin + "/imageCollector";
}