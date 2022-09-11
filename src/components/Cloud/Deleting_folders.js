import React from 'react';
import { database, auth } from '../../Firebase';

export default function deleteFolder(folder_id_to_delete) {
    function filesDeletion(folderId) {
        return new Promise((res, rej) => {
            database.files.where("folderId", "==", folderId).get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    doc.ref.delete();
                });
                res("Done well")
            })
                .catch(e => rej(e.message))
        })
    }


    return new Promise((res, rej) => {

        // deleting the current folder
        database.folders.doc(folder_id_to_delete).delete().then(() => {
            filesDeletion(folder_id_to_delete).then(msg => {
                console.log(msg)
            })
                .catch(e => console.log(e.message))

            // DeletionInStorage(folder_id_to_delete).then(msg => {
            //     console.log(msg)
            // })
            //     .catch(e => console.log(e.message))

            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.log(error.message)
        });

        //deleting descendant folders
        database.folders.where("userId", "==", auth.currentUser.uid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                if (doc.data().pathIds.indexOf(folder_id_to_delete) >= 0) {
                    console.log("folder id : ", doc.id)

                    filesDeletion(doc.id).then(msg => {
                        console.log(msg)
                    })

                    doc.ref.delete();
                }
            });
            res("Folder Deleted Successfully")
        }).catch((error) => {
            console.log(error.message)
            rej(error.message)
        })

    })
}
