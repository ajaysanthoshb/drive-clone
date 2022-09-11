import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

// creation of firebase app
const app = firebase.initializeApp(
    {
        apiKey: "AIzaSyCDaR8_IYaj1X9chj_S92FAGFvQcZGL5AA",
        authDomain: "cloud-storage-8a902.firebaseapp.com",
        projectId: "cloud-storage-8a902",
        storageBucket: "cloud-storage-8a902.appspot.com",
        messagingSenderId: "516355434930",
        appId: "1:516355434930:web:3aac84193e37b3db3a5cab",
        databaseUrl:"https://cloud-storage-8a902.firebaseio.com"
    }
)

//using app, create instance of authentication
export const auth = app.auth()

export const storage = app.storage()

const firestore = app.firestore() //it gives access to database and its stuff
//but app.firestore() gives lot of info to user
//but we want only for folders and files
export const database = {
    folders : firestore.collection("folders"),
    files : firestore.collection("files"),
    formatDoc : doc =>{
        return {id : doc.id, ...doc.data()}
    },
    getCurrentTimeStamp : firebase.firestore.FieldValue.serverTimestamp
}
export default app;