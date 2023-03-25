//positionandsave.js
import { showProgressBar, hideProgressBar } from "./progress";

async function saveData(licensePlate, latitude, longitude) {
  const apiUrl = "https://parken.cstrube.de/apiv3/save-data";
  const data = {
    licensePlate: licensePlate,
    latitude: latitude,
    longitude: longitude
  };
  showProgressBar(); // Anzeigen des Ladebalkens

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Data saved successfully:", jsonResponse);

      hideProgressBar(); // Ausblenden des Ladebalkens
      const swoosh = new Audio("/sound/swoosh.mp3");
      swoosh.play();
    } else {
      console.error("Error saving data:", response.status, response.statusText);
      const errorsound = new Audio("/sound/error.mp3");
      errorsound.play();
      hideProgressBar(); // Ausblenden des Ladebalkens
    }
  } catch (error) {
    console.error("Error sending data to server:", error);
    hideProgressBar(); // Ausblenden des Ladebalkens
  }
}


export function getLocation(licensePlate) {
  if (navigator.geolocation) {
    showProgressBar(); // Anzeigen des Ladebalkens
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      saveData(licensePlate, latitude, longitude).catch(error => {
        console.error(error);
      }).finally(() => {
        hideProgressBar(); // Ausblenden des Ladebalkens unabhängig davon, ob das Speichern erfolgreich war oder nicht
      });
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

