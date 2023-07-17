nomAffichageMenu=document.getElementById('nomAffichageMenu');
nomAffichageMenuSous=document.getElementById('nomAffichageMenuSous');
roleAffichageMenuSous=document.getElementById('roleAffichageMenuSous');
photoProfilMenu=document.getElementById('photoProfilMenu');
photoProfilSousMenu=document.getElementById('photoProfilSousMenu');


document.getElementById('logoutMenuHaut').addEventListener('click', toggleSignOut, false);
document.getElementById('logoutMenuGauche').addEventListener('click', toggleSignOut, false);


//Initialisation de l'application, redirection en cas de déconnexion et chargement des données utilisateurs
function initApp() {
      // Listening for auth state changes.
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          
          var uid = user.uid;
		  localStorage.setItem("uid", uid);
          var providerData = user.providerData;
		  localStorage.setItem("providerData", providerData);
		  
		  console.log(user);
		  
		  
		  //nomAffichageMenu.textContent =displayName;

			//Récupération des informations d'utilisateur et chargement en affichage
			firebase.database().ref('users').child(uid).once('value').then((snapshot) => {
				  const etapes = snapshot.val();
				  console.log(snapshot.val().displayName);
				  localStorage.setItem("displayName", snapshot.val().displayName);
				  localStorage.setItem("role", snapshot.val().role);
				  localStorage.setItem("email", snapshot.val().email);
				  localStorage.setItem("emailVerified", snapshot.val().emailVerified);
				  localStorage.setItem("photoURL",snapshot.val().photoURL);
				  localStorage.setItem("isAnonymous", snapshot.val().isAnonymous);
				  
				  nomAffichageMenu.textContent =snapshot.val().displayName;
				  nomAffichageMenuSous.textContent =snapshot.val().displayName;
				  roleAffichageMenuSous.textContent =snapshot.val().role;
				  photoProfilMenu.src=snapshot.val().photoURL;
				  photoProfilSousMenu.src=snapshot.val().photoURL;
			});
			
          
        } else {
          // User is signed out.
          window.location = 'auth-login-basic.html';
        }
      });
    }

    window.onload = function() {
      initApp();
    };


