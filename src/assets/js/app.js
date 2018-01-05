$("#modal").iziModal();

$(document).on('click', '.trigger', function (event) {
    event.preventDefault();
    $('#modal').iziModal('open');
});

$(document).ready(function () {
    $('#nav-mobile span').addClass('animated flipInX');
});

(function () {

    $(".button-collapse").sideNav();

    // models

    /* Main view model */
    var ViewModel = function (locations) {

        this.showMarkers = function () {
            mapManipulationObject.showListings();
        }.bind(this);

        this.hideMarkers = function () {
            hideListings();
        }.bind(this);

        this.toggleDrawing = function () {
            toggleDrawingFunction(drawingManagerGlobal);
        }.bind(this);

        /*  this.toggleSideBar = function () {
             this.canCloseSideBar(!this.canCloseSideBar());
             setTimeout(function () {
                 google.maps.event.trigger(map.data.getMap(), 'resize');
                 map.setCenter(map.getCenter());
             }, 500);
         }.bind(this); */
    }


    var viewModel = new ViewModel(locations);
    ko.applyBindings(viewModel);


}());

