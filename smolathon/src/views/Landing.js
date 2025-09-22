import { Header } from "../widgets/Header";
// import { ReactComponent as Heart } from '../static/images/heart.svg';
import RoadBG from '../static/images/road.jpg';
import { ReactComponent as Heart } from '../static/images/heart.svg';
import "../static/styles/Landing.css";
import { Button } from "../widgets/Button";

export const Landing = () => {
    return (
        <div>
            <Header />

            <main className="m1">
                <div className="left-side">

                    <h1>Центр организации дорожного движения <span className="accent">Смоленской области</span></h1>
                    <p>Безопасность и порядок на дорогах <br /> вашего региона</p>
                    <Heart width="300px" height="250px" className="heart" />

                    <div className="actionButtons" style={{gap: "20px"}}>
                        <Button isOnBright={true} text="О центре организации" />
                        <Button isAccent={true} text="Услуги" />
                    </div>
                </div>
                <div className="right-side">
                    <div className="whitespace"></div>
                    <img src={RoadBG}></img>
                </div>
            </main>

            <main className="m2">
                
            </main>
        </div>
    );
}