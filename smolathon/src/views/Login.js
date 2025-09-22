import { useState } from "react";
import { useAuth } from "../providers/authProvider";

export const Login = () => {
    const [input, setInput] = useState({ email: '', password: '' });
    const { loginAction } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        loginAction(input);
    };

    // TODO: add input validation

    return (
        <form onSubmit={handleSubmit}>
            <input type='email' autoComplete='username' name='email' onChange={(e) => setInput({ ...input, email: e.target.value })}></input>
            <input type='password' autoComplete='current-password' name='password' onChange={(e) => setInput({ ...input, password: e.target.value })}></input>
            <button type="submit">Login</button>
        </form>
    );
}