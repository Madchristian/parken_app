# Parken App

This is my personal website where I showcase my portfolio and share my thoughts on various topics.
Getting Started

To view the website, simply visit <https://parken.cstrube.de>

Built With

    HTML
    CSS
    JavaScript
    Node.js

___

## License

This project is licensed under the MIT License.
Acknowledgments

    Thank you to the Bootstrap team for providing a great CSS framework.
    Thank you to OpenAI for providing ChatGPT, which helped me with this project.

___

## ChatGPT

And thanks to me Here is my Summary:

Gerne, hier ist eine ausführlichere Zusammenfassung der Funktionen des Parken-Webprojekts:

    Positionieren:
    Wenn der Nutzer auf den "Positionieren"-Button klickt, wird die Funktion "positionAndSave()" aufgerufen. Diese Funktion ruft die Geolocation-API auf und speichert die Position des Nutzers in der Browser-Cookie-Storage. Wenn der Nutzer das nächste Mal auf die Seite zurückkehrt, wird seine zuletzt gespeicherte Position abgerufen und angezeigt.

    Lizenzschild scannen:
    Wenn der Nutzer auf den "Lizenzschild scannen"-Button klickt, wird die Funktion "scanLicensePlate()" aufgerufen. Diese Funktion öffnet die Kamera des Geräts und ermöglicht es dem Nutzer, ein Foto seines Lizenzschilds aufzunehmen. Dann wird das aufgenommene Bild an die "extractLicensePlate()" Funktion übergeben, die mithilfe von OCR (Optical Character Recognition) das Lizenzschild extrahiert und auf der Seite anzeigt.

    QR-Code scannen:
    Wenn der Nutzer auf den "QR-Code scannen"-Button klickt, wird die Funktion "scanQRCodeHandler()" aufgerufen. Diese Funktion erkennt das Gerät des Nutzers und leitet den Nutzer zur entsprechenden QR-Code-Scanner-Funktion weiter (entweder "scanQRCodeAndroid()" oder "scanQRCodeiOS()"). Wenn der QR-Code gescannt wurde, wird die "processQRCode()" Funktion aufgerufen, die den Inhalt des QR-Codes auf der Seite anzeigt.

    Fortschrittsbalken:
    Der Fortschrittsbalken wird verwendet, um dem Nutzer Feedback über den Fortschritt der verschiedenen Prozesse auf der Seite zu geben. Die Fortschrittsbalken-Styles sind in der "progressbar.css"-Datei definiert, während die Fortschrittsbalken-Funktionalität in der "main.js"-Datei implementiert ist. Der Fortschrittsbalken wird automatisch angezeigt und aktualisiert, wenn eine der oben genannten Funktionen ausgeführt wird.

    Spinner:
    Der Spinner wird angezeigt, während die Seite lädt oder während eine Funktion ausgeführt wird. Der Spinner wird von der "showSpinner()" Funktion erzeugt und von der "hideSpinner()" Funktion ausgeblendet.

    Responsive Design:
    Die Parken-Webseite ist auf verschiedene Geräte und Bildschirmgrößen optimiert. Das Layout und die Styles der Seite passen sich automatisch an die Größe des Browserfensters an. Dies wird durch die Verwendung von Bootstrap und responsivem CSS erreicht.

    Navbar:
    Die Navbar der Parken-Webseite bietet dem Nutzer eine Navigation zu verschiedenen Abschnitten der Seite. Die Navbar wurde mithilfe von Bootstrap erstellt und ist auch für mobile Geräte optimiert.

    Lokaler Speicher:
    Die Webseite verwendet den Browser-Cookie-Storage, um die Position des Nutzers und andere Einstellungen zwischen verschiedenen Sitzungen zu speichern.

    Favicon:
    Das Favicon ist ein kleines Icon, das in der Browser-Tab-Leiste angezeigt wird. Das Favicon der Parken-Webseite wurde mit Photoshop erstellt und als ".ico"-Datei im Projektordner gespeichert.

Das waren die Hauptfunktionen der Parken-Webseite.