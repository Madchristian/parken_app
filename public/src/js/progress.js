// progress.js
// Definieren Sie eine Variable, um die Progressbar-Status zu speichern
let progressBarIsActive = false;

// Funktion, um das 'hidden' Attribut hinzuzufügen oder zu entfernen
export function toggleProgressBarVisibility() {
  const progressContainer = document.getElementById('progress-container');
  if (progressContainer) {
    if (progressBarIsActive) {
      progressContainer.removeAttribute('hidden');
    } else {
      progressContainer.setAttribute('hidden', true);
    }
  }
}

// Funktion, um den Fortschrittsbalken zu aktualisieren
export function updateProgressBar(progress) {
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    if (progress === 100) {
      // Wenn der Fortschrittsbalken 100 erreicht, setzen Sie den Fortschrittsstatus auf inaktiv
      progressBarIsActive = false;
      toggleProgressBarVisibility();
    }
  }
}
export function showProgressBar() {
  const progressContainer = document.createElement('div');
  progressContainer.classList.add('progress-container');
  progressContainer.innerHTML = `
    <div class="progress">
      <div class="progress-bar" role="progressbar"></div>
    </div>
  `;
  document.body.appendChild(progressContainer);
}

export function hideProgressBar() {
  const progressContainer = document.querySelector('.progress-container');
  if (progressContainer) {
    progressContainer.remove();
  }
}

// Beispielcode, um die Progressbar zu aktualisieren
// Aktivieren Sie die Progressbar
progressBarIsActive = true;
toggleProgressBarVisibility();
updateProgressBar(50); // aktualisieren Sie den Fortschrittsbalken auf 50%
