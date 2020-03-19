// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// This function takes the text parameter passed to this HTTP endpoint and inserts it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin.database().ref('/messages').push({original: original});
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString());
  });
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
	
	//updating the credentials of the user
	let docRef = admin.firestore().collection("user").doc(un);
	
	if(check_user_in_database(un)){
	try{
		docRef.update({
			username: un,
			password: ps,
			name: n,
			latitud: lat,
			longitud: lon
		});
		res.send("1");
	}
	catch(error){
		res.send("error trying to update the user");
	}
	}
	else{
		res.send("No such user in the database");
	}
}

function check_user_in_database(username){
	/*
	
	**pre:
		-username is the user to check
	
	**post: 
		false if the user is not in the database
		true if the user is in the database
		else if there is an error
		
	*/
	
	let docRef = admin.firestore().collection("user").doc(username);
	let getDoc = cityRef.get()
	.then(doc => {
		if (!doc.exists) {
			return false;
		} else {
			return true;
		}
		})
	.catch(err => {
		console.log('Error getting the user', err);
	});
}