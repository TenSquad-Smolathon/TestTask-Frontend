import { useState } from "react";
import { useAuth } from "../providers/authProvider";
import { Navigate } from "react-router-dom";

export const Login = () => {
    const [authorized, setAuthorized] = useState(false);
    const [input, setInput] = useState({ email: '', password: '' });
    const { loginAction } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        loginAction(input).then((val) => {
            setAuthorized(val);
            console.log(val);
        });
    };

    // TODO: add input validation

    return (
        authorized ? <Navigate to="/admin"></Navigate> : <form onSubmit={handleSubmit}>
            <input type='email' autoComplete='username' name='email' onChange={(e) => setInput({ ...input, email: e.target.value })}></input>
            <input type='password' autoComplete='current-password' name='password' onChange={(e) => setInput({ ...input, password: e.target.value })}></input>
            <button type="submit">Login</button>
        </form>
    );
}