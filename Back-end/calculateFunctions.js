const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.interes = functions.https.onRequest(async (req, res) => {
    let users = await getUsers();
    console.log("Tinc users");
    let offers = await getOffers();
    console.log("Tinc Offers");
    let wishes = await getWishes();
    console.log("Tinc Wishes");
    let resultat = getOffersWished(offers, wishes, users);
    await addInterests(resultat);
    console.log("Interessos afegits");
    res.send(resultat);
    return null;
});

exports.match = functions.https.onRequest(async (req, res) => {
    let offers = await getOffers();
    let offersDic = {};
    offers.forEach(doc => {
        offersDic[doc.id] = doc;
    });

    let interes = await getInteres();
    let mutuals = calculateMutuals(interes, offersDic);
    await addMatch(mutuals);
    res.send(mutuals);
    return null;
});

async function getOffers() {
    const snapshot = await admin.firestore().collection('offer').get()
    return snapshot.docs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });
}

async function getWishes() {
    const snapshot = await admin.firestore().collection('wish').get()
    return snapshot.docs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });
}

async function getUsers() {
    const snapshot = await admin.firestore().collection('user').get()
    let temp = snapshot.docs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });
    let resultat = {};
    temp.forEach(user => {
        resultat[user.id] = user;
    });
    return resultat;
}

async function getInteres() {
    const snapshot = await admin.firestore().collection('interes').get()
    let temp = snapshot.docs.map(doc => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });
    let resultat = {};
    temp.forEach(doc => {
        resultat[doc.id] = doc;
        delete resultat[doc.id].id;
    });
    return resultat;
}

async function addInterests(matches) {
    let promises = [];
    for(var key in matches) {
        var value = matches[key];
        let matchRef = admin.firestore().collection('interes').doc(key);
        let promise = matchRef.set({
            match: value
        });
        promises.push(promise)
    }
    await Promise.all(promises);
    return null;
}

async function addMatch(matches){
    let data = {}
    matches.forEach(match => {
        if(data.hasOwnProperty(match.user1)){
            data[match.user1].push(match);
        }
        else{
            data[match.user1] = [match];
        }
    })
    let promises = [];
    for(var key in data) {
        let matchRef = admin.firestore().collection('match').doc(key);
        let promise = matchRef.set({
            match: data[key]
        });
        promises.push(promise)
    }
    await Promise.all(promises);
    return null;
}

function getOffersWished(offers, wishes, users){
    let usersData = {};
    for(var user in users){
        usersData[user] = [];
    }  
    wishes.forEach(wish => {
        offers.forEach(offer => {
            if(isAMatch(offer, wish)){
                var us1 = users[offer.user];
                var us2 = users[wish.user];
                if(getDistanceFromLatLonInKm(us1,us2)){
                    if(usersData[wish.user].indexOf(offer.id) === -1){
                        usersData[wish.user].push(offer.id);
                    }
                }
            }
        })
    });
    return usersData;
}

function calculateMutuals(interes, offers){
    resultat = [];
    for(var user1 in interes){
        let matchsUser1 = interes[user1].match;
        
        for(var user2 in interes){
            let matchsUser2 = interes[user2].match;

            if(user1 !== user2){
                let conjunt = calculatePairs(user1, user2, matchsUser1, matchsUser2, offers);
                resultat = [...resultat, ...conjunt];
            }
        }
    }
    return resultat;
}

function calculatePairs(user1, user2, matchsUser1, matchsUser2,offers){
    result = [];
    matchsUser1.forEach(offer1 => {
        matchsUser2.forEach(offer2 => {
            //console.log("User 1:", user1, "Offer 1:", offers[offer1]);
            //console.log("User 2:", user2, "Offer 2:", offers[offer2]);
            if(isAOfferMatch(user1, user2, offers[offer1], offers[offer2])){
                console.log("IS A MATCH!!!");
                result.push({'user1': user1, 'user2': user2, 'offer1': offer1, 'offer2': offer2});
            }
        })
    });
    return result;
}

function isAMatch(offer, wish){
    if(wish.user === offer.user){
        return false;
    }
    else if(offer.name === wish.name){
        if(offer.value*0.8 < wish.value && offer.value*1.2 > wish.value){
            return true;
        }
        else {
            return false;
        }
    }
    else{
        return false;
    }
}

function isAOfferMatch(user1, user2, offer1, offer2){
    //console.log(user1, offer2.user, user2, offer1.user)
    if(offer1.user !== user2 || offer2.user !== user1){
        return false;
    }
    else{
        return true;
    }
}

// FUNCIONS DE DISTANCIA

function getDistanceFromLatLonInKm(user1, user2) {
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
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
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