import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../widgets/Header";
import { CircularProgress } from "@mui/material";
import '../static/styles/News.css';
import { Button } from "../widgets/Button";
import TestImage from "../static/images/road.jpg";

export const News = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [news, setNews] = useState([
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
        { title: "Hello, world", short_desc: "Really short description", image_src: TestImage },
    ]);

    const load = async () => {
        console.log("Loading!");

        try {
            const result = await axios.get("/news");
            setNews(result.data);
        } catch (e) {
            console.log(`Exception while fetching news: ${e}`);
        }

        setIsLoaded(true);
    }

    useEffect(() => {
        load();
    }, [isLoaded, articles]);

    return (
        <div className="news-container">
            <Header></Header>

            {isLoaded ? <div className="content">
                {news != null ? <div className="myContent">
                    <h1>Статьи</h1>
                    <div className="news">
                        {news.map((val, index, arr) => <New val={val} />)}
                    </div>
                </div> : <div className="loading">
                    <p>Не удалось загрузить 😔</p>
                    <Button text="Повторить попытку" onClick={() => load() && setIsLoaded(false)}></Button>
                </div>}
            </div> : <div className="loading">
                <CircularProgress color="black" />
                <p>Загружаем новости...</p>
            </div>}
        </div>
    );
}

const New = ({ val }) => {
    return (
        <div className="new">
            <img src={val.image_src}></img>

            <div>
                <h1 className="heading">{val.title}</h1>
                <p className="heading">{val.short_desc}</p>
                <Button text="Читать"></Button>
            </div>
        </div>
    );
};
