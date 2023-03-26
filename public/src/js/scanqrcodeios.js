import { getLocation } from './positionandsave.js';
import { extractLicensePlate } from './extractLicensePlate.js';

document.addEventListener('DOMContentLoaded', () => {
  // Get the modal element
  const myModal = document.getElementById('qrScannerModal');

  // Add event listeners to handle the modal's show and hide events
  myModal.addEventListener('shown.bs.modal', () => {
    startScanning(myModal);
  });

  myModal.addEventListener('hidden.bs.modal', () => {
    stopScanning(myModal);
  });

  // Add event listener to handle the timeout
  myModal.addEventListener('scanner-timeout', () => {
    stopProgress();
    const modal = bootstrap.Modal.getInstance(myModal);
    modal.hide();
  });
});

let cameraPermission = undefined;
let stream = null;
let intervalId;
let timeoutId;

async function requestCameraPermission() {
  try {
    await window.navigator.mediaDevices.getUserMedia({ video: true });
    cameraPermission = true;
  } catch (error) {
    console.error(error);
    cameraPermission = false;
  }
}
let myModal; // Move the myModal variable outside of the function

function stopScanning(modal) {
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
    modal.querySelector('.modal-body').removeChild(video); // Remove the video element from the modal body
    video = null;
  }
}

myModal.addEventListener('hidden.bs.modal', () => {
  stopScanning(qrModalElement);
});


export async function scanQRCodeiOS() {
  const video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.style.width = '100%';
  video.style.height = '100%'; // Change this from 'auto' to '100%'
  video.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Set the background color to transparent

  const permissionStatus = await navigator.permissions.query({ name: 'camera' });
  if (permissionStatus.state === 'granted') {
    cameraPermission = true;
  } else if (permissionStatus.state === 'prompt') {
    await requestCameraPermission();
    if (!cameraPermission) {
      console.log("Camera permission denied");
      return;
    }
  }

  if (cameraPermission) {
    const qrModalElement = document.getElementById('qrScannerModal');
    const qrModalBodyElement = qrModalElement.querySelector('.modal-body');

    qrModalBodyElement.appendChild(video);

    myModal = new bootstrap.Modal(qrModalElement, {
      keyboard: false
    });
    
    myModal.show();

    qrModalElement.addEventListener('hidden.bs.modal', () => {
      stopScanning(myModal);
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
          if (code) {
            const licensePlate = extractLicensePlate(code.data);
            if (licensePlate) {
              getLocation(licensePlate);
              stopScanning();
            }
          }
        }
      }, 100);

      timeoutId = setTimeout(() => {
        stopScanning();
      }, 30000);
    } catch (error) {
      console.error(error);
      stopScanning(myModal);
    }
  } else {
    console.error('No camera permission');
  }
}

export default scanQRCodeiOS;
