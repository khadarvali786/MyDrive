const Firebase = require( 'firebase-admin' );

const serviceAccount = require( '../chatting-3f70f-firebase-adminsdk-tj270-e05fdbbc36.json' );

const firebase = Firebase.initializeApp({
    credential: Firebase.credential.cert(serviceAccount),
    storageBucket: 'chatting-3f70f.appspot.com'
})

module.exports = Firebase;