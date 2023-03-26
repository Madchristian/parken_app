import { getLocation } from "./positionandsave.js";
import { startProgress, stopProgress, updateProgressBar } from "./progress.js";

// licensePlateScanner.js
export const licensePlateFileInput = document.getElementById('licensePlateInput');

// ...

export async function scanLicensePlate(inputElement) {
  const imageFile = inputElement.files[0];
  if (!imageFile) {
    console.error("No image file selected");
    return;
  }

  startProgress();
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
    console.log("worker initialized");

    // Erkennen Sie das Nummernschild
    const {
      data: { text },
    } = await worker.recognize(imageFile, {
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789-",
    });

    console.log(text);
    await worker.terminate();
    console.log("worker terminated");
    updateProgressBar(60); // Aktualisierung des Fortschrittsbalkens auf 60%

    const licensePlate = text;
    getLocation(licensePlate);
  } catch (error) {
    console.error(error);
  } finally {
    stopProgress();
  }
}
