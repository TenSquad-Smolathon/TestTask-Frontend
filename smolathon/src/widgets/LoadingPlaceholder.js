import { CircularProgress } from "@mui/material";

// Placeholder for loading screen
export const LoadingPlaceholder = ({children}) => {
    return (
        <div className="loading">
            <CircularProgress color="black" />
            <p>Загружаем{!!children ? " " + children : ""}...</p>
        </div>
    );
}