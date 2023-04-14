// parken.js

// Importieren der benötigten Funktionen und Variablen aus anderen Modulen
import { scanQRCodeHandler } from "../deep_learning/qr_code/scanqrcodehandler.js";
import { scanLicensePlate } from "../deep_learning/licence_plate/licensePlateScanner.js";
import { stopSpinner } from "../features/progress/progress.js";
import {
  trainAndSaveModels,
  initializeModels,
} from "../deep_learning/model/trainings.js";

// Exportieren der benötigten Funktionen und Variablen für andere Module
export { scanQRCodeHandler };

document.addEventListener("DOMContentLoaded", async () => {
  stopSpinner();

  // Funktion zur Initialisierung der Event-Listener
  function init() {
    // Input-Element für die Kennzeichen-Datei auswählen
    const licensePlateFileInput = document.getElementById("licensePlateInput");
    // Event-Listener für das Ändern des Input-Elements hinzufügen
    licensePlateFileInput.addEventListener("change", async () => {
      try {
        const imageData = await scanLicensePlate(licensePlateFileInput);

        // Erfassen Sie die Benutzereingabe für das Kennzeichen, den Fahrzeugtyp und die Farbe
        const licensePlateInput =
          document.getElementById("licensePlateInput").value;
        const vehicleTypeInput =
          document.getElementById("vehicleTypeInput").value;
        const colorInput = document.getElementById("colorInput").value;
        const labels = [licensePlateInput, vehicleTypeInput, colorInput];

        // Erstellen Sie ein Trainingsdatenobjekt mit dem erfassten Bild und den vom Benutzer eingegebenen Informationen
        const trainingData = [
          {
            image: imageData,
            label: {
              licensePlate: licensePlateInput,
              vehicleType: vehicleTypeInput,
              color: colorInput,
            },
          },
        ];

        // Trainieren Sie die Modelle mit dem Trainingsdatenobjekt und speichern Sie die trainierten Daten in der Datenbank
        await trainAndSaveModels(trainingData);
      } catch (error) {
        console.error(error);
      }
    });
    // Event-Listener für den "Kennzeichen scannen"-Button hinzufügen
    document
      .getElementById("train_model_button")
      .addEventListener("click", async () => {
        // Klicken des Input-Elements simulieren
        licensePlateFileInput.click();
      });

    // Event-Listener für den "QR Code scannen"-Button hinzufügen
    document
      .getElementById("scanQRCodeButtonCheck")
      .addEventListener("click", async () => {
        // Überprüfen, ob das Gerät mobil ist
        const isMobile = window.innerWidth < 2734;
        let vehiclestatus = "Check";
        // Wenn das Gerät mobil ist, den QR-Code-Scanner öffnen
        if (isMobile) {
          try {
            await scanQRCodeHandler(vehiclestatus);
          } catch (error) {
            console.error(error);
          }
        } else {
          // Andernfalls eine Fehlermeldung ausgeben
          alert("This feature is only available on mobile devices.");
        }
      });

    // Event-Listener für den "QR Code scannen"-Button hinzufügen
    document
      .getElementById("scanQRCodeButtonMech")
      .addEventListener("click", async () => {
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
          alert("This feature is only available on mobile devices.");
        }
      });
    // Event-Listener für den "QR Code scannen"-Button hinzufügen
    document
      .getElementById("scanQRCodeButtonWash")
      .addEventListener("click", async () => {
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
          alert("This feature is only available on mobile devices.");
        }
      });
  }
  // Event-Listener für das Laden der Seite hinzufügen
  window.onload = init;
});
