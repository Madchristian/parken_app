export function extractLicensePlate(qrCodeText, vehiclestatus) {
  const licensePlateRegex = /Kennzeichen:\s*([A-ZÄÖÜ0-9]+[-]?[A-ZÄÖÜ0-9]*)/;
    const match = licensePlateRegex.exec(qrCodeText);
    if (match) {
      return match[1];
    } else {
      console.error('No license plate found in QR code text');
      return null;
    }
  }
  