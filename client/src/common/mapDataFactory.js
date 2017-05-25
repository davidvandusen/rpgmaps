const {imageDataToAreaDescriptors} = require('./imageData');
const {outlineMask, smoothPolygon, containmentGraph} = require('./geometry');
const {intToCssHex, cssToRgba} = require('./color');
const AreaMask = require('./AreaMask');

function mapDataFactory(configTerrains) {
  const terrainsByColor = configTerrains.reduce((obj, terrain) => {
    obj[terrain.color] = terrain;
    return obj;
  }, {});

  const terrainsByClassName = configTerrains.reduce((obj, terrain) => {
    obj[terrain.className] = terrain;
    return obj;
  }, {});

  function getTerrainByColor(color) {
    return terrainsByColor[intToCssHex(color)];
  }

  function getTerrainByClassName(className) {
    return terrainsByClassName[className];
  }

  function fromImageData(imageData) {
    return imageDataToAreaDescriptors(imageData).then(areaDescriptors => {
      areaDescriptors.forEach(ad => ad.terrain = getTerrainByColor(ad.color));
      areaDescriptors = areaDescriptors.filter(ad => ad.terrain);
      areaDescriptors.sort((ad1, ad2) => ad1.terrain.layer - ad2.terrain.layer);
      const mapData = {
        height: imageData.height,
        width: imageData.width
      };
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

  function toImageData(mapData) {
    const length = mapData.width * mapData.height * 4;
    const data = new Uint8ClampedArray(length);
    mapData.areas.forEach(area => {
      const rgba = cssToRgba(getTerrainByClassName(area.ctor).color);
      area.mask.forEach((x, y, i) => {
        const offset = i * 4;
        data[offset] = rgba[0];
        data[offset + 1] = rgba[1];
        data[offset + 2] = rgba[2];
        data[offset + 3] = rgba[3];
      });
    });
    return new ImageData(data, mapData.width, mapData.height);
  }

  return {
    fromImageData,
    toImageData
  };
}

mapDataFactory.hydrateJSON = function (mapData) {
  mapData.areas.forEach(area => area.mask = AreaMask.fromJSON(area.mask));
  return mapData;
};

module.exports = mapDataFactory;
