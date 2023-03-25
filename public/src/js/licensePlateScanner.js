import { getLocation } from "./positionandsave.js";
import { showProgressBar, hideProgressBar, updateProgressBar } from "./progress.js";
// licensePlateScanner.js
export const licensePlateFileInput = document.getElementById('licensePlateInput');


// ...
export async function scanLicensePlate(imageFile) {
  showProgressBar();
  updateProgressBar(20); // Aktualisierung des Fortschrittsbalkens auf 20%

  // Erstellen Sie einen Worker
  const worker = await Tesseract.createWorker({

    logger: (m) => console.log(m),
  });

  try {
    // Initialisieren Sie den Worker
    await worker.load();
    await worker.loadLanguage("deu");
    await worker.initialize("deu");

    // Erkennen Sie das Nummernschild
    const {
      data: { text },
    } = await worker.recognize(imageFile, {
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789-",
    });

    console.log(text);
    await worker.terminate();
    updateProgressBar(60); // Aktualisierung des Fortschrittsbalkens auf 60%
    hideProgressBar();

    const licensePlate = text;
    getLocation(licensePlate);
  } catch (error) {
    console.error(error);
    hideProgressBar();
  }
}