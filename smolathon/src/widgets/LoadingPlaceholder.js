import { CircularProgress } from "@mui/material";

export const LoadingPlaceholder = ({children}) => {
    return (
        <div className="loading">
            <CircularProgress color="black" />
            <p>Загружаем{!!children ? " " + children : ""}...</p>
        </div>
    );
}