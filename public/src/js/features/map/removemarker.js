// features.map.removemarker.js
export async function deleteParkedCar(id, locationName, map, markers) {
  try {
    const confirmDelete = confirm("Fahrzeug abgeholt?");
    if (!confirmDelete) {
      return;
    }
    const response = await fetch(
      `/apiv3/delete-vehicle?id=${id}&locationName=${locationName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Remove the marker from the map
    removeMarker(markers, id, map);
   

    
  } catch (error) {
    console.error("Error deleting parked car:", error);
    alert("Error deleting parked car");
  }
}
function removeMarker(markers, markerId, map) {
    if (markers.has(markerId)) {
      const marker = markers.get(markerId);
      marker.removeFrom(map);
      markers.delete(markerId);
      console.log(`Removed marker with ID ${markerId}`);
    } else {
      console.warn(`No marker found with ID ${markerId}`);
    }
  }
  