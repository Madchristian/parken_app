// licensePlateScanner.js
//import { Tesseract } from '../../node_modules/tesseract.js/dist/tesseract.min.js';
import { getLocation } from "./positionandsave.js";
import { showProgressBar, hideProgressBar } from "./progress.js";

export async function scanLicensePlate(imageFile) {
  showProgressBar();

  // Erstellen Sie einen Worker
  const worker = Tesseract.createWorker({
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
    hideProgressBar();

    const licensePlate = text;
    getLocation(licensePlate);
  } catch (error) {
    console.error(error);
    hideProgressBar();
  }
}





export function processImage(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        // do something with the image, e.g. display it
        const imageElement = document.getElementById('licensePlateImage');
        imageElement.src = this.src;
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(file);
  }
  
