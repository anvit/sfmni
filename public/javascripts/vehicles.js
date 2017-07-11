/**
 * Vehicles
 * @class
 */
var Vehicles = function () {
    var _vehiclesUrl = "http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni";
    var _vehicleLayer = null;
    var _mapService = null;

    /**
     * Intializes vehicle layer
     * @param mapService
     */
    this.initVehicles = function(mapService) {
        _mapService = mapService;
        _vehicleLayer = _mapService.getSvg().append("g").attr("class", "vehicles");
    }

    /**
     * Creates and updates SVG vehicles for the given route tag
     * @param routeTag
     */
    this.updateVehicles = function (routeTag) {
        var projection = _mapService.getProjection();

        var vehicleQuery = _vehiclesUrl + "&r=" + routeTag + "&t=0";
        d3.json(vehicleQuery, function(error, data) {
            if (error === null && typeof(data.vehicle) !== 'undefined' && typeof(routeTag) !== 'undefined') {
                var vehicles = _vehicleLayer.selectAll("text.R" + routeTag).data(data.vehicle);
                var t = d3.transition().duration(1000).ease(d3.easeSin);
                vehicles.exit().remove();

                vehicles.enter()
                    .append("text")
                    .on("mouseover", function(d) {
                        _mapService.getTooltip().transition()
                            .duration(200)
                            .style("opacity", 0.9);
                        _mapService.getTooltip().html("Route: " + d.routeTag)
                            .style("left", (d3.event.pageX + 20 ) + "px")
                            .style("top", (d3.event.pageY - 15) + "px");
                    }).on("mouseout", function(d) {
                        _mapService.getTooltip().transition()
                         .duration(500)
                         .style("opacity", 0);
                    })
                    .attr("class", "R" + routeTag + " vehicles")
                    .attr('font-family', 'FontAwesome')
                    .attr('font-size', '1em')
                    .text(function(d) {
                        return '\uf207';
                    }).attr("data-route-id", function (d) {
                        return d.id;
                    }).attr("x", function (d) {
                        return _mapService.getProjection()([d.lon,d.lat])[0];
                    }).attr("y", function(d){
                        return _mapService.getProjection()([d.lon,d.lat])[1];
                    }).merge(vehicles)
                    .transition(t)
                    .attr("x", function (d) {
                        return _mapService.getProjection()([d.lon,d.lat])[0];
                    }).attr("y", function(d){
                        return _mapService.getProjection()([d.lon,d.lat])[1];
                    });
            }
        });
    }

    /**
     * Hides SVG vehicles for the given route tag
     * @param routeTag
     */
    this.hideVehicles = function (routeTag) {
        d3.selectAll("text.R" + routeTag).data([]).exit().remove();
    }
}
