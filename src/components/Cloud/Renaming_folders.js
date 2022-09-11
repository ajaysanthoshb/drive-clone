import React from 'react'
import { database } from '../../Firebase';
export default function RenameFolders(folderId_to_update,new_name) {
    return new Promise((res,rej)=>{
        database.folders.doc(folderId_to_update).update({
            folder_name : new_name
        }).then(()=>{
            res("Folder renamed successfully")
        }).catch(()=>{
            rej("Unable to rename the folder")
        })
    })
}
