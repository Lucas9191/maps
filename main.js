let map;
let marker;
let autocomplete;
let input;
let polygon; // Agregamos una variable para el polígono
let polygons = []; // Almacena los polígonos dibujados en el mapa


async function initMap() {
  const argCoords = { lat: -34, lng: -64.0 };
  const { Map } = await google.maps.importLibrary("maps");
  input = document.getElementById("place_input");

  map = new Map(document.getElementById("map"), {
    center: argCoords,
    zoom: 5,
  });

  marker = new google.maps.Marker({
    position: argCoords,
    map: map,
  });

  initAutocomplete();
  initDrawingManager();
}

function initAutocomplete() {
  input = document.getElementById("place_input");
  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', function () {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      alert("Ubicación no válida");
      return;
    }

    // Define el nivel de zoom deseado (ajústalo según tus preferencias)
    const zoomLevel = 14;

    map.setCenter(place.geometry.location);
    map.setZoom(zoomLevel); // Ajusta el nivel de zoom para acercarse a la ubicación seleccionada
    marker.setPosition(place.geometry.location);
  });
}

function initDrawingManager() {
  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        //google.maps.drawing.OverlayType.MARKER,
        //google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.POLYGON,
        //google.maps.drawing.OverlayType.POLYLINE,
        //google.maps.drawing.OverlayType.RECTANGLE,
      ],
    },
    markerOptions: {
      icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    },
    circleOptions: {
      fillColor: "#ffff00",
      fillOpacity: 1,
      strokeWeight: 5,
      clickable: false,
      editable: true,
      zIndex: 1,
    },
  });

  drawingManager.setMap(map);

  

 
  // Agregamos un evento cuando se completa el dibujo del polígono
  google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
    if (event.type === google.maps.drawing.OverlayType.POLYGON) {
      if (polygon) {
        polygon.setMap(null); // Elimina el polígono anterior si existe
      }
      polygon = event.overlay;


      // Calculamos el área en hectáreas
      const areaInSquareMeters = google.maps.geometry.spherical.computeArea(polygon.getPath());
      const areaInHectares = areaInSquareMeters / 10000;

      // Mostramos el área en alguna parte de la página
      document.getElementById('area_display').textContent = `Área en Hectáreas: ${areaInHectares.toFixed(2)}`;

       // Guardamos el polígono y su área en el array 'polygons'
       polygons.push({ polygon: polygon, area: areaInHectares });

    }

  
  });
}
  

// Asigna la función initMap a la ventana global
window.initMap = initMap;



 