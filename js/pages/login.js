

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
		  
		  window.location = 'index.html';
		  
		  
          
          
        } else {
          // User is signed out.
         // window.location = 'auth-login-basic.html';
		 document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
        }
      });
    }

    window.onload = function() {
      initApp();
    };


