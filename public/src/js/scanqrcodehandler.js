import { scanQRCodeAndroid } from './scanqrcodeandroid.js';
import { scanQRCodeiOS } from './scanqrcodeios.js';
import { getLocation } from './positionandsave.js';

export async function scanQRCodeHandler() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  let qrCodeData;
  if (isIOS) {
    qrCodeData = await scanQRCodeiOS();
  } else {
    qrCodeData = await scanQRCodeAndroid();
  }
  processQRCode(qrCodeData);
}