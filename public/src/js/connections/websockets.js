// websockets.js
// 2023-04-14
import { deleteParkedCar } from "../features/map/removemarker.js";

let socket;
let socketOpen = false;

let reconnectAttempts = 0;

const MAX_RECONNECT_ATTEMPTS = 10;

export function initializeWebSocket() {
  if (socketOpen) {
    console.log("WebSocket connection already established.");
    return;
  }

  connectWebSocket();
  socket.addEventListener("close", () => {
    socketOpen = false;
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`Trying to reconnect (attempt ${reconnectAttempts})...`);
      setTimeout(() => {
        initializeWebSocket();
      }, 10000);
    } else {
      console.error(
        `WebSocket connection failed after ${MAX_RECONNECT_ATTEMPTS} attempts.`
      );
    }
  });
}

export function connectWebSocket() {
  try {
    socket = new WebSocket(`wss://${window.location.host}/apiv3/vehicle-queue`);
    console.log(socket);
    socket.onerror = function (event) {
      console.error("WebSocket error observed:", event);
      alert("WebSocket connection error");
    };

    socket.onmessage = async function (event) {
      try {
        console.log("Raw data received from WebSocket:", event.data);
        const receivedData = JSON.parse(event.data);
        //console.log("Received timestamp:", receivedData.timestamp);

        if (receivedData.type === "update") {
          const _id = receivedData._id;
          const locationName = receivedData.locationName;
          const response = await fetch(
            `/apiv3/parked-cars/${_id}/${locationName}`
          );
          const carData = await response.json();

          if (carData) {
            const car = carData;

            // Update the marker for the car or add a new marker if it doesn't exist yet
            const existingMarker = markerGroup.getLayer(car._id);

            if (existingMarker) {
              existingMarker.setLatLng([car.latitude, car.longitude]);
            } else {
              const icon = createIcon(
                car.vehiclestatus,
                car.licensePlate,
                car.timestamp,
                car._id
              );

              // When adding a new marker after receiving a WebSocket update event, include the collectionName in the options
              const marker = L.marker([car.latitude, car.longitude], {
                icon: icon,
                licensePlate: car.licensePlate,
                collectionName: car.collectionName,
              });
              markerGroup.addLayer(marker);
              markers.set(car._id, marker);

              // Add an event listener to the delete button on the marker
              const deleteButton = document.getElementById(`delete-${car._id}`);
              if (deleteButton) {
                deleteButton.addEventListener("click", (event) => {
                  event.stopPropagation(); // Prevent the click event from propagating to the marker itself
                  deleteParkedCar(car._id, car.locationName, map, markers);

                });
              }
            }
          }
        } else if (receivedData.type === "delete") {
          const carId = receivedData.id;
          console.log("Removing marker with ID", carId);
          // Remove the marker for the deleted vehicle from the map
          const marker = markerGroup.getLayer(carId);
          if (marker) {
            console.log("Removing marker", marker);
            markerGroup.removeLayer(marker);
            markers.delete(carId); // Verwenden Sie die delete-Methode, um den Marker aus der Map zu entfernen
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
      socketOpen = false;
      console.error("WebSocket connection closed:", event);
      if (
        socket.readyState !== WebSocket.OPEN &&
        reconnectAttempts < MAX_RECONNECT_ATTEMPTS
      ) {
        setTimeout(() => {
          reconnectAttempts++;
          console.log(`Trying to reconnect (attempt ${reconnectAttempts})...`);
          connectWebSocket();
        }, 10000);
      } else if (socket.readyState === WebSocket.OPEN) {
        console.log("WebSocket connection is still open.");
      } else {
        console.error(
          `WebSocket connection failed after ${MAX_RECONNECT_ATTEMPTS} attempts.`
        );
      }
    };

    socketOpen = true; // set socketOpen to true to indicate that a connection has been established
  } catch (error) {
    console.error("WebSocket connection error:", error);
    alert("WebSocket connection error");
  }
}
