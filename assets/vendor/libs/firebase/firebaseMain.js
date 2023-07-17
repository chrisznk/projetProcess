// ====================***====================
// **************** VARIABLE *****************
// ====================***====================

var varZone="";
var varMachine="";
var varProcedure="";

recupererParametres()

// ====================***====================
// ****************** LOGIN ******************
// ====================***====================

//Deconnexion
function toggleSignOut() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    }
}

function toggleSignIn() {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
      } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  // The email of the user's account used.
			  var email = error.email;
			  // The firebase.auth.AuthCredential type that was used.
			  var credential = error.credential; 
			  // [START_EXCLUDE]
			  if (errorCode === 'auth/account-exists-with-different-credential') {
				alert("You have already signed up with a different auth provider for that email.");
				// If you are using multiple auth providers on your app you should handle linking
				// the user's accounts here.
			  }
			  else if (errorCode === 'auth/auth-domain-config-required') {
				alert("An auth domain configuration is required"); 
			  }
			  else if (errorCode === 'auth/cancelled-popup-request') {
				  alert("Popup Google sign in was canceled");
			  }
			  else if (errorCode === 'auth/operation-not-allowed') {
				  alert("Operation is not allowed");
			  }
			  else if (errorCode === 'auth/operation-not-supported-in-this-environment') {
				  alert("Operation is not supported in this environment");
			  }
			  else if (errorCode === 'auth/popup-blocked') {
				  alert("Sign in popup got blocked");
			  }
			  else if (errorCode === 'auth/popup-closed-by-user') {
				  alert("Google sign in popup got cancelled");
			  }
			  else if (errorCode === 'auth/unauthorized-domain') {
				  alert("Unauthorized domain");
			  }
			   else {
				console.error(error);
			  }
          console.log(error);
        });
      }
    }

    /**
     * Handles the sign up button press.
     */
    function handleSignUp() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Create user with email and pass.
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
    }

    /**
     * Sends an email verification to the user.
     */
    function sendEmailVerification() {
      firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        alert('Email Verification Sent!');
      });
    }

    function sendPasswordReset() {
      var email = document.getElementById('email').value;
      firebase.auth().sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        alert('Password Reset Email Sent!');
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
      });
    }

    

// ====================***====================
// ******************* ZONE ******************
// ====================***====================

//Création de zone
function setZone() {
console.log("oiuytyuioiuytyuioiuyuio");
    //Initialisation des variables de paramètre
    createur = localStorage.displayName;
    nom = document.getElementById("nom").value;
    description = document.getElementById("description").value;
    localisation = document.getElementById("localisation").value;
	uid=localStorage.getItem("uid");
	console.log(localisation);
    //Ajout de la zone à partir des paramètres ci-dessus
    firebase.database().ref('zone/').push({
        createur: createur,
        datecreation: dateFormat(),
        modification: createur,
        datemodification: dateFormat(),
        nom: nom,
        description: description,
        localisation: localisation,
		uid:uid
    }).then((snap) => {
        const key = snap.key
        //La clée unique du script
        console.log(key);
		location.reload();
    });
	
}

function loadBeforeModifyZone(zoneKey) {
    //Reception de la zone
    firebase.database().ref('zone/' + zoneKey).once('value').then((snapshot) => {
        const etapes = snapshot.val();
        console.log(snapshot.val().createur);
        document.getElementById("nomModifier").value=snapshot.val().nom;
		document.getElementById("descriptionModifier").value=snapshot.val().description;
		document.getElementById("localisationModifier").value=snapshot.val().localisation;
		document.getElementById("boutonModification").setAttribute( "onClick", "updateZone('"+zoneKey+"')" );
		$('#largeModalModifier').modal('show'); 
    });
}

//Update de zone
function updateZone(zoneKey) {

    //Initialisation des variables de paramètre
    modification = localStorage.displayName;
    nom = document.getElementById("nomModifier").value;
    description = document.getElementById("descriptionModifier").value;
    localisation = document.getElementById("localisationModifier").value;

    //Ajout de la zone à partir des paramètres ci-dessus
    firebase.database().ref('zone/'+zoneKey).update({
        modification: modification,
        datemodification: dateFormat(),
        nom: nom,
        description: description,
        localisation: localisation
    });
	location.reload();
}

//Récupération d'une zone à partir de son identifiant
function getZone(zoneKey) {
    //Reception de la zone
    firebase.database().ref('zone/' + zoneKey).once('value').then((snapshot) => {
        const etapes = snapshot.val();
        console.log(snapshot.val());
		return snapshot.val();
        //snapshot.forEach(element => parcoursAllMachine(element.val(),element.key));
    });
}

//suppression d'une zone à partir de son identifiant et de l'identifiant de sa zone
function removeZone(zoneKey) {
    //Suppression de la zone
    firebase.database().ref('zone/'+zoneKey).remove();
	location.reload();
}

//Création d'un QRCODE pur la zone
function getQrForZone(zoneKey) {
    generationQrCode(zoneKey);
}

//Récupération des zones
function getAllZones() {

    //Reception des zones
    firebase.database().ref('zone/').once('value').then((snapshot) => {
        const etapes = snapshot.val();
        //Ici le element.val() corresponds à la valeur, et key correspond à la clé qui a été utilisé pour trouver cette valeur
        snapshot.forEach(element => parcoursAllZone(element.val(), element.key));
    });
}

//Parcours des zones
function parcoursAllZone(zone, zoneKey) {
    console.log(zone.description)
    //Ici le programme receptionne les info et les insert dans un template HTML pour l'afficher après coup 
    var template = `
					  <tr>
                        <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>`+zone.nom+`</strong></td>
                        <td>`+zone.description+`</td>
                        <td>`+zone.localisation+`</td>
                        <td>`+zone.createur+`</td>
                        <td>
                          <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                              <i class="bx bx-dots-vertical-rounded"></i>
                            </button>
                            <div class="dropdown-menu">
							  <a href="dashboardMachine.html?zone=`+zoneKey+`" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-folder-open me-1"></i>Open</a>
                              <a onclick="loadBeforeModifyZone('`+zoneKey+`')" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-edit-alt me-1"></i>Edit</a>
							  <a onclick="getQrForZone('`+zoneKey+`')" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-qr me-1"></i>QR Code</a>
                              <a onclick="removeZone('`+zoneKey+`')" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Delete</a>
                            </div>
                          </div>
                        </td>
						
                      </tr>
	  `;
    console.log(template);
	var tableDeDonnee = document.getElementById('tableDeDonnee');
	tableDeDonnee.insertAdjacentHTML('beforeend', template);

}


// ====================***====================
// ***************** MACHINE *****************
// ====================***====================

//Création de machine, elle demande de préciser la zone de la machine
function setMachine() {
	zoneKey=varZone;

	//Initialisation des variables de paramètre
    nom = document.getElementById("nom").value;
    description = document.getElementById("description").value;
    localisation = document.getElementById("localisation").value;
	uid=localStorage.getItem("uid");
	console.log(localisation);
	
    
    //Ajout de la machine à partir des paramètres ci-dessus
    firebase.database().ref('zone/'+zoneKey+'/machines').push({
        nom: nom,
        description: description,
        localisation: localisation,
        dateinstallation: dateFormat(),
        datemaintenance: dateFormat(),
		uid:uid,
        zoneKey: zoneKey
    }).then((snap) => {
        const key = snap.key
        //La clée unique du script
        console.log(key);
		location.reload();
    });
}


function loadBeforeModifyMachine(machineKey) {
	
	zoneKey=varZone;
	
    //Reception de la zone
    firebase.database().ref('zone/' + zoneKey+'/machines/'+machineKey).once('value').then((snapshot) => {
        const etapes = snapshot.val();
        console.log(snapshot.val().createur);
        document.getElementById("nomModifier").value=snapshot.val().nom;
		document.getElementById("descriptionModifier").value=snapshot.val().description;
		document.getElementById("localisationModifier").value=snapshot.val().localisation;
		document.getElementById("boutonModification").setAttribute( "onClick", "updateMachine('"+machineKey+"')" );
		$('#largeModalModifier').modal('show'); 
    });
}

//Update de zone
function updateMachine(machineKey) {
	
	zoneKey=varZone;

    //Initialisation des variables de paramètre
    modification = localStorage.displayName;
    nom = document.getElementById("nomModifier").value;
    description = document.getElementById("descriptionModifier").value;
    localisation = document.getElementById("localisationModifier").value;
    
    //Modification de la machine à partir des paramètres ci-dessus
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey).update({
        nom: nom,
        description: description,
        localisation: localisation,
        dateinstallation: dateFormat(),
        datemaintenance: dateFormat(),
        zoneKey: zoneKey
    })
	location.reload();
}

//Récupération d'une machine à partir de son identifiant et de l'identifiant de sa zone
function getMachine(machineKey) {
	
	zoneKey=varZone;
	
    //Reception de la machine
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey).once('value').then((snapshot) => {
        const etapes = snapshot.val();
        console.log(snapshot.val());
		return snapshot;
        //snapshot.forEach(element => parcoursAllMachine(element.val(),element.key));
    });
	
}

//suppression d'une Machine à partir de son identifiant et de l'identifiant de sa zone
function removeMachine(machineKey) {
	
	zoneKey=varZone;
	
    //Suppression de la Machine
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey).remove();
	
	location.reload();
}


//Création d'un QRCODE pur la machine
function getQrForMachine(machineKey) {
	
	zoneKey=varZone;
	
    generationQrCode(zoneKey+"|||"+machineKey);
}

//Récupération des machines à partir de l'identifiant de sa zone
function getAllMachine() {
	zoneKey=varZone;
    //Reception des machine
    firebase.database().ref('zone/'+zoneKey+'/machines/').once('value').then((snapshot) => {
        const etapes = snapshot.val();
        //Ici le element.val() corresponds à la valeur, et key correspond à la clé qui a été utilisé pour trouver cette valeur
        snapshot.forEach(element => parcoursAllMachine(element.val(), element.key));
    });
	
	firebase.database().ref('zone/'+zoneKey+'/nom/').once('value').then((snapshot) => {
        const nomDeZone = snapshot.val();
        //Ici le element.val() corresponds à la valeur, et key correspond à la clé qui a été utilisé pour trouver cette valeur
        document.getElementById("nomDeZoneAffichage").insertAdjacentHTML('beforeend', nomDeZone);  
    });
}

//Parcours des machines
function parcoursAllMachine(machine, machineKey) {
    console.log(machine.description)
    //Ici le programme receptionne les info et les insert dans un template HTML pour l'afficher après coup 
    var template = `
					  <tr>
                        <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>`+machine.nom+`</strong></td>
                        <td>`+machine.description+`</td>
                        <td>`+machine.localisation+`</td>
                        <td>
                          <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                              <i class="bx bx-dots-vertical-rounded"></i>
                            </button>
                            <div class="dropdown-menu">
							  <a href="dashboardProcedure.html?zone=`+zoneKey+`&machine=`+machineKey+`" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-folder-open me-1"></i>Open</a>
                              <a onclick="loadBeforeModifyMachine('`+machineKey+`')" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-edit-alt me-1"></i>Edit</a>
							  <a onclick="getQrForMachine('`+machineKey+`')" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-qr me-1"></i>QR Code</a>
                              <a onclick="removeMachine('`+machineKey+`')" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Delete</a>
                            </div>
                          </div>
                        </td>
						
                      </tr>
	  `;
    console.log(template);
	var tableDeDonnee = document.getElementById('tableDeDonnee');
	tableDeDonnee.insertAdjacentHTML('beforeend', template);

}

// ====================***====================
// **************** PROCEDURE ****************
// ====================***====================

//Création de Procedure, elle demande de préciser la zone de la Procedure
function setProcedure() {
	zoneKey=varZone;
	machineKey=varMachine;

    //Initialisation des variables de paramètre
    titre = document.getElementById("titre").value;
	description = document.getElementById("description").value;
	duree = document.getElementById("duree").value;
    lignes = document.getElementById("ligne").value;
    localisation = document.getElementById("localisation").value;	
	
	uid=localStorage.getItem("uid");
	console.log(localisation);
    
    //Ajout de la Procedure à partir des paramètres ci-dessus
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+'/procedures/').push({
        titre: titre,
        description: description,
        duree: duree,
        lignes: lignes,
		localisation: localisation,
        createur: localStorage.displayName,
        modification: localStorage.displayName,
        datemodification: dateFormat(),
		datecreation: dateFormat(),
        zoneKey: zoneKey,
		uid:uid,
		machineKey:machineKey
    }).then((snap) => {
        const key = snap.key
        //La clée unique du script
        console.log(key);
		location.reload();
    });
}

//Chargement avant modification du update
function loadBeforeModifyProcedure(procedureKey) {
	
	zoneKey=varZone;
	machineKey=varMachine;
	
    //Reception de la zone
    firebase.database().ref('zone/' + zoneKey+'/machines/'+machineKey+'/procedures/'+procedureKey).once('value').then((snapshot) => {
        const etapes = snapshot.val();
        console.log(snapshot.val().createur);
		
		document.getElementById("titreModifier").value=snapshot.val().titre;
		document.getElementById("descriptionModifier").value=snapshot.val().description;
		document.getElementById("dureeModifier").value=snapshot.val().duree;
		document.getElementById("ligneModifier").value=snapshot.val().lignes;
		document.getElementById("localisationModifier").value=snapshot.val().localisation;	
		
		
		
		document.getElementById("boutonModification").setAttribute( "onClick", "updateProcedure('"+procedureKey+"')" );
		$('#largeModalModifier').modal('show'); 
    });
}


//Update de procedure
function updateProcedure(procedureKey) {

    //Initialisation des variables de paramètre
    zoneKey=varZone;
	machineKey=varMachine;

    //Initialisation des variables de paramètre
    titre = document.getElementById("titreModifier").value;
	description = document.getElementById("descriptionModifier").value;
	duree = document.getElementById("dureeModifier").value;
    lignes = document.getElementById("ligneModifier").value;
    localisation = document.getElementById("localisationModifier").value;	
	
    
    //Ajout de la Procedure à partir des paramètres ci-dessus
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+'/procedures/'+procedureKey).update({
        titre: titre,
        description: description,
        duree: duree,
        lignes: lignes,
		localisation: localisation,
        modification: localStorage.displayName,
        datemodification: dateFormat()
    })
	location.reload();
}

//Récupération d'une Procédure à partir de son identifiant et de l'identifiant de sa zone
function getProcedure(procedureKey) {
	
	zoneKey=varZone;
	machineKey=varMachine;
	
    //Reception de la Procédure
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+"/procedures/"+procedureKey).once('value').then((snapshot) => {
        const etapes = snapshot.val();
        console.log(snapshot.val());
		return snapshot;
        //snapshot.forEach(element => parcoursAllMachine(element.val(),element.key));
    });
}

//suppression d'une Procedure à partir de son identifiant et de l'identifiant de sa zone
function removeProcedure(procedureKey) {
	
	zoneKey=varZone;
	machineKey=varMachine;
	
    //Suppression de la Procedure
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+"/procedures/"+procedureKey).remove();
	location.reload();
}


//Création d'un QRCODE pur la procédure
function getQrForProcedure(procedureKey) {
	
	zoneKey=varZone;
	machineKey=varMachine;
	
    generationQrCode(zoneKey+"|||"+machineKey+"|||"+procedureKey);
}

//Récupération des procedures à partir de l'identifiant de sa zone
function getAllProcedure(machine, machineKey) {
	
	zoneKey=varZone;
	machineKey=varMachine;
	//Reception des Procedures
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+'/procedures').once('value').then((snapshot) => {
        const etapes = snapshot.val();
        //Ici le element.val() corresponds à la valeur, et key correspond à la clé qui a été utilisé pour trouver cette valeur
        snapshot.forEach(element => parcoursAllProcedure(element.val(), element.key));
    });
	
	firebase.database().ref('zone/'+zoneKey+'/nom/').once('value').then((snapshot) => {
        const nomDeZone = snapshot.val();
        //Ici le element.val() corresponds à la valeur, et key correspond à la clé qui a été utilisé pour trouver cette valeur
        document.getElementById("nomDeZoneAffichage").insertAdjacentHTML('beforeend', nomDeZone);  
    });
	
	firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+'/nom/').once('value').then((snapshot) => {
        const nomDeZone = snapshot.val();
        //Ici le element.val() corresponds à la valeur, et key correspond à la clé qui a été utilisé pour trouver cette valeur
        document.getElementById("nomDeMachineAffichage").insertAdjacentHTML('beforeend', nomDeZone);  
    });
}

//Parcours des procedures
function parcoursAllProcedure(procedure, procedureKey) {
    zoneKey=varZone;
	machineKey=varMachine;

	console.log(procedure.description)
    //Ici le programme receptionne les info et les insert dans un template HTML pour l'afficher après coup 
    var template = `
					  <tr>
                        <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>`+procedure.titre+`</strong></td>
                        <td>`+procedure.description+`</td>
						<td>`+procedure.duree+`</td>
                        <td>`+procedure.localisation+`</td>
						<td>`+procedure.lignes+`</td>
						<td>`+procedure.createur+`</td>
						<td>`+procedure.datecreation+`</td>
                        <td>
                          <div class="dropdown">
                            <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                              <i class="bx bx-dots-vertical-rounded"></i>
                            </button>
                            <div class="dropdown-menu">
							  <a href="dashboardProcedure.html?zone=`+zoneKey+`&machine=`+machineKey+`&procedure=`+procedureKey+`" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-folder-open me-1"></i>Open</a>
                              <a onclick="loadBeforeModifyProcedure('`+procedureKey+`')" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-edit-alt me-1"></i>Edit</a>
							  <a onclick="getQrForProcedure('`+procedureKey+`')" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-qr me-1"></i>QR Code</a>
                              <a onclick="removeProcedure('`+procedureKey+`')" class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Delete</a>
                            </div>
                          </div>
                        </td>
						
                      </tr>
	  `;
    console.log(template);
	var tableDeDonnee = document.getElementById('tableDeDonnee');
	tableDeDonnee.insertAdjacentHTML('beforeend', template);

}

// ====================***====================
// ***************** Etapes ******************
// ====================***====================

//Création de Etape, elle demande de préciser la zone de la Etape
function setEtape(zoneKey,machineKey,procedureKey,imageUrl) {

    //Initialisation des variables de paramètre
    titre = "titre";
	description = "description";
    type = "lignes";
	createur="créateur";
	picto = ["3","2","1"];
	epi = ["3","2","1"];
	position = "100000";
    
    //Ajout de la Etape à partir des paramètres ci-dessus
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+'/procedures/'+procedureKey+'/etapes').push({
        titre: titre,
        description: description,
        type: type,
		imageUrl: imageUrl,
		picto : picto,
		epi : epi,
        createur: createur,
        datecreation: dateFormat(),
        modification: createur,
        datemodification: dateFormat(),
        zoneKey: zoneKey,
		machineKey: machineKey,
		procedureKey: procedureKey,
		position : position
    }).then((snap) => {
        const key = snap.key
        //La clée unique du script
        console.log(key);
    });
}

//Update de l'etape
function updateEtape(zoneKey,machineKey,procedureKey,etapeKey) {

    //Initialisation des variables de paramètre
    titre = "titre";
	description = "description";
    type = "lignes";
	modification="modification";
	picto = ["3","2","1"];
	epi = ["3","2","1"];
	position = "100000";
    
    //Ajout de la Etape à partir des paramètres ci-dessus
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+'/procedures/'+procedureKey+'/etapes/'+etapeKey).update({
        titre: titre,
        description: description,
        type: type,
		imageUrl: imageUrl,
		picto : picto,
		epi : epi,
        modification: modification,
        datemodification: dateFormat(),
        zoneKey: zoneKey,
		machineKey: machineKey,
		procedureKey: procedureKey,
		position : position
    })
}

//Récupération d'une Etape à partir de son identifiant et de l'identifiant de sa zone
function getEtape(zoneKey,machineKey,procedureKey,etapeKey) {
    //Reception de la Etape
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+"/procedures/"+procedureKey+"/etapes/"+etapeKey).once('value').then((snapshot) => {
        const etapes = snapshot.val();
        console.log(snapshot.val());
		return snapshot;
        //snapshot.forEach(element => parcoursAllMachine(element.val(),element.key));
    });

}

//suppression d'une Etape à partir de son identifiant et de l'identifiant de sa zone
function removeEtape(zoneKey,machineKey,procedureKey,etapeKey) {
    //Suppression de la Etape
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+"/procedures/"+procedureKey+"/etapes/"+etapeKey).remove();
}

//Récupération de la position d'une Etape à partir de son identifiant et de l'identifiant de sa zone
function getPositionEtape(zoneKey,machineKey,procedureKey,etapeKey) {
    //Reception de la Etape
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+"/procedures/"+procedureKey+"/etapes/"+etapeKey+"/position").once('value').then((snapshot) => {
        const etapes = snapshot.val();
        console.log(snapshot.val());
		return snapshot;
        //snapshot.forEach(element => parcoursAllMachine(element.val(),element.key));
    });
}

//Update de la position d'une étape
function updatePositionEtape(zoneKey,machineKey,procedureKey,etapeKey,position) {

    //Mise à joru de l'étape
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+'/procedures/'+procedureKey+'/etapes/'+etapeKey+"/position").update({
		position : position
    })
}



//Récupération d'une picto à partir de son identifiant et de l'identifiant de sa zone
function getPicto(zoneKey,machineKey,procedureKey,etapeKey) {
    //Reception de la picto
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+"/procedures/"+procedureKey+"/etapes/"+etapeKey+"/picto").once('value').then((snapshot) => {
        const etapes = snapshot.val();
        console.log(snapshot.val());
		return snapshot;
        //snapshot.forEach(element => parcoursAllMachine(element.val(),element.key));
    });
}

//Récupération d'une epi à partir de son identifiant et de l'identifiant de sa zone
function getEpi(zoneKey,machineKey,procedureKey,etapeKey) {
    //Reception de la epi
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+"/procedures/"+procedureKey+"/etapes/"+etapeKey+"/epi").once('value').then((snapshot) => {
        const etapes = snapshot.val();
        console.log(snapshot.val());
		return snapshot;
        //snapshot.forEach(element => parcoursAllMachine(element.val(),element.key));
    });
}

//Récupération des Etape à partir de l'identifiant de sa zone
function getAllEtape(zoneKey,machineKey,procedureKey) {
    //Reception des Etape
    firebase.database().ref('zone/'+zoneKey+'/machines/'+machineKey+'/procedures/'+procedureKey+"/etapes").once('value').then((snapshot) => {
        const etapes = snapshot.val();
        //Ici le element.val() corresponds à la valeur, et key correspond à la clé qui a été utilisé pour trouver cette valeur
        snapshot.forEach(element => parcoursAllProcedure(element.val(), element.key));
    });
}

//Parcours des procedures
function parcoursAllEtape(procedure, procedureKey) {
    console.log(procedure.description)
    //Ici le programme receptionne les info et les insert dans un template HTML pour l'afficher après coup
    var template = `
	<h2 class="featurette-heading">` + procedureKey + `</h2>
	  `;
    console.log(template);

}

// ====================***====================
// ***************** GLOBALE *****************
// ====================***====================

//Mettre la date du jours au bon format 
function dateFormat() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '/' + mm + '/' + yyyy;

    return formattedToday;
}

//Encode un texte pour le mettre en format html, ce code sert a réparer la requete de génération de QR CODE
function htmlEncode (value){
  return $('<div/>').text(value).html();
}

//Fonction s'occupant du téléchargement d'un fichier à partir d'une URL et d'un nom de fichier
function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

//Crée et télécharge le QR CODE en fonction d'un texte
function generationQrCode(texte){
  downloadURI("https://chart.googleapis.com/chart?cht=qr&chl=" + htmlEncode(texte) + "&chs=160x160&chld=L|0", "QRCode.png");
}

//Récupère les parametre de la page et les chargent en locale
function recupererParametres()
  {
    var parameters = location.search.substring(1).split("&");
    var type="";
    try {
        var temp = parameters[0].split("=");
        varZone = unescape(temp[1]);
        console.log(Zone);
        type="zone";
    }catch{}
    try {
        temp = parameters[1].split("=");
   	    varMachine = unescape(temp[1]);
        console.log(Machine);
        type="machine";
    }catch{}
    try {
        temp = parameters[2].split("=");
        varProcedure = unescape(temp[1]);
        console.log(Procedure);
        type="procedure";
    }catch{}
    
  }