const functions = require('firebase-functions');
const admin = require('firebase-admin');

// FUNCIONS AUTOMATIQUES

exports.offerCreated = functions.firestore.document('offer/{id}')
  .onCreate((snap, context) => {
    const offerID = context.params.id;
    const username = snap.data()['user'];
    const user = admin.firestore().collection("user").doc(username);
    return user.get().then(doc => {
        return user.update({
            offer: [...doc.data().offer, offerID]
        });
    });
});

exports.wishCreated = functions.firestore.document('wish/{id}')
  .onCreate(async (snap, context) => {
    const wishID = context.params.id;
    const username = snap.data()['user'];
    const user = admin.firestore().collection("user").doc(username);
    const doc = await user.get();
    return user.update({
        wish: [...doc.data().wish, wishID]
    });
});

exports.offerDeleted = functions.firestore.document('offer/{id}')
  .onDelete(async (snap, context) => {
    const offerID = context.params.id;
    const username = snap.data()['user'];
    const user = admin.firestore().collection("user").doc(username);
    const doc = await user.get();
    if(doc.exists){
      return user.update({
        offer: doc.data().offer.filter(value => {return value !== offerID})
      });
    } else {
      return null;
    }
    
});

exports.wishDeleted = functions.firestore.document('wish/{id}')
  .onDelete(async (snap, context) => {
    const wishID = context.params.id;
    const username = snap.data()['user'];
    const user = admin.firestore().collection("user").doc(username);
    const doc = await user.get();
    if(doc.exists){
      return user.update({
          wish: doc.data().wish.filter(value => {return value !== wishID})
      });
    } else {
      return null;
    }
});

exports.userDeleted = functions.firestore.document('user/{username}')
  .onDelete(async (snap, context) => {
    let promises = []
    const offers = snap.data()['offer'];
    offers.forEach(element => {
      var offerRef = admin.firestore().collection('offer').doc(element);
      let promise = offerRef.delete();
      promises.push(promise)
    });
    const wishes = snap.data()['wish'];
    wishes.forEach(element => {
      var wishRef = admin.firestore().collection('wish').doc(element);
      let promise = wishRef.delete();
      promises.push(promise)
    });
    return Promise.all(promises);
});