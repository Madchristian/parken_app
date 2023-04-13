import { getLocation } from "../../features/location/positionandsave.js";
import { startSpinner, stopSpinner } from "../../features/progress/progress.js";

export const licensePlateFileInput = document.getElementById('licensePlateInput');

export async function captureImageWithCamera() {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "camera";
    input.style.display = "none";

    input.addEventListener("change", () => {
      const file = input.files[0];
      if (!file) {
        reject(new Error("No image file captured"));
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      };

      img.onerror = (error) => {
        reject(error);
      };
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}

export async function scanLicensePlate() {
  startSpinner();

  try {
    // Erfassen Sie das Bild von der Kamera und konvertieren Sie es in die geeignete Form
    const imageData = await captureImageWithCamera();

    // Vorhersage der Kennzeichen-, Fahrzeugtyp- und Farbinformationen
    const [licensePlate, vehicleType, color] = predict(model, imageData);
    const vehiclestatus = "gescannt";

    // Verwenden Sie die erkannten Informationen für Ihre Anwendung
    getLocation(licensePlate, vehiclestatus);
  } catch (error) {
    console.error(error);
  } finally {
    stopSpinner();
  }
}


async function getImageFromInput(imageFile) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = URL.createObjectURL(imageFile);

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
}
