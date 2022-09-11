import React from 'react'
import { database, auth } from '../../Firebase';

export default function gettingfiles(docId) {
    var arr = []
    return new Promise((res,rej)=>{
        database.files
        .where("folderId", "==", docId)
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((querySnapshot)=>{
            querySnapshot.docs.map((doc)=>{
                // doc.data() is never undefined for query doc snapshots
                arr.push(doc.data().file_name);
            });
            res(arr)
        })
    })
}
