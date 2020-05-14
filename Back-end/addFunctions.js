const functions = require('firebase-functions');
const admin = require('firebase-admin');

// FUNCIONS D'AFEGIR

exports.offer = functions.https.onRequest(async (req, res) => {
    let dades = getParameters(req.query);
    let elemRef = admin.firestore().collection("offer");
    elemRef.add(dades).then(doc => {
        res.send(doc.id);
        return null;
    }).catch(err => {
        console.log("An error have ocurred: ", err);
        res.send("-1");
        return null;
    });
    return;
});

exports.wish = functions.https.onRequest(async (req, res) => {
    let dades = getParameters(req.query)
    let elemRef = admin.firestore().collection("wish");
    elemRef.add(dades).then(doc => {
        res.send(doc.id);
        return null;
    }).catch(err => {
        console.log("An error have ocurred: ", err);
        res.send("-1");
        return null;
    });
    return;
});

exports.favorite = functions.https.onRequest(async (req, res) => {
    const favID = req.query.id;
    const user = req.query.un;
    let userRef = admin.firestore().collection("user").doc(user);
    const doc = await userRef.get();
    if(doc.exists && doc.data().favorite.includes(favID)){
        res.send("Favorite duplicated");
    }
    else{
        await userRef.update({
            favorite: [...doc.data().favorite, favID]
        });
        res.send("Favorite Added");
    }
    return;
});

function getParameters(params){
    let dataToModify = {};
    if(params.hasOwnProperty('un')){
        dataToModify.user = params.un;
    }
    if(params.hasOwnProperty('user')){
        dataToModify.user = params.user;
    }
    if(params.hasOwnProperty('n')){
        dataToModify.name = params.n;
    }
    if(params.hasOwnProperty('name')){
        dataToModify.name = params.name;
    }
    if(params.hasOwnProperty('category')){
        dataToModify.category = params.category;
    }
    if(params.hasOwnProperty('type')){
        dataToModify.type = params.type;
    }
    if(params.hasOwnProperty('keywords')){
        dataToModify.keywords = params.keywords;
    }
    if(params.hasOwnProperty('value')){
        dataToModify.value = parseFloat(params.value);
    }
    if(params.hasOwnProperty('description')){
        dataToModify.description = params.description;
    }
    return dataToModify;
}