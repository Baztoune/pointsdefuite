---
---

window.addEventListener("DOMContentLoaded", (event) => {
  const audio = document.querySelector("#audio-wrapper");
  if (audio) {
    // audio controls
    const volumeIcon = document.querySelector('#audio-controls').getElementsByTagName('i')[0];
    if(volumeIcon) {
      volumeIcon.addEventListener('click', () => {
        if (audio.paused) {
          audio.play();
          volumeIcon.classList.remove('fa-volume-mute');
          volumeIcon.classList.add('fa-volume-up');
        } else {
          audio.pause();
          volumeIcon.classList.add('fa-volume-mute');
          volumeIcon.classList.remove('fa-volume-up');
        }
      });
    }
    const startPlayPromise = audio.play();
    if (startPlayPromise !== undefined) {
      startPlayPromise
        .then(() => { console.log("PLAYING AUDIO OK") })
        .catch((error) => {
          if (error.name === "NotAllowedError") {
            console.log("SHOW MUTE BUTTON");
            volumeIcon.classList.add('fa-volume-mute');
            volumeIcon.classList.remove('fa-volume-up');
          } else {
            // Handle a load or playback error
            console.error("ERROR", error);
          }
        });
    }
  }


  // Get all "navbar-burger" elements
  const $navbarBurger = document.querySelector('.navbar-burger');
  const $navbar = document.querySelector('.navbar');
  if ($navbarBurger) {
    $navbarBurger.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const target = $navbarBurger.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $navbarBurger.classList.toggle('is-active');
        $target.classList.toggle('is-active');
        $navbar.classList.toggle('has-active-menu');
      });
  }

  // init map
  if (document.querySelector("#map")) {
    var firstLoad = true;
    const tileLayer = L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        id: "helemalda/ckm7qvd0jg9os17qnqhn6h1vc",
        accessToken:
          "pk.eyJ1IjoiaGVsZW1hbGRhIiwiYSI6ImNrbTd0bmJlbjA3OXUyb3BoOWZwMGU2dDkifQ.UMw7_4tHL_8pgunSuWv_tw",
        attribution: '<a href="http://mapbox.com/about/maps">Mapbox Terms</a>',
        maxZoom: 10,
        minZoom: 2
      }
      );
      
      const map = L.map("map", {
        center: L.latLng(20, 20),
        zoom: 2,
        zoomControl: false,
        layers: [tileLayer],
      });

    const customIcon = new L.Icon({
      iconUrl: "{{ '/assets/images/point-13px.png' | relative_url }}",
      iconSize: [13, 13],
      popupAnchor: [0, -13],
    });
    L.control.zoom({position:'bottomright'}).addTo(map);
    const markerLayer = L.featureGroup();
    map.addLayer(markerLayer);

    // load markers
    fetch(new Request("/locations.json"))
      .then((response) => response.json())
      .then((data) => {
        const vignettes = document.querySelector("#vignettes");
        if(vignettes){
          const regions = ['france', 'islande', 'ecosse', 'nouvelle-caledonie', 'norvege', 'danemark'];
          regions.forEach(regionName=>{
            const $region = document.querySelector('.'+regionName)
            $region.addEventListener('click', () => {
              const points = data
                .filter(d=>d.friendlyUrlName.includes(regionName))
                .map(d=>L.latLng(d.latitude, d.longitude));
                if(points.length>0){
                  map.flyToBounds(L.latLngBounds(points),{paddingTopLeft:[0, 30], paddingBottomRight:[0, 150]});
                }
            })
          })
        }
        for (var i = 0; i < data.length; i++) {
          const location = new L.LatLng(data[i].latitude, data[i].longitude);
          const marker = new L.Marker(location, {icon: customIcon});

          marker.bindPopup(
            '<div class="has-text-centered">' +
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
