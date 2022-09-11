import { database, storage, auth } from "../../Firebase"

export default function DeleteFile(currentFolderId, currentFileId, fileName) {
    function deletingfromdb(currentFileId) {
        return new Promise((res, rej) => {
            database.files.doc(currentFileId).delete().then(msg => {
                res("All went fine")
            }).catch(e => {
                rej(`Something went wrong : ${e.message}`)
            })
        })
    }

    function deletingInStorage(currentFolderId, fileName) {
        if (currentFolderId == null) {
            //points a location where we want to delete this file
            return new Promise((res, rej) => {
                storage.ref(`/files/${auth.currentUser.uid}/${fileName}`).delete().then(msg => {
                    res("file successfully deleted in storage")
                }).catch(e => {
                    rej(e.message)
                })
            })
        }
        else {
            return new Promise((res, rej) => {
                storage.ref(`/files/${auth.currentUser.uid}/${currentFolderId}/${fileName}`).delete().then(msg => {
                    res("file successfully deleted in storage")
                }).catch(e => {
                    rej(e.message)
                })
            })
        }

    }

    // console.log(currentFolderId, currentFileId, fileName)
    return new Promise((res,rej)=>{deletingInStorage(currentFolderId,fileName).then(messag=>{
            console.log(messag)
            deletingfromdb(currentFileId).then(msg => {
                console.log(msg)
                res(msg)
            }).catch(e => {
                console.log(e.message)
                rej(e.message)
            })
        })
    })
}
