const functions = require('firebase-functions');
const admin = require('firebase-admin');
var FieldValue = require("firebase-admin").firestore.FieldValue;

exports.create = functions.https.onRequest(async (req, res) => {
    //Grabing the parameters
    const user1 = req.query.un1;
    const user2 = req.query.un2;

    console.log('Users: ', user1, user2)

    //Accessing the collection 'user' and the user's personal document
    const userRef1 = admin.firestore().collection('user').doc(user1);
    const userRef2 = admin.firestore().collection('user').doc(user2);

    let continuar = true;
    let promises = [];
    let userData1, userData2;
    promises.push(userRef1.get().then(doc => {
        if(!doc.exists){
            continuar = false;
        } else {
            userData1 = doc.data();
        }
        return null;
    }));
    promises.push(userRef2.get().then(doc => {
        if(!doc.exists){
            continuar = false;
        } else {
            userData2 = doc.data();
        }
        return null;
    }));

    await Promise.all(promises);
    if(!continuar){
        res.send("1"); // user doesn't exist
        return null;
    }
    
    if(userData1.chats.hasOwnProperty(user2)){
        res.send(userData1.chats[user2]); // chat already exists
        return null;
    }
    
    const chatRef = admin.firestore().collection('chat');
    return chatRef.add({
        'user1': user1,
        'user2': user2,
        'messages': []
    }).then(doc => {
        res.send(doc.id);
        return null;
    }).catch(err => {
        console.log("An error have ocurred: ", err);
        res.send("-1");
        return null;
    });
});
