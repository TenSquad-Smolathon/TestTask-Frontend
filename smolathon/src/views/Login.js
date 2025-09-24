import { useState } from "react";
import { useAuth } from "../providers/authProvider";
import { Navigate } from "react-router-dom";
import '../static/styles/Login.css';

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
        <div className="login-wrapper">
            <div className="login-root">
                <h1>Вход</h1>
                {authorized ? <Navigate to="/admin"></Navigate> : <form onSubmit={handleSubmit}>
                    <div className="inputs">
                        <br />
                        <label htmlFor="email">Почта</label>
                        <br />
                        <input type='email' autoComplete='username' name='email' onChange={(e) => setInput({ ...input, email: e.target.value })} />

                        <br />
                        <label htmlFor="password">Пароль</label>
                        <br />
                        <input type='password' autoComplete='current-password' name='password' onChange={(e) => setInput({ ...input, password: e.target.value })} />
                    </div>
                    
                    <br />
                    <input type="submit" value="Войти" />
                </form>}
            </div>
        </div>

    );
}