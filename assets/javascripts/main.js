---
---

window.addEventListener("DOMContentLoaded", (event) => {
  let audio = document.querySelector("#audio-wrapper");
  if (audio) {
    let startPlayPromise = audio.play();
    if (startPlayPromise !== undefined) {
      startPlayPromise
        .then(() => {
          // Start whatever you need to do only after playback
          // has begun.
          console.log("PLAYING AUDIO OK");
        })
        .catch((error) => {
          if (error.name === "NotAllowedError") {
            console.log("SHOW PLAY BUTTON");
            let div = document.createElement("div");
            div.setAttribute("id", "mobile-play-button");
            div.classList.add("absolute-center", "transition-500");
            document.querySelector("#image-wrapper").append(div);
            div.addEventListener("click", function (e) {
              if (audio.paused) {
                audio.play();
                div.classList.add("invisible");
              } else {
                audio.pause();
                div.classList.remove("invisible");
              }
            });
          } else {
            // Handle a load or playback error
            console.log("ERROR");
          }
        });
    }
  }

  if (document.querySelector("#map")) {
    // map
    var firstLoad = true;
    var tileLayer = L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        id: "helemalda/ckm7qvd0jg9os17qnqhn6h1vc",
        accessToken:
          "pk.eyJ1IjoiaGVsZW1hbGRhIiwiYSI6ImNrbTd0bmJlbjA3OXUyb3BoOWZwMGU2dDkifQ.UMw7_4tHL_8pgunSuWv_tw",
        attribution: '<a href="http://mapbox.com/about/maps">Mapbox Terms</a>',
        maxZoom: 10,
        minZoom: 2,
      }
    );

    var map = L.map("map", {
      center: L.latLng(46.369674, 2.581787),
      zoom: 2,
      layers: [tileLayer],
    });

    var customIcon = new L.Icon({
      iconUrl: "{{ '/assets/images/point-13px.png' | relative_url }}",
      iconSize: [13, 13],
      popupAnchor: [0, -13],
    });
    var markerLayer = L.featureGroup();
    map.addLayer(markerLayer);

    // load markers
    fetch(new Request("/locations.json"))
      .then((response) => response.json())
      .then((data) => {
        for (var i = 0; i < data.length; i++) {
          var location = new L.LatLng(data[i].latitude, data[i].longitude);
          var marker = new L.Marker(location, {
            icon: customIcon,
          });
          marker.bindPopup(
            '<div class="textCenter">' +
              '<a href="' +
              data[i].friendlyUrlName +
              '">' +
              data[i].titre +
              "</a>" +
              "</div>",
            {
              maxWidth: "400",
              closeButton: false,
              offset: new L.Point(0, 6),
            }
          );
          markerLayer.addLayer(marker);
        }
        if (firstLoad == true) {
          window.setTimeout(function () {
            map.fitBounds(markerLayer.getBounds());
            firstLoad = false;
          }, 900);
        }
      });

    // events
    map.on("zoomend", function (e) {
      var zoom = parseInt(map.getZoom(), 10);
      var markerContainer = document.querySelector(".leaflet-marker-pane");
      markerContainer.classList.remove(
        "zoom-max",
        "zoom-medium-plus",
        "zoom-medium"
      ); // default : min
      if (zoom >= 10) {
        markerContainer.classList.add("zoom-max");
      } else if (zoom >= 9) {
        markerContainer.classList.add("zoom-medium-plus");
      } else if (zoom >= 8) {
        markerContainer.classList.add("zoom-medium");
      }
    });
  }
});
