// progress.js

let progressBarIsActive = false;
let progressInterval = null;

function toggleProgressBarVisibility() {
  const progressContainer = document.getElementById('progress-container');
  if (progressContainer) {
    if (progressBarIsActive) {
      progressContainer.style.display = 'block';
    } else {
      progressContainer.style.display = 'none';
    }
  }
}

function updateProgressBar(progress) {
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    if (progress === 100) {
      progressBarIsActive = false;
      toggleProgressBarVisibility();
    }
  }
}

function startProgress() {
  progressBarIsActive = true;
  toggleProgressBarVisibility();

  const progressBar = document.querySelector('#progress-container .progress-bar');
  progressBar.style.width = '0%';

  progressInterval = setInterval(() => {
    let width = parseFloat(progressBar.style.width);
    width += 0.1;
    if (width >= 100) {
      width = 100;
      clearInterval(progressInterval);
      progressInterval = null;
    }
    progressBar.style.width = width + '%';
  }, 10);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  progressBarIsActive = false;
  toggleProgressBarVisibility();
}

export { updateProgressBar, startProgress, stopProgress };
