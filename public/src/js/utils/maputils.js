// maputils.js

export let currentZIndex = 1000;

export async function searchForLicensePlate(map, markerGroup, licensePlate) {
  if (!licensePlate) {
    return;
  }

  // Loop through each marker in the markerGroup
  let found = false;
  markerGroup.eachLayer((marker) => {
    if (marker.options.licensePlate.toLowerCase() === licensePlate.toLowerCase()) {
      found = true;
      map.setView(marker.getLatLng(), 18);
      marker.openPopup();
    }
  });

  if (!found) {
    alert("License plate not found");
  }
}
