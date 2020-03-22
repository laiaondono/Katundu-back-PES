// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

//This function signs up a new user, cheking the correctness of the new values and updating the Database with
// this new credentials.
exports.signup = functions.https.onRequest(async (req,res) => {
    //Grabing the parameters
    try{
    const un = req.query.un;
    const pw = req.query.pw;
    const n = req.query.n;
    const lat = req.query.lat;
    const lon = req.query.lon;

    const snapshot = await admin.database().ref('/users');
      snapshot.push({username:un,
              password: pw, name: n,
            latitud: lat, longitud: lon});

      res.send("1");
    }
    catch(error)
    {
      res.send("0");
    }
});


//Login function
exports.login = functions.https.onRequest(async (req,res) => {
  //Grabing the parameters
  const un = req.query.un;
  const pw = req.query.pw;

  //Accessing the collection 'user' and the user's personal document
  let user = admin.firestore().collection('user').doc(un);

  let getDoc = user.get().then(doc => {
    if (!doc.exists) {	//the user is not registered
        res.send("No such user!");

    } else {

	if(doc.data().password === pw){
            res.send("Successful login");    

        }
        else {
            res.send("Incorrect password");

        }

    }
    return null;
  })
  .catch(err => {
    res.send("Error getting document"+err);
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
        res.send("The username already exists");
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
        res.send("New user added");
        return null;
      }
    }).catch(err => {
    console.log('Error getting the user', err);
    res.send("Something went wrong");
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
    let userRef = admin.firestore().collection('user').doc(un);
    let getDoc = userRef.get().then(doc => {
        if(!doc.exists) {
            res.send('Account deleted successfully');
        }
        else {
            res.send('Something went wrong');
        }
        return null;
    }).catch(err => {
        res.send("Error getting document"+err);
    });
});
