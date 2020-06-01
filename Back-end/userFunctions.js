const functions = require('firebase-functions');
const admin = require('firebase-admin');

//Login function
exports.login = functions.https.onRequest(async (req, res) => {
    //Grabing the parameters
    const un = req.query.un;
    const pw = req.query.pw;

    //Accessing the collection 'user' and the user's personal document
    let user = admin.firestore().collection('user').doc(un);

    user.get().then(doc => {
        if (!doc.exists) {
            res.send("1"); //The user doesn't exist
        }
        else {
            if (doc.data().password === pw) {
                res.send("0"); //Successful login
            }
            else {
                res.send("2"); //Incorrect password
            }
        }
        return null;
    }).catch(err => {
        console.log('Error getting the user', err);
        res.send("-1"); //Error getting the document
    });
});

exports.add = functions.https.onRequest(async (req, res) => {
    const params = req.query;
    if (!params.hasOwnProperty('un') || !params.hasOwnProperty('pw')) {
        res.send("-1"); // Not user or password provided
        return null;
    }
    const user = params.un;
    const userRef = admin.firestore().collection('user').doc(user);
    let userData = await userRef.get().catch(() => {
        res.send("-1") // Error getting the user
        return null;
    });
    if (userData.exists) {
        res.send("1"); // User already exist
        return null;
    } else {
        let dataToAdd = getParameters(params);
        dataToAdd.offer = [];
        dataToAdd.wish = [];
        dataToAdd.favorite = [];
        dataToAdd.post = [];
        dataToAdd.trofeo = []
        dataToAdd.distanciamaxima = 10;
	dataToAdd.valoracio = -1;
        let setnewdata = userRef.set(dataToAdd);
        res.send("0"); // User Created
        return setnewdata;
    }
});

exports.modify = functions.https.onRequest(async (req, res) => {
    const params = req.query;
    let dataToModify = getParameters(params)
    const userRef = admin.firestore().collection('user').doc(params.un);
    let userDoc = await userRef.get().catch(err => {
        console.log("Error getting document", err);
        res.send("-1"); //Error getting the document
        return null;
    });
    if(!userDoc.exists){
        res.send("1"); //The user doesn't exist
        return null;
    } else {
        res.send("0"); // User Updated
        return userRef.update(dataToModify);
    }
});

//Delete account function
exports.delete = functions.https.onRequest(async (req,res) => {
    //Grabing the parameters
    const un = req.query.un;
    //Deleting the account
    let userRef = admin.firestore().collection('user').doc(un);
    await userRef.delete().catch((err) => {
        console.log('Error deleting', err);
        res.send("-1");
        return null;
    });  
    userRef.get().then(doc => {
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
        return null;
    });
});

exports.search = functions.https.onRequest(async (req,res) => {

	const un = req.query.un;
	
  let user = admin.firestore().collection('user').doc(un);
  
  let getDoc = user.get().then(doc => {
    if (!doc.exists) {
      res.send("1"); //The user doesn't exist
      return null;
    } else {
      let data = {
        name : doc.data().name
      }

      res.send(data);//usuari existeix
      return null;
    }
  }).catch(err =>{
		console.log('Error getting the user info', err);
		res.send("-1");
  });
  
});

function getParameters(params) {
    let dataToModify = {};
    if (params.hasOwnProperty('lat')) {
        dataToModify.latitud = params.lat;
    }
    if (params.hasOwnProperty('lon')) {
        dataToModify.longitud = params.lon;
    }
    if (params.hasOwnProperty('un')) {
        dataToModify.username = params.un;
    }
    if (params.hasOwnProperty('n')) {
        dataToModify.name = params.n;
    }
    if (params.hasOwnProperty('pw')) {
        dataToModify.password = params.pw;
    }
    if (params.hasOwnProperty('distanciamaxima')) {
        dataToModify.distanciamaxima = params.distanciamaxima;
    }
    return dataToModify;
}



// // auth trigger (new user signup)
// exports.SignUp = functions.auth.user().onCreate(user => {
//     // for background triggers you must return a value/promise
//     return admin.firestore().collection('user').doc(user.uid).set({
//         name: "",
//         latitud: 0,
//         longitud: 0,
//         offer: [],
//         wish: [],
//         favorite: []
//     });
// });

// // auth trigger (user deleted)
// exports.Deleted = functions.auth.user().onDelete(user => {
//     const doc = admin.firestore().collection('users').doc(user.uid);
//     return doc.delete();
// });
