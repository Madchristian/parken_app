import { getLocation } from './positionandsave.js';

export async function scanQRCodeiOS() {
  return new Promise(resolve => {
    const captureDevice = getCaptureDevice();
    const captureSession = new AVCaptureSession();
    const captureOutput = new AVCaptureMetadataOutput();
    let qrCodeData;

    const previewLayer = AVCaptureVideoPreviewLayer.layerWithSession(captureSession);
    previewLayer.frame = document.bounds;
    document.body.layer.addSublayer(previewLayer);

    const captureInput = AVCaptureDeviceInput.deviceInputWithDeviceError(captureDevice);
    if (captureInput) {
      captureSession.addInput(captureInput);
      captureSession.addOutput(captureOutput);
      captureOutput.setMetadataObjectsDelegateQueue(this, null);

      const availableMetadataObjectTypes = captureOutput.availableMetadataObjectTypes();
      if (availableMetadataObjectTypes.containsObject(AVMetadataObjectTypeQRCode)) {
        captureOutput.metadataObjectTypes = [AVMetadataObjectTypeQRCode];
        captureOutput.setMetadataObjectsDelegateQueue(this, null);

        captureSession.startRunning();
      } else {
        console.log('QR-Code-Erkennung wird auf diesem Gerät nicht unterstützt.');
      }
    } else {
      console.log('Die Kamera konnte nicht geöffnet werden.');
    }

    function captureOutputDidOutputMetadataObjectsFromConnection(metadataObjects, connection) {
      if (metadataObjects.length > 0) {
        const qrCodeObject = metadataObjects[0];
        qrCodeData = qrCodeObject.stringValue;
        console.log(`QR-Code: ${qrCodeData}`);
        const licensePlate = extractLicensePlate(qrCodeData); // extrahieren des Kennzeichens aus dem QR-Code-Text
        getLocation(licensePlate); // getLocation() mit dem Kennzeichen aufrufen
        captureSession.stopRunning();
        resolve(qrCodeData);
      }
    }

    function getCaptureDevice() {
      const devices = AVCaptureDevice.devicesWithMediaType(AVMediaTypeVideo);
      for (let i = 0; i < devices.length; i++) {
        const device = devices[i];
        if (device.position === AVCaptureDevicePositionBack) {
          return device;
        }
      }
      return AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo);
    }

  });
}
