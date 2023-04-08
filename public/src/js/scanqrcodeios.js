import { getLocation } from "./positionandsave.js";

let cameraPermission = undefined;
let stream = null;
let intervalId;
let timeoutId;
let video;

async function requestCameraPermission() {
  try {
    await window.navigator.mediaDevices.getUserMedia({ video: true });
    cameraPermission = true;
  } catch (error) {
    console.error(error);
    cameraPermission = false;
  }
}

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

export async function scanQRCodeiOS() {
  video = document.createElement('video');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.style.width = '100%';
  video.style.height = '90%'; // Change this from 'auto' to '100%'
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
          if (code) {
            const qrCodeData = code.data.toString();
            if (qrCodeData.trim() !== '') { // Check if the QR code data is not empty
              if (navigator.vibrate) {
                navigator.vibrate(200); // Vibrate for 200 milliseconds
              }
              const licensePlate = qrCodeData; 
              stopScanning();
              getLocation(licensePlate);
            
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

export default scanQRCodeiOS;
