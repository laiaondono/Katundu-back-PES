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
    const username = req.query.username;
    const password = req.query.password;
    const name = req.query.name;

    const snapshot = await admin.database().ref('/users');
    
    snapshot.push({username:username,
            password: password, name: name});
    res.redirect(303,snapshot.ref.toString());
    /*
    var usersRef = ref.child("users");
    usersRef.set({
    alanisawesome: {
    date_of_birth: "June 23, 1912",
    full_name: "Alan Turing"
  },
  gracehop: {
    date_of_birth: "December 9, 1906",
    full_name: "Grace Hopper"
  }
  */
});
