const home = document.querySelector('.home');
home.addEventListener('click', () => {
  window.location.replace("home.html");
});

const profile = document.querySelector('.profile');
profile.addEventListener('click', () => {
  window.location.replace("user.html");
});