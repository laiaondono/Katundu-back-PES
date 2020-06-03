const logo = document.querySelector('.logo');
const requestLogin = document.querySelector('.login');
const requestRegister = document.querySelector('.register');

const homeDiv = document.querySelector('#home');
const loginDiv = document.querySelector('#login');
const registerDiv = document.querySelector('#register');

// open request modal
requestLogin.addEventListener('click', () => {
    console.log("Login");
    loginDiv.classList.add('active');
    if (registerDiv.classList.contains('active')) {
        registerDiv.classList.remove('active');
    }
    if (homeDiv.classList.contains('active')) {
        homeDiv.classList.remove('active');
    }
});

// close request modal
requestRegister.addEventListener('click', () => {
    console.log("Register");
    registerDiv.classList.add('active');
    if (loginDiv.classList.contains('active')) {
        loginDiv.classList.remove('active');
    }
    if (homeDiv.classList.contains('active')) {
        homeDiv.classList.remove('active');
    }
});

logo.addEventListener('click', () => {
    console.log("Home");
    homeDiv.classList.add('active');
    if (registerDiv.classList.contains('active')) {
        registerDiv.classList.remove('active');
    }
    if (loginDiv.classList.contains('active')) {
        loginDiv.classList.remove('active');
    }
})