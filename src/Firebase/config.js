
import firebase from "firebase"
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCpqZFHgH9-_xhLmqvLm5SLuTMbtjcL1gM",
    authDomain: "olx-clone-007.firebaseapp.com",
    projectId: "olx-clone-007",
    storageBucket: "olx-clone-007.appspot.com",
    messagingSenderId: "240941020029",
    appId: "1:240941020029:web:c98a80f85b6aeca4a75214",
    measurementId: "G-HS08XC274K"
}
export default firebase.initializeApp(firebaseConfig)