function linearTransform(featurePoints, matchPoints){
    featurePoints = featurePoints.map(p=>[p[1],p[0]]);
    // console.log()
    // var offset = [
    //     matchPoints[0][0] - featurePoints[0][0],
    //     matchPoints[0][1] - featurePoints[0][1]
    // ];
    // var o = function (arr){  
    //     return [arr[0]+offset[0], arr[1]+offset[1]];
    // };

    var a1 = featurePoints[0];
    var b1 = featurePoints[1];
    var a2 = matchPoints[0];
    var b2 = matchPoints[1];
    var scale = [
        (a2[0] - b2[0])/ (a1[0] - b1[0]),
        (a2[1] - b2[1])/ (a1[1] - b1[1]) 
    ];
    console.log("scale: ", scale);
    var s = function (arr){
        return [
            a2[0] + (arr[0] - a1[0]) * scale[0],
            a2[1] + (arr[1] - a1[1]) * scale[1]
        ];
    }

    return function(point){
        return s(point);
    };
}