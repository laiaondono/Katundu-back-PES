const sentences = ['Not yet makineta', 'Work in progress', 'Try this tomorrow',
'Bro, im not working', 'Did you really think this would work?']


const getUserByUID = firebase.functions().httpsCallable('web-getUserByUID');
let user = "";
getUserByUID().then(data => {
  user = data.data;
});


const home = document.querySelector('.home');
home.addEventListener('click', () => {
  window.location.replace("home.html");
});

const chats = document.querySelector('.chats');
chats.addEventListener('click', () => {
  window.location.replace("chat.html");
});

// FUNCIONS D'AFEGIR
async function newOffer(){
  Swal.fire({
    title: 'New Offer',
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Name">' +
      '<select id="type" name="typ" class="swal2-input"><option value="Producte">Product</option>' +
      '<option value="Servei">Service</option></select>' +
      '<input type="number" id="swal-input2" class="swal2-input" placeholder="Value" min="0">' +
      '<input type="text" id="swal-input3" class="swal2-input" placeholder="Description">' +
      '<input type="text" id="swal-input4" class="swal2-input" placeholder="Keywords (separated by #)">',
    focusConfirm: false,
    preConfirm: () => {
        let name = document.getElementById('swal-input1').value;
        let value = document.getElementById('swal-input2').value;
        let description = document.getElementById('swal-input3').value;
        let ref = firebase.firestore().collection("offer");
        return ref.add({user: user, name: name, value: value, description: description});
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if(result.isConfirmed){
      Swal.fire({
        title: "Offer Created",
      })
    }
  })
}

// Swal.fire(sentences[Math.floor(Math.random()*sentences.length)]);
function newWish(){
  Swal.fire({
    title: 'New Wish',
    html:
      '<input id="swal-wish1" class="swal2-input" placeholder="Name">' +
      '<input type="number" id="swal-wish2" class="swal2-input" placeholder="Value">' +
      '<input type="text" id="swal-wish3" class="swal2-input" placeholder="Description">',
    focusConfirm: false,
    preConfirm: () => {
        let name = document.getElementById('swal-wish1').value;
        let value = document.getElementById('swal-wish2').value;
        let ref = firebase.firestore().collection("wish");
        return ref.add({user: user, name: name, value: value});
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if(result.isConfirmed){
      Swal.fire({
        title: "Wish Created",
      })
    }
  })
}

function updateUserInfo(){
  const updateForm = document.querySelector('#update');
  const name = updateForm.name.value;
  const distance = updateForm.distance.value;
  const password = updateForm.password.value;
  let dataToModify = {};
    if(name !== ""){
      dataToModify.name = name;
    }
    if(name !== ""){
      dataToModify.distanciamaxima = distance;
    }
    if(password !== ""){
      dataToModify.password = password;
    }
    let ref = firebase.firestore().collection("user").doc(user);
    return ref.update(dataToModify).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Done',
        text: 'User updated!'
      })
    }).catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: err
      })
    });
}

function submit(){
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!',
    footer: "Why? Because I'm not yet developed"
  })
}