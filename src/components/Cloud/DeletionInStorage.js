import React from 'react'
import { database,auth, storage } from '../../Firebase';
import gettingfiles from './gettingfiles';

export default function DeletionInStorage(folder_id_to_delete) {
    function storageDeletion(childFiles,DocId){
        childFiles.map(childFile => {
            storage.ref(`/files/${auth.currentUser.uid}/${DocId}/${childFile}`).delete().then().catch((e)=>{
            console.log("File cant delete in storage")
            })
        })
    }
    return new Promise((res,rej)=>{database.folders.where("userId","==",auth.currentUser.uid).get().then(function (querySnapshot) {
            querySnapshot.forEach(async(doc)=>{
                if (doc.data().pathIds.indexOf(folder_id_to_delete) >= 0) {
                    let childFiles = await gettingfiles(doc.id)
                    console.log("childFIles :",childFiles)
                    storageDeletion(childFiles,doc.id)
                  }
                else if(doc.id == folder_id_to_delete){
                    let childFiles = await gettingfiles(doc.id)
                    console.log("childFIles :",childFiles)
                    storageDeletion(childFiles,doc.id)
                    
                  }
            })
            res("Files in storage Deleted Successfully")
        }).catch((error) => {
            console.log(error.message)
            rej(error.message)
        })

    })

}
