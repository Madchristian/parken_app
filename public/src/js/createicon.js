function getIconClass(vehiclestatus) {
    if (vehiclestatus === 'Mech') {
      return 'fa-solid fa-wrench wrench-icon';
    } else if (vehiclestatus === 'Wash') {
      return 'fa-solid fa-square-parking parking-icon';
    } else if (vehiclestatus === 'Check') {
      return 'fa-solid fa-list-check checked-icon';
    }
    return 'fa-solid fa-square-parking parking-icon';
  }
  
  
  function getDigitalClock(timestamp) {
    const date = new Date(Date.UTC(
      timestamp.substr(0, 4),  // Jahr
      timestamp.substr(5, 2) - 1,  // Monat (ACHTUNG: 0-basiert!)
      timestamp.substr(8, 2),  // Tag
      timestamp.substr(11, 2),  // Stunde
      timestamp.substr(14, 2),  // Minute
      timestamp.substr(17, 2)  // Sekunde
    ));
  
    const localTimeString = date.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' }).split(' ')[1].split(':');
  
    return `
      <div class="digital-clock">
        <div class="hours">${localTimeString[0]}</div>
        <div class="separator">--</div>
        <div class="minutes">${localTimeString[1]}</div>
      </div>
    `;
  }
  

export function createIcon(vehiclestatus, licensePlate, timestamp, id) {
    const iconClass = getIconClass(vehiclestatus);
    const clock = getDigitalClock(timestamp);
  
    return L.divIcon({
      className: 'license-plate-icon',
      html: `
    <style>
      .wrench-icon {
        color: orange;
      }
      .parking-icon {
        color: blue;
        margin-top: -15px;
      }
      .checked-icon {
        color: red;
        margin-top: 15px;
      }
      .btn-delete-container {
        position: relative;
      }
      .btn-delete {
        position: absolute;
        right: -22px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 24px;
        opacity: 1;
        background: transparent;
        border: none;
      }
      .fa-square-check {
        font-size: 24px;
        color: green;
      }
      .digital-clock {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        font-size: 8px;
        line-height: 1;
      }
      .hours,
      .separator,
      .minutes {
        display: block;
        margin: -4px;
        padding: 2px;
      }
      .license-plate-icon {
        display: flex;
        align-items: center;
        height: 10px;
      }
      
      .license-plate-icon span {
        margin: 0;
        line-height: 10px;
      }
      
    </style>
    <div class="license-plate-icon">
      <i class="${iconClass}"></i>
      <div class="btn-delete-container" style="display: inline-block; background-color: white; color: black; border: 1px solid black; padding: 2px 4px; font-size: 14px; font-weight: bold; border-radius: 3px; white-space: nowrap;">
        ${clock}${licensePlate}
        <button id="delete-${id}" class="btn-delete" aria-label="Close">
          <i class="fa-solid fa-square-check"></i>
        </button>
      </div>
    </div>
      `
    });
  }