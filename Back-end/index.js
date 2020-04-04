// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();


//Login function
exports.login = functions.https.onRequest(async (req,res) => {
  //Grabing the parameters
  const un = req.query.un;
  const pw = req.query.pw;

  //Accessing the collection 'user' and the user's personal document
  let user = admin.firestore().collection('user').doc(un);

  let getDoc = user.get().then(doc => {
    if (!doc.exists) {	
        res.send("1"); //The user doesn't exist

    } else {

	if(doc.data().password === pw){
            res.send("0"); //Successful login

        }
        else {
            res.send("2"); //Incorrect password

        }

    }
    return null;
  })
  .catch(err => {
    console.log('Error getting the user', err);
    res.send("-1"); //Error getting the document
  });

  
});


//This function signs up a new user, cheking the correctness of the new values and updating the Database with
// this new credentials.

exports.signup = functions.https.onRequest(async (req,res) => {
  //Grabing the parameters
  const un = req.query.un;
  const pw = req.query.pw;
  const n = req.query.n;
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  //Checking is document exists, if not creating a new one
  let docRef = admin.firestore().collection('user').doc(un);
  let getDoc = docRef.get().then(doc => {
      if (doc.exists) {
        res.send("1");
        return null;
        
      } else {
        let newdata = admin.firestore().collection('user').doc(un);
        let setnewdata = newdata.set({
          username: un,
          password: pw,
          name: n,
          latitud: lat,
          longitud: lon,
        });
        res.send("0");
        return null;
      }
    }).catch(err => {
    console.log('Error getting the user', err);
    res.send("-1");
    });
});

//Delete account function
exports.deleteaccount = functions.https.onRequest(async (req,res) => {

    //Pre: an account with the username in the request exists.
    //Post: all the data related to the user with the username in the request has been deleted.

    //Grabing the parameters
    const un = req.query.un;

    //Deleting the account
    let deleteUser = admin.firestore().collection('user').doc(un).delete();

    //Checking if the account was deleted successfully
    deleteUser.then(r => {
        console.log('Delete: ', r);
        let userRef = admin.firestore().collection('user').doc(un);
        let getDoc = userRef.get().then(doc => {
            if(!doc.exists) {
                res.send("0");
            }
            else {
                res.send("1");
            }
            return null;
        }).catch(err => {
            console.log('Error getting the document', err);
            res.send("-1");
        });
        return null;
    }).catch(err => {
        console.log('Error deleting', err);
        res.send("-1");
    });
});

exports.modify_personal_credentials = functions.https.onRequest(async (req,res) => {
	/*
	
	**pre:
		-req.query.un is the username of the user
		-req.query.pw is the password of the user
		-req.query.n is the name of the user
		-req.query.lat is the latitud of the user
		-req.query.lon is the longitud of the user
	
	**post: 
		user has the new credentials
	
	*/
	
	//getting the new credentials for the update of the user
	const un = req.query.un;
  const pw = req.query.pw;
  const n = req.query.n;
  const lat = req.query.lat;
  const lon = req.query.lon;
	
	//updating the credentials of the user and checking the user
  let docRef = admin.firestore().collection("user").doc(un);
  let getDoc = docRef.get().then(doc => {
  if (!doc.exists) {
    res.send("1"); //The user doesn't exist
    return null;
      
  } else {
	  try{
		  docRef.update({
			  username: un,
			  password: pw,
			  name: n,
			  latitud: lat,
			  longitud: lon
		  });
		  res.send("0"); //Ok
	  }
	  catch(error){
		  res.send("2"); //error trying to update the user
    }
    return null;
  }
  }).catch(err => {
    res.send("Error getting document"+err);
    res.send("-1"); //Error getting the document
  });
});

//ADD WISH function
//Afegeix un nou desig a la llista de desitjos i al array de wishes de l'usuari
exports.addwish = functions.https.onRequest(async (req,res) => {

	const user = req.query.user;
	const name = req.query.name;
	const category = req.query.category;
	const type = req.query.type;
	const keywords = req.query.keywords;
	const value = req.query.value;
	const description = req.query.description;

	let addDoc = admin.firestore().collection('wishes').add({
	  user: user,
	  name: name,
	  category: category,
	  type: type,
	  keywords: keywords,
	  value: value,
	  description: description

	}).then(ref => {
	  console.log('Added wish with ID: ', ref.id);

	//AFEGIR ID WISH A LA LLISTA DE WISHES DE L'USUARI
	//Si no té l'array el crea
	admin.firestore().collection('user').doc(user).update({
	  wishes: admin.firestore.FieldValue.arrayUnion(ref.id)
	});

	res.send(ref.id);
	return null;

	});
});