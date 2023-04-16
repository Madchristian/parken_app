// mapUtils.js
export function searchForLicensePlate(map, licensePlate, markerGroup) {
    const marker = markerGroup
      .getLayers()
      .find((marker) => marker.options.licensePlate === licensePlate);
  
    if (marker) {
      map.setView(marker.getLatLng(), 19);
    } else {
      alert("Kennzeichen nicht gefunden");
    }
  }
  
