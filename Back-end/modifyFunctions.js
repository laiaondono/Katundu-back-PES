const functions = require('firebase-functions');
const admin = require('firebase-admin');

// FUNCIONS D'AFEGIR

exports.offer = functions.https.onRequest(async (req, res) => {
    const id = req.query.id;
    let dades = getParameters(req.query);
    if(dades.name === null || dades.value === null){
        res.send("3")//this values cannot be empty
        return null
    }
    let offerRef = admin.firestore().collection("offer").doc(id);
    let offerDoc = await offerRef.get().catch(err => {
        console.log("Error getting document", err);
        res.send("-1"); //Error getting the document
    });
    if(!offerDoc.exists){
        res.send("1"); //The offer doesn't exist
    }
    else{
        offerRef.update(dades).then(doc => {
            res.send(0);
            return null;
        }).catch(err => {
            console.log("An error have ocurred: ", err);
            res.send("2"); //error trying to update the offer
            return null;
        });
    }
    return null;
});

exports.wish = functions.https.onRequest(async (req, res) => {
    const id = req.query.id;
    let dades = getParameters(req.query);
    if(dades.name === null || dades.value === null){
        res.send("3")//this values cannot be empty
        return null
    }
    let wishRef = admin.firestore().collection("wish").doc(id);
    let wishDoc = await wishRef.get().catch(err => {
        console.log("Error getting document", err);
        res.send("-1"); //Error getting the document
    });
    if(!wishDoc.exists){
        res.send("1"); //The wish doesn't exist
    }
    else{
        wishRef.update(dades).then(doc => {
            res.send(0);
            return null;
        }).catch(err => {
            console.log("An error have ocurred: ", err);
            res.send("2"); //error trying to update the wish
            return null;
        });
    }
    return null;
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