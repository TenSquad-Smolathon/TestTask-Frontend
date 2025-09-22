import '../static/styles/Button.css';

export const Button = ({ text, isAccent = false, isOnBright = false, onClick = (e) => {} }) => {
    return (
        <div onClick={onClick} className={isAccent ? "button-accent" : isOnBright ? "button-dark" : "button"}>
            <p>{ text }</p>
        </div>
    );
}