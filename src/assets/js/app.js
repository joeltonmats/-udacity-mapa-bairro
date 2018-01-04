(function () {


    // models

    /* Main view model */
    var ViewModel = function (locations) {

        this.canCloseSideBar = ko.observable(false);
        var myLocations = ko.observableArray(locations);

        this.showMarkers = function () {
            showListings();
        }.bind(this);

        this.hideMarkers = function () {
            hideListings();
        }.bind(this);

        this.toggleDrawing = function () {
            toggleDrawingFunction(drawingManagerGlobal);
        }.bind(this);

        this.toggleSideBar = function () {
            this.canCloseSideBar(!this.canCloseSideBar());
            setTimeout(function () {
                console.log('eeded', map.data.getMap());
                /* mapObj = Drupal.gmap.getMap('gmap-auto1map-gmap0'); */
                google.maps.event.trigger(map.data.getMap(), 'resize');
                var ob = 40.7413549;
                var pb = -73.9980244;
                latLongShit = new google.maps.LatLng(ob, pb);
                map.setCenter(latLongShit);
            }, 500);
        }.bind(this);
    }


    var viewModel = new ViewModel(locations);
    ko.applyBindings(viewModel);


}());