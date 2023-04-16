import { createIcon } from "../features/map/createicon.js";
import { startSpinner, stopSpinner } from "../features/progress/progress.js";
import { initializeWebSocket } from "../connections/websockets.js";
import { searchForLicensePlate } from "../utils/maputils.js";
import { deleteParkedCar } from "../features/map/removemarker.js";

const markers = new Map();

export let markerGroup; // Definieren Sie markerGroup auf globaler Ebene

let currentZIndex = 1000;

let map;

const openStreetMap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 19,
  }
);

document.addEventListener("DOMContentLoaded", async function () {
  // Initialize the map
  map = L.map("map", {
    center: [0, 0],
    zoom: 15,
    maxZoom: 19,
  });

  openStreetMap.addTo(map);
  const baseMaps = {
    OpenStreetMap: openStreetMap,
  };
  L.control.layers(baseMaps).addTo(map);

  // Create a feature group to group the markers
  markerGroup = L.featureGroup().addTo(map);

  try {
    startSpinner();

    // Fetch all parked cars from the database
    const response = await fetch("/apiv3/search-vehicle");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const parkedCars = await response.json();

    if (!Array.isArray(parkedCars.data)) {
      throw new Error("Response is not an array of parked cars");
    }

    // Calculate the bounding box for the coordinates
    const coordinates = parkedCars.data
      .map((car) => [car.latitude, car.longitude])
      .filter((coord) => coord[0] && coord[1]); // Filter out invalid coordinates

    if (coordinates.length > 0) {
      const markerBounds = L.latLngBounds(coordinates);

      // Set the map view to include all parked cars
      map.fitBounds(markerBounds);
    } else {
      // Set the map view to a default location and zoom level
      map.setView([51.1657, 10.4515], 6); // Deutschland
    }

    // Loop through the parked cars and create markers for each one
    parkedCars.data.forEach((car) => {
      if (car.latitude && car.longitude) {
        // Prüfen Sie, ob die Koordinaten gültig sind
        const icon = createIcon(
          car.vehiclestatus,
          car.licensePlate,
          car.timestamp,
          car._id
        );
        const marker = L.marker([car.latitude, car.longitude], {
          icon: icon,
          licensePlate: car.licensePlate,
        });

        // Add an event listener to the delete button on the marker
        marker.on("popupopen", () => {
          const deleteButton = document.getElementById(`delete-${car._id}`);
          if (deleteButton) {
            deleteButton.addEventListener("click", (event) => {
              event.stopPropagation(); // Prevent the click event from propagating to the marker itself
              deleteParkedCar(car._id, car.locationName, map);
            });
          }
        });

        // Add a click event listener to the marker
        marker.on("click", function () {
          currentZIndex += 1;
          this.setZIndexOffset(currentZIndex);
        });

        markerGroup.addLayer(marker);
        // Fügen Sie den Marker zur "markers" Map hinzu
        markers.set(car._id, marker);
        marker._leaflet_id = car._id;
        markerGroup.eachLayer(function (marker) {
          marker.on("click", function () {
            currentZIndex += 1;
            this.setZIndexOffset(currentZIndex);
          });
        });
      }
    });

    stopSpinner();
    initializeWebSocket();
  } catch (error) {
    console.error(error);
    // Wenn ein Fehler auftritt, stelle trotzdem eine Verbindung zum WebSocket her
    initializeWebSocket();
    stopSpinner();
  }
});

document.getElementById("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  searchForLicensePlate(map, markerGroup);
});
