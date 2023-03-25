$(document).ready(function() {
    var selectedCellIndex = -1; // Initialisierung der ausgewählten Zelle
  
    $(".grid-item").click(function() {
      // Entfernen der Hervorhebung aus allen Grid-Elementen
      $(".grid-item").removeClass("selected");
  
      // Hinzufügen der Hervorhebung zum ausgewählten Grid-Element
      $(this).addClass("selected");
  
      // Speichern des Index der ausgewählten Zelle in der Variablen
      selectedCellIndex = $(this).data("index");
    });
  
    // Beispiel für die Verwendung der ausgewählten Zelle
    $("#btn-save").click(function() {
      if (selectedCellIndex != -1) {
        alert("Ausgewählte Zelle: " + selectedCellIndex);
      } else {
        alert("Bitte eine Zelle auswählen.");
      }
    });
  });
  