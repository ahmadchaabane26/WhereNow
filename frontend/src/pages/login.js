import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import firebase from "../firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const darkYellow = '#b58b00'; // Consistent color for both pages

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);

            const user = firebase.auth().currentUser;
            if (user) {
                navigate(`/${user.uid}/dashboard`);
            } else {
                navigate('/');
            }
        } catch {
            setError("Failed to log in");
        }

        setLoading(false);
    }

    return (
        <>
            <Card style={{
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: `2px solid ${darkYellow}`,
                transition: 'transform 0.5s, box-shadow 0.5s',
                animation: 'card-entry 1s ease-out'
            }}>
                <Card.Body>
                    <h2 className="text-center mb-4" style={{
                        color: darkYellow,
                        fontFamily: '"Roboto", sans-serif',
                        letterSpacing: '2px',
                        fontWeight: '700',
                        animation: 'fade-in 1s ease-in-out'
                    }}>WhereNow</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-3" type="submit" style={{
                                backgroundColor: darkYellow,
                                borderColor: darkYellow,
                                color: 'white',
                                fontWeight: 'bold',
                                letterSpacing: '1px',
                                transition: 'background-color 0.3s',
                            }}>
                            Log In  
                        </Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/forgot-password" style={{ color: darkYellow }}>Forgot Password?</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup" style={{ color: darkYellow }}>Sign Up</Link>
            </div>
            <style>{`
                @keyframes card-entry {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
}
