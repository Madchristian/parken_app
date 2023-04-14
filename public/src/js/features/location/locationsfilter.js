// locationsfilter.js
import { markerGroup } from "/src/js/core/parkplatz.js";

async function fetchLocations() {
  try {
    const response = await fetch("/apiv3/get-collection-names");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const locations = await response.json();
    populateLocationDropdown(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
}

function populateLocationDropdown(locations) {
  const dropdownMenu = document.getElementById("locationDropdown");

  locations.forEach((location) => {
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.className = "dropdown-item";
    link.href = "#";
    link.textContent = location.name;
    link.addEventListener("click", () => {
      showMarkersByCollection(location.collectionName);
    });
    listItem.appendChild(link);
    dropdownMenu.appendChild(listItem);
  });
}

function showMarkersByCollection(collectionName) {
  markerGroup.eachLayer((marker) => {
    if (marker.options.collectionName === collectionName) {
      marker.addTo(map);
    } else {
      marker.removeFrom(map);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchLocations();
});
