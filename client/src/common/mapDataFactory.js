const {imageDataToAreaDescriptors} = require('../common/imageData');
const {outlineMask, smoothPolygon, containmentGraph} = require('../common/geometry');
const {intToCssHex} = require('../common/color');

function mapDataFactory(configTerrains) {
  const terrainsIndex = configTerrains.reduce((obj, terrain) => {
    obj[terrain.color] = terrain;
    return obj;
  }, {});

  function getTerrain(color) {
    return terrainsIndex[intToCssHex(color)];
  }

  function fromImageData(imageData) {
    return imageDataToAreaDescriptors(imageData).then(areaDescriptors => {
      areaDescriptors.forEach(ad => ad.terrain = getTerrain(ad.color));
      areaDescriptors = areaDescriptors.filter(ad => ad.terrain);
      areaDescriptors.sort((ad1, ad2) => ad1.terrain.layer - ad2.terrain.layer);
      const mapData = {};
      mapData.outlines = new Array(areaDescriptors.length);
      mapData.smoothOutlines = new Array(areaDescriptors.length);
      mapData.areas = new Array(areaDescriptors.length);
      for (let areaIndex = 0; areaIndex < areaDescriptors.length; areaIndex++) {
        const areaDescriptor = areaDescriptors[areaIndex];
        const area = {};
        area.ctor = areaDescriptor.terrain.className;
        area.mask = areaDescriptor.mask;
        mapData.outlines[areaIndex] = outlineMask(area.mask);
        mapData.smoothOutlines[areaIndex] = smoothPolygon(mapData.outlines[areaIndex], 2);
        mapData.areas[areaIndex] = area;
      }
      const graph = containmentGraph(mapData.outlines);
      for (let index = 0; index < graph.length; index++) {
        mapData.areas[index].contains = graph[index];
      }
      return mapData;
    });
  }

  return {
    fromImageData
  };
}

module.exports = mapDataFactory;
