import { Button } from "./Button";

export const FailedPlaceholder = ({ children, retry = () => {} }) => {
    return (
        <div className="loading">
            <p>Не удалось загрузить{!!children ? " " + children : ""} 😔</p>
            <Button text="Повторить попытку" onClick={retry}></Button>
        </div>
    );
}