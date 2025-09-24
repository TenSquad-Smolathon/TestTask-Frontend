import '../static/styles/Button.css';

export const Button = ({ text, className = "", isAccent = false, isOnBright = false, onClick = (e) => {} }) => {
    return (
        <div onClick={(e) => {console.log("Clicked!"); onClick(e)}} className={(isAccent ? "button-accent" : isOnBright ? "button-dark" : "button") + ` ${className}`}>
            <p>{ text }</p>
        </div>
    );
}