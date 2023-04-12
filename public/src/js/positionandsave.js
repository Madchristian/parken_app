import { startSpinner, stopSpinner } from "./progress.js";
import { showMessage } from "./messages.js";

const recentSavedData = new Map();

async function saveData(licensePlate, latitude, longitude, vehiclestatus, locationName) {
  const apiUrl = "http://quart:5000/apiv3/save-data";
  const data = {
    licensePlate: licensePlate,
    latitude: latitude,
    longitude: longitude,
    vehiclestatus: vehiclestatus,
    locationName: locationName
  };

  const cacheKey = JSON.stringify(data);
  if (recentSavedData.has(cacheKey)) {
    console.log("Data already saved recently, skipping save:", data);
    showMessage("Daten wurde schon gespeichert", "info");
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
      }, 1 * 60 * 1000);
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


async function getLocationName(latitude, longitude) {
  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
  const response = await fetch(nominatimUrl);

  if (response.ok) {
    const data = await response.json();
    return data.address.town || data.address.city || data.address.county;
  } else {
    console.error("Error fetching location name:", response.status, response.statusText);
    throw new Error("Error fetching location name");
  }
}


export async function getLocation(licensePlate, vehiclestatus) {
  if (navigator.geolocation) {
    startSpinner();
    navigator.geolocation.getCurrentPosition(async position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      console.log(licensePlate);

      try {
        const locationName = await getLocationName(latitude, longitude);
        console.log("Location name:", locationName);
        await saveData(licensePlate, latitude, longitude, vehiclestatus, locationName);
        stopSpinner();
      } catch (error) {
        console.error(error);
        stopSpinner();
      }
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
