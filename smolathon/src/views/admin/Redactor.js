import { useEffect, useState } from 'react';
import { AdminHeader } from './Header';
import { Button } from '../../widgets/Button';
import axios from 'axios';
import '../../static/styles/Redactor.css';

const generateRandomString = (n) => {
    const s = "1234567890abcdefghijkopqrstuvwxyz";
    let res = "";
    for (let i = 0; i < n; i++) {
        res += s[Math.trunc(Math.random() * s.length)]
    }
    return res;
}

class Type {
    static PROJECT = 0
    static NEW = 1
    static ARTICLE = 2
}

class API {
    async add_project({ name, description }) {
        await axios.post("/projects/", {
            name,
            description,
        });
    }

    async edit_project({ id, name, description }) {
        await axios.patch(`/projects/${id}/`, {
            id,
            name,
            description,
        });
    }

    async delete_project({ id }) {
        await axios.delete(`/projects/${id}/`);
    }


    async add_new({ name, short_desc, text }) {
        await axios.post("/news/", {
            name,
            short_desc,
            text
        });
    }

    async edit_new({ id, name, short_desc, text }) {
        await axios.patch(`/news/${id}/`, {
            name,
            short_desc,
            text
        });
    }

    async delete_new({ id }) {
        await axios.delete(`/news/${id}`, {
            id
        });
    }


    async add_article({ name, short_desc, text }) {
        await axios.post("/articles/", {
            name,
            short_desc,
            text
        });
    }

    async edit_article({ id, name, short_desc, text }) {
        await axios.patch(`/articles/${id}/`, {
            name,
            short_desc,
            text
        });
    }

    async delete_article({ id }) {
        await axios.delete(`/articles/${id}`, {
            id
        });
    }
}

export const AdminRedactor = () => {
    const [news, setNews] = useState([]);
    const [articles, setArticles] = useState([]);
    const [projects, setProjects] = useState([]);
    const [searchTerms, setSearchTerms] = useState({
        news: "",
        articles: "",
        projects: ""
    });
    const [currentCreatingMode, setCurrentCreatingMode] = useState({
        isOpened: false,
        type: Type.PROJECT,
        reload: () => { },
        template: {},
    });
    const api = new API();

    const loadNews = async () => {
        try {
            const result = await axios.get("/news/");
            setNews(result.data);
        } catch (e) {
            console.log(`Error occured while loading news: ${e}`);
            setNews([]);
        }
    }

    const loadArticles = async () => {
        try {
            const result = await axios.get("/articles/");
            setArticles(result.data);
        } catch (e) {
            console.log(`Error occured while loading articles: ${e}`);
            setArticles([]);
        }
    }

    const loadProjects = async () => {
        try {
            const result = await axios.get("/projects/");
            setProjects(result.data);
        } catch (e) {
            console.log(`Error occured while loading projects: ${e}`);
            setProjects([]);
        }
    }

    const containsTerm = (val, term) => {
        return Object.values(val).join('').toLowerCase().includes(term.toLowerCase());
    }

    useEffect(() => {
        loadNews();
        loadArticles();
        loadProjects();
    }, []);

    return (
        <div className='admin-root'>
            <AdminHeader />

            <RDPage isCreating
                isOpened={currentCreatingMode.isOpened}
                reload={currentCreatingMode.reload}
                type={currentCreatingMode.type}
                close={() => setCurrentCreatingMode({ ...currentCreatingMode, isOpened: false })}
                api={api}
            >{currentCreatingMode.template}</RDPage>

            <div className="screen">
                <div style={{ height: "20px" }} />
                <h1>Редактор содержимого страниц</h1>

                <div className='rd__news-wrapper'>
                    <h2>Новости</h2>
                    {/* TODO: make an Create logic */}
                    <input placeholder='Поиск...' name="rd__news-search" onInput={(e) => setSearchTerms({
                        ...searchTerms, news: e.target.value,
                    })} />
                    <input type='button' value="Создать" />

                    <div className='rd__news rd__row'>
                        {
                            news.map(
                                (val) => containsTerm(val, searchTerms.news) && <RDPage api={api} reload={loadNews}>{val}</RDPage>
                            )
                        }
                    </div>
                </div>

                <div className='rd__articles-wrapper'>
                    <h2>Статьи</h2>
                    {/* TODO: make an Create logic */}
                    <input placeholder='Поиск...' name="rd__articles-search" onInput={(e) => setSearchTerms({
                        ...searchTerms, articles: e.target.value,
                    })} />
                    <input type='button' value="Создать" />

                    <div className='rd__articles rd__row'>
                        {
                            articles.map(
                                (val) => containsTerm(val, searchTerms.articles) && <RDPage api={api} reload={loadArticles}>{val}</RDPage>
                            )
                        }
                    </div>
                </div>

                <div className='rd__projects-wrapper'>
                    <h2>Проекты</h2>
                    <input placeholder='Поиск...' name='rd__projects-search' onInput={(e) => setSearchTerms({
                        ...searchTerms, projects: e.target.value,
                    })} />
                    <input type='button' value="Создать" onClick={() => {
                        setCurrentCreatingMode({
                            isOpened: true,
                            type: Type.PROJECT,
                            reload: loadProjects,
                            template: {
                                name: "",
                                description: "",
                            }
                        });
                    }} />

                    <div className='rd__projects rd__row'>
                        {
                            projects.map(
                                (val) => containsTerm(val, searchTerms.projects) && <RDPage api={api} reload={loadProjects} type={Type.PROJECT}>{val}</RDPage>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

const RDPage = ({ children: val, api, reload, type, isCreating = false, isOpened = false, close = () => { } }) => {
    const [isEditorOpened, setIsEditorOpened] = useState(false);
    const [randomId, _] = useState(generateRandomString(5));

    const save = async () => {
        let values = {};

        for (const field of Object.keys(val)) {
            if (["id", "created_at", "updated_at"].includes(field)) continue;

            values[field] = document.getElementById(`${randomId}_${field}`).value;
        }

        console.log(values);

        switch (type) {
            case Type.ARTICLE:
                if (isCreating) {
                    await api.add_article({ ...values });
                } else {
                    await api.edit_article({ ...values, id: val.id });
                }
                break;

            case Type.NEW:
                if (isCreating) {
                    await api.add_new({ ...values });
                } else {
                    await api.edit_new({ ...values, id: val.id });
                }
                break;

            case Type.PROJECT:
                if (isCreating) {
                    await api.add_project(values);
                } else {
                    await api.edit_project({ ...values, id: val.id });
                }
                break;
        }
    }

    return (<div className='rd__page'>
        {!isCreating && <h2>{val.name}</h2>}

        {!isCreating && <Button text="Редактировать" isAccent onClick={() => {
            setIsEditorOpened(true);
        }} />}

        {!isCreating && <Button text="Удалить" isOnBright onClick={() => {
            api.delete_project({ id: val.id }).then(reload);
        }} />}

        {
            (isEditorOpened || (isOpened && isCreating)) && <div style={{
                position: "fixed",
                top: 0,
                left: "20%",
                right: 0,
                bottom: 0,
                background: "white",
                padding: "20px"
            }}>
                <Button isAccent text={"Закрыть"} onClick={() => setIsEditorOpened(false) || close()} />

                {
                    Object.keys(val).map((v) => !["id", "created_at", "updated_at"].includes(v) && <div>
                        <br />
                        <textarea placeholder={v} id={`${randomId}_${v}`} defaultValue={val[v]}></textarea>
                    </div>)
                }

                <br />

                {/* TODO: make a creating and saving algos */}

                <Button text={"Сохранить"} isAccent onClick={() => {
                    save().then(() => {
                        setIsEditorOpened(false);
                        close();
                        reload();
                    }, (r) => { });
                }} />
            </div>
        }
    </div>);
}