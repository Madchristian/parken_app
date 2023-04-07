// Set the boundary of the area you want to display
const southWest = L.latLng(48.9, 2.2); // Lower left corner
const northEast = L.latLng(49.1, 2.4); // Upper right corner
const bounds = L.latLngBounds(southWest, northEast);

// Initialize the map and set its view
const map = L.map('map', {
    center: bounds.getCenter(),
    zoom: 12,
    maxBounds: bounds
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

// Fetch vehicle data from your API
fetch('/apiv3/search-vehicle') // Replace with the actual URL of your API
    .then(response => response.json())
    .then(data => {
        // Iterate over the vehicles and add them to the map
        data.data.forEach(vehicle => {
            const marker = L.marker([vehicle.latitude, vehicle.longitude]).addTo(map);
            marker.bindPopup(`<strong>${vehicle.licensePlate}</strong>`);
        });
    });
