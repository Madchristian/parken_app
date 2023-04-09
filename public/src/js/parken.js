// parken.js

// Importieren der benötigten Funktionen und Variablen aus anderen Modulen
import { scanQRCodeHandler } from './scanqrcodehandler.js';
import { scanLicensePlate } from './licensePlateScanner.js';
import { stopSpinner } from './progress.js';

// Exportieren der benötigten Funktionen und Variablen für andere Module
export {
  scanQRCodeHandler
};

document.addEventListener('DOMContentLoaded', () => {
  stopSpinner();

  // Funktion zur Initialisierung der Event-Listener
  function init() {

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
    document.getElementById('scanQRCodeButtonMech').addEventListener('click', async () => {
      // Überprüfen, ob das Gerät mobil ist
      const isMobile = window.innerWidth < 2734;
      let vehiclestatus = "Mech";
      // Wenn das Gerät mobil ist, den QR-Code-Scanner öffnen
      if (isMobile) {
        try {
          await scanQRCodeHandler(vehiclestatus);
        } catch (error) {
          console.error(error);
        }
      } else {
        // Andernfalls eine Fehlermeldung ausgeben
        alert('This feature is only available on mobile devices.');
      }
    });
  }
    // Event-Listener für den "QR Code scannen"-Button hinzufügen
    document.getElementById('scanQRCodeButtonWash').addEventListener('click', async () => {
      // Überprüfen, ob das Gerät mobil ist
      const isMobile = window.innerWidth < 2734;
      let vehiclestatus = "Wash";
      // Wenn das Gerät mobil ist, den QR-Code-Scanner öffnen
      if (isMobile) {
        try {
          await scanQRCodeHandler(vehiclestatus);
        } catch (error) {
          console.error(error);
        }
      } else {
        // Andernfalls eine Fehlermeldung ausgeben
        alert('This feature is only available on mobile devices.');
      }
    });

  // Event-Listener für das Laden der Seite hinzufügen
  window.onload = init;
});
