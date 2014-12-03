"use strict";
var _ = require('underscore');
var WKT = require('wellknown/wellknown.js');
var proj4 = require('proj4');
var nysp = "+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs";
var webMerc = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs";
//var $ = require('jquery');



var convertNYSP2WebMerc = function (geojson) {
    geojson = geojson.geometry || geojson;
    var newGeoJson = _.omit(geojson, 'coordinates');
    newGeoJson.coordinates = [];
    switch (geojson.type.toLowerCase()) {
        case "polygon":
            _.each(geojson.coordinates, function (ring) {
                var newRing = [];
                _.each(ring, function (coord) {
                    var newPt = proj4(nysp).inverse([coord[0], coord[1]]);
                    newRing.push(newPt);
                });
                newGeoJson.coordinates.push(newRing);
            });
            break;
        case "polyline":
        case "linestring":
            _.each(geojson.coordinates, function (coord) {
                var newPt = proj4(nysp).inverse([coord[0], coord[1]]);
                newGeoJson.coordinates.push(newPt);
            });
            break;
    }
    return newGeoJson;
}

var convertWebMerc2NYSP = function (geojson) {
    geojson = geojson.geometry || geojson;
    var newGeoJson = _.omit(geojson, 'coordinates');
    newGeoJson.coordinates = [];
    switch (geojson.type.toLowerCase()) {
        case "polygon":
            _.each(geojson.coordinates, function (ring) {
                var newRing = [];
                _.each(ring, function (coord) {
                    var newPt = proj4(nysp, [coord[0], coord[1]]);
                    newRing.push(newPt);
                });
                newGeoJson.coordinates.push(newRing);
            });
            break;
        case "polyline":
        case "linestring":
            _.each(geojson.coordinates, function (coord) {
                var newPt = proj4(nysp, [coord[0], coord[1]]);
                newGeoJson.coordinates.push(newPt);
            });
            break;
    }
    return newGeoJson;
}

var wkt2GeoJson = function (wkt) {
    return WKT.parse(wkt);
}

var geoJson2Wkt = function (geojson) {
    return WKT.stringify(geojson);
}

/*var wkt2WebMerc = function (wkt) {
    return convertNYSP2WebMerc(wkt2GeoJson(wkt));
}

var geoJson2NYSP = function (geojson) {
    return geoJson2Wkt(convertWebMerc2NYSP(geojson));
}*/

exports.convertNYSP2WebMerc = convertNYSP2WebMerc;
exports.convertWebMerc2NYSP = convertWebMerc2NYSP;
exports.wkt2GeoJson = wkt2GeoJson;
exports.geoJson2Wkt = geoJson2Wkt;
/*exports.wkt2WebMerc = wkt2WebMerc;
exports.geoJson2NYSP = geoJson2NYSP;*/