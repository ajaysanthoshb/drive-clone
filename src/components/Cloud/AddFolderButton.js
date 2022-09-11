import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { database, auth } from '../../Firebase';
import { ROOT_FOLDER } from '../hooks/useFolder';
import '../styling/folderbutton.css';

export default function AddFolderButton({ currentFolder }) {
    const [open, setOpen] = useState(false)
    const [name_of_folder, setName] = useState("")
    const [submit, changeSubmit] = useState(false)
    const [disabled_button4,setDisabledButton4] = useState(false)
    function openModal() {
        setOpen(true)
    }
    function closeModal() {
        setOpen(false)
    }

    function handleSubmit(e) {
        e.preventDefault()
        changeSubmit(true)
        if (name_of_folder.length > 20) {
            return
        }
        setDisabledButton4(true)
        if (!currentFolder) {
            console.log("PARENT")
            return
        }
        setTimeout(() => {
            const path = [...currentFolder.path]
            const pathIds = [...currentFolder.pathIds]
            if (currentFolder !== ROOT_FOLDER) {
                path.push({ name: currentFolder.folder_name, id: currentFolder.id })
                pathIds.push(currentFolder.id)
            }
            //Create a folder in the database


            database.folders.add({
                folder_name: name_of_folder,
                parentId: currentFolder.id,
                userId: auth.currentUser.uid,
                path: path,
                pathIds: pathIds,
                createdAt: database.getCurrentTimeStamp()
            })
            setName("")
            setDisabledButton4(false)
            closeModal()
        }, 700)
        
    }

    return (
        <>
            <Button onClick={openModal} className="material-icons" style={{ fontSize: "1.5rem", padding: "0.25rem 0.75rem", border: "none", marginTop: "1rem", borderRadius: "0.25rem" }}>
                create_new_folder
            </Button>
            <Modal show={open} onHide={()=>{
                if(!disabled_button4){
                    closeModal()
                }
                 }}>
                <Form onSubmit={handleSubmit}>
                    {name_of_folder && submit && name_of_folder.length > 20 && (
                        <>
                            <Alert variant="danger d-flex align-items-center">
                                <span className="material-icons me-2" style={{ fontSize: "1.5rem" }}>warning</span>
                                <span>Folder name exceeds 20 characters</span>
                            </Alert>
                        </>
                    )}
                    {name_of_folder && submit && name_of_folder.length <= 20 && (<Alert variant="success d-flex align-items-center">
                        <span className="material-icons me-2">check_circle</span>
                        <span>Folder added successfully</span>
                    </Alert>)}
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Folder Name</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={name_of_folder}
                                onChange={e => {
                                    changeSubmit(false)
                                    setName(e.target.value)
                                }}
                                style={{ border: "2px solid rgba(34, 34, 34, 0.4)" }}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: "1px solid rgba(34, 34, 34, 0.3)" }}>
                        <Button disabled = {disabled_button4} variant="secondary" onClick={closeModal}>
                            Close
                        </Button>
                        <Button disabled = {disabled_button4} variant="success" type="submit">
                            Add Folder
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}
