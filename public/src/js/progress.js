// progress.js

export function showSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'spinner';
    spinner.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    document.body.appendChild(spinner);
    }
    
export function hideSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
    spinner.remove();
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