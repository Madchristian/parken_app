import { startSpinner, stopSpinner } from "./progress.js";
import { showMessage } from "./messages.js";

const recentSavedData = new Map();

async function saveData(licensePlate, latitude, longitude) {
  const apiUrl = "https://parken.cstrube.de/apiv3/save-data";
  const data = {
    licensePlate: licensePlate,
    latitude: latitude,
    longitude: longitude
  };

  const cacheKey = JSON.stringify(data);
  if (recentSavedData.has(cacheKey)) {
    console.log("Data already saved recently, skipping save:", data);
    alert("Daten wurden bereits erfasst.");
    return;
  }

  startSpinner(); // Anzeigen des Ladebalkens

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

      // Cache the data to prevent multiple saves
      recentSavedData.set(cacheKey, true);
      // Remove the data from the cache after a specific time (e.g., 5 minutes)
      setTimeout(() => {
        recentSavedData.delete(cacheKey);
      }, 5 * 60 * 1000);
      stopSpinner();
      const swooshsound = new Audio("/sound/swoosh.mp3");
      swooshsound.play();
      showMessage("Position erfolgreich gespeichert"); // Zeigt eine grüne Erfolgsmeldung an
    } else {
      console.error("Error saving data:", response.status, response.statusText);
      const errorsound = new Audio("/sound/error.mp3");
      errorsound.play();
      showMessage("Ein Fehler ist aufgetreten, bitte spöter erneut vesuchen", "error"); 
      stopSpinner();
    }

  } catch (error) {
    console.error("Error sending data to server:", error);
    stopSpinner();
  }
}


export function getLocation(licensePlate) {
  if (navigator.geolocation) {
    startSpinner(); // Anzeigen des Ladebalkens
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      console.log(licensePlate)
      saveData(licensePlate, latitude, longitude).catch(error => {
        console.error(error);
        console.log(data)
      }).finally(() => {
        stopSpinner(); // Ausblenden des Ladebalkens unabhängig davon, ob das Speichern erfolgreich war oder nicht
      });
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
