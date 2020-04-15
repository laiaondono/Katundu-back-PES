const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.offerMatch = functions.https.onRequest(async (req, res) => {
    let offers = await getOffers();
    //console.log(offers);
    let wishes = await getWishes();
    //console.log(wishes);
    let resultat = getOffersWished(offers, wishes);
    addMatches(resultat);
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

async function addMatches(matches) {
    let promises = [];
    for(var key in matches) {
        var value = matches[key];
        // do something with "key" and "value" variables
        let matchRef = admin.firestore().collection('match').doc(key);
        let promise = matchRef.set({
            match: value
        });
        promises.push(promise)
    }
    await Promise.all(promises);
    return;
}

function getOffersWished(offers, wishes){
    let users = {};
    wishes.forEach(wish => {
        users[wish.user] = [];
    });
    wishes.forEach(wish => {
        offers.forEach(offer => {
            if(isAMatch(offer, wish)){
                users[wish.user] = [...users[wish.user], offer.id];
            }
        })
    });
    return users;
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