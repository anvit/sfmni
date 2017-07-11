/**
 * Map service to set up the page, and initialize map variables
 * @class
 */
var MapService = function () {
    var _projection = null;
    var _geoPath = null;
    var _svg = null;
    var _tooltip = null;

    /**
     * Create SVG for the page and initialize the map
     * @param width
     * @param height
     */
    this.initMapService = function (width, height) {
        var zoom = d3.zoom().scaleExtent([0.25, 3]).on("zoom", _zoomed);

        var container = d3.select("body").append("div").classed("svg-container", true)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 "+ width +" "+ height)
            .classed("svg-content-responsive", true).call(zoom);

        _svg = d3.select("svg").append("g").attr("class", "container");

        _projection = d3.geoMercator()
            .center([-122.43, 37.77])
            .scale(450000)
            .translate([width / 2, height / 2]);
        _geoPath = d3.geoPath().projection(_projection);
    }

    var _zoomed = function () {
        _svg.attr("transform", d3.event.transform);
    }

    /**
     * Add tooltip element to the body
     */
    this.initTooltip = function () {
        _tooltip = d3.select("body").append("div").attr("class", "tooltip");
    }

    /**
     * @returns {Object} Geo Path
     */
    this.getGeoPath = function () {
        return _geoPath;
    }

    /**
     * @returns {Object} Map Projection
     */
    this.getProjection = function () {
        return _projection;
    }

    /**
     * @returns {Object} SVG
     */
    this.getSvg = function () {
        return _svg;
    }

    /**
     * @returns {Object} Tooltip div
     */
    this.getTooltip = function () {
        return _tooltip;
    }
}
