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
	  distanciamaxima: 10
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
//Afegeix un nou desig a la llista de desitjos i al array de desitjos de l'usuari
exports.addwish = functions.https.onRequest(async (req,res) => {

	const user = req.query.user;
	const name = req.query.name;
	const category = req.query.category;
	const type = req.query.type;
	const keywords = req.query.keywords;
	const value = parseFloat(req.query.value);

	let addDoc = admin.firestore().collection('wish').add({
	  user: user,
	  name: name,
	  category: category,
	  type: type,
	  keywords: keywords,
	  value: value,

	}).then(ref => {
	  console.log('Added wish with ID: ', ref.id);

	//AFEGIR ID WISH A LA LLISTA DE WISHES DE L'USUARI
	//Si no té l'array el crea
	admin.firestore().collection('user').doc(user).update({
	  wish: admin.firestore.FieldValue.arrayUnion(ref.id)
	})
	res.send(ref.id);
	return null;

	}).catch(err =>{
		console.log('Error adding a new wish', err);
		res.send("-1");
	});

});


exports.deleteoffer = functions.https.onRequest(async (req, res) => {

    //Pre: the offer exists
    //Post: the offer is no longer in the database

    //Grabing the parameters
    const id = req.query.id;

    //Getting the offer's document
    var offerRef = admin.firestore().collection('offer').doc(id);

    //Getting the offer's user
    let usersOffer;
    offerRef.get().then(doc => {
        usersOffer = doc.data().user;
        return null;
    }).catch(err => {
        console.log('Error getting the document', err);
        res.send("-1");
    });

    //Deleting the offer
    let deleteOffer = offerRef.delete();

    //Checking if the offer was deleted successfully
    deleteOffer.then(r => {
        console.log('Delete: ', r);
        let offerRefCheck = admin.firestore().collection('offer').doc(id);
        // eslint-disable-next-line promise/no-nesting
        offerRefCheck.get().then(doc => {
            if (!doc.exists) {

                //Deleting the offer from the user's offers
                let userRef = admin.firestore().collection('user').doc(usersOffer);

                // eslint-disable-next-line promise/no-nesting
                userRef.update({offer: admin.firestore.FieldValue.arrayRemove(id)})
                    .then(ref => {
                    res.send("0");
                    console.log('Delete', ref);
                    // eslint-disable-next-line promise/no-nesting
                    return null;
                }).catch(err => {
                    console.log('Error getting the document', err);
                    res.send("-1");
                });
            } else {
                res.send("1");
            }
            // eslint-disable-next-line promise/no-nesting
            return null;
        }).catch(err => {
            console.log('Error getting the document', err);
            res.send("-1");
        });
        return null;
    }).catch(err => {
        console.log('Error getting the document', err);
        res.send("-1");
    });
});

exports.deletewish = functions.https.onRequest(async (req, res) => {

    //Pre: the wish exists
    //Post: the wish is no longer in the database

    //Grabing the parameters
    const id = req.query.id;

    //Getting the wish’s document
    var wishRef = admin.firestore().collection('wish').doc(id);

    //Getting the wish’s user
    let usersWish;
    wishRef.get().then(doc => {
        usersWish = doc.data().user;
        return null;
    }).catch(err => {
        console.log('Error getting the document', err);
        res.send("-1");
    });

    //Deleting the wish
    let deleteWish = wishRef.delete();

    //Checking if the wish was deleted successfully
    deleteWish.then(r => {
        console.log('Delete: ', r);
        let wishRefCheck = admin.firestore().collection('wish').doc(id);
        // eslint-disable-next-line promise/no-nesting
        wishRefCheck.get().then(doc => {
            if (!doc.exists) {

                //Deleting the wish from the user's wishes
                let userRef = admin.firestore().collection('user').doc(usersWish);

                // eslint-disable-next-line promise/no-nesting
                userRef.update({wish: admin.firestore.FieldValue.arrayRemove(id)})
                    .then(ref => {
                        res.send("0");
                        console.log('Delete', ref);
                        // eslint-disable-next-line promise/no-nesting
                        return null;
                    }).catch(err => {
                    console.log('Error getting the document', err);
                    res.send("-1");
                });
            } else {
                res.send("1");
            }
            // eslint-disable-next-line promise/no-nesting
            return null;
        }).catch(err => {
            console.log('Error getting the document', err);
            res.send("-1");
        });
        return null;
    }).catch(err => {
        console.log('Error getting the document', err);
        res.send("-1");
    });
});

exports.deletefavorite = functions.https.onRequest(async (req, res) => {

    //Pre: the favorite exists
    //Post: the favorite is no longer in the database

    //Grabing the parameters
    const id = req.query.id;
    const un = req.query.un;

    //Deleting the favorite
    var userRef = admin.firestore().collection('user').doc(un);
    // eslint-disable-next-line promise/no-nesting
    userRef.update({favorite: admin.firestore.FieldValue.arrayRemove(id)})
        .then(ref => {
            res.send("0");
            console.log('Delete', ref);
            // eslint-disable-next-line promise/no-nesting
            return null;
        }).catch(err => {
        console.log('Error getting the document', err);
        res.send("-1");
    });
});

exports.addoffer = functions.https.onRequest(async (req, res) => {

    const user = req.query.user;
    const name = req.query.name;
    const category = req.query.category;
    const type = req.query.type;
    const keywords = req.query.keywords;
    const value = parseFloat(req.query.value);
    const description = req.query.description;

    admin.firestore().collection('offer').add({
        user: user,
        name: name,
        category: category,
        type: type,
        keywords: keywords,
        value: value,
        description: description

    }).then(ref => {
        console.log('New offer: ', ref.id);

        admin.firestore().collection('user').doc(user).update({
            offers: admin.firestore.FieldValue.arrayUnion(ref.id)
        });
        res.send(ref.id);
        return null;
    }).catch(err => {
        console.log('Error when adding an offer', err);
        res.send(-1);
    });
});

exports.modifywish = functions.https.onRequest(async (req, res) => {

  //Pre: the wish and the user exists
  //Post: the wish has the new information

  //id of the wish to change information
  const id = req.query.id;

  //new information
	const n = req.query.name;
	const cat = req.query.category;
	const ty = req.query.type;
	const kwords = req.query.keywords;
	const val = req.query.value;

  if(n === null || val === null){
    res.send("3")//this values cannot be empty
    return null
  }
  let docRef = admin.firestore().collection("wish").doc(id);
  let getDoc = docRef.get().then(doc => {
    if (!doc.exists) {
      res.send("1"); //The wish doesn't exist
      return null;
    } else {
      try{
        docRef.update({
          category: cat,
          keywords: kwords,
          name: n,
          type: ty,
          value: val
        });
        res.send("0"); //Ok
      }
      catch(error){
        res.send("2"); //error trying to update the wish
      }
      return null;
    }
    }).catch(err => {
      res.send("Error getting document"+err);
      res.send("-1"); //Error getting the document
    });
});

exports.modifyoffer = functions.https.onRequest(async (req, res) => {

  //Pre: the offer and the user exists
  //Post: the offer has the new information

  //id of the offer to change information
  const id = req.query.id;

  //new information
	const n = req.query.name;
	const cat = req.query.category;
	const ty = req.query.type;
	const kwords = req.query.keywords;
	const val = req.query.value;
  const descrpt = req.query.description;

  if(n === null || val === null){
    res.send("3")//name and value cannot be empty
    return null
  }
  let docRef = admin.firestore().collection("offer").doc(id);
  let getDoc = docRef.get().then(doc => {
    if (!doc.exists) {
      res.send("1"); //The user doesn't exist
      return null;
    } else {
      try{
        docRef.update({
          name: n,
          category: cat,
          type: ty,
          keywords: kwords,
          value: val,
          description: descrpt
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

//Returns the user information
exports.infouser = functions.https.onRequest(async (req,res) => {

	const username = req.query.username;
	
	let user = admin.firestore().collection('user').doc(username);


	let getDoc = user.get().then(doc => {
	  
	let data = {
	  name: doc.data().name,
	  password: doc.data().password,
	  latitud: doc.data().latitud,
	  longitud: doc.data().longitud,
	  wish: doc.data().wish,
	  offer: doc.data().offer,
	  distancia: doc.data().distanciamaxima

	}
	  res.send(data);
	  return null;
	
	}).catch(err =>{
		console.log('Error getting the user info', err);
		res.send("-1");
	});

});

exports.getOffers = functions.https.onRequest(async (req, res) => {
    const user = req.query.un;
    let offers = await getCollection(user, "offer").catch( err => {
        console.log(err);
        res.send("1");
    });
    if(Array.isArray(offers) && offers.length !== 0){
        let resultat = await getElements(offers, "offer");
        res.send(resultat);
    }  
});

exports.getWishes = functions.https.onRequest(async (req, res) => {
    const user = req.query.un;
    let wishes = await getCollection(user, "wish").catch(err => {
        console.log(err);
        res.send("1");
    });
    if(Array.isArray(wishes)){
        let resultat = await getElements(wishes, "wish");
        res.send(resultat);
    }
});

exports.getFavorites = functions.https.onRequest(async (req, res) => {
    const user = req.query.un;
    let favorites = await getCollection(user, "favorite").catch(err => {
        console.log(err);
        res.send("1");
    });
    if(Array.isArray(favorites)){
        let resultat = await getElements(favorites, "offer");
        res.send(resultat);
    }
});

async function getCollection(user, nameColl){
    let docRef = admin.firestore().collection("user").doc(user);
    let collection = [];
    await docRef.get().then(doc => {
        if (!doc.exists) {	
            throw new Error("User doesn't exist");
        } else {
            collection = doc.data()[nameColl];
        }
        return;        
    }).catch(err => {throw err;});
    return collection;
}

async function getElements(elements, nameColl){
    let resultat = [];
    let promises = [];
    elements.forEach(element => {
        let elemRef = admin.firestore().collection(nameColl).doc(element);
        let promise = elemRef.get().then(doc => {
            let data = doc.data();
            data.id = doc.id;
            resultat.push(data);
            return;
        });
        promises.push(promise);
    });
    await Promise.all(promises);    // esperem a que s'hagin afegit tots
    return resultat;
}

exports.searchuser = functions.https.onRequest(async (req,res) => {

	const username = req.query.username;
	
  let user = admin.firestore().collection('user').doc(username);
  
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

exports.addfavorite = functions.https.onRequest(async (req,res) => {

	//The objectId is the id of another users offer
	const user = req.query.user;
	const objectId = req.query.objectId;

	admin.firestore().collection('user').doc(user).update({
	    favorite: admin.firestore.FieldValue.arrayUnion(objectId)
	}).catch(err =>{
		console.log('Error getting the user info', err);
		res.send("-1");
	});
	res.send("0");
	return null;

});
