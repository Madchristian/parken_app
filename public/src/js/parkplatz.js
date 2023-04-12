import { createIcon } from "./createicon.js";
import { startSpinner, stopSpinner } from "./progress.js";

let socket;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

const markers = [];
let markerGroup; // Definieren Sie markerGroup auf globaler Ebene

function initializeWebSocket() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("WebSocket connection already established.");
    return;
  }

  connectWebSocket();
  socket.addEventListener("close", () => {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`Trying to reconnect (attempt ${reconnectAttempts})...`);
      setTimeout(() => {
        initializeWebSocket();
      }, 10000);
    } else {
      console.error(`WebSocket connection failed after ${MAX_RECONNECT_ATTEMPTS} attempts.`);
    }
  });
}

async function deleteParkedCar(id, locationName, map) {
  try {
    const confirmDelete = confirm("Fahrzeug abgeholt?");
    if (!confirmDelete) {
      return;
    }
    const response = await fetch(`http://quart:5000/apiv3/delete-vehicle?id=${id}&locationName=${locationName}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Remove the marker from the map
    const marker = markers.find(marker => marker._leaflet_id === id);
    if (marker) {
      map.removeLayer(marker);
      markerGroup.removeLayer(marker);

    }
  } catch (error) {
    console.error("Error deleting parked car:", error);
    alert("Error deleting parked car");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  // Initialize the map
  const map = L.map('map', {
    center: [0, 0],
    zoom: 15,
    maxZoom: 19
  });

  // Create a feature group to group the markers
  markerGroup = L.featureGroup().addTo(map);


// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxZoom: 19
}).addTo(map);

try {
  startSpinner();

  // Fetch all parked cars from the database
  const response = await fetch("http://quart:5000/apiv3/search-vehicle");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const parkedCars = await response.json();

  if (!Array.isArray(parkedCars.data)) {
    throw new Error("Response is not an array of parked cars");
  }


  // Calculate the bounding box for the coordinates
  const coordinates = parkedCars.data
    .map(car => [car.latitude, car.longitude])
    .filter(coord => coord[0] && coord[1]); // Filter out invalid coordinates

  if (coordinates.length > 0) {
    const markerBounds = L.latLngBounds(coordinates);

    // Set the map view to include all parked cars
    map.fitBounds(markerBounds);
  } else {
    // Set the map view to a default location and zoom level
    map.setView([51.1657, 10.4515], 6); // Deutschland
  }

  // Loop through the parked cars and create markers for each one
  parkedCars.data.forEach(car => {
    if (car.latitude && car.longitude) { // Prüfen Sie, ob die Koordinaten gültig sind
      const icon = createIcon(car.vehiclestatus, car.licensePlate, car.timestamp, car._id);
      const marker = L.marker([car.latitude, car.longitude], { icon: icon, licensePlate: car.licensePlate });
      markerGroup.addLayer(marker);

      // Add an event listener to the delete button on the marker
      const deleteButton = document.getElementById(`delete-${car._id}`);
      if (deleteButton) {
        deleteButton.addEventListener('click', (event) => {

          event.stopPropagation(); // Prevent the click event from propagating to the marker itself
          deleteParkedCar(car._id, car.locationName, map);
        });
      }
      marker._leaflet_id = car._id;
    }
  })


  stopSpinner();
  initializeWebSocket();
} catch (error) {
  console.error(error);
  // Wenn ein Fehler auftritt, stelle trotzdem eine Verbindung zum WebSocket her
  initializeWebSocket();
  stopSpinner();
}
});


function connectWebSocket() {
  try {
    socket = new WebSocket(`wss://quart:5000/apiv3/vehicle-queue`);
    console.log(socket)
    socket.onerror = function (event) {
      console.error("WebSocket error observed:", event);
      alert("WebSocket connection error");
    };

    socket.onmessage = async function (event) {
      try {
        console.log("Raw data received from WebSocket:", event.data);
        const receivedData = JSON.parse(event.data);
        //console.log("Received timestamp:", receivedData.timestamp);

        if (receivedData.type === 'update') {
          const _id = receivedData._id;
          const locationName = receivedData.locationName;
          const response = await fetch(`http://quart:5000/apiv3/parked-cars/${_id}/${locationName}`);
          const carData = await response.json();

          if (carData) {
            const car = carData;

            // Update the marker for the car or add a new marker if it doesn't exist yet
            const existingMarker = markerGroup.getLayer(car._id);

            if (existingMarker) {
              existingMarker.setLatLng([car.latitude, car.longitude]);
            } else {
              const icon = createIcon(car.vehiclestatus, car.licensePlate, car.timestamp, car._id);

              const marker = L.marker([car.latitude, car.longitude], { icon: icon, licensePlate: car.licensePlate });
              markerGroup.addLayer(marker);
              markers.push(marker);


              // Add an event listener to the delete button on the marker
              const deleteButton = document.getElementById(`delete-${car._id}`);
              if (deleteButton) {
                deleteButton.addEventListener('click', (event) => {
                  event.stopPropagation(); // Prevent the click event from propagating to the marker itself
                  deleteParkedCar(car._id, map);
                });
              }
            }
          }
        } else if (receivedData.type === 'delete') {
          const carId = receivedData.id;
          console.log("Removing marker with ID", carId);
          // Remove the marker for the deleted vehicle from the map
          const marker = markerGroup.getLayer(carId);
          if (marker) {
            console.log("Removing marker", marker);
            markerGroup.removeLayer(marker);
            console.log("Removed marker", marker);
          } else {
            console.log("No marker found with ID", carId);
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socket.onclose = function (event) {
      console.error("WebSocket connection closed:", event);
      if (socket.readyState !== WebSocket.OPEN && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        setTimeout(() => {
          reconnectAttempts++;
          console.log(`Trying to reconnect (attempt ${reconnectAttempts})...`);
          connectWebSocket();
        }, 10000);
      } else if (socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket connection is still open.");
      } else {
        console.error(`WebSocket connection failed after ${MAX_RECONNECT_ATTEMPTS} attempts.`);
      }
    };
  } catch (error) {
    console.error("WebSocket connection error:", error);
    alert("WebSocket connection error");
  }
}

document.getElementById('searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  searchForLicensePlate();
});

function searchForLicensePlate() {
  const licensePlate = document.getElementById('searchInput').value.toUpperCase();
  const marker = markerGroup.getLayers().find(marker => marker.options.licensePlate === licensePlate);

  if (marker) {
    map.setView(marker.getLatLng(), 18);
  } else {
    alert('Kennzeichen nicht gefunden');
  }
}

