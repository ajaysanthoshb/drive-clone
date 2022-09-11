import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { auth } from '../../Firebase'
import { Link } from 'react-router-dom'
export default function ForgotPassword() {
    const emailRef = useRef();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null);
    const [msg, setMsg] = useState('')

    // const {signup} = useAuth()

    function resetpassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    // auth.onAuthStateChanged(user=>{
    //     setUser(user)
    //     console.log(user.email)
    // })



    async function handleSubmit(e) {
        e.preventDefault()
        console.log("print")
        setMsg('')
        setError('')
        setLoading(true)
        try {
            await resetpassword(emailRef.current.value)
            setMsg('Check your inbox for further instructions')
        }
        catch (e) {
            setError(e.message)
        }
        setLoading(false)
    }

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <Card className="p-2">
                    <Card.Body>
                        <h2 className="text-center mb-4">Password Reset</h2>
                        <Alert variant="danger" style={{ display: `${error === '' ? "none" : "block"}` }}>{error}</Alert>
                        {msg && <Alert variant="success">{msg}</Alert>}
                        {/* {user && user.email} */}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required></Form.Control>
                            </Form.Group>
                            <Button disabled={loading} className="w-100 mt-3" type="submit">
                                Reset Password
                            </Button>
                        </Form>
                    </Card.Body>
                    <div className="w-100 text-center mt-2">
                        <Link to="/login">Login</Link>
                    </div>
                </Card>
                <div className="w-100 text-center mt-3">
                    Need an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </Container>
    )
}


