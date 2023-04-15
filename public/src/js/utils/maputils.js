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
  
  export function removeMarker(markers, markerId, map) {
    if (markers.has(markerId)) {
      const marker = markers.get(markerId);
      marker.removeFrom(map);
      markers.delete(markerId);
      console.log(`Removed marker with ID ${markerId}`);
    } else {
      console.warn(`No marker found with ID ${markerId}`);
    }
  }
  