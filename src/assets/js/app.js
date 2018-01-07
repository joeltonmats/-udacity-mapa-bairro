/*Jquery'S Plugins Initializing */
function initializeJqueryPlugins() {
    /*start modal configuration*/
    $("#modal").iziModal();

    /*Side Nav Fixed for large devices*/
    $(".button-collapse").sideNav();

    /*start tabs configuration*/
    $('ul.tabs').tabs();

    /*Animating Title*/
    $('#nav-mobile #main-title').addClass('animated flipInX');
};


//------- Knockout.js Architecture ---------

/*MODELS*/
var Location = function (data) {
    this.title = data.title;
    this.location = data.location;
};

/* MAIN VIEW MODEL */
var ViewModel = function () {

    var self = this;
    this.locationsMapList = ko.observableArray([]);
    this.placePhotosList = ko.observableArray([]);
    this.tracksList = ko.observableArray([]);
    this.filterPlace = ko.observable();
    this.themesList = ko.observableArray(themes);
    this.currentTheme = ko.observable(this.themesList()[1]);


    /*initialize locationsMapList with pre-defined locations*/
    locations.forEach(function (location) {
        self.locationsMapList.push(new Location(location));
    });

    /*create the markers*/
    mapModule.createMarkers(self.locationsMapList());

    /*This is the main list showed in the locations sideNav.
    * It is filter by the search input field.
    */
    this.filteredLocation = ko.computed(
        function () {
            if (!self.filterPlace()) {
                var bounds = new google.maps.LatLngBounds();
                self.locationsMapList().forEach(function (location) {
                    location.marker.setMap(map);
                    bounds.extend(location.marker.position);
                });

                map.fitBounds(bounds);

                return self.locationsMapList();
            } else {
                return ko.utils.arrayFilter(self.locationsMapList(),
                    function (loc) {
                        if (loc.title.toLowerCase().indexOf(
                            self.filterPlace().toLowerCase()) !== -1) {
                            loc.marker.setMap(map);
                        } else {
                            loc.marker.setMap(null);
                        }
                        return loc.title.toLowerCase()
                            .indexOf(self.filterPlace().toLowerCase()) !== -1;
                    });
            }
        }
    );

    this.currentLocation = ko.observable(this.locationsMapList()[0]);

    /*Load Photos from places*/
    this.loadPlacePhoto = function () {
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId: 'ChIJW7w1-SGuEmsRkMwyFmh9AQU'
        }, function (place, status) {
            if (status == 'OK') {
                var count = 0;
                /* FIX 1 - How initialize property a array ?  
                * each request the array is increase. I tried
                self.placePhotosList.removeAll(),
                self.placePhotosList([]). Both doesnt work
                */
                place.photos.forEach(function (photo) {
                    photo.id = count;
                    self.placePhotosList.push(photo);
                    count++;
                });

                $('.carousel').carousel({ fullWidth: true });
            }
        });
    };

    /*Load Official Playlist from Barber*/
    this.loadPlaylistOfficial = function () {
        console.log('entrou');
        $.ajax({
            url: 'https://api.deezer.com/playlist/908622995/?output=jsonp',
            dataType: 'jsonp'
        }).done(function (response) {
            self.tracksList(response.tracks.data);
        });
    };

    this.changeTheme = function (themeSelected) {
        $('#nav-mobile').removeClass(self.currentTheme().colorClass).addClass(themeSelected.colorClass);

        var styledMapType = new google.maps.StyledMapType(themeSelected.mapStyle);
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

        self.currentTheme(themeSelected);
    }


    /*Bounce when location is clicked*/
    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            for (var i = 0; i < self.locationsMapList().length; i++) {
                var mark = self.locationsMapList()[i].marker;
                if (mark.getAnimation() !== null)
                    mark.setAnimation(null);
            }
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    /* It calls when a location is clicked on sideNav list.*/
    this.defineLocationOnMap = function (locationClicked) {
        $('ul.tabs').tabs('select_tab', 'panorama-view');
        toggleBounce(locationClicked.marker);

        /*With timeout the user will see the bounce*/
        setTimeout(function () {
            populateInfoModal(locationClicked.marker);
            self.currentLocation(locationClicked);
        }, 500);
    }.bind(this);


    /*When modal instance is closed, the bounce effect finish*/
    $(document).on('closing', '#modal', function (e) {
        self.currentLocation().marker.setAnimation(null);
    });

}


/*Initialize the Map*/
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), mapConfiguration);

    ko.applyBindings(new ViewModel());

    google.maps.event.addDomListener(
        window, 'resize',
        function () {
            mapModule.showListings();
        });
};

//error handling function that gets called when google maps api does not return successfully
function mapAPIErrorHandler() {
    $('#map').html('<h2>Failed to retrieve some maps resources, Please, try again later.</h2>');
}


/*Stop all audio playing*/
$('div').click(function () {
    var sounds = document.getElementsByTagName('audio');
    for (i = 0; i < sounds.length; i++) sounds[i].pause();
});


initializeJqueryPlugins();
