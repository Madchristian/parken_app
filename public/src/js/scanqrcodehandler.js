import { scanQRCodeAndroid } from './scanqrcodeandroid.js';
import { scanQRCodeiOS } from './scanqrcodeios.js';
import { getLocation } from './positionandsave.js';

export async function scanQRCodeHandler() {
  let cameraPermission = undefined;
  const isMobile = window.innerWidth < 2734;
  let qrCodeData;
  if (isMobile) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      qrCodeData = await scanQRCodeiOS();
    }
    } else {
      qrCodeData = await scanQRCodeAndroid();
    }
  processQRCode(qrCodeData);
}

export function processQRCode(qrCodeData) {
  const licensePlate = qrCodeData;
  getLocation(licensePlate);

  // Make the device vibrate
  if (navigator.vibrate) {
    navigator.vibrate(200); // Vibrate for 200 milliseconds
  }
}