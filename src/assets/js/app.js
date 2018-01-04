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
                google.maps.event.trigger(map.data.getMap(), 'resize');
                map.setCenter(map.getCenter());
            }, 500);
        }.bind(this);
    }


    var viewModel = new ViewModel(locations);
    ko.applyBindings(viewModel);


}());