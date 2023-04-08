// cookies.js
// Funktion zum Abfragen der Cookie-Zustimmung
export async function askForCookieConsent() {
    const consent = getCookie('cookieConsent');
    if (consent === null) {
      // Cookie-Modal anzeigen
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div class="modal fade" tabindex="-1" role="dialog" id="cookieModal" aria-labelledby="cookieModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="cookieModalLabel">Cookie-Einwilligung</h5>
                  <span aria-hidden="true">&times;</span>
              </div>
              <div class="modal-body">
                <p>Diese Webseite verwendet Cookies um die Entscheidung der Erlaubnis für Kamera und Position zu speichern.</p>
                <p>Bitte stimmen Sie der Verwendung von Cookies zu, um die Funktionen dieser Webseite nutzen zu können.</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Nein</button>
                <button type="button" class="btn btn-primary" id="cookieConsentYes">Ja</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
  
      // Cookie-Modal anzeigen
      $('#cookieModal').modal('show');
  
      // Event-Listener für "Ja"-Button hinzufügen
      document.getElementById('cookieConsentYes').addEventListener('click', () => {
        setCookie('cookieConsent', 'true', 365);
        $('#cookieModal').modal('hide');
      });
  
      // Event-Listener für das Schließen des Modals hinzufügen
      $('#cookieModal').on('hidden.bs.modal', () => {
        // Wenn das Modal geschlossen wird, aber die Zustimmung noch nicht erteilt wurde, setzen wir sie auf "Nein"
        if (getCookie('cookieConsent') === null) {
          setCookie('cookieConsent', 'false', 365);
        }
      });
    }
  }

  export function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const cookieOptions = { expires: expires.toUTCString(), path: '/', SameSite: 'None', secure: true };
    document.cookie = `${name}=${value}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`;
  }
  
  
  export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }
  