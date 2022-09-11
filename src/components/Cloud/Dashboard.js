import React, { useEffect, useState, useRef } from 'react'
import NavbarComponent from './Navbar';
import { Button, Container, Modal, Form, Alert } from 'react-bootstrap';
import AddFolderButton from './AddFolderButton';
import { useFolder } from '../hooks/useFolder';
import { Link, useParams } from 'react-router-dom';
import Greater_icon from './Greater_icon';
import DeleteFile from '../DeleteFile/DeleteFile';
import '../styling/childfolder.css';
import deleteFolder from './Deleting_folders';
import RenameFolders from './Renaming_folders';
import AddFileButton from './AddFileButton';
import DeletionInStorage from './DeletionInStorage';

export default function Dashboard() {
    const { folderId } = useParams()
    const { folder, childFolders, childFiles } = useFolder(folderId)
    const rename_folder = useRef(null)
    const [open, setOpen] = useState(false);
    const [submit, changeSubmit] = useState(false)
    const [rename, setRename] = useState("")

    const [fileDelete, setFileDelete] = useState("")
    const [openPopUp, setOpenPopUp] = useState(false)
    const [loading, setLoading] = useState(false)

    //Storing ID
    const [storingID, setID] = useState("");
    const [storeFileId, setStoreFileId] = useState("")
    const [folderDelete, setFolderDelete] = useState(false)
    const [text_msg, setMsg] = useState("")
    const [renameMsg, setRenameMsg] = useState("")
    // Storing folder name
    const [storingName, setName] = useState("");

    //Managing delete Pop up
    const [openDeletePop, setOpenDeletePop] = useState(false);

    const [disabled_button1, setDisabledButton1] = useState(false)
    var [disabled_button2, setDisabledButton2] = useState(false)
    var [disabled_button3, setDisabledButton3] = useState(false)


    // if (folder != null) {
    //     console.log(folder.path)
    // }
    function call_func(f_name, f_id) {
        setID(f_id)
        setName(f_name)
        setRename(f_name)
        setOpen(true)
    }

    function storeFileName(fi_name) {
        setFileDelete(fi_name)
    }

    function folderDeletion() {
        console.log(openDeletePop)
        setDisabledButton2(true)
        DeletionInStorage(storingID).then((newMsg) => {
            console.log(newMsg)
            deleteFolder(storingID).then((msg) => {
                setMsg(msg)
                console.log(msg)
                setFolderDelete(true)
                console.log("Msg got")
                setTimeout(() => {
                    setDisabledButton2(false)
                }, 600)
                setTimeout(() => {
                    setOpenDeletePop(false)
                    setMsg("")
                    console.log("Msg not got")
                }, 700)
                setTimeout(() => {
                    setFolderDelete(false)
                }, 1000)
            }).catch(error => {
                setDisabledButton2(false)
                console.error(error);
            });
        }).catch(e => {
            setDisabledButton2(false)
            console.log(e.message)
        })
    }

    function edit_folder(stored_id, refolder) {
        if (refolder.length > 20) {
            changeSubmit(true)
            return
        }
        setDisabledButton1(true)
        RenameFolders(stored_id, refolder).then((msg) => {
            changeSubmit(true)
            setRenameMsg(msg)
            setTimeout(() => {
                setDisabledButton1(false)
            }, 600)
            setTimeout(() => {
                setOpen(false)
                changeSubmit(false)
                setRenameMsg("")
            }, 700)
            console.log("Done successfully")
        }).catch((e) => {
            changeSubmit(true)
            setRenameMsg(e.message)
            setTimeout(() => {
                setDisabledButton1(false)
            }, 600)
            setTimeout(() => {
                changeSubmit(false)
                setRenameMsg("")
            }, 700)
            console.log(e.message)
        })
    }
    return (
        <>
            <NavbarComponent>

            </NavbarComponent>
            <Container fluid style={{ background: "#222", minHeight: "90.5vh", color: "#ddd" }}>
                <div className="d-flex align-items-center justify-content-between p-1" style={{ margin: "0" }}>
                    {/* <FolderBreadCrumbs currentFolder={folder} /> */}
                    <div>
                        {/* From second child of root */}
                        {folder && folder.id && folder.path.length > 0 && <span key="1" style={{ fontSize: "1.25rem" }} className="d-flex align-items-center justify-content-center flex-wrap"><Link to="/" className="me-1 routing">Root</Link> <Greater_icon /> {folder.path.map((ele, i) => <Greater_icon key={ele.id} element={ele.name} pathId={ele.id} />)}{folder.folder_name}</span>}

                        {/* For first child of root */}
                        {folder && folder.id && folder.path.length == 0 && <span key="2" style={{ fontSize: "1.25rem" }} className="d-flex align-items-center justify-content-center"><Link to="/" className="me-1 routing">Root</Link> <Greater_icon /> {`${folder.folder_name}`}</span>}

                        {/* for Root folder */}
                        {folder && !folder.id && folder.path.length == 0 && <span key="3" style={{ fontSize: "1.25rem" }}>Root</span>}
                    </div>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div key="6" className="me-2">
                            <AddFileButton currentFolder={folder} />
                        </div>
                        <div key="7">
                            <AddFolderButton currentFolder={folder}></AddFolderButton>
                        </div>
                    </div>
                </div>
                {childFolders.length > 0 && <div style={{ fontSize: "0.95rem" }}>Folders</div>}
                {childFolders.length > 0 && (
                    <div className="d-flex flex-wrap">
                        {childFolders.map(childFolder => (
                            <>
                                <div key={`${childFolder.id}123`} className="text-decoration-none d-flex justify-content-between align-items-center  child_folders" style={{ cursor: "pointer" }}>
                                    <Link
                                        className="d-block text-truncate text-decoration-none"
                                        style={{ maxWidth: "130px", color: "white" }}
                                        to={`/folder/${childFolder.id}`}
                                    >
                                        <i className="material-icons me-2 ms-1 text-warning" style={{ position: "relative", top: "0.25rem", fontSize: "1.25rem" }} >folder</i>
                                        <span className="text-white">{childFolder.folder_name}</span>
                                    </Link>

                                    {/* 3 dots */}
                                    <span className="material-icons cursor_type ms-1" style={{ fontSize: "1rem", maxWidth: "25px" }} onClick={() => call_func(childFolder.folder_name, childFolder.id)}>more_vert</span>
                                </div>

                                {/* Modal for editing */}
                                <Modal animation={true} key={`${childFolder.id}456`} show={open}
                                    onHide={() => {
                                        if (!disabled_button1) {
                                            setOpen(false)
                                            changeSubmit(false)
                                        }
                                    }}>

                                    <Form onSubmit={(e) => {
                                        e.preventDefault()
                                        edit_folder(storingID, rename_folder.current.value)
                                    }
                                    }>
                                        <Modal.Body>
                                            {submit && rename.length <= 20 && (<>
                                                <Alert variant="success d-flex align-items-center">
                                                    <span className="material-icons me-2">
                                                        check_circle
                                                    </span>
                                                    <span>{renameMsg}</span>
                                                </Alert>
                                            </>)}
                                            {submit && rename.length > 20 && (<>
                                                <Alert variant="danger d-flex align-items-center">
                                                    <span className="material-icons me-2" style={{ fontSize: "1.5rem" }}>
                                                        warning
                                                    </span>
                                                    <span>Renamed Folder exceeds 20 characters</span>
                                                </Alert>
                                            </>)}
                                            <Form.Group>
                                                <Form.Label>Editing {storingName} Folder</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    required
                                                    ref={rename_folder}
                                                    placeholder={storingName}
                                                    value={rename}
                                                    onChange={e => {
                                                        e.preventDefault()
                                                        changeSubmit(false)
                                                        setRename(e.target.value)
                                                    }}
                                                    style={{ border: "2px solid rgba(34, 34, 34, 0.4)" }}
                                                />
                                                {/* <Form.Control required ref = {rename_folder} type="text" placeholder={storingName} /> */}
                                            </Form.Group>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button disabled={disabled_button1} onClick={() => {
                                                setDisabledButton1(false)
                                                setOpen(false)
                                            }}>Cancel</Button>
                                            <Button disabled={disabled_button1} variant="danger" onClick={() => {
                                                setTimeout(() => {
                                                    setDisabledButton1(false)
                                                    setOpen(false)
                                                    setOpenDeletePop(true)
                                                }, 100)
                                            }}>Delete</Button>
                                            <Button disabled={disabled_button1} variant="success" type="submit">{!disabled_button1 ? "Rename" : "Renaming..."}</Button>
                                        </Modal.Footer>
                                    </Form>
                                </Modal>
                            </>
                        ))}
                    </div>
                )}

                {/* Modal for delete pop up */}
                <Modal animation={true} key={`6alpha_core_runner_9`} show={openDeletePop} onHide={() => {
                    if (!disabled_button2) {
                        setOpenDeletePop(false)
                    }
                }}>
                    <Form>
                        <Modal.Body>
                            {folderDelete && (<>
                                <Alert variant="success d-flex align-items-center">
                                    <span className="material-icons me-2">
                                        check_circle
                                    </span>
                                    <span>{text_msg}</span>
                                </Alert>
                            </>)}
                            {!folderDelete && (<>
                                <Alert variant="danger d-flex align-items-center">
                                    <span className="material-icons me-2" style={{ fontSize: "1.5rem" }}>
                                        warning
                                    </span>
                                    <span>
                                        Do u really wanna delete {storingName} folder?
                                    </span>
                                </Alert>
                            </>)}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button disabled={disabled_button2} onClick={() => {
                                setDisabledButton2(false);
                                setOpenDeletePop(false)
                            }}>Cancel</Button>
                            <Button disabled={disabled_button2} variant="danger" onClick={folderDeletion} >
                                {!disabled_button2 ? "Delete" : "Deleting..."}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                {/* Handling files */}

                {childFolders.length > 0 && childFiles.length > 0 && <hr />}
                {childFiles.length > 0 && <div style={{ fontSize: "0.95rem" }}>Files</div>}

                {childFiles.length > 0 && (
                    <div className="d-flex flex-wrap">

                        {childFiles.map(childFile => {
                            const images = ["gif", "jpeg", "jpg", "png", "svg"]
                            const docs = ["doc", "docx"]
                            const txt = ["txt", "rtf"]
                            const slides = ["pptx", "ppt", "gslides", "pptm"]
                            const videos = ["avi", "mp4", "wmv", "mkv", "webm", "mov", "flv"]
                            const audio = ["mp3", "weba", "aac", "flac", "m4a", "wav", "wma"]
                            const lang = ["java", "js", "c", "cpp", "kt", "py", "css", "html", "sh", "cs", "sql", "php"]
                            const spreadsheet = ["xls", "xlsm", "xlsx", "xlx", "ods", "csv", "gsheet", "gsheets"]
                            var k = childFile.file_name.split(".")
                            var default_icon = false
                            var joined_string = ""
                            k.forEach((ele, index) => {
                                if (index == 0) {
                                    joined_string += `${ele}`
                                }
                                else if (index != k.length - 1) {
                                    joined_string += `.${ele}`
                                }
                            })

                            if (k[k.length - 1] != "pdf"
                                && images.indexOf(k[k.length - 1]) < 0
                                && docs.indexOf(k[k.length - 1]) < 0
                                && txt.indexOf(k[k.length - 1]) < 0
                                && spreadsheet.indexOf(k[k.length - 1]) < 0
                                && slides.indexOf(k[k.length - 1]) < 0
                                && lang.indexOf(k[k.length - 1]) < 0
                                && audio.indexOf(k[k.length - 1]) < 0
                                && videos.indexOf(k[k.length - 1]) < 0) {
                                default_icon = true
                            }
                            return (
                                <div key={childFile.id} className="text-decoration-none d-flex justify-content-between align-items-center child_folders" style={{ cursor: "pointer" }}>
                                    <a href={childFile.url} target="_blank" className="d-flex align-items-center text-decoration-none">
                                        {childFile.file_name.split(".")[k.length - 1] == "pdf" && <i className="material-icons me-2 ms-1" style={{ color: "hsl(0, 100%, 75%)" }}>picture_as_pdf</i>}
                                        {images.indexOf(childFile.file_name.split(".")[k.length - 1]) >= 0 && <i className="material-icons me-2 ms-1" style={{ color: "var(--bs-cyan)" }}>image</i>}
                                        {docs.indexOf(childFile.file_name.split(".")[k.length - 1]) >= 0 && <i className="material-icons me-2 ms-1" style={{ color: "var(--bs-cyan)" }}>article</i>}
                                        {txt.indexOf(childFile.file_name.split(".")[k.length - 1]) >= 0 && <i className="material-icons me-2 ms-1" style={{ color: "var(--bs-cyan)" }}>description</i>}
                                        {spreadsheet.indexOf(childFile.file_name.split(".")[k.length - 1]) >= 0 && <i className="iconify-inline me-2 ms-1" style={{ color: "lime" }} data-icon="mdi:google-spreadsheet"></i>}
                                        {slides.indexOf(childFile.file_name.split(".")[k.length - 1]) >= 0 && <i className="fa fa-file-powerpoint-o me-2 ms-1" style={{ color: "red", fontSize: "1.25rem" }}></i>}
                                        {lang.indexOf(childFile.file_name.split(".")[k.length - 1]) >= 0 && <i className="material-icons me-2 ms-1">code</i>}
                                        {audio.indexOf(childFile.file_name.split(".")[k.length - 1]) >= 0 && <i className="material-icons me-2 ms-1" style={{ color: "hotpink" }}>library_music</i>}
                                        {videos.indexOf(childFile.file_name.split(".")[k.length - 1]) >= 0 && <i className="material-icons me-2 ms-1" style={{ color: "red" }}>movie</i>}
                                        {default_icon && <i className="iconify-inline me-2 ms-1" data-icon="ant-design:file-unknown-filled" style={{ fontSize: "1.25rem", color: "yellow" }}></i>}
                                        <div
                                            className="d-block text-truncate"
                                            style={{ maxWidth: "130px", color: "lime" }}
                                        >
                                            <span className="text-white">{joined_string.trim()}</span>
                                        </div>
                                        <span className="text-white">.{childFile.file_name.split(".")[k.length - 1]}</span>
                                    </a>
                                    <span className="material-icons cursor_type ms-1" style={{ fontSize: "1.25rem" }} onClick={() => {
                                        storeFileName(childFile.file_name)
                                        setStoreFileId(childFile.id)
                                        setOpenPopUp(true)
                                    }}>more_vert</span>
                                </div>)
                        })}
                    </div>)}

                {/* Creating Modal for deleting file pop up */}

                <Modal show={openPopUp} onHide={() => {
                    if (!disabled_button3) {
                        setOpenPopUp(false)
                    }
                }}>
                    <Form onSubmit={(e) => {
                        e.preventDefault()
                        setDisabledButton3(true)
                        DeleteFile(folder.id, storeFileId, fileDelete).then((msg) => {
                            setLoading(true)
                            setTimeout(() => {
                                setDisabledButton3(false)
                            }, 750)
                            setTimeout(() => {
                                setOpenPopUp(false)
                            }, 800)
                            setTimeout(() => {
                                setLoading(false)
                            }, 1000)
                        })
                    }}>
                        <Modal.Body>
                            {!loading && (<Alert variant="danger d-flex align-items-center">
                                <span className="material-icons me-2">warning</span>
                                <span>Do u wanna really delete {fileDelete}?</span>
                            </Alert>)}
                            {loading && (<Alert variant="success d-flex align-items-center">
                                <span className="material-icons me-2">check_circle</span>
                                <span>File Deleted Successfully</span>
                            </Alert>)}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button disabled={disabled_button3} variant="success" onClick={() => {
                                setDisabledButton3(false)
                                setOpenPopUp(false)
                            }}>Cancel</Button>
                            <Button disabled={disabled_button3} variant="danger" type="submit" >{
                                !disabled_button3 ? "Delete" : "Deleting...."
                            }</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

            </Container>
        </>
    )
}
