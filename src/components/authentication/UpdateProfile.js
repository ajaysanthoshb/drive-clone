import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { auth } from '../../Firebase'
import { Link, useHistory } from 'react-router-dom'
export default function UpdateProfile() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null);
    const history = useHistory()
    // const {signup} = useAuth()

    // function signup(email,password){
    //     return auth.createUserWithEmailAndPassword(email,password)
    // }

    function updateEmail(email) {
        return auth.currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return auth.currentUser.updatePassword(password)
    }


    function handleSubmit(e) {
        e.preventDefault()
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        const promises = []
        setLoading(true)
        setError("")

        if (emailRef.current.value !== auth.currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises)
            .then(() => {
                setLoading(false)
                history.push("/user")
            })
            .catch(() => {
                setError("Failed to update account")
                setLoading(false)
            })

    }

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Update Profile</h2>
                        <Alert variant="danger" style={{ display: `${error === '' ? "none" : "block"}` }}>{error}</Alert>
                        {/* {user && user.email} */}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email" className="p-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required
                                    defaultValue={auth.currentUser.email}></Form.Control>
                            </Form.Group>
                            <Form.Group id="password" className="p-2">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef}
                                    placeholder="Leave blank to keep same"></Form.Control>
                            </Form.Group>
                            <Form.Group id="password-confirm" className="p-2">
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef}
                                    placeholder="Leave blank to keep same"></Form.Control>
                            </Form.Group>
                            <Button disabled={loading} className="w-100" type="submit">Update</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    <Link to="/user">Cancel</Link>
                </div>
            </div>
        </Container>
    )
}
