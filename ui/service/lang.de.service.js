angular.module('kityminderEditor')
.service('lang.de', function() {
return {

'de':

{

'template':

{

'default':

'Mind Map',

'tianpan':

'Tianpan Karte',

'structure':

'Organigramm',

'filetree':

'Verzeichnis-Organigramm',

'right':

'Logisches Strukturdiagramm',

'fish-bone':

'Fischknochenfigur'
},

'theme':

{

'classic':

'Der Mind Map-Klassiker',

'classic-compact':

'Kompakter Klassiker',

'snow':

'sanftes kaltes Licht',

'snow-compact':

'Kompaktes Kaltlicht',

'fish':

'Fischknochenkarte',

'wire':

'Drahtgitter'

'fresh-red':

'Frisches Rot',

'fresh-soil':

'Boden gelb',

'fresh-green':

'Literarisches Grün',

'fresh-blue':

'Himmelblau',

'fresh-purple':

'Romantisches Lila',

'fresh-pink':

'Gehirnpulver',

'fresh-red-compat':

'Kompakt rot',

'fresh-soil-compat':

'Kompakt gelb',

'fresh-green-compat':

'Kompaktgrün',

'fresh-blue-compat':

'Kompakt blau',

'fresh-purple-compat':

'Kompaktes Lila',

'fresh-pink-compat':

'Kompaktes Pulver',

'tianpan':

'Klassisches Zifferblatt',

'tianpan-compact':

'Kompakter Tag'
},

'maintopic':

'Zentrierthema',

'topic':

'Branchenthema',

'panels':

{

'history':

'Geschichte',

'template':

'Vorlage',

'theme':

'Haut',

'layout':

'Layout',

'style':

'Stil',

'font':

'Text',

'color':

'Farbe',

'background':

'Hintergrund',

'insert':

'Einfügen',

'arrange':

'Anpassung',

'nodeop':

'aktuell',

'priority':

'Priorität',

'progress':

'Fortschritt',

'resource':

'Ressourcen',

'note':

'Bemerkungen',

'attachment':

'Anlage',

'word':

'Text'
},

'error_message':

{

'title':

'Oh, die Mind Map ist falsch',

'err_load':

'Laden der Mind Map fehlgeschlagen',

'err_save':

'Save Mind Map failed',

'err_network':

'Netzwerkfehler',

'err_doc_resolve':

'Dokumentanalyse fehlgeschlagen',

'err_unknown':

'Ein seltsamer Fehler ist aufgetreten',

'err_localfile_read':

'Datei Lesefehler',

'err_download':

'Dateidownload fehlgeschlagen',

'err_remove_share':

'Abbrechen der Freigabe fehlgeschlagen',

'err_create_share':

'Misserfolg',

'err_mkdir':

'Verzeichniserstellung fehlgeschlagen',

'err_ls':

'Verzeichnis lesen fehlgeschlagen',

'err_share_data':

'Fehler beim Laden freigegebener Inhalte',

'err_share_sync_fail':

'Content-Synchronisierung fehlgeschlagen',

'err_move_file':

'Dateiverschiebung fehlgeschlagen',

'err_rename':

'Umbenennen fehlgeschlagen',


'unknownreason':

'Vielleicht haben Aliens den Code gefälscht ...',

'pcs_code':

{
3:
'Diese Schnittstelle wird nicht unterstützt',
4:
'Es gibt keine Erlaubnis, diese Operation durchzuführen',
5:
'IP ist nicht autorisiert',
110:
'Benutzersitzung ist abgelaufen, bitte loggen Sie sich erneut ein',
31001:
'Datenbankabfragefehler',
31002:
'Datenbankverbindungsfehler',
31003:
'Die Datenbank gibt ein leeres Ergebnis zurück',
31021:
'Netzwerkfehler',
31022:
'Verbindung zum Server kann nicht vorübergehend hergestellt werden',
31023:
'Eingabeparameterfehler',
31024:
'App-ID ist leer',
31025:
'Backend-Speicherfehler',
31041:
'Benutzer-Cookie ist kein legaler Baidu-Cookie',
31042:
'Benutzer ist nicht eingeloggt',
31043:
'Benutzer ist nicht aktiviert',
31044:
'Benutzer ist nicht berechtigt',
31045:
'Benutzer existiert nicht',
31046:
'Benutzer existiert bereits',
31061:
'Die Datei existiert bereits',
31062:
'Der Dateiname ist illegal',
31063:
'Das übergeordnete Dateiverzeichnis existiert nicht',
31064:
'Kein Zugriff auf diese Datei',
31065:
'Das Verzeichnis ist voll',
31066:
'Die Datei existiert nicht',
31067:
'Dateiverarbeitungsfehler',
31068:
'Dateierstellung fehlgeschlagen',
31069:
'Dateikopie fehlgeschlagen',
31070:
'Dateilöschung fehlgeschlagen',
31071:
'Datei-Meta-Informationen können nicht gelesen werden',
31072:
'Dateibewegung fehlgeschlagen',
31073:
'Datei umbenennen fehlgeschlagen',
31079:
'Datei MD5 wurde nicht gefunden, bitte verwenden Sie die Upload-API, um die gesamte Datei hochzuladen.',
31081:
'Superfile Erstellung fehlgeschlagen',
31082:
'Die Liste der untersten Blöcke ist leer',
31083:
'Superfile-Update fehlgeschlagen',
31101:
'Tag System interner Fehler',
31102:
'Tag Parameter Fehler',
31103:
'Tag Systemfehler',
31110:
'Nicht autorisiert, dieses Verzeichniskontingent festzulegen',
31111:
'Kontingentverwaltung unterstützt nur zwei Ebenen von Verzeichnissen',
31112:
'Out of Quote',
31113:
'Das Kontingent darf die Quote der Katalog-Vorfahren nicht überschreiten',
31114:
'Kontingente dürfen nicht kleiner sein als Unterverzeichniskontingente'
31141:
'Miniaturansicht-Service fehlgeschlagen',
31201:
'Signaturfehler',
31202:
'Die Datei existiert nicht',
31203:
'Einstellung acl ist fehlgeschlagen',
31204:
'Anfrage acl Verifizierung fehlgeschlagen',
31205:
'Get acl fehlgeschlagen',
31206:
'acl existiert nicht',
31207:
'Bucket existiert bereits',
31208:
'Benutzeranforderungsfehler',
31209:
'Serverfehler',
31210:
'Server unterstützt nicht',
31211:
'Kein Zugang',
31212:
'Service nicht verfügbar',
31213:
'Wiederholungsfehler',
31214:
'Dateidaten hochladen fehlgeschlagen',
31215:
'Upload Datei Meta fehlgeschlagen',
31216:
'Herunterladen von Dateidaten fehlgeschlagen',
31217:
'Download Datei Meta fehlgeschlagen',
31218:
'Kapazität überschreitet das Limit',
31219:
'Die Anzahl der Anfragen überschreitet das Limit',
31220:
'Flow überschreitet das Limit',
31298:
'Der Server hat einen Wert zurückgegeben, der KEY ist ungültig',
31299:
'Server Rückgabewert KEY existiert nicht'
}
},

'ui':

{

'shared_file_title':

'[geteilt] {0} (nur lesen)',

'load_share_for_edit':

'Laden freigegebener Dateien ...',

'share_sync_success':

'Freigegebener Inhalt wurde synchronisiert',

'recycle_clear_confirm':

'Sind Sie sicher, den Papierkorb zu leeren? Die geleerte Datei kann nicht wiederhergestellt werden. ',


'fullscreen_exit_hint':

'Drücken Sie Esc oder F11, um den Vollbildmodus zu beenden',

'error_detail':

'Details',

'copy_and_feedback':

'Kopieren und Feedback',

'move_file_confirm':

'Verschieben Sie '{0}' in '{1}'? ',

'rename':

'umbenennen',

'rename_success':

'{0} erfolgreich umbenannt',

'move_success':

'{0} wurde erfolgreich nach {1} verschoben',


'command':

{

'exportPNG':

'Export als PNG-Bild',

'exportSVG':

'Nach SVG-Bild exportieren',

'appendsiblingnode':

'Das gleiche Thema einfügen',

'appendparentnode':

'Überlegenes Thema einfügen',

'appendchildnode':

'Untergeordnetes Thema einfügen',

'removenode':

'Löschen',

'editnode':

'Bearbeiten',

'arrangeup':

'Aufwärts',

'arrangedown':

'Unten',

'resetlayout':

'Layout organisieren',

'expandtoleaf':

'Alle Knoten erweitern',

'expandtolevel1':

'Erweitern auf Level 1 Knoten',

'expandtolevel2':

'Erweitern zum sekundären Knoten',

'expandtolevel3':

'Erweitern zu einem Knoten der dritten Ebene',

'expandtolevel4':

'Erweitern zu einem vierstufigen Knoten',

'expandtolevel5':

'Erweitern zu einem fünfstufigen Knoten',

'expandtolevel6':

'Erweitern zu einem sechsstufigen Knoten',

'fullscreen':

'Vollbild',

'outline':

'Gliederung'
},

'search':'suchen',

'export':

'exportieren',


'expandtoleaf':

'Erweitern',


'back':

'Zurück',


'undo':

'Rückgängig (Strg + Z)',

'redo':

'Wiederholen (Strg + Y)',


'tabs':

{

'file':

'Datei',

'idea':

'Gedanken',

'appearence':

'Aussehen',

'view':

'Ansicht'
},


'quickvisit':

{

'new':

'Neu (Strg + Alt + N)',

'save':

'Speichern (Strg + S)',

'share':

'Teilen (Strg + Alt + S)',

'feedback':

'Rückmeldungsfrage (F1)',

'editshare':

'Bearbeiten'
},


'menu':

{


'mainmenutext':

'Baidu Mind Map', // Hauptmenübutton Text


'newtab':

'Neu',

'opentab':

'Offen',

'savetab':

'Speichern',

'sharetab':

'Teilen',

'preferencetab':

'Einstellungen',

'helptab':

'Hilfe',

'feedbacktab':

'Feedback',

'recenttab':

'Kürzlich verwendet',

'netdisktab':

'Baidu Cloud Speicher',

'localtab':

'lokale Datei',

'drafttab':

'Entwurfsbox',

'downloadtab':

'Exportieren nach lokal',

'createsharetab':

'aktuelle Mind Map',

'managesharetab':

'Geteilt',


'newheader':

'Neue Mind Map',

'openheader':

'Öffnen',

'saveheader':

'Speichern in',

'draftheader':

'Entwurfsbox',

'shareheader':

'Teilen Sie meine Gehirnkarte',

'downloadheader':

'Export in das angegebene Format',

'preferenceheader':

'Präferenzen',

'helpheader':

'Hilfe':

'feedbackheader':

'Feedback'
},


'mydocument':

'Meine Dokumente',

'emptydir':

'Das Verzeichnis ist leer! ',

'pickfile':

'Datei auswählen ...',

'acceptfile':

'Unterstütztes Format: {0}',

'dropfile':

'Oder ziehe die Datei hier',

'unsupportedfile':

'Nicht unterstütztes Dateiformat',

'untitleddoc':

'Unbenanntes Dokument',

'overrideconfirm':

'{0} existiert bereits, Überschreiben bestätigen? ',

'checklogin':

'Login-Status prüfen ...',

'loggingin':

'Registrierung ...',

'recent':

'Vor kurzem eröffnet',

'clearrecent':

'Leer',

'clearrecentconfirm':

'Löschen Sie die Liste der letzten Dokumente? ',

'cleardraft':

'Leer',

'cleardraftconfirm':

'Leere Entwürfe bestätigen? ',

'none_share':

'Nicht teilen',

'public_share':

'öffentlicher Austausch',

'password_share':

'Privates Teilen',

'email_share':

'Mail-Einladung',

'url_share':

'URL der Mind Map:',

'sns_share':

'Social Network Sharing':

'sns_share_text':

'' {0} '- Ich benutze die Mind Map, die von Baidu Mind Map erstellt wurde, schau sie dir an! (Adresse: {1}) ',

'none_share_description':

'Teilen Sie nicht die aktuelle Mind Map',

'public_share_description':

'Erstellen Sie eine Freigabe, die für alle sichtbar ist',

'share_button_text':

'Erstellen',

'password_share_description':

'Erstellen Sie eine Freigabe, für die ein Kennwort erforderlich ist, um sichtbar zu sein',

'email_share_description':

'Erstellen Sie eine Freigabe, die für die angegebene Person sichtbar ist, und erlauben Sie ihnen, sie zu bearbeiten',

'ondev':

'Bitte freuen Sie sich auf! ',

'create_share_failed':

'Fehler beim Teilen: {0}',

'remove_share_failed':

'Löschen fehlgeschlagen: {1}',

'copy':

'Kopieren',

'copied':

'Kopiert',

'shared_tip':

'Die aktuelle Mind Map wird von {0} geteilt, Sie können sie auf Ihrer eigenen Netzwerkfestplatte speichern oder sie erneut teilen'

'current_share':

'aktuelle Mind Map',

'manage_share':

'Mein Anteil',

'share_remove_action':

'Teilen Sie nicht die Mind Map',

'share_view_action':

'Open-Sharing-Adresse',

'share_edit_action':

'Gemeinsame Dateien bearbeiten',

'login':

'Einloggen',

'logout':

'Abmelden',

'switchuser':

'Konto wechseln',

'userinfo':

'persönliche Informationen',

'gotonetdisk':

'Mein Weblaufwerk',

'requirelogin':

'Bitte <a class='login-button'> anmelden </a> und verwenden',

'saveas':

'Speichern unter',

'filename':

'Dateiname':

'fileformat':

'Dateiformat':

'save':

'Speichern',

'mkdir':

'Neues Verzeichnis',

'recycle':

'Papierkorb',

'newdir':

'Unbenanntes Verzeichnis',


'bold':

'Fett',

'italic':

'Kursiv',

'forecolor':

'Schriftfarbe',

'fontfamily':

'Schriftart',

'fontsize':

'Schriftgröße',

'layoutstyle':

'Thema',

'node':

'Knotenoperation',

'saveto':

'Speichern unter',

'hand':

'Ziehen erlauben',

'camera':

'Suchen Sie den Stammknoten',

'zoom-in':

'Vergrößern (Strg +)',

'zoom-out':

'Verkleinern (Strg)',

'markers':

'Tag',

'resource':

'Ressourcen',

'help':

'Hilfe',

'preference':

'Präferenzen',

'expandnode':

'Auf das Blatt erweitern',

'collapsenode':

'einen Level-1-Knoten erhalten',

'template':

'Vorlage',

'theme':

'Haut',

'clearstyle':

'Klare Stil',

'copystyle':

'Stil kopieren',

'pastestyle':

'Stil einfügen',

'appendsiblingnode':


'Gleiches Thema',

'appendchildnode':

'Untergeordnetes Thema',

'arrangeup':

'Voreinstellung',

'arrangedown':


'Nachstimmen',

'editnode':

'Bearbeiten',

'removenode':

'Entfernen',

'priority':

'Priorität',

'priority':

{
'p1':

'Nicht begonnen',

'p2':

'1/8 fertiggestellt',

'p3':

'1/4 fertiggestellt',

'p4':

'3/8 fertiggestellt',

'p5':

'1/2 fertiggestellt',

'p6':

'5/8 fertiggestellt',

'p7':

'3/4 fertiggestellt',

'p8':

'7/8 fertiggestellt',

'p9':

'Abgeschlossen',

'p0':

'Klarer Fortschritt'
},

'link':

'Verbindung',

'image':

'Bild',

'note':

'Bemerkungen',

'insertlink':

'Link einfügen',

'insertimage':

'Bild einfügen',

'insertnote':

'Notiz einfügen',

'removelink':

'Bestehende Links entfernen',

'removeimage':

'Bestehendes Bild entfernen',

'removenote':

'Bestehende Notizen entfernen',

'resetlayout':

Organisieren,

'justnow':

'gerade begonnen',

'minutesago':

'Vor {0} Minuten',

'hoursago':

'Vor {0} Stunden',

'yesterday':

'Gestern',

'daysago':

Vor {0} Tagen,

'longago':

'Vor langer Zeit',


'redirect':

'Sie öffnen die Verbindung {0}, Baidu Mind Map kann die Sicherheit der Verbindung nicht garantieren. Möchten Sie fortfahren? ',

'navigator':

'Navigator',

'unsavedcontent':

'Die aktuelle Datei wurde nicht auf dem Netzlaufwerk gespeichert: \ n \ n {0} \ n \ n Obwohl nicht gespeicherte Daten in den Entwürfen zwischengespeichert werden, werden beim Löschen des Browsercaches die Entwürfe gelöscht. ',


'shortcuts':

'Verknüpfung',

'contact':

'Kontakt und Feedback',

'email':


'Mail-Gruppe',

'qq_group':

'QQ-Gruppe',

'github_issue':

'Github',

'baidu_tieba':

'贴 吧',

'clipboardunsupported':

'Ihr Browser unterstützt keine Zwischenablage, bitte verwenden Sie die Tastenkombination zum Kopieren',

'load_success':

'{0} erfolgreich geladen',

'save_success':

'{0} wurde in {1} gespeichert,
'autosave_success':

'{0} wurde automatisch in {1} gespeichert,

'selectall':

'Alles auswählen',

'selectrevert':

'umgekehrte Wahl',

'selectsiblings':

'Wähle Bruderknoten',

'selectlevel':

'Wählen Sie einen Peer-Knoten',

'selectpath':

'Wähle einen Weg',

'selecttree':

'Teilbaum auswählen'
},

'popupcolor':

{

'clearColor':

'Leere Farbe',

'standardColor':

'Standardfarbe',

'themeColor':

'Themenfarbe'
},

'dialogs':

{

'markers':

{

'static':

{
'lang_input_text':

'Textinhalt:',

'lang_input_url':

'Linkadresse:',

'lang_input_title':

'Titel:',

'lang_input_target':

'Ob im neuen Fenster:'
},

'priority':

'Priorität',

'none':

Nein,

'progress':

{

'title':

'Fortschritt',

'notdone':

'unvollendet',

'done1':

'1/8 fertiggestellt',

'done2':

'1/4 fertiggestellt',

'done3':

'3/8 fertiggestellt',

'done4':

'1/2 fertiggestellt',

'done5':

'5/8 fertiggestellt',

'done6':

'3/4 fertiggestellt',

'done7':

'7/8 fertiggestellt',

'done':

'abgeschlossen'
}
},

'help':

{

},

'hyperlink':

{},

'image':

{},

'resource':

{}
},

'hyperlink':

{

'hyperlink':

'Verbindung ...',

'unhyperlink':

'Link entfernen'
},

'image':

{

'image':


'Bild ...',

'removeimage':

'Bild entfernen'
},

'marker':

{

'marker':

'Fortschritt / Priorität ...'
},

'resource':

{

'resource':

'Ressourcen ...'
}
}
}
});
