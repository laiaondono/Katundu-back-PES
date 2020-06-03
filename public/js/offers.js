async function getUrl(offerId){
    var storageRef = firebase.storage().ref();
    var listRef = storageRef.child('products/'+offerId);
    var url = [];
    let promises = []
    await listRef.listAll().then(async function(res) {
        res.items.forEach(async function(itemRef) {
          let promise = itemRef.getDownloadURL().then(doc => { url.push(doc)});
          promises.push(promise);
        });
    }).catch(function(error) {
        console.log(error)
    });
    await Promise.all(promises);
    return url;
}

var app = new Vue({
    el: '#app',
    data: {
        requests: [],
        myInterests: [],
        username: "",
        search: ""
    },
    mounted() {
        const ref = firebase.firestore().collection('offer');
        ref.onSnapshot(async snapshot => {
            let requests = [];
            let promises = [];
            snapshot.forEach(doc => {
                let promise = getUrl(doc.id).then(url => {
                    requests.push({ ...doc.data(), id: doc.id, url: url });
                })
                promises.push(promise)
            });
            await Promise.all(promises)
            this.requests = requests;
        });
        const getUserByUID = firebase.functions().httpsCallable('web-getUserByUID');
        getUserByUID().then(data => {
            this.username = data.data;
            const userRef = firebase.firestore().collection('interes').doc(this.username);
            userRef.get().then(data => {
                let interessos = data.data().match;
                console.log(interessos);
                this.requests.forEach(req => {
                    if(interessos.indexOf(req.id) > -1){
                        this.myInterests.push(req);
                    }
                })
            });
        });
    },
    methods: {
        // ANEM A OFFERS
        goToOffers() {
            const home = document.querySelector('#home');
            const surprise = document.querySelector('#surprise');
            const interest = document.querySelector('#interest');
            const match = document.querySelector('#match');
            home.classList.add('active');
            if (surprise.classList.contains('active')) {
                surprise.classList.remove('active');
            }
            if (interest.classList.contains('active')) {
                interest.classList.remove('active');
            }
            if (match.classList.contains('active')) {
                match.classList.remove('active');
            }
        },
        // ANEM A OFFERS
        goToSurprise() {
            const home = document.querySelector('#home');
            const surprise = document.querySelector('#surprise');
            const interest = document.querySelector('#interest');
            const match = document.querySelector('#match');
            surprise.classList.add('active');
            if (home.classList.contains('active')) {
                home.classList.remove('active');
            }
            if (interest.classList.contains('active')) {
                interest.classList.remove('active');
            }
            if (match.classList.contains('active')) {
                match.classList.remove('active');
            }
        },
        goToInterests(){
            const home = document.querySelector('#home');
            const surprise = document.querySelector('#surprise');
            const interest = document.querySelector('#interest');
            const match = document.querySelector('#match');
            interest.classList.add('active');
            if (home.classList.contains('active')) {
                home.classList.remove('active');
            }
            if (surprise.classList.contains('active')) {
                surprise.classList.remove('active');
            }
            if (match.classList.contains('active')) {
                match.classList.remove('active');
            }
        },
        goToMatch(){
            const home = document.querySelector('#home');
            const surprise = document.querySelector('#surprise');
            const interest = document.querySelector('#interest');
            const match = document.querySelector('#match');
            match.classList.add('active');
            if (home.classList.contains('active')) {
                home.classList.remove('active');
            }
            if (interest.classList.contains('active')) {
                interest.classList.remove('active');
            }
            if (surprise.classList.contains('active')) {
                surprise.classList.remove('active');
            }
        },
        // SHOW INFO
        async showInfoOffer(offer) {
            Swal.fire({
                title: `${offer.name}`,
                html: `<p>User: ${offer.user}</p><p>Value: ${offer.value}€</p><p>Description: ${offer.description}</p>`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Close',
                confirmButtonText: 'Add to favorite!',
                imageUrl: `${offer.url}`,
                imageHeight: 400,
                imageAlt: 'Custom image',
            }).then((result) => {
                if (result.value) {
                    const ref = firebase.firestore().collection('user').doc(this.username);
                    ref.update({
                        favorite: firebase.firestore.FieldValue.arrayUnion(offer.id)
                    }).then(() => {
                        Swal.fire("Good Job");
                    }).catch(err => {
                        Swal.fire(err)
                    })
                }
            })
        },

        filterOffer(){
            return this.requests.filter(req => {
                return (req.name.includes(this.search) || req.description.includes(this.search)  || req.keywords.includes(this.search))
            })
        },
    }
});