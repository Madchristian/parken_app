async function handleMessage(supabase, message) {
    // Überprüfen, ob die Nachricht für die KI bestimmt ist
    if (message.text.startsWith('@my_ki_bot')) {
      // Entfernen Sie das "@my_ki_bot" aus der Nachricht
      const userQuery = message.text.replace('@my_ki_bot', '').trim();
  
      // Erkennen Sie das Kennzeichen oder die Auftragsnummer in der Benutzeranfrage
      const licensePlateOrOrderNumber = extractLicensePlateOrOrderNumber(userQuery);
  
      // Suchen Sie das Fahrzeug in der Datenbank
      const vehicle = await findVehicleByLicensePlateOrOrderNumber(supabase, licensePlateOrOrderNumber);
  
      // Generieren Sie die Antwort der KI
      let kiResponse;
      if (vehicle) {
        kiResponse = `Das Fahrzeug ${vehicle.license_plate} ist ${vehicle.status} und steht seit ${vehicle.timestamp} auf Position ${vehicle.location}.`;
      } else {
        kiResponse = `Es wurde kein Fahrzeug mit dem Kennzeichen oder der Auftragsnummer ${licensePlateOrOrderNumber} gefunden.`;
      }
  
      // Senden Sie die Antwort der KI an den Chatroom
      await supabase.from('messages').insert([
        {
          chatroom_id: message.chatroom_id,
          sender_id: 'my_ki_bot', // Verwenden Sie eine eindeutige Kennung für Ihren KI-Bot
          text: kiResponse,
        },
      ]);
    }
  }
  
  // Funktion zum Extrahieren des Kennzeichens oder der Auftragsnummer aus dem Benutzertext
  function extractLicensePlateOrOrderNumber(text) {
    // Hier können Sie die Logik zum Extrahieren von Kennzeichen oder Auftragsnummern implementieren
    // Zum Beispiel können Sie Reguläre Ausdrücke oder Natural Language Processing (NLP) verwenden
    // In diesem Beispiel geben wir einfach den gesamten Text zurück
    return text;
  }
  
  // Funktion zum Suchen eines Fahrzeugs in der Datenbank anhand des Kennzeichens oder der Auftragsnummer
  async function findVehicleByLicensePlateOrOrderNumber(supabase, licensePlateOrOrderNumber) {
    // Führen Sie eine Abfrage in der Fahrzeugtabelle durch, um das Fahrzeug basierend auf dem Kennzeichen oder der Auftragsnummer zu finden
    const { data, error } = await supabase
      .from('vehicles')
        .select('*')
        .eq('license_plate', licensePlateOrOrderNumber)
        .or('order_number', 'eq', licensePlateOrOrderNumber)
        .single();
  }