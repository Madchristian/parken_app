// messages.js

export function showMessage(message, type = "success") {
  const messageElement = document.createElement("div");
  messageElement.classList.add("toast", "align-items-center", "text-white", "border-0");

  let iconClass = "";
  let toastClass = "";
  switch (type) {
    case "error":
      iconClass = "bi-exclamation-triangle-fill";
      toastClass = "bg-danger";
      break;
    case "info":
      iconClass = "bi-info-circle-fill";
      toastClass = "bg-primary";
      break;
    default:
      iconClass = "bi-check-circle-fill";
      toastClass = "bg-success";
  }

  messageElement.classList.add(toastClass);
  messageElement.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <i class="bi ${iconClass} me-2"></i>
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  // Add the message element to the page
  document.body.appendChild(messageElement);

  // Show the toast message
  const toast = new bootstrap.Toast(messageElement, { autohide: true });
  toast.show();
}
