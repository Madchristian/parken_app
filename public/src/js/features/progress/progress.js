// progress.js

const spinnerContainer = document.getElementById("spinner-container");

export function startSpinner() {
  const spinnerContainer = document.getElementById('spinner-container');
  spinnerContainer.classList.remove('hidden');
}

export function stopSpinner() {
  const spinnerContainer = document.getElementById('spinner-container');
  spinnerContainer.classList.add('hidden');
}
