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
        user: {},
        myOffers: [],
        myWishes: [],
        myFavorites: []
    },
    async mounted() {
        // OBTENIR USER
        const getUserByUID = firebase.functions().httpsCallable('web-getUserByUID');
        let data = await getUserByUID();
        let username = data.data;
        const userRef = firebase.firestore().collection('user').doc(username);
        data = await userRef.get();
        this.user = data.data();
        let userFavorites = [];
        if (this.user.hasOwnProperty('favorite')) {
            userFavorites = this.user.favorite;
        }

        // GETTING MY OFFERS & FAVORITES
        const offersRef = firebase.firestore().collection('offer').orderBy('name', 'asc');
        offersRef.onSnapshot(async snapshot => {
            let offers = [];
            let favorites = [];
            let promises = [];
            snapshot.forEach(doc => {
                let promise = getUrl(doc.id).then(url => {
                    if (doc.data().user === username) {
                        offers.push({ ...doc.data(), id: doc.id, url: url });
                    }
                    if (userFavorites.indexOf(doc.id) > -1) {
                        favorites.push({ ...doc.data(), id: doc.id, url: url });
                    }
                })
                promises.push(promise)
            });
            await Promise.all(promises)
            this.myOffers = offers;
            this.myFavorites = favorites;
        });

        // GETTING MY WISHES
        const wishesRef = firebase.firestore().collection('wish').orderBy('name', 'asc');
        wishesRef.onSnapshot(snapshot => {
            let wishes = [];
            snapshot.forEach(doc => {
                if (doc.data().user === username) {
                    wishes.push({ ...doc.data(), id: doc.id });
                }
            });
            this.myWishes = wishes;
        });

        // ACTUALITZAR LES DADES DEL FORMULARI
        const update = document.querySelector('#update');
        if (this.user.hasOwnProperty('name')) {
            update.name.value = this.user.name;
        }
        if (this.user.hasOwnProperty('distanciamaxima')) {
            update.distance.value = this.user.distanciamaxima;
        }
        if (this.user.hasOwnProperty('password')) {
            update.password.value = this.user.password;
        }
    },
    methods: {
        // ANEM A OFFERS
        goToOffers() {
            const offers = document.querySelector('#offers');
            const wishes = document.querySelector('#wishes');
            const favorites = document.querySelector('#favorites');
            const info = document.querySelector('#info');
            const home = document.querySelector('#home');
            offers.classList.add('active');
            if (wishes.classList.contains('active')) {
                wishes.classList.remove('active');
            }
            if (favorites.classList.contains('active')) {
                favorites.classList.remove('active');
            }
            if (info.classList.contains('active')) {
                info.classList.remove('active');
            }
            if (home.classList.contains('active')) {
                home.classList.remove('active');
            }
        },
        // ANEM A WISHES
        goToWishes() {
            const offers = document.querySelector('#offers');
            const wishes = document.querySelector('#wishes');
            const favorites = document.querySelector('#favorites');
            const info = document.querySelector('#info');
            const home = document.querySelector('#home');
            wishes.classList.add('active');
            if (offers.classList.contains('active')) {
                offers.classList.remove('active');
            }
            if (favorites.classList.contains('active')) {
                favorites.classList.remove('active');
            }
            if (info.classList.contains('active')) {
                info.classList.remove('active');
            }
            if (home.classList.contains('active')) {
                home.classList.remove('active');
            }
        },
        // ANEM A FAVORITES
        goToFavorites() {
            const offers = document.querySelector('#offers');
            const wishes = document.querySelector('#wishes');
            const favorites = document.querySelector('#favorites');
            const info = document.querySelector('#info');
            const home = document.querySelector('#home');
            favorites.classList.add('active');
            if (offers.classList.contains('active')) {
                offers.classList.remove('active');
            }
            if (wishes.classList.contains('active')) {
                wishes.classList.remove('active');
            }
            if (info.classList.contains('active')) {
                info.classList.remove('active');
            }
            if (home.classList.contains('active')) {
                home.classList.remove('active');
            }
        },
        // ANEM A Info
        goToInfo() {
            const offers = document.querySelector('#offers');
            const wishes = document.querySelector('#wishes');
            const favorites = document.querySelector('#favorites');
            const info = document.querySelector('#info');
            const home = document.querySelector('#home');
            info.classList.add('active');
            if (offers.classList.contains('active')) {
                offers.classList.remove('active');
            }
            if (wishes.classList.contains('active')) {
                wishes.classList.remove('active');
            }
            if (favorites.classList.contains('active')) {
                favorites.classList.remove('active');
            }
            if (home.classList.contains('active')) {
                home.classList.remove('active');
            }
        },
        // SHOW INFO
        showInfoOffer(offer) {
            Swal.fire({
                imageUrl: `${offer.url}`,
                imageHeight: 400,
                imageAlt: 'Custom image',
                title: `${offer.name}`,
                html: `<p>${offer.description}</p><p>User: ${offer.user}</p><p>Value: ${offer.value}€</p><p>Description: ${offer.description}</p>`,
                showCancelButton: false,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Close',
            })
        },
        showInfoFavorite(favorite) {
            Swal.fire({
                imageUrl: `${favorite.url}`,
                imageHeight: 400,
                imageAlt: 'Custom image',
                title: `${favorite.name}`,
                html: `<p>${favorite.description}</p><p>User: ${favorite.user}</p><p>Value: ${favorite.value}€</p><p>Description: ${favorite.description}</p>`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Close',
                confirmButtonText: 'Remove from favorite!'
            }).then((result) => {
                if (result.value) {
                    const ref = firebase.firestore().collection('user').doc(this.user.username);
                    ref.update({
                        favorite: firebase.firestore.FieldValue.arrayRemove(favorite.id)
                    }).then(() => {
                        this.myFavorites = this.myFavorites.filter(deleted => {return favorite.id !== deleted.id});
                        Swal.fire("Good Job");
                    }).catch(err => {
                        Swal.fire(err)
                    })
                }
            })
        }
    }
});