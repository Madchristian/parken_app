import { getLocation } from "../../features/location/positionandsave.js";
import { startSpinner, stopSpinner } from "../../features/progress/progress.js";

export const licensePlateFileInput =
  document.getElementById("licensePlateInput");

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

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Skalieren Sie die Bilder auf die gewünschte Größe
        const targetWidth = 224;
        const targetHeight = 224;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Laden Sie das Beispielbild
        const exampleImage = new Image();
        exampleImage.src = "images/sample.png";
        exampleImage.onload = () => {
          // Zeichnen Sie das transparente Beispielbild auf den Canvas
          ctx.globalAlpha = 0.2; // 20% Transparenz
          ctx.drawImage(exampleImage, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1.0; // Setzen Sie die Transparenz zurück auf 100%

          // Zeichnen Sie das aufgenommene Bild auf den Canvas
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          document.body.removeChild(input);
          resolve(imageData);
        };

        exampleImage.onerror = (error) => {
          console.error("Error loading example image:", error);
          reject(error);
        };
      };
    });

    document.body.appendChild(input);
    input.click();
  });
}

// After capturing the image with the camera, display the input form
export async function scanLicensePlate() {
  startSpinner();

  try {
    // Capture the image from the camera and convert it into the appropriate form
    const imageData = await captureImageWithCamera();

    // Show the input form for user to enter vehicle information
    document.getElementById("inputForm").style.display = "block";

    // Listen for submit button click
    document.getElementById("submitButton").addEventListener("click", () => {
      // Get the user input values
      const licensePlate = document.getElementById("licensePlate").value;
      const vehicleType = document.getElementById("vehicleType").value;
      const color = document.getElementById("color").value;

      // Call the function to train the model with the image and user input values
      trainModel(imageData, licensePlate, vehicleType, color);
    });
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
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

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
