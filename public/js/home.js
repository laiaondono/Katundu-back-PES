const randomSentence = document.querySelector('#randomSentence');
const profile = document.querySelector('.profile');
const home = document.querySelector('.home');
const chats = document.querySelector('.chats');

const sentences = ["Katundu is the best way to exchange anything you want.", 
"Katundu is the best app ever", "If you don't want it, exchange it.",
"You can change anything in Katundu", "Welcome to Katundu, were the impossible comes to reality"]

randomSentence.innerHTML = sentences[Math.floor(Math.random()*sentences.length)];

profile.addEventListener('click', () => {
    window.location.replace("user.html");
});

chats.addEventListener('click', () => {
    window.location.replace("chat.html");
});