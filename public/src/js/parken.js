// parken.js

// Importieren der benötigten Funktionen und Variablen aus anderen Modulen
import { getLocation } from './positionandsave.js';
import { updateProgressBar, startProgress, stopProgress } from './progress.js';
import { scanQRCodeHandler} from './scanqrcodehandler.js';
import { scanLicensePlate } from './licensePlateScanner.js';

// Exportieren der benötigten Funktionen und Variablen für andere Module
export {
  getLocation,
  startProgress,
  stopProgress,
  updateProgressBar,
  scanQRCodeHandler
};

document.addEventListener('DOMContentLoaded', () => {
  // Hide progress bar initially
  stopProgress();

  // Funktion zur Initialisierung der Event-Listener
  function init() {
    // Event-Listener für den "Position"-Button hinzufügen
    document.getElementById('positionButton').addEventListener('click', async () => {
      try {
        await getLocation('');
      } catch (error) {
        console.error(error);
      }
    });

    // Event-Listener für den "Kennzeichen scannen"-Button hinzufügen
    document.getElementById('scanLicensePlateButton').addEventListener('click', async () => {
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
