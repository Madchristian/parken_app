
import { startSpinner, stopSpinner } from "./progress.js";

let socket;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

function getIconClass(vehiclestatus) {
  if (vehiclestatus === 'Mech') {
    return 'fa-solid fa-wrench wrench-icon';
  } else if (vehiclestatus === 'Wash') {
    return 'fa-solid fa-square-parking parking-icon';
  } else if (vehiclestatus === 'Checked') {
    return 'fa-solid fa-list-check checked-icon';
  }
  return 'fa-solid fa-square-parking parking-icon';
}


function getDigitalClock(timestamp) {
  const date = new Date(timestamp);
  const isoTimeString = date.toISOString().replace("Z", " GMT");
  const localTimeString = new Date(isoTimeString).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }).split(':');

  return `
    <div class="digital-clock">
      <div class="hours">${localTimeString[0]}</div>
      <div class="separator">--</div>
      <div class="minutes">${localTimeString[1]}</div>
    </div>
  `;
}


function createIcon(vehiclestatus, licensePlate, timestamp, id) {
  const iconClass = getIconClass(vehiclestatus); // Replace this with the actual timestamp from the server
  const clock = getDigitalClock(timestamp);

  return L.divIcon({
    className: 'license-plate-icon',
    html: `
  <style>
    .wrench-icon {
      color: orange;
    }
    .parking-icon {
      color: blue;
      margin-top: -15px;
  }
  .checked-icon {
    color: red;
    margin-top: 15px;
  }
    .btn-delete-container {
      position: relative;
    }
    .btn-delete {
      position: absolute;
      right: -2.0em;
      top: 0;
    }
    .fa-square-check {
      /* Hier wird die Größe des Symbols geändert */
      font-size: 18px;
      color: green;
    }
    .digital-clock {
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      font-size: 8px;
      line-height: 1;
    }
    .hours,
    .separator,
    .minutes {
      display: block;
      margin: -4px;
      padding: 2px;
    }
  </style>
  <div class="license-plate-icon">
    <i class="${iconClass}"></i>
    <div class="btn-delete-container" style="display: inline-block; background-color: white; color: black; border: 1px solid black; padding: 2px 4px; font-size: 14px; font-weight: bold; border-radius: 3px; white-space: nowrap;">
      ${clock}${licensePlate}
      <button id="delete-${id}" class="btn-delete" aria-label="Close" style="cursor: pointer; padding-left: 2px; padding: 2x 2px;">
        <i class="fa-solid fa-square-check"></i>
      </button>
    </div>
  </div>
    `
  });

}


async function deleteParkedCar(id, map) {
  try {
    const confirmDelete = confirm("Fahrzeug abgeholt?");
    if (!confirmDelete) {
      return;
    }
    const response = await fetch(`/apiv3/delete-vehicle?id=${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Remove the marker from the map
    const marker = map._layers[id];
    if (marker) {
      marker.remove();
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
    zoom: 15
  });

  // Add a tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 19
  }).addTo(map);

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
    const coordinates = parkedCars.data.map(car => [car.latitude, car.longitude]);
    const markerBounds = L.latLngBounds(coordinates);

    // Set the map view to include all parked cars
    map.fitBounds(markerBounds);

    // Add markers with custom icons for each parked car
    parkedCars.data.forEach(car => {
      const icon = createIcon(car.vehiclestatus, car.licensePlate, car.timestamp, car._id);
      const marker = L.marker([car.latitude, car.longitude], { icon: icon }).addTo(map);

      // Add an event listener to the delete button on the marker
      const deleteButton = document.getElementById(`delete-${car._id}`);
      if (deleteButton) {
        deleteButton.addEventListener('click', (event) => {

          event.stopPropagation(); // Prevent the click event from propagating to the marker itself
          deleteParkedCar(car._id, map);
        });
      }


      stopSpinner();
      marker._leaflet_id = car._id;
    });

    stopSpinner();

    function connectWebSocket() {
      try {
        socket = new WebSocket(`wss://${window.location.host}/apiv3/vehicle-queue`);

        socket.onerror = function (event) {
          console.error("WebSocket error observed:", event);
          alert("WebSocket connection error");
        };

        socket.onmessage = async function (event) {
          try {
            console.log("Raw data received from WebSocket:", event.data);
            console.log("Received timestamp:", receivedData.timestamp);
            const receivedData = JSON.parse(event.data);

            if (receivedData.type === 'update') {
              const carId = receivedData.carId;
              const response = await fetch(`/apiv3/parked-cars/${carId}`);
              const carData = await response.json();

              if (carData) {
                const car = carData;

                // Update the marker for the car or add a new marker if it doesn't exist yet
                const existingMarker = map._layers[car._id];
                if (existingMarker) {
                  existingMarker.setLatLng([car.latitude, car.longitude]);
                } else {
                  const icon = createIcon(car.vehiclestatus, car.licensePlate, car._id);

                  const marker = L.marker([car.latitude, car.longitude], { icon: icon }).addTo(map);

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
              const carId = receivedData.carId;

              // Remove the marker for the deleted vehicle from the map
              const marker = map._layers[carId];
              if (marker) {
                marker.remove();
              }
            }
          } catch (error) {
            console.error("Error processing WebSocket message:", error);
          }
        };

        socket.onclose = function (event) {
          console.error("WebSocket connection closed:", event);
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            setTimeout(() => {
              reconnectAttempts++;
              console.log(`Trying to reconnect (attempt ${reconnectAttempts})...`);
              connectWebSocket();
            }, 5000);
          } else {
            console.error(`WebSocket connection failed after ${MAX_RECONNECT_ATTEMPTS} attempts.`);
          }
        };

      } catch (error) {
        console.error("WebSocket connection error:", error);
        alert("WebSocket connection error");
      }
    }

    connectWebSocket();
    stopSpinner();

  } catch (error) {
    console.error("");

  }
});
