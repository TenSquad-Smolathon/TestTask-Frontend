import { useEffect, useState } from "react";
import { Header } from "../widgets/Header";
import { Button } from "../widgets/Button";
import { LoadingPlaceholder } from "../widgets/LoadingPlaceholder";
import { FailedPlaceholder } from "../widgets/FailedPlaceholder";
import Markdown from 'react-markdown'
import axios from "axios";
import '../static/styles/News.css';


export const News = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [news, setNews] = useState(null);

    const load = async () => {
        try {
            const result = await axios.get("/news");
            setNews(result.data);
        } catch (e) {
            console.log(`Exception while fetching news: ${e}`);
            setNews(null);
        }

        setIsLoaded(true);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="news-container">
            <Header />
            <div style={{ height: "20px" }} />

            {isLoaded ? <div className="new">
                {news != null ? <div className="myContent">
                    <h1>Новости ЦОДД</h1>
                    <div className="news">
                        {news.map((val, index, arr) => <New>{val}</New>)}
                    </div>
                </div> : <FailedPlaceholder retry={() => console.log("retrying") || load() || setIsLoaded(false)}>новости</FailedPlaceholder>}
            </div> : <LoadingPlaceholder>новости</LoadingPlaceholder>}
        </div>
    );
}

const New = ({ children: val }) => {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <div>
            <div className="new">
                <img src={val.image_src}></img>

                <div className="text-part">
                    <div>
                        <h1 className="heading">{val.title}</h1>
                        <p className="heading">{val.short_desc}</p>
                    </div>

                    <div style={{ height: "100%" }} />

                    <Button text="Читать" isAccent={true} onClick={() => {
                        setIsOpened(!isOpened);
                    }} />
                </div>
            </div>

            {isOpened && <NewReader close={() => setIsOpened(false)}>{val}</NewReader>}
        </div>
    );
};

export const NewReader = ({ children: val, close = () => { } }) => {
    return (
        <div className="reader-wrapper">
            <div className="reader">
                <Button onClick={close} isAccent={true} text="Закрыть" className="close-button" />
                <h1 style={{ fontSize: "2rem" }}>{val.title}</h1>
                <hr />
                <Markdown>{val.text}</Markdown>
            </div>
        </div>
    );
}