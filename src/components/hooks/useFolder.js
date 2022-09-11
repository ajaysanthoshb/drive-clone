import { database,auth } from '../../Firebase';
import React, { useReducer, useEffect } from 'react'
import {useHistory} from 'react-router-dom';
export const ROOT_FOLDER = { folder_name: 'Root', id: null, path: [],pathIds : [] }
// const ACTIONS = {
//     SELECT_FOLDER: 'select-folder',
//     UPDATE_FOLDER: 'update-folder',
//     SET_CHILD_FOLDERS : 'set-child-folders'
// }
function reducer(state, { type, payload}) {
    switch (type) {
        case 'select-folder':
            return {
                ...state,
                folderId: payload.folderId,
                folder: payload.folder,
            }
        case 'update-folder':
            return {
                ...state,
                folder: payload.folder
            }
        case 'set-child-folders':
            return{
                ...state,
                childFolders : payload.childFolders
            }
        case 'set-child-files':
            return{
                ...state,
                childFiles : payload.childFiles
            }
        default:
            return state
    }
}
export function useFolder(folderId = null, folder = null) {
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: []
    })
    const history = useHistory()

    // useEffect(() => {
    //     dispatch({
    //         type: "select-folder",
    //         payload: { folderId, folder }
    //     })
    // }, [folderId, folder])

    useEffect(() => {
        if (folderId == null) {
            return dispatch({
                type: "update-folder",
                payload: { folder: ROOT_FOLDER },
            })
        }
        else{
            database.folders.doc(folderId)
                .get()
                .then((doc) => {
                    if(doc.data().userId != auth.currentUser.uid)
                    {
                        console.log("Error user access overrided..")
                        setTimeout(()=>{
                            history.push("/")
                        },800)
                    }
                    else{
                        const formattedDoc = { id: doc.id, ...doc.data() }
                        dispatch({
                            type: "update-folder",
                            payload: { folder: formattedDoc },
                        })
                    }
                })
                .catch((e) => {
                    console.error(e.message)
                    dispatch({
                        type: "update-folder",
                        payload: { folder: ROOT_FOLDER },
                    })
                })
        }

    }, [folderId])


    useEffect(() => {
        // console.log(auth.currentUser)
        return database.folders
            .where("parentId", "==", folderId)
            .where("userId", "==", auth.currentUser.uid)
            .orderBy("createdAt")
            .onSnapshot(snapshot => {
                dispatch({
                    type: "set-child-folders",
                    payload: { childFolders: snapshot.docs.map(doc => {
                        return {id:doc.id,...doc.data()}
                    })}
                })
            })
    }, [folderId, auth.currentUser])

    useEffect(() => {
        // console.log(auth.currentUser)
        return database.files
            .where("folderId", "==", folderId)
            .where("userId", "==", auth.currentUser.uid)
            .orderBy("createdAt")
            .onSnapshot(snapshot => {
                dispatch({
                    type: "set-child-files",
                    payload: { childFiles : snapshot.docs.map(doc => {
                        return {id:doc.id,...doc.data()}
                    })}
                })
            })
    }, [folderId, auth.currentUser])

    return state
}
