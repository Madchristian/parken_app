// parken.js
import { getLocation } from './positionandsave.js';
import { showSpinner, hideSpinner } from './progress.js';
import { scanQRCodeHandler} from './scanqrcodehandler.js';
import { processImage, scanLicensePlate } from './licensePlateScanner.js';

export {
  getLocation,
  showSpinner,
  hideSpinner,
  scanQRCodeHandler
};
function init() {
    document.getElementById('positionButton').addEventListener('click', async () => {
      try {
        await getLocation('');
      } catch (error) {
        console.error(error);
      }
    });
  
    document.getElementById('scanLicensePlateButton').addEventListener('click', () => {
        licensePlateFileInput.addEventListener('change', async () => {
          try {
            await scanLicensePlate(licensePlateFileInput);
          } catch (error) {
            console.error(error);
          }
        });
        licensePlateFileInput.click();
      });
      
  
    document.getElementById('scanQRCodeButton').addEventListener('click', async () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        try {
          await scanQRCodeHandler();
        } catch (error) {
          console.error(error);
        }
      } else {
        alert('This feature is only available on mobile devices.');
      }
      
    })
      
  }
  
  window.onload = init;
  