---
---
var toggleFullScreen = function toggleFullScreen() {
    var isFs = document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen;
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard method
        (!document.mozFullScreenElement && !document.webkitFullScreenElement)) {  // current working methods
        if(!isFs){
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }
}

$(function () {
    if ($('#map').length > 0) {
        // map
        var firstLoad = true;
        var tileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            id: 'baztoune/ckp1ia04k2yky18rw1ml5hw7c',
            accessToken: 'pk.eyJ1IjoiYmF6dG91bmUiLCJhIjoib0Q0LWtMQSJ9.yK53blLhQb69aKjqo2CAZQ',
            attribution:'<a href="http://mapbox.com/about/maps">Mapbox Terms</a>',
            maxZoom:10,
            minZoom:2
        });

        var map = L.map('map',{
            center: L.latLng(46.369674, 2.581787),
            zoom: 2,
            layers : [tileLayer]
        });

        var customIcon = new L.Icon({
            iconUrl: "{{ '/assets/images/point-13px.png' | relative_url }}",
            iconSize: [13, 13],
            popupAnchor: [0, -13]
        });
        var markerLayer = L.featureGroup();
        map.addLayer(markerLayer);

        // load markers
        $.getJSON('/locations.json', function (data) {
            for (var i = 0; i < data.length; i++) {
                var location = new L.LatLng(data[i].latitude, data[i].longitude);
                var titre = data[i].titre;
                var marker = new L.Marker(location, {
                    icon: customIcon,
                    riseOnHover: true
                });
                marker.bindPopup(
                      "<div class=\"textCenter\">"
                    + "<a href=\"" + data[i].friendlyUrlName + "\">"
                    + titre
                    + "</a>"
                    + "</div>", {
                        maxWidth: '400',
                        closeButton: false,
                        offset: new L.Point(0, 6)
                    }
                );
                markerLayer.addLayer(marker);
            }
            if (firstLoad == true) {
                window.setTimeout(function(){
                    map.fitBounds(markerLayer.getBounds());
                    firstLoad = false;
                }, 900);
            };
        });

        // events
        map.on('zoomend', function(e) {
            var zoom = parseInt(map.getZoom(),10);
            var $markerContainer =$('.leaflet-marker-pane').first();
            $markerContainer.removeClass('zoom-max zoom-medium-plus zoom-medium'); // default : min
            if(zoom >= 10){
                $markerContainer.addClass('zoom-max');
            } else if(zoom >= 9){
                $markerContainer.addClass('zoom-medium-plus');
            } else if(zoom >= 8){
                $markerContainer.addClass('zoom-medium');
            }
        });
    }

    if ($('#player-wrapper').length > 0) {
        // load player
        var my_jPlayer = $("#player-wrapper");
        my_jPlayer.jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: './'+my_jPlayer.attr('data-mp3'),
                    oga: './'+my_jPlayer.attr('data-oga'),
                    volume:0
                });
                if($.jPlayer.platform.mobile || $.jPlayer.platform.tablet) {
                    // needed on mobile devices
                    $('#image-wrapper').append(
                        '<div class="absolute-center transition-500" id="mobile-play-button"></div>'
                    );
                } else {
                    my_jPlayer.jPlayer("play");
                }
            },
            swfPath: "../../src",
            supplied: "mp3,ogg",
            solution: "html,flash",
            wmode: "window",
            loop: true
        });
        var my_jPlayer_data = my_jPlayer.data("jPlayer");

        // bind controls
        $("body").on("touchstart", "#image-wrapper", function(e) {
            if(my_jPlayer_data.status.paused){
                my_jPlayer.jPlayer("play");
                $('#mobile-play-button').addClass('invisible');
            } else{
                my_jPlayer.jPlayer("pause");
                $('#mobile-play-button').removeClass('invisible');
            }
        });

        $('.player-mute').click(function(e){
            if(my_jPlayer.jPlayer("option","muted")){
                my_jPlayer.jPlayer("unmute");
                $(this).removeClass('icon-unmute').addClass('icon-mute');
            } else {
                my_jPlayer.jPlayer("mute");
                $(this).removeClass('icon-mute').addClass('icon-unmute');
            }
        });

        // background
        $.vegas({
            src:'./'+$('#image-wrapper').attr('data-jpg'),
            fade:2000,
            loading:false
        });
    }

    $(document).bind({
        "idle.idleTimer" : function(){
            if(!($.jPlayer.platform.mobile || $.jPlayer.platform.tablet) && $('#footer:hover').length === 0){
                // si on n'est pas sur mobile
                // si on n'est pas au dessus du footer
                // on le cache
                $('#footer').addClass('invisible');
            }
        },
        "active.idleTimer": function(){
                $('#footer').removeClass('invisible');
        }
    });
    $.idleTimer(1000);

    if(Modernizr.fullscreen){
        $('.player-fullscreen').click(toggleFullScreen);
    } else {
        $('.player-fullscreen').addClass('invisible');
    }
});