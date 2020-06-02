const functions = require('firebase-functions');
const admin = require('firebase-admin');

// end exchange
exports.exchange = functions.https.onRequest(async (req, res) => {
    const id1 = req.query.id1;
    const id2 = req.query.id2;
    let offerRef1 = admin.firestore().collection("offer").doc(id1);
    let offerRef2 = admin.firestore().collection("offer").doc(id2);
    let promises = []
    let offers = []
    promises.push(offerRef1.get().then(doc => {
        offers.push(doc);
        return null;
    }).catch(err => {
        console.log("Error getting document", err);
        res.send("-1");
        return null;
    }));
    promises.push(offerRef2.get().then(doc => {
        offers.push(doc);
        return null;
    }).catch(err => {
        console.log("Error getting document", err);
        res.send("-1");
        return null;
    }));

    await Promise.all(promises);
    if(!offers[0].exists || !offers[1].exists){
        res.send("1"); //The offer doesn't exist
    }
    else{
        console.log("Les dues ofertes existeixen")
        let intercanvis = admin.firestore().collection("exchanges");
        intercanvis.add(offers[0].data());
        intercanvis.add(offers[1].data());
        offerRef1.delete();
        offerRef2.delete();
        res.send("0")
    }
    return null;
});

exports.done = functions.firestore.document('exchanges/{id}')
.onCreate((snap, context) => {
  const offerID = context.params.id;
  const username = snap.data()['user'];
  const user = admin.firestore().collection("user").doc(username);
  return user.update({
        exchange:  admin.firestore.FieldValue.arrayUnion(offerID),
    //   trofeo: admin.firestore.FieldValue.arrayUnion(1)
  });
});