import React, { useState, useRef } from "react"
import { Button } from "react-bootstrap"
import { storage, auth, database } from "../../Firebase";
import { ROOT_FOLDER } from "../hooks/useFolder";
import '../styling/childFile.css'
import '../styling/folderbutton.css';
export default function AddFileButton({ currentFolder }) {
    // const [fileUpload,setFileUpload] = useState(true)
    const upload_element = useRef()
    function databaseAndStorage(filePath, file, currentFolder) {
        return new Promise((res, rej) => {
            var uploadTask
            //points a location where we want to upload this
            uploadTask = storage.ref(`/files/${auth.currentUser.uid}/${filePath}`).put(file)
            uploadTask.on("state_changed",
                () => { },
                () => { },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(url => {
                        // Getting url for downloading the uploaded file in storage
                        console.log("CF", currentFolder.id)
                        database.files.where("file_name", "==", file.name)
                            .where("userId", '==', auth.currentUser.uid)
                            .where('folderId', "==", currentFolder.id)
                            .get()
                            .then(existingFiles => {

                                // Handling file duplicates

                                //if file we want to upload is already present in storage then update url
                                // else create a new document in database for it

                                const existingFile = existingFiles.docs[0]
                                console.log(file.name)
                                if (existingFile) {
                                    existingFile.ref.update({
                                        url: url,
                                        createdAt: database.getCurrentTimeStamp()
                                    }).then(() => {
                                        res("file updated well")
                                        // setFileUpload(true)
                                    })
                                }
                                else {
                                    database.files.add(
                                        {
                                            url: url,
                                            file_name: file.name,
                                            createdAt: database.getCurrentTimeStamp(),
                                            folderId: currentFolder.id,
                                            userId: auth.currentUser.uid
                                        }
                                    ).then(() => {
                                        res("file uploaded well")
                                        // setFileUpload(true)
                                    }).catch((e)=>{
                                        rej(e.message)
                                    })
                                }
                            })
                            .catch(e=>{
                                rej(e.message)
                            })
                    })
                })
        })

    }
    function handleUpload(e) {
        var file, filePath
        var promises = []
        for (let i = 0; i < e.target.files.length; i++) {
            file = e.target.files[i]
            console.log(file)
            if (file) {
                upload_element.current.classList.add("uploading")
            }
            if (currentFolder == null || file == null) {
                return
            }

            filePath = currentFolder === ROOT_FOLDER ? [file.name].join("/") : [currentFolder.id, file.name].join("/")

            console.log("file name : ", file.name)
            // await databaseAndStorage(filePath, file, currentFolder)
            // if(i == e.target.files.length-1){
            //     upload_element.current.classList.remove("uploading")
            // }
            promises.push(databaseAndStorage(filePath, file, currentFolder))
        }
        Promise.all(promises).then((msg) => {
            console.log(msg)
            upload_element.current.classList.remove("uploading")
        }).catch(e => {
            console.log(e.message)
        })
    }
    return (
        <label className="btn" htmlFor="file-upload-btn" style={{
            fontSize: "1.75rem", padding: "0.0475rem 0.75rem", border: "none", marginTop: "1rem", borderRadius: "0.25rem"
            , color: "#fff", background: "hsl(160,70%,40%)"
        }}>
            <input
                type="file"
                onChange={handleUpload}
                id="file-upload-btn"
                className="visually-hidden"
                multiple="multiple"
            />
            <i className="material-icons">upload_file</i>

            {/* Uploading animation */}
            <span ref={upload_element} className="" style={{ position: "fixed", left: "90%", bottom: "1rem", color: "lime", fontSize: "1rem" }}></span>
        </label>
    )
}