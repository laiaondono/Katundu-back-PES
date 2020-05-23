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
            favorite: [...doc.data().favorite, favID],
            trofeo: admin.firestore.FieldValue.arrayUnion(4)
        });
        res.send("Favorite Added");
    }
    return;
});

exports.valoracio = functions.https.onRequest(async (req, res) => {
    const user = req.query.user; //usuari al que afegim la valoracio
    const punt = parseFloat(req.query.punt);
    const userRef = admin.firestore().collection('valoracio').doc(user);
    const userData = await userRef.get();
    if (!userData.exists) {
        let dataToAdd = {}
        dataToAdd.valoracio = [];
        let setnewdata = userRef.set(dataToAdd);
    } 
    userRef.update({
        valoracio: [...userData.data().valoracio, punt]
    })
    let valors = userData.data().valoracio;
    var val = punt;
    var nvals = 1;
    valors.forEach(valor => {
        val = val + valor;
        nvals = nvals + 1;
    })
    val = val/nvals;
    const profileRef = admin.firestore().collection('user').doc(user);
    const profileData = await profileRef.get();
    profileRef.update({
        valoracio: val
    })
    res.send("0");
    return null;
});

exports.post = functions.https.onRequest(async (req, res) => {
    let dades = getParameters(req.query);
    dades.time = FieldValue.serverTimestamp();
    let elemRef = admin.firestore().collection("post");
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
