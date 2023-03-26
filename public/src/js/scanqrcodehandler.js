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

function processQRCode(qrCodeData) {
  // Verarbeite das erkannte QRCode-Daten hier, z.B. extrahiere das Kfz-Kennzeichen
  const licensePlate = qrCodeData; // Ersetzen Sie dies durch die tatsächliche Verarbeitung der QR-Codedaten
  getLocation(licensePlate); // Rufe die getLocation-Funktion mit dem Kfz-Kennzeichen auf
}