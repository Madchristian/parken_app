import { startSpinner, stopSpinner } from "./progress.js";

let socket;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

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
      const icon = L.divIcon({
        className: 'license-plate-icon',
        html: `
          <div style="display: inline-block; background-color: white; color: black; border: 1px solid black; padding: 1px 4px; font-size: 10px; font-weight: bold; border-radius: 3px; white-space: nowrap;">
            ${car.licensePlate}
            <button id="delete-${car._id}" class="btn-delete" aria-label="Close", map)" cursor: pointer; padding-left: 2px; padding: 1px 4px;">
            <i class="fa-sharp fa-regular fa-trash-can-list"></i>
            </button>
          </div>`
      });
      const marker = L.marker([car.latitude, car.longitude], { icon: icon }).addTo(map);

      // Event-Listener für den Lösch-Button hinzufügen
      const deleteButton = document.getElementById(`delete-${car._id}`);
      if (deleteButton) {
        deleteButton.addEventListener('click', (event) => {
          event.stopPropagation(); // Verhindert, dass das Klick-Event auf den Marker selbst weitergeleitet wird
          deleteParkedCar(car._id, map);
        });
      }


      stopSpinner();
      marker._leaflet_id = car._id;
    });




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
                  const icon = L.divIcon({
                    className: 'license-plate-icon',
                    html: `
                      <div style="display: inline-block; background-color: white; color: black; border: 1px solid black; padding: 2px 2px; font-size: 10px; font-weight: bold; border-radius: 3px; white-space: nowrap;">
                        ${car.licensePlate}
                        <button id="delete-${car._id}" class="btn-delete" aria-label="Close" style="cursor: pointer; padding-left: 4px; padding: 4px 8px;">
                          <i class="fa-sharp fa-regular fa-trash-can-list"></i>
                        </button>
                      </div>`
                  });

                  const marker = L.marker([car.latitude, car.longitude], { icon: icon }).addTo(map);

                  // Event-Listener für den Lösch-Button hinzufügen
                  const deleteButton = document.getElementById(`delete-${car._id}`);
                  if (deleteButton) {
                    deleteButton.addEventListener('click', (event) => {
                      event.stopPropagation(); // Verhindert, dass das Klick-Event auf den Marker selbst weitergeleitet wird
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
