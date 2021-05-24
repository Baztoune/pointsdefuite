---
---

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
                var marker = new L.Marker(location, {
                    icon: customIcon,
                });
                marker.bindPopup(
                      "<div class=\"textCenter\">"
                    + "<a href=\"" + data[i].friendlyUrlName + "\">"
                    + data[i].titre
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

    $('#image-wrapper').css("background-image", "url(" + $('#image-wrapper').attr('data-jpg') + ")");
});
