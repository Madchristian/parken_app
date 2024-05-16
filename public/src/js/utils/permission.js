// permission.js

// Check if camera permission has been granted
if (navigator.permissions && navigator.permissions.query) {
  navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
    if (permissionStatus.state === "granted") {
      localStorage.setItem("cameraPermission", "granted");
    }
  });
} else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      localStorage.setItem("cameraPermission", "granted");
      stream.getTracks().forEach((track) => track.stop());
    })
    .catch((error) => console.error(error));

  // Check if location permission has been granted
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem("locationPermission", "granted");
      },
      (error) => {
        console.log(error);
      }
    );
  }
} else {
  console.log("Web Storage API not supported.");
}
