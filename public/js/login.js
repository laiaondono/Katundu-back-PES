const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const registerForm = document.querySelector('.registerForm');
const loginForm = document.querySelector('.loginForm');

let registering = false;

// register form
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("Registering");

    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const username = registerForm.username.value;

    if(username === ""){
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: "Do not leave the user empty",
          })
    }

    const addUsername = firebase.functions().httpsCallable('web-addUsername');

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async (user) => {
            Swal.fire(
                'Good job!',
                "You've successfully registered",
                'success'
            );
            registering = true;
            console.log('registered', user);
            registerForm.reset();
            await addUsername({
                uid: user.user.uid,
                username: username
            });
            registering = false;
            window.location.replace("user.html");
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: error.message
              })
        });
});

// login form
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(user => {
            console.log('logged in', user);
            loginForm.reset();
        })
        .catch(error => {
            loginForm.querySelector('.error').textContent = error.message;
        });
});

// auth listener
firebase.auth().onAuthStateChanged(user => {
    let arr = (window.location.href).split("/");
    let file = (arr[arr.length-1]);
    console.log(file);
    if (user && !registering) {
        console.log("Usuario loggeado");
        if( file !== "home.html"){
            window.location.replace("home.html");
        }
    } else {
        console.log("Usuario no loggeado");
        if( file !== "index.html"){
            window.location.replace("index.html");
        }
    }
});