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

exports.chatCreated = functions.firestore.document('chat/{id}')
  .onCreate(async (snap, context) => {
    const chatID = context.params.id;
    const username1 = snap.data()['user1'];
    const username2 = snap.data()['user2'];
    // afegim la referencia al chat a l'usuari 1
    const user1 = admin.firestore().collection("user").doc(username1);
    const doc1 = await user1.get();
    let chats = doc1.data().chats;
    chats[username2] = chatID;
    await user1.update({
        chats: chats
    });
    // afegiom la referencia al chat a l'usuari 2
    const user2 = admin.firestore().collection("user").doc(username2);
    const doc2 = await user2.get();
    chats = doc2.data().chats;
    chats[username1] = chatID;
    await user2.update({
        chats: chats
    });
});

exports.messageCreated = functions.firestore.document('chat/{id}/messages/{idMessage}')
  .onCreate(async (snap, context) => {
    const chatID = context.params.id;
    const messageID = context.params.idMessage;
    const date = snap.data()['time'].toDate();
    let dateAsISOString = date.toISOString();
    let stringToShow = `Message ${messageID} added to ${chatID} at ${dateAsISOString}`;
    console.log(stringToShow);
    const messageRef = admin.firestore().collection("chat").doc(chatID).collection('messages').doc(messageID);
    return messageRef.update({
      time: date,
      order: dateAsISOString
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
