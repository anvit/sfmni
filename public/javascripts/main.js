/**
 * SfMuniApp
 * @class
 */
var SfMuniApp = function() {
    var _routesPrefs = null;
    var _map = null;
    var _vehicles = null;
    var _routes = null;
    var _mapService = null;

    /**
     * Start the app
     */
    this.startApp = function () {
        _mapService = new MapService();
        _map = new Map();
        _routes = new Routes();
        _vehicle = new Vehicles();

        _mapService.initMapService(window.innerWidth, window.innerHeight);

        // Load map data
        _map.initMap(_mapService);

        // Set up interface for selecting routes
        var routesUrl = "http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=sf-muni";
        var gui = new dat.GUI();
        var folder = gui.addFolder('Select routes');
        d3.json(routesUrl, function(error, data) {
            _routesPrefs = new RoutesList(data.route);
            for (var i = 0; i<data.route.length; ++i) {
                folder.add(_routesPrefs, data.route[i].tag).name(data.route[i].title).onChange(_routesChanged);
            }
        });
        folder.open();

        // Wait till map is loaded before creating vehicle and route layers
        _pollForMapLoaded().then(function() {
            d3.select(".loader").style("display", "none");
            d3.select(".svg-container").style("display", "inline-block");
            _routes.initRoutes(_mapService);
            _vehicle.initVehicles(_mapService);

            // Set up tooltip
            _mapService.initTooltip();

            // Refresh vehicle data every 15 sec
            setInterval(_refreshVehicles, 15000);
        }).catch(function() {
            console.error("Unable to load map data");
        });
    }

    var _filterEnabledRoutes = function () {
        var keys = Object.keys(_routesPrefs);
        return keys.filter(function(key) {
            return _routesPrefs[key];
        });
    }

    var _refreshVehicles = function () {
        var enabledRoutes = _filterEnabledRoutes();
        for (var i = 0; i < enabledRoutes.length; i++) {
            _vehicle.updateVehicles(enabledRoutes[i]);
        }
    }

    var _pollForMapLoaded = function() {
        var endTime = Number(new Date()) + 60000;
        var interval = 30;
        var checkCondition = function(resolve, reject) {
            var result = _map.getMapLoaded() === true;
            if (result) {
                resolve(result);
            } else if (Number(new Date()) < endTime) {
                setTimeout(checkCondition, 30, resolve, reject);
            } else {
                reject(new Error('Timed out waiting on loading maps'));
            }
        };
        return new Promise(checkCondition);
    }

    var _routesChanged = function(value) {
        if (value === true) {
            _routes.createRoutes(this.property);
            _vehicle.updateVehicles(this.property);
        } else {
            _routes.hideRoutes(this.property);
            _vehicle.hideVehicles(this.property);
        }
    }
}

/**
 * List of routes. Used by Dat.GUI for the interface
 * @class
 */
var RoutesList = function(data) {
    for (var i = 0; i<data.length; ++i) {
        this[data[i].tag] = false;
    }
}

// Start the app
var app = new SfMuniApp();
app.startApp();
