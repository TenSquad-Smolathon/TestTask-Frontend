import { Button } from "./Button";

// Placeholder for failed loading
export const FailedPlaceholder = ({ children, retry = () => {} }) => {
    return (
        <div className="loading">
            <p>Не удалось загрузить{!!children ? " " + children : ""} 😔</p>
            <Button text="Повторить попытку" onClick={retry}></Button>
        </div>
    );
}