function showClock(elementId, timestamp) {
    const element = document.getElementById(elementId);
  
    function updateTime() {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
  
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
      element.textContent = formattedTime;
    }
  
    updateTime();
    setInterval(updateTime, 1000);
  }
  