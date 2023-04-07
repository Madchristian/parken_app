// progress.js

const spinnerContainer = document.getElementById("spinner-container");

export function startSpinner() {
  spinnerContainer.classList.remove("d-none"); // Anzeigen des Spinners
}

export function stopSpinner() {
  spinnerContainer.classList.add("d-none"); // Ausblenden des Spinners
}