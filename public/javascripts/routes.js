/**
 * Routes
 * @class
 */
var Routes = function () {
    var _routesUrl = "http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=sf-muni";
    var _routeLayer = null;
    var _mapService = null;

    /**
     * Intializes route layer
     * @param mapService
     */
    this.initRoutes = function(mapService) {
        _mapService = mapService;
        _routeLayer = _mapService.getSvg().append("g").attr("class", "routes");
    }

    /**
     * Creates SVG routes for the given route tag
     * @param routeTag
     */
    this.createRoutes = function (routeTag) {
        var routesQuery = _routesUrl + "&r=" + routeTag ;
        d3.json(routesQuery, function(error, data) {
            if (error === null && typeof(data.route) !== 'undefined' && typeof(routeTag) !== 'undefined') {
                var stops = _routeLayer.selectAll(".ST" + routeTag).data(data.route.stop);
                stops.enter()
                    .append('circle')
                    .attr("class", "ST" + routeTag)
                    .attr("fill", '#' + data.route.color)
                    .attr("r", 5)
                    .attr("cx", function(d) {
                        return _mapService.getProjection()([d.lon,d.lat])[0];
                    })
                    .attr("cy", function(d) {
                        return _mapService.getProjection()([d.lon,d.lat])[1];
                    }).on("mouseover", function(d) {
                        _mapService.getTooltip().transition()
                            .duration(200)
                            .style("opacity", 0.9);
                        _mapService.getTooltip().html(d.title)
                            .style("left", (d3.event.pageX + 20 ) + "px")
                            .style("top", (d3.event.pageY - 15) + "px");
                    }).on("mouseout", function(d) {
                        _mapService.getTooltip().transition()
                         .duration(500)
                         .style("opacity", 0);
                    });
            } else {
                console.error("No routes");
            }
        });
    }

    /**
     * Hides SVG routes for the given route tag
     * @param routeTag
     */
    this.hideRoutes = function (routeTag) {
        d3.selectAll(".ST" + routeTag).data([]).exit().remove();
    }
}
