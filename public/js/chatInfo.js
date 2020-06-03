var app = new Vue({
    el: '#app',
    data: {
        user: {},
        myChats: [],
        chatMessages: [],
        allUsers: [],
        messageToSend: "",
        idChat: -1,
        search: ""
    },
    async mounted() {
        // OBTENIR USER
        const getUserByUID = firebase.functions().httpsCallable('web-getUserByUID');
        let data = await getUserByUID();
        let username = data.data;
        const userRef = firebase.firestore().collection('user').doc(username);
        data = await userRef.get();
        this.user = data.data();
        let chats = [];
        if (this.user.hasOwnProperty('chats')) {
            for(var chat in this.user.chats){
                if (this.user.chats.hasOwnProperty(chat)) {           
                    chats.push({'user': chat, 'id': this.user.chats[chat]})
                }
            }
        }
        this.myChats = chats;

        const usersRef = firebase.firestore().collection('user').orderBy('username', 'asc');
        usersRef.onSnapshot(snapshot => {
            let users = [];
            snapshot.forEach(doc => {
                users.push({ ...doc.data(), id: doc.id });
            });
            this.allUsers = users;
        })
    },
    methods: {
        goToChats(){
            const offers = document.querySelector('#offers');
            offers.classList.add('active');
            const messages = document.querySelector('#messages');
            messages.classList.remove('active');
            const newChat = document.querySelector('#newChat');
            newChat.classList.remove('active');
        },
        async goToChat(id){
            if(id !== -1){
                this.idChat = id;
                const chatRef = firebase.firestore().collection('chat').doc(id).collection('messages').orderBy('order', 'desc');
                chatRef.onSnapshot(snapshot => {
                    let chats = [];
                    snapshot.forEach(doc => {
                        let owner = "";
                        if(doc.data().username === this.user.username) owner = "sender";
                        else owner = "receiver";
                        chats.push({ ...doc.data(), id: doc.id, owner: owner });
                    });
                    this.chatMessages = chats;
                });
            }
            const offers = document.querySelector('#offers');
            offers.classList.remove('active');
            const messages = document.querySelector('#messages');
            messages.classList.add('active');
            const newChat = document.querySelector('#newChat');
            newChat.classList.remove('active');
        },
        goToNewChat(){
            const offers = document.querySelector('#offers');
            offers.classList.remove('active');
            const messages = document.querySelector('#messages');
            messages.classList.remove('active');
            const newChat = document.querySelector('#newChat');
            newChat.classList.add('active');
        },
        sendMessage(){
            if(this.messageToSend !== "" && this.idChat !== -1){
                const chatRef = firebase.firestore().collection('chat').doc(this.idChat).collection('messages');
                msg = {username: this.user.username, message: this.messageToSend, time: new Date()}
                chatRef.add({username: this.user.username, message: this.messageToSend, time: new Date()});
                this.messageToSend = "";
                msg['owner'] = "sender";
                msg['order'] = new Date().toISOString();
                this.chatMessages.unshift(msg);
            }
        },
        startChat(user){
            if(this.user.hasOwnProperty("chats") && this.user.chats.hasOwnProperty(user.username)){
                Swal.fire({
                    html: `<h1>${user.username}</h1><p>Name: ${user.name}</p><p>Score: ${user.valoracio}</p>`,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Close',
                    confirmButtonText: 'Go to chat'
                }).then((result) => {
                    if (result.value) {
                        this.goToChat(this.user.chats[user.username]);
                    }
                })
            }
            else{
                Swal.fire({
                    html: `<h1>${user.username}</h1><p>Name: ${user.name}</p><p>Score: ${user.valoracio}</p>`,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Close',
                    confirmButtonText: 'Start New Chat'
                }).then((result) => {
                    if(result.value){
                        const chatRef = firebase.firestore().collection('chat');
                        chatRef.add({
                            'user1': this.user.username,
                            'user2': user.username,
                            'messages': []
                        }).then(doc => {
                            this.goToChat(doc.id);
                        }).catch(err => {
                            Swal.fire(err)
                        });
                    }
                })
            }
        },
        filterUsers(){
            return this.allUsers.filter(usr => {
                return (usr.hasOwnProperty('name') && usr.name.includes(this.search) || usr.username.includes(this.search))
            })
        },
        filterChats(){
            return this.myChats.filter(chat => {
                return chat.user.includes(this.search)
            })
        },
    }
});