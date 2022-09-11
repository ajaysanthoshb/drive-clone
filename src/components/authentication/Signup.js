import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { auth } from '../../Firebase'
import { Link, useHistory } from 'react-router-dom'
export default function SignUp() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null);
    const history = useHistory()
    // const {signup} = useAuth()

    function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }


    async function handleSubmit(e) {
        e.preventDefault()
        console.log("print")
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('PASSWORDS DO NOT MATCH!')
        }
        setError('')
        setLoading(true)
        try {
            var res = await signup(emailRef.current.value, passwordRef.current.value)
            setUser(res.user)
            console.log(res.user.email)
            setLoading(false)
            history.push('/')
        }
        catch (e) {
            setError(e.message)
            setLoading(false)
        }

    }

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Sign Up</h2>
                        <Alert variant="danger" style={{ display: `${error === '' ? "none" : "block"}` }}>{error}</Alert>
                        {/* {user && user.email} */}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email" className="p-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required></Form.Control>
                            </Form.Group>
                            <Form.Group id="password" className="p-2">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required></Form.Control>
                            </Form.Group>
                            <Form.Group id="password-confirm" className="p-2">
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} required></Form.Control>
                            </Form.Group>
                            <Button disabled={loading} className="w-100" type="submit">Sign Up</Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
        </Container>
    )
}
