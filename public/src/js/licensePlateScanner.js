import { getLocation } from "./positionandsave.js";
import { startSpinner, stopSpinner } from "./progress.js";

export const licensePlateFileInput = document.getElementById('licensePlateInput');

// Create and initialize the Tesseract worker
let worker;
async function initWorker() {
  worker = await Tesseract.createWorker({
    logger: (m) => console.log(m),
  });
  await worker.loadLanguage("deu");
  await worker.initialize("deu");
  console.log("worker initialized");
}

initWorker().catch((error) => {
  console.error("Error initializing worker:", error);
});

export async function scanLicensePlate(inputElement) {
  const imageFile = inputElement.files[0];
  if (!imageFile) {
    console.error("No image file selected");
    return;
  }

  startSpinner();

  try {
    // Recognize the license plate
    const {
      data: { text },
    } = await worker.recognize(imageFile, {
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789",
      tessedit_pageseg_mode: "6", // Set the page segmentation mode to "6" (Assume a single uniform block of text)
    });

    console.log(text);

    const licensePlate = text;
    getLocation(licensePlate);
  } catch (error) {
    console.error(error);
  } finally {
    stopSpinner();
  }
}
