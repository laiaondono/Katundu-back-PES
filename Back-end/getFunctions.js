const functions = require('firebase-functions');
const admin = require('firebase-admin');

// funcio per agafar totes les ofertes d'un usuari
// per la funció de wish s'ha de canviar offer per wish
exports.offers = functions.https.onRequest(async (req, res) => {
    const user = req.query.un;
    let offers = await getCollection(user, "offer").catch( err => {
        console.log(err);
        res.send("1");
    });
    if(Array.isArray(offers)){
        let resultat = await getElements(offers, "offer");
        res.send(resultat);
    }  
});

exports.wishes = functions.https.onRequest(async (req, res) => {
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


exports.favorites = functions.https.onRequest(async (req, res) => {
    const user = req.query.un;
    let favorites = await getCollection(user, "favorite").catch(err => {
        console.log(err);
        res.send("-1");
    });
    if(Array.isArray(favorites)){
        let resultat = await getElements(favorites, "offer");
        res.send(resultat);
    }
    else{
        res.send("-1")
    }
});

exports.chats = functions.https.onRequest(async (req, res) => {
    const user = req.query.un;
    let chats = await getCollection(user, "chats").catch(err => {
        console.log(err);
        res.send("-1");
    });
    res.send(Object.keys(chats).map((key) => { 
        return {"user": key, "id": chats[key]}; 
    }));
});

exports.infoUser = functions.https.onRequest(async (req, res) => {
    const user = req.query.un;
    let info = await getElements([user], "user").catch(err => {
        console.log(err);
        res.send("-1");
    });
    if(Array.isArray(info) && info.length > 0){
        res.send(filterUser(info[0]));
    }
    else{
        res.send("-1");
    }
});

exports.products = functions.https.onRequest(async (req, res) => {
    const params = req.query;
    let prods = [];
    let offers = await getOffers();
    var us1 = admin.firestore().collection('user').doc(params.username);

	offers.forEach(offer => {
	var us2 = admin.firestore().collection('user').doc(offer.user);
	var valid = true;
	if(!getDistanceFromLatLonInKm(us1,us2)) valid = false;
		if(params.hasOwnProperty('name') && valid){
			if(params.name !== offer.name)
				valid = false;
		}
		if (params.hasOwnProperty('category') && valid){
			if(params.category !== offer.category)
				valid = false;
		}
		if (params.hasOwnProperty('value') && valid){
			if(!(params.value*0.8 < offer.value && params.value*1.2 > offer.value))
				valid = false;
		}
		if (params.hasOwnProperty('type') && valid){
			if(params.type !== offer.type)
				valid = false;
		}
		if (params.hasOwnProperty('keyword') && valid){
			if(!(offer.keywords.includes(params.keyword)))
				valid = false;
		}
		if(valid) prods.push(offer);
	})
	res.send(prods);
	return prods;

});

exports.users = functions.https.onRequest(async (req, res) => {
    let users = [];
    let usersRef = admin.firestore().collection("user").get()
    .then(snapshot=>{
        snapshot.forEach(doc =>{
        let data = {
            username: doc.id
        }
            users.push(data);
        });
        res.send(users);
        return null;
    })
    .catch(err => {
    console.log('Error getting documents', err);
  });

});

exports.matches = functions.https.onRequest(async (req, res) => {
    const user = req.query.un;
    const matches = await admin.firestore().collection('match').doc(user).get();
    let result = [];
    let promises = [];
    matches.data().match.forEach(match => {
        let promise = getPair(match).then(pair => {
            result.push(pair);
            return null;
        });
        promises.push(promise);
    });
    await Promise.all(promises);
    res.send(result);
    return null;
});

exports.products = functions.https.onRequest(async (req, res) => {
    const params = req.query;
    let prods = [];
    let offers = await getOffers();


    const user1 = await admin.firestore().collection('user').doc(params.username).get();
    let promises = []
    offers.forEach(async offer => {
    	
    	const promise = admin.firestore().collection('user').doc(offer.user).get().then(doc =>{
            const user2 = doc.data();
            var valid = true;
            if(user1.data().username === user2.username) valid = false;
            if(!getDistanceFromLatLonInKm(user1.data(),user2)) valid = false;
            if(params.hasOwnProperty('name') && valid){
                if(params.name !== offer.name)
                    valid = false;
            }
            if (params.hasOwnProperty('category') && valid){
                if(params.category !== offer.category)
                    valid = false;
            }
            if (params.hasOwnProperty('value') && valid){
                if(!(params.value*0.8 < offer.value && params.value*1.2 > offer.value))
                    valid = false;
            }
            if (params.hasOwnProperty('type') && valid){
                if(params.type !== offer.type)
                    valid = false;
            }
            if (params.hasOwnProperty('keyword') && valid){
                if(!(offer.keywords.includes(params.keyword)))
                    valid = false;
            }
            if(valid) prods.push(offer);    
            return null;        
        });
        promises.push(promise)
;
        console.log(prods);
    })
    await Promise.all(promises);
    res.send(prods);
    return prods;

});

function getDistanceFromLatLonInKm(user1, user2) {
    console.log(user1);
    console.log(user2);
    if(user1 === undefined || user2 === undefined){
        return false;
    }
    var lat1 = parseFloat(user1.latitud);
    var lon1 = parseFloat(user1.longitud);
    var lat2 = parseFloat(user2.latitud);
    var lon2 = parseFloat(user2.longitud);
    var dismaxima = Math.min(parseFloat(user1.distanciamaxima), parseFloat(user2.distanciamaxima));
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1))  Math.cos(deg2rad(lat2))  
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    if(d<=dismaxima){
        return true;
    }
    else return false;
  }
  
function deg2rad(deg) {
    return deg * (Math.PI/180);
}

async function getOffers() {
    const snapshot = await admin.firestore().collection('offer').get()
    return snapshot.docs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });
}

async function getPair(match){
    let pair = {}
    await admin.firestore().collection('offer').doc(match.offer1).get().then(doc => {
        pair["offer1"] = doc.data();
        pair["offer1"].id = doc.id;
        return null;
    });
    await admin.firestore().collection('offer').doc(match.offer2).get().then(doc => {
        pair["offer2"] = doc.data();
        pair["offer2"].id = doc.id;
        return null;
    });
    console.log(pair);
    return pair;
}

async function getCollection(user, nameColl){
    let docRef = admin.firestore().collection("user").doc(user);  // all data from user
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
            let oferta = doc.data();
            oferta.id = doc.id;
            resultat.push(oferta);
            return;
        });
        promises.push(promise);
    });
    await Promise.all(promises);    // esperem a que s'hagin afegit tots
    return resultat;
}

function filterUser(data){
    if(typeof data !== 'object'){
        return "-1";
    }
    else{
        delete data.wish;
        delete data.favorite;
        return data;
    }
}
