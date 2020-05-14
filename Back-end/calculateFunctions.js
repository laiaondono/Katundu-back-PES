const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.offerMatch = functions.https.onRequest(async (req, res) => {
    let offers = await getOffers();
    console.log("Tinc Offers");
    let wishes = await getWishes();
    console.log("Tinc Wishes");
    //Fins aqui funciona bé
    getOffersWished(offers, wishes);
    console.log("Tinc Resultat")
    return "0";
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
    wishes.forEach(wish => {
        offers.forEach(offer => {
            if(isAMatch(offer, wish)){
                var us1 = admin.firestore().collection('user').doc(offer.user);
                var us2 = admin.firestore().collection('user').doc(wish.user);
                if(getDistanceFromLatLonInKm(us1,us2)){
                    let offer2 = SearchOfferMatch(us2, us1);
                    if(offer2 === "0"){
                        addInteres(us2, offer);
                    }
                    else{
                        addMatches(offer, offer2);
                    }
                }
            }
            console.log("finish one wish");
        })
    });
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

function SearchOfferMatch(usuariW, usuariO){
    //usuariW busca oferta
    //usuariO busca wish
    let Ofertes = usuariW.offer;
    let Wishes = usuariO.wish;
    //console.log(Wishes);
    //console.log(Ofertes);
    if(Wishes === undefined || Ofertes === undefined){
        return "0";
    }
    else{
        Wishes.forEach(wish => {
            Ofertes.forEach(offer => {
                if(isAMatch(offer, wish)){
                    return offer;
                }
            })
        });
        return "0";
    }
}

async function addMatches(oferta1, oferta2) {
    let addDoc = admin.firestore().collection('match').add({
        oferta1: oferta1,
        oferta2: oferta2,
  
      }).then(ref => {
        console.log('Added wish with ID: ', ref.id);

      admin.firestore().collection('user').doc(user).update({
        match: admin.firestore.FieldValue.arrayUnion(ref.id)
      })
      res.send(ref.id);
  
      return null;
  
      }).catch(err =>{
          console.log('Error adding a new match', err);
          res.send("-1");
      });
}

async function addInteres(usuari, oferta) {
    const userRef = admin.firestore().collection('interes').doc(usuari);
    let userData = await userRef.get().catch(() => {
        res.send("-1"); 
        return null;
    });
    if (userData.exists) {
        userRef.update({
            offer : admin.firestore.FieldValue.arrayUnion(oferta)
        })
    } else {
        dataToAdd.offer = [];
        dataToAdd.offer.push(oferta);
        let setnewdata = userRef.set(dataToAdd);
        res.send("0"); // Interes Created
        return setnewdata;
    }
}
