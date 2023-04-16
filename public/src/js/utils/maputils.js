// maputils.js

export let currentZIndex = 1000;

export function searchForLicensePlate(map, licensePlate, markerGroup) {
  const marker = markerGroup
    .getLayers()
    .find((marker) => marker.options.licensePlate === licensePlate);

  if (marker) {
    // Erstellen Sie eine Animation, die auf den Marker zoomt
    const zoomDuration = 2.5; // Dauer der Animation in Sekunden
    map.flyTo(marker.getLatLng(), 19, { duration: zoomDuration });

    setTimeout(() => {
      currentZIndex += 1;
      marker.setZIndexOffset(currentZIndex);
    }, zoomDuration * 1000); // Aktualisieren Sie den Z-Index nach der Animation
  } else {
    alert("Kennzeichen nicht gefunden");
  }
}
