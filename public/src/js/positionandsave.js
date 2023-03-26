import { startProgress, stopProgress, updateProgressBar } from "./progress.js";

async function saveData(licensePlate, latitude, longitude) {
  const apiUrl = "https://parken.cstrube.de/apiv3/save-data";
  const data = {
    licensePlate: licensePlate,
    latitude: latitude,
    longitude: longitude
  };
  startProgress(); // Anzeigen des Ladebalkens

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

      // Aktualisieren des Fortschrittsbalkens auf 100% und Ausblenden des Ladebalkens
      updateProgressBar(100);
      stopProgress();
      
      const swoosh = new Audio("/sound/swoosh.mp3");
      swoosh.play();
    } else {
      console.error("Error saving data:", response.status, response.statusText);
      const errorsound = new Audio("/sound/error.mp3");
      errorsound.play();

      // Aktualisieren des Fortschrittsbalkens auf 0% und Ausblenden des Ladebalkens
      updateProgressBar(0);
      stopProgress();
    }
  } catch (error) {
    console.error("Error sending data to server:", error);

    // Aktualisieren des Fortschrittsbalkens auf 0% und Ausblenden des Ladebalkens
    updateProgressBar(0);
    stopProgress();
  }
}

export function getLocation(licensePlate) {
  if (navigator.geolocation) {
    startProgress(); // Anzeigen des Ladebalkens
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      console.log(licensePlate)
      saveData(licensePlate, latitude, longitude).catch(error => {
        console.error(error);
        console.log(data)
      }).finally(() => {
        stopProgress(); // Ausblenden des Ladebalkens unabhängig davon, ob das Speichern erfolgreich war oder nicht
      });
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
