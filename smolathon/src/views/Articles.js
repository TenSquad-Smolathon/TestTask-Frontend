import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "../widgets/Header";
import { Button } from "../widgets/Button";
import { LoadingPlaceholder } from "../widgets/LoadingPlaceholder";
import { FailedPlaceholder } from "../widgets/FailedPlaceholder";
import { NewReader } from "./News";
import '../static/styles/Article.css';
import '../static/styles/News.css';

// Страница статей
export const Articles = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [articles, setArticles] = useState(null);

    const load = async () => {
        console.log("Loading!");

        try {
            const result = await axios.get("/content/articles/");
            setArticles(result.data);
        } catch (e) {
            console.log(`Exception while fetching articles: ${e}`);
            setArticles(null);
        }

        setIsLoaded(true);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="articles-container">
            <Header />
            <div style={{ height: "70px" }} />

            {isLoaded ? <div className="content">
                {articles != null ? <div className="myContent">
                    <h1>Статьи</h1>
                    <div className="articles">
                        {articles.map((val, index, arr) => <Article val={val} />)}
                    </div>
                </div> : <FailedPlaceholder retry={() => console.log("retrying") || load() || setIsLoaded(false)}>статьи</FailedPlaceholder>}
            </div> : <LoadingPlaceholder>статьи</LoadingPlaceholder>}
        </div>
    );
}

const Article = ({ val }) => {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <div>
            <div className="article">
                <img src={val.image_src} style={{ minHeight: "200px", minWidth: "200px", background: "lightgray" }} ></img>

                <div style={{ height: "10px" }} />

                <h1 className="heading">{val.name}</h1>
                <p className="heading">{val.short_desc}</p>

                <div style={{ height: "10px" }} />

                <Button isAccent={true} text="Читать" onClick={() => setIsOpened(!isOpened)}></Button>
            </div>

            {isOpened && <NewReader close={() => setIsOpened(false)}>{val}</NewReader>}
        </div>
    );
};
