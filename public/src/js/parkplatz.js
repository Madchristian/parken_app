// parklpatz.js
import { startSpinner, stopSpinner } from "./progress.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Initialize the map
  const map = L.map('map', {
    center: [0, 0],
    zoom: 5
  });

  // Add a tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18
  }).addTo(map);

  try {
    startSpinner();
    // Fetch all parked cars from the database
    const response = await fetch("/apiv3/get-vehicle-data");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const parkedCars = await response.json();

    if (!Array.isArray(parkedCars.data)) {
      throw new Error("Response is not an array of parked cars");
    }

    // Calculate the bounding box for the coordinates
    const coordinates = parkedCars.data.map(car => [car.latitude, car.longitude]);
    const markerBounds = L.latLngBounds(coordinates);

    // Set the map view to include all parked cars
    map.fitBounds(markerBounds);

    // Add markers for each parked car
    parkedCars.data.forEach(car => {
      const marker = L.marker([car.latitude, car.longitude]).addTo(map);
      marker.bindPopup(`License Plate: ${car.licensePlate}<br>Latitude: ${car.latitude}<br>Longitude: ${car.longitude}`);
      marker._leaflet_id = car._id;
    });

    // Connect to the vehicle_queue WebSocket to receive updates
    const socket = new WebSocket(`ws://${window.location.host}/apiv3/vehicle-queue`);
    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (Array.isArray(data.data)) {
        data.data.forEach(car => {
          // Update the marker for the car or add a new marker if it doesn't exist yet
          const existingMarker = map._layers[car._id];
          if (existingMarker) {
            existingMarker.setLatLng([car.latitude, car.longitude]);
          } else {
            const marker = L.marker([car.latitude, car.longitude]).addTo(map);
            marker.bindPopup(`License Plate: ${car.licensePlate}<br>Latitude: ${car.latitude}<br>Longitude: ${car.longitude}`);
            marker._leaflet_id = car._id;
          }
        });
      }
    };

    stopSpinner();
  } catch (error) {
    console.error(error);
    alert("Error fetching parked cars from database");
  }
});
