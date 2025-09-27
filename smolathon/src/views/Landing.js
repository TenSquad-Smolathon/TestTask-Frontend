import { ReactComponent as CrossLine } from '../static/images/crossline.svg';
import { Header } from "../widgets/Header";
import RoadBG from '../static/images/road.webp';
import { Button } from "../widgets/Button";
import { useNavigate } from "react-router-dom";
import "../static/styles/Landing.css";

// Лендинг-страница - первое, что видит пользователь
export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Header />

            <main className="m1">
                <div className="left-side">
                    <h1>Центр организации дорожного движения <span className="accent">Смоленской области</span></h1>
                    <CrossLine style={{ padding: "10px 0px" }} />
                    <p style={{ paddingBottom: "40px" }}>Безопасность и порядок на дорогах <br /> вашего региона</p>

                    <div className="actionButtons" style={{ gap: "20px" }}>
                        <Button isOnBright={true} text="Об организации" onClick={() => navigate("/about")} />
                        <Button isAccent={true} text="Контакты" onClick={() => navigate("/contacts")} />
                    </div>
                </div>

                <div className="right-side">
                    {/* <div className="whitespace"></div> */}
                    <img src={RoadBG}></img>
                </div>
            </main>

            <main className="m2">
                <h1>Наши сервисы - для вашего удобства</h1>

                <div className="buttons">
                    <Button isOnBright text="Интерактивная карта" onClick={() => navigate("/services/accidents-map")} />
                    <Button isOnBright text="Статистика" onClick={() => navigate("/services/stats")} />
                    <Button isOnBright text="Новости" onClick={() => navigate("/news")} />
                    <Button isOnBright text="Статьи" onClick={() => navigate("/articles")} />
                </div>

                <br />
            </main>
        </div>
    );
}