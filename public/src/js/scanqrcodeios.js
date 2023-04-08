import { processQRCode } from './scanqrcodehandler.js';

let stream = null;
let intervalId;
let timeoutId;
let video;

function stopScanning() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  if (video) {
    const qrModalElement = document.getElementById('qrScannerModal');
    const qrModalBodyElement = qrModalElement.querySelector('.modal-body');
    qrModalBodyElement.removeChild(video); // Remove the video element from the modal body
    video = null;
  }
  const qrModal = bootstrap.Modal.getInstance(document.getElementById('qrScannerModal'));
  if (qrModal) {
    qrModal.hide();
  }
}

async function scanQRCodeiOS() {
  video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.style.width = '100%';
  video.style.height = '100%'; // Change this from 'auto' to '100%'
  video.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Set the background color to transparent

  let cameraPermission = getCookie('cameraPermission'); // Check if camera permission is granted in cookie

  if (cameraPermission) {
    const qrModalElement = document.getElementById('qrScannerModal');
    const qrModalBodyElement = qrModalElement.querySelector('.modal-body');

    qrModalBodyElement.appendChild(video);

    const myModal = new bootstrap.Modal(qrModalElement, {
      keyboard: false
    });

    myModal.show();

    qrModalElement.addEventListener('hidden.bs.modal', () => {
      stopScanning();
    });

    const canvasElement = document.createElement('canvas');
    canvasElement.style.display = 'none';
    document.body.appendChild(canvasElement);

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } });
      video.srcObject = stream;
      await video.play();

      intervalId = setInterval(() => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const canvasContext = canvasElement.getContext('2d');
          canvasElement.width = video.videoWidth;
          canvasElement.height = video.videoHeight;
          canvasContext.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
          const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) { // Check if code.data is not empty
            const qrCodeData = code.data.toString();
            if (qrCodeData.match(/^([A-Z]{1,3}-[A-Z0-9]{1,2}\d{1,4}[A-Z]{0,2})$/)) {
              processQRCode(qrCodeData);
              stopScanning();
                // Make the device vibrate
              if (navigator.vibrate) {
              navigator.vibrate(200); // Vibrate for 200 milliseconds
  }
            }
          }
        }
      }, 100);

      timeoutId = setTimeout(() => {
        stopScanning();
      }, 30000);
    } catch (error) {
      console.error(error);
      stopScanning();
    }
  } else {
    console.error('No camera permission');
  }
}

export { scanQRCodeiOS };
