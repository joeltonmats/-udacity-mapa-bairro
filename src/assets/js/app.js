function initializeJqueryPlugins() {
    $("#modal").iziModal();
    $(".button-collapse").sideNav();
    $('ul.tabs').tabs();
};


$(document).ready(function () {
    $('#nav-mobile span').addClass('animated flipInX');
});


$('div').click(function () {
    console.log('entrou');
    var sounds = document.getElementsByTagName('audio');
    for (i = 0; i < sounds.length; i++) sounds[i].pause();
})



//------- Knockout.js Architecture ---------

// models
var Location = function (data) {
    this.title = data.title;
    this.location = data.location;
};

/* Main view model */
var ViewModel = function () {

    var self = this;
    this.locationsMapList = ko.observableArray([]);
    this.placePhotosList = ko.observableArray([]);
    this.tracksList = ko.observableArray([]);


    //initialize locationsMapList with pre-defined locations
    locations.forEach(function (location) {
        self.locationsMapList.push(new Location(location));
    });

    mapModule.createMarkers(self.locationsMapList());

    this.currentLocation = ko.observable(
        this.locationsMapList()[0]);


    this.showMarkers = function () {
        mapModule.showListings();
    }.bind(this);

    this.hideMarkers = function () {
        hideListings();
    }.bind(this);

    this.toggleDrawing = function () {
        toggleDrawingFunction(drawingManagerGlobal);
    }.bind(this);

    this.loadPlacePhoto = function () {
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId: 'ChIJW7w1-SGuEmsRkMwyFmh9AQU'
        }, function (place, status) {
            if (status == 'OK') {
                var count = 0;
                place.photos.forEach(function (photo) {
                    photo.id = count;
                    self.placePhotosList.push(photo);
                    count++;
                });
                /*self.placePhotosList(place.photos);*/
                $('.carousel').carousel({ fullWidth: true });
            }
            console.log('place', place);
            console.log('status', self.placePhotosList());
        });
    }

    this.loadPlaylistOfficial = function () {
        $.ajax({
            url: 'https://api.deezer.com/playlist/908622995/?output=jsonp',
            dataType: 'jsonp'
        }).done(function (response) {
            self.tracksList(response.tracks.data);
        });
    }


    //bounce when location is clicked
    function toggleBounce(marker) {

        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            for (var i = 0; i < self.locationsMapList()
                .length; i++) {
                var mark = self.locationsMapList()[i].marker;
                if (mark.getAnimation() !== null) {
                    mark.setAnimation(null);
                }
            }
            marker.setAnimation(google.maps.Animation
                .BOUNCE);
        }
    }



    /*
        It calls when a location is clicked on sideNav list.
    */
    this.defineLocationOnMap = function (locationClicked) {
        console.log(locationClicked);
        $('ul.tabs').tabs('select_tab', 'test1');
        toggleBounce(locationClicked.marker);
        setTimeout(function () {
            populateInfoModal(locationClicked.marker);
            self.currentLocation(locationClicked);
        }, 500);
    }.bind(this);


    $(document).on('closing', '#modal', function (e) {
        self.currentLocation().marker.setAnimation(null);
    });

    /*  this.toggleSideBar = function () {
         this.canCloseSideBar(!this.canCloseSideBar());
         setTimeout(function () {
             google.maps.event.trigger(map.data.getMap(), 'resize');
             map.setCenter(map.getCenter());
         }, 500);
     }.bind(this); */

    this.showMarkers();
}



initializeJqueryPlugins();


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), mapConfiguration);
    ko.applyBindings(new ViewModel());

    google.maps.event.addDomListener(
        window, 'resize',
        function () {
            mapModule.showListings();
        });
};


