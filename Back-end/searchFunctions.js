const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.user = functions.https.onRequest(async (req, res) => {
    const username = req.query.username;
    let user = admin.firestore().collection('user').doc(username);
    user.get().then(doc => {
        if (!doc.exists) {
            res.send("1"); //The user doesn't exist
            return null;
        } else {
            let data = {
                name: doc.data().name
            }
            res.send(data);//usuari existeix
            return null;
        }
    }).catch(err => {
        console.log('Error getting the user info', err);
        res.send("-1");
    });
});