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
    const user1 = await admin.firestore().collection('user').doc(params.username).get();
    let promises = []
    offers.forEach(async offer => {
        const promise = admin.firestore().collection('user').doc(offer.user).get().then(doc =>{
            const user2 = doc.data();
            var valid = true;
            if(params.username === offer.user) valid = false;
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
        promises.push(promise);
        console.log(prods);
    })
    await Promise.all(promises);
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

exports.posts = functions.https.onRequest(async (req, res) => {
    const postsRef = admin.firestore().collection('post').orderBy("time", "desc");
    const snapshot = await postsRef.get();
    res.send(snapshot.docs.map(doc => {
        let data = doc.data();
        data.time = data.time.toDate();
        data.id = doc.id;
        return data;
    }));
    return null;

});

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
        return data;
    }
}
