// map overlay
// photo
const getOverlay = (components) => {
  const Overlay = (image) => {
    const {imageMeta, server } = components.init;
    const O = {};
  
    O.image = image;

    // if (Object.prototype.hasOwnProperty.call(data, 'bbox')) {
    //   const coordString = data.bbox.match(/\(\((.+)\)\)/);
    //   if (coordString && coordString[1]) {
    //     const coords = _.map(coordString[1].split(','), (pair) => {
    //       return _.map(pair.split(' '), (d) => {
    //         return +d;
    //       });
    //     });
    //     const f = {
    //       type: 'Feature',
    //       geometry: {
    //         type: 'Polygon',
    //         coordinates: [coords],
    //       },
    //     };
    //     O.bbox = L.geoJson(f).getBounds();
    //   }
    // }

    var t = linearTransform(image.featurePoints, image.matchPoints);
    const _layer = L.imageOverlay(
      server + "getImage/" + image.imageId,
      [t([0,0]), t([image.height, image.width])],
      {opacity: 0.7}
    );
    O.layer = () => _layer;
    O.opacity = () => _layer.options.opacity;

    return O;
  };
  return Overlay;
};
export default getOverlay;

