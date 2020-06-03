const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const signOut = document.querySelector('.logout');

// toggle auth modals
authSwitchLinks.forEach(link => {
    link.addEventListener('click', () => {
        authModals.forEach(modal => modal.classList.toggle('active'));
    });
});

// sign out
signOut.addEventListener('click', () => {
    firebase.auth().signOut()
        .then(() => console.log('signed out'));
});

// auth listener
firebase.auth().onAuthStateChanged(user => {
    let arr = (window.location.href).split("/");
    let file = (arr[arr.length-1]);
    // console.log(file);
    if (user) {
        console.log("Usuario loggeado");
    } else {
        console.log("Usuario no loggeado");
        if( file !== "index.html"){
            window.location.replace("index.html");
        }
    }
});