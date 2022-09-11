import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { auth } from '../../Firebase'
import firebase from "firebase/app"
import { Link, useHistory } from 'react-router-dom'
export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null);
    const history = useHistory()
    // const {signup} = useAuth()

    function login(email, password) {
        return new Promise((resolve,reject)=>{
            firebase.auth().setPersistence("session")
            .then(() => {
                resolve(firebase.auth().signInWithEmailAndPassword(email, password));
            })
            .catch((error) => {
                reject(error)
            });
        })
        

    }

    // auth.onAuthStateChanged(user=>{
    //     setUser(user)
    //     console.log(user.email)
    // })



    async function handleSubmit(e) {
        e.preventDefault()
        console.log("print")
        setError('')
        setLoading(true)
        try {
            var res = await login(emailRef.current.value, passwordRef.current.value)
            // //login(emailRef.current.value, passwordRef.current.value)
            // //.then(msg=>{
            //     res = msg
            // }).catch(e=>{
            //     res = msg
            // })
            setUser(res.user)
            console.log(auth.currentUser)
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
                <Card className="p-2">
                    <Card.Body>
                        <h2 className="text-center mb-4">Log In</h2>
                        <Alert variant="danger" style={{ display: `${error === '' ? "none" : "block"}` }}>{error}</Alert>
                        {/* {user && user.email} */}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required></Form.Control>
                            </Form.Group>
                            <Form.Group id="password" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} required></Form.Control>
                            </Form.Group>
                            <Button disabled={loading} className="w-100" type="submit">Log In</Button>
                        </Form>
                    </Card.Body>
                    <div className="w-100 text-center mt-2">
                        <Link to="/forgotPassword">Forgot password</Link>
                    </div>
                </Card>
                <div className="w-100 text-center mt-3">
                    Need an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </Container>
    )
}


