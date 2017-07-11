/**
 * Map
 * @class
 */
var Map = function () {
    var _mapLoaded = false;
    var _svg = null;
    var _geoPath = null;

    /**
     * Returns true if the map is loaded, false otherwise
     * @returns {Boolean}
     */
    this.getMapLoaded = function () {
        return _mapLoaded;
    }

    /**
     * Creates svg map layers from GeoJSON data
     * @param mapService
     */
    this.initMap = function (mapService) {
        _mapService = mapService;

        d3.json("/javascripts/maps/arteries.json", function(error, topo) {
            _drawMapLayer("arteries", topo.features);
            d3.json("/javascripts/maps/streets.json", function(error, topo) {
                _drawMapLayer("streets", topo.features);
                d3.json("/javascripts/maps/neighborhoods.json", function(error, topo) {
                    _drawMapLayer("neighborhoods", topo.features);
                    d3.json("/javascripts/maps/freeways.json", function(error, topo) {
                        _drawMapLayer("freeways", topo.features);
                        _mapLoaded = true;
                    });
                });
            });
        });

    }

    var _drawMapLayer = function (layerStyle, data) {
        _mapService.getSvg().append("g")
            .attr("class", layerStyle)
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("fill", "none")
            .attr("d", _mapService.getGeoPath());
    }
}
