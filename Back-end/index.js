// const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.get = require('./getFunctions');
exports.on = require('./onEvent');
exports.add = require('./addFunctions');
exports.modify = require('./modifyFunctions');
exports.delete = require('./deleteFunctions');
exports.user = require('./userFunctions');
exports.calculate = require('./calculateFunctions');

// // auth trigger (new user signup)
// exports.newUserSignUp = functions.auth.user().onCreate(user => {
//     // for background triggers you must return a value/promise
//     return admin.firestore().collection('users').doc(user.uid).set({
//         email: user.email,
//         upvotedOn: []
//     });
// });

// // auth trigger (user deleted)
// exports.userDeleted = functions.auth.user().onDelete(user => {
//     const doc = admin.firestore().collection('users').doc(user.uid);
//     return doc.delete();
// });

// // http callable function (adding a request)
// exports.addRequest = functions.https.onCall((data, context) => {
//     if (!context.auth) {
//         throw new functions.https.HttpsError(
//             'unauthenticated',
//             'only authenticated users can add requests'
//         );
//     }
//     if (data.text.length > 30) {
//         throw new functions.https.HttpsError(
//             'invalid-argument',
//             'request must be no more than 30 characters long'
//         );
//     }
//     const reqs = admin.firestore().collection('requests');
//     return reqs.add({
//         text: data.text,
//         upvotes: 0
//     }).then(() => {
//         return;
//     });
// });

// // upvote callable function
// exports.upvote = functions.https.onCall(async (data, context) => {
//     // check auth state
//     if (!context.auth) {
//         throw new functions.https.HttpsError(
//             'unauthenticated',
//             'only authenticated users can vote up requests'
//         );
//     }
//     // get refs for user doc & request doc
//     const user = admin.firestore().collection('users').doc(context.auth.uid);
//     const request = admin.firestore().collection('requests').doc(data.id);

//     const doc = await user.get();
//     // check thew user hasn't already upvoted
//     if (doc.data().upvotedOn.includes(data.id)) {
//         throw new functions.https.HttpsError(
//             'failed-precondition',
//             'You can only vote something up once'
//         );
//     }

//     // update the array in user document
//     await user.update({
//         upvotedOn: [...doc.data().upvotedOn, data.id]
//     });

//     // update the votes on the request
//     return request.update({
//         upvotes: admin.firestore.FieldValue.increment(1)
//     });
// });


// /* MY FUNCTIONS */

// // http callable function (adding a NEW OBJECT)
// exports.addOffer = functions.https.onCall((data, context) => {
//     if (!context.auth) {
//         throw new functions.https.HttpsError(
//             'unauthenticated',
//             'only authenticated users can add requests'
//         );
//     }
//     if (data.text.length > 30) {
//         throw new functions.https.HttpsError(
//             'invalid-argument',
//             'request must be no more than 30 characters long'
//         );
//     }
//     let type;
//     if(data.type === "Object"){
//         type = "objects";
//     }
//     else{
//         type = "services";
//     }
//     const reqs = admin.firestore().collection(type);
//     return reqs.add({
//         text: data.text,
//         description: "Not yet implemented",
//         price: data.price,
//     }).then(() => {
//         return;
//     });
// });

// // const snapshot = await firestore.collection("posts").orderBy("lastModified", "desc").limit(100).get()
// // res.send(snapshot.docs.map(doc => doc.data()))