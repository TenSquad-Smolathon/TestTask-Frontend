import { useState } from "react";
import { useAuth } from "../providers/authProvider";
import { Navigate, useNavigate } from "react-router-dom";
import '../static/styles/Login.css';

export const Login = () => {
    const [input, setInput] = useState({ username: '', password: '' });
    const { loginAction } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        loginAction(input).then((val) => {
            console.log(val);

            if (val) {
                navigate("/admin");
            } else {
                alert("Неверный логин или пароль, или сервер недоступен");
            }
        });
    };

    // TODO: add input validation

    return (
        <div className="login-wrapper">
            <div className="login-root">
                <h1>Вход</h1>
                <form onSubmit={handleSubmit}>
                    <div className="inputs">
                        <br />
                        <label htmlFor="username">Логин</label>
                        <br />
                        <input type='login' autoComplete='username' name='username' onChange={(e) => setInput({ ...input, username: e.target.value })} />

                        <br />
                        <label htmlFor="password">Пароль</label>
                        <br />
                        <input type='password' autoComplete='current-password' name='password' onChange={(e) => setInput({ ...input, password: e.target.value })} />
                    </div>
                    
                    <br />
                    <input type="submit" value="Войти" />
                </form>
            </div>
        </div>

    );
}