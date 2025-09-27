// Страница "404 Not Found"
export const NotFound = () => {
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh"}}>
            <h1>404 Not Found</h1>
            <p>Попробуйте поискать что-нибудь другое</p>
            <a href="/">На главную</a>
        </div>
    );
}