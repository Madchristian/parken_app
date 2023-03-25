import { getLocation } from './positionandsave.js';
import { extractLicensePlate } from './extractLicensePlate.js';

export async function scanQRCodeAndroid() {
  const constraints = {
    audio: false,
    video: { facingMode: { exact: "environment" } }
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const video = document.createElement('video');
    video.srcObject = stream;
    document.body.appendChild(video);

    const codeReader = new ZXing.BrowserQRCodeReader();
    const result = await codeReader.decodeFromVideoElement(video);

    video.srcObject.getTracks().forEach(track => track.stop());
    document.body.removeChild(video);

    const licensePlate = extractLicensePlate(result.text); // extract license plate from QR code text
    if (licensePlate) {
      getLocation(licensePlate); // call getLocation() function with license plate
    }

    return result.text;
  } catch (error) {
    console.error(error);
  }
}
