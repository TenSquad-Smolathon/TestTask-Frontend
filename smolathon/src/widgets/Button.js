import '../static/styles/Button.css';

// Button
export const Button = ({ text, className = "", isAccent = false, isOnBright = false, onClick = (e) => {} }) => {
    return (
        <div onClick={onClick} className={(isAccent ? "button-accent" : isOnBright ? "button-dark" : "button") + ` ${className}`}>
            <p>{ text }</p>
        </div>
    );
}