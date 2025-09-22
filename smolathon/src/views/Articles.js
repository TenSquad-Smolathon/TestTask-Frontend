import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../widgets/Header";
import { CircularProgress } from "@mui/material";
import '../static/styles/Article.css';
import { Button } from "../widgets/Button";
import TestImage from "../static/images/road.jpg";

export const Articles = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState([
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
        {title: "Hello, world", short_desc: "Really short description", image_src: TestImage},
    ]);

    const load = async () => {
        console.log("Loading!");

        try {
            const result = await axios.get("/articles");
            setArticles(result.data);
        } catch (e) {
            console.log(`Exception while fetching articles: ${e}`);
        }

        setIsLoaded(true);
    }

    useEffect(() => {
        load();
    }, [isLoaded, articles]);

    return (
        <div className="articles-container">
            <Header></Header>

            {isLoaded ? <div className="content">
                {articles != null ? <div className="myContent">
                    <h1>Статьи</h1>
                    <div className="articles">
                        {articles.map((val, index, arr) => <Article val={val} />)}
                    </div>
                </div> : <div className="loading">
                    <p>Не удалось загрузить 😔</p>
                    <Button text="Повторить попытку" onClick={() => load() && setIsLoaded(false)}></Button>
                </div>}
            </div> : <div className="loading">
                <CircularProgress color="black" />
                <p>Загружаем статьи...</p>
            </div>}
        </div>
    );
}

const Article = ({val}) => {
    return (
        <div className="article">
            <img src={val.image_src}></img>
            <h1 className="heading">{val.title}</h1>
            <p className="heading">{val.short_desc}</p>

            <Button text="Читать"></Button>
        </div>
    );
};
