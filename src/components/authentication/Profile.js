import React, { useState } from 'react';
import { Card, Button, Alert, Container } from 'react-bootstrap';
import { auth } from '../../Firebase';
import { Link, useHistory } from 'react-router-dom';
export default function Profile() {
    const history = useHistory()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    function logout() {
        return auth.signOut()
    }
    async function handlelogout(e) {
        e.preventDefault()
        console.log("print")
        setError('')
        setLoading(true)
        try {
            await logout()
            history.push('/login')
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
                        <h2 className="text-center mb-4">Profile</h2>
                        <Alert variant="danger" style={{ display: `${error === '' ? "none" : "block"}` }}>{error}</Alert>
                        <strong>Email: </strong>{auth.currentUser && auth.currentUser.email}
                        <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                            Update Profile
                        </Link>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    <Button disabled={loading} variant="link" onClick={handlelogout}>Log Out</Button>
                </div>
            </div>
        </Container>
    )
}
