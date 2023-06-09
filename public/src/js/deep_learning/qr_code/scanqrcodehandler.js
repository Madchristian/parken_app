import { scanQRCodeAndroid } from './scanqrcodeandroid.js';
import { scanQRCodeiOS } from './scanqrcodeios.js';
import { getLocation } from '../../features/location/positionandsave.js';

export async function scanQRCodeHandler(vehiclestatus) {
  const isMobile = window.innerWidth < 2734;
  let qrCodeData;
  if (isMobile) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      qrCodeData = await scanQRCodeiOS(vehiclestatus);
    } else {
      qrCodeData = await scanQRCodeAndroid(vehiclestatus);
    }
  }
}

export function processQRCode(qrCodeData, vehiclestatus) {
  // Verarbeite das erkannte QRCode-Daten hier, z.B. extrahiere das Kfz-Kennzeichen
  const licensePlate = qrCodeData; // The QR code data is directly assigned to the licensePlate variable
  getLocation(licensePlate, vehiclestatus); // Rufe die getLocation-Funktion mit dem Kfz-Kennzeichen auf
// Make the device vibrate

  if (navigator.vibrate) {
  navigator.vibrate(200); // Vibrate for 200 milliseconds
}
}
