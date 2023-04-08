// parken.js

// Importieren der benötigten Funktionen und Variablen aus anderen Modulen
import { getLocation } from './positionandsave.js';
import { stopSpinner, startSpinner } from './progress.js';
import { scanQRCodeHandler } from './scanqrcodehandler.js';
import { scanLicensePlate } from './licensePlateScanner.js';
import { setCookie, getCookie, askForCookieConsent } from './cookies.js';

// Exportieren der benötigten Funktionen und Variablen für andere Module
export {
  getLocation,
  scanQRCodeHandler,
  stopSpinner,
  startSpinner
};
// Funktion zur Abfrage der Geolokalisierungserlaubnis
async function getLocationPermission() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true), // Erlaubnis erteilt
        () => resolve(false) // Erlaubnis verweigert
      );
    } else {
      // Geolocation wird vom Browser nicht unterstützt
      reject(new Error('Geolocation not supported'));
    }
  });
}

// Funktion zur Abfrage der Kameraerlaubnis
async function getCameraPermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    return true; // Erlaubnis erteilt
  } catch (error) {
    console.error(error);
    return false; // Erlaubnis verweigert
  }
}
document.addEventListener('DOMContentLoaded', async () => {
  stopSpinner();

  // Abfrage der Cookie-Zustimmung
  await askForCookieConsent();




  // Funktion zur Initialisierung der Event-Listener
  function init() {

    // Event-Listener für den "Kennzeichen scannen"-Button hinzufügen
    document.getElementById('scanLicensePlateButton').addEventListener('click', async () => {

      // Abfrage der Geolokalisierungserlaubnis
      let locationPermission = getCookie('locationPermission');
      if (locationPermission === null) {
        locationPermission = await getLocationPermission();
        setCookie('locationPermission', locationPermission, 365);
      }
      // Abfrage der Kameraerlaubnis
      let cameraPermission = getCookie('cameraPermission');
      if (cameraPermission === null) {
        cameraPermission = await getCameraPermission();
        setCookie('cameraPermission', cameraPermission, 365);
      }
      // Input-Element für die Kennzeichen-Datei auswählen 
      const licensePlateFileInput = document.getElementById('licensePlateInput');
      // Event-Listener für das Ändern des Input-Elements hinzufügen
      licensePlateFileInput.addEventListener('change', async () => {
        try {
          await scanLicensePlate(licensePlateFileInput);
        } catch (error) {
          console.error(error);
        }
      });
      // Klicken des Input-Elements simulieren
      licensePlateFileInput.click();
    });

    // Event-Listener für den "QR Code scannen"-Button hinzufügen
    document.getElementById('scanQRCodeButton').addEventListener('click', async () => {
      // Überprüfen, ob das Gerät mobil ist
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      // Abfrage der Geolokalisierungserlaubnis
      let locationPermission = getCookie('locationPermission');
      if (locationPermission === null) {
        locationPermission = await getLocationPermission();
        setCookie('locationPermission', locationPermission, 365);
      }
      // Abfrage der Kameraerlaubnis
      let cameraPermission = getCookie('cameraPermission');
      if (cameraPermission === null) {
        cameraPermission = await getCameraPermission();
        setCookie('cameraPermission', cameraPermission, 365);
      }
      // Wenn das Gerät mobil ist, den QR-Code-Scanner öffnen
      if (isMobile) {
        try {
          await scanQRCodeHandler();
        } catch (error) {
          console.error(error);
        }
      } else {
        // Andernfalls eine Fehlermeldung ausgeben
        alert('This feature is only available on mobile devices.');
      }
    });
  }

  // Event-Listener für das Laden der Seite hinzufügen
  window.onload = init;
});
