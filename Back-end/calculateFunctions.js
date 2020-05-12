const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.offerMatch = functions.https.onRequest(async (req, res) => {
    let offers = await getOffers();
    console.log("Tinc Offers");
    let wishes = await getWishes();
    console.log("Tinc Wishes");
    let resultat = getOffersWished(offers, wishes);
    console.log("Tinc Resultat")
    res.send(resultat);
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

function getOffersWished(offers, wishes){
    let users = {};
    wishes.forEach(wish => {
        users[wish.user] = [];
    });
    wishes.forEach(wish => {
        offers.forEach(offer => {
            if(isAMatch(offer, wish)){
                var us1 = admin.firestore().collection('user').doc(offer.user);
                var us2 = admin.firestore().collection('user').doc(wish.user);
                if(getDistanceFromLatLonInKm(us1,us2)){
                    users[wish.user] = [...users[wish.user], offer.id];
                }
            }
        })
    });
    return users;
}

function getDistanceFromLatLonInKm(user1, user2) {
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
