// FUNCIONS D'ELIMINAR

const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.offer = functions.https.onRequest(async (req, res) => {
    const id = req.query.id;
    var offerRef = admin.firestore().collection('offer').doc(id);
    return offerRef.delete().then(() => res.send("0"));
});

exports.wish = functions.https.onRequest(async (req, res) => {
    const id = req.query.id;
    var wishRef = admin.firestore().collection('wish').doc(id);
    return wishRef.delete().then(() => res.send("0"));
});

exports.favorite = functions.https.onRequest(async (req, res) => {
    const user = req.query.un;
    const id = req.query.id;
    //Deleting the favorite
    var userRef = admin.firestore().collection('user').doc(un);
    userRef.update({
        favorite: admin.firestore.FieldValue.arrayRemove(id)
    }).then(ref => {
        res.send("0");
        return null;
    }).catch(err => {
        console.log('Error getting the document', err);
        res.send("-1");
        return null;
    });
    return null;
});