import { useEffect, useState } from 'react';
import { AdminHeader } from './Header';
import { Button } from '../../widgets/Button';
import axios from 'axios';
import '../../static/styles/Redactor.css';

// random string generator
const generateRandomString = (n) => {
    const s = "1234567890abcdefghijkopqrstuvwxyz";
    let res = "";
    for (let i = 0; i < n; i++) {
        res += s[Math.trunc(Math.random() * s.length)]
    }
    return res;
}

// page types
class Type {
    static PROJECT = 0
    static NEW = 1
    static ARTICLE = 2
    static SERVICE = 3
    static CONTACT = 4
    static DOCUMENT = 5
    static VACANCY = 6
}

// API mappings
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
        await axios.post("/content/news/", {
            name,
            short_desc,
            text
        });
    }

    async edit_new({ id, name, short_desc, text }) {
        await axios.patch(`/content/news/${id}/`, {
            name,
            short_desc,
            text
        });
    }

    async delete_new({ id }) {
        await axios.delete(`/content/news/${id}`);
    }


    async add_article({ name, short_desc, text }) {
        await axios.post("/content/articles/", {
            name,
            short_desc,
            text
        });
    }

    async edit_article({ id, name, short_desc, text }) {
        await axios.patch(`/content/articles/${id}/`, {
            name,
            short_desc,
            text
        });
    }

    async delete_article({ id }) {
        await axios.delete(`/content/articles/${id}/`);
    }


    async add_contact({
        name,
        phone,
        email
    }) {
        await axios.post("/content/contacts/", {
            name,
            phone,
            email,
            image_path: "",
        });
    }

    async edit_contact({
        id,
        name,
        phone,
        email
    }) {
        await axios.patch(`/content/contacts/${id}/`, {
            name,
            phone,
            email,
            image_path: "",
        });
    }

    async delete_contact({ id }) {
        await axios.delete(`/content/contacts/${id}/`);
    }


    async add_service({
        title,
        short_desc,
        desc,
        text,
        inputs,
        action_text,
    }) {
        await axios.post("/content/services/", {
            title,
            short_desc,
            desc,
            text,
            inputs: inputs,
            action_text,
        });
    }

    async edit_service({
        id,
        title,
        short_desc,
        desc,
        text,
        inputs,
        action_text,
    }) {
        await axios.patch(`/content/services/${id}/`, {
            title,
            short_desc,
            desc,
            text,
            inputs,
            action_text,
        });
    }

    async delete_service({ id }) {
        await axios.delete(`/content/services/${id}/`);
    }

    async add_document({
        name,
        link
    }) {
        await axios.post("/content/documents/", {
            name,
            link,
        });
    }

    async edit_document({
        id,
        name,
        text,
    }) {
        await axios.patch(`/content/documents/${id}/`, {
            name,
            text,
        });
    }

    async delete_document({ id }) {
        await axios.delete(`/content/documents/${id}/`);
    }


    async add_vacancy({
        title,
        description,
        requirements,
        payout,
    }) {
        await axios.post("/content/vacancies/", {
            title,
            description,
            requirements,
            payout,
        });
    }

    async edit_vacancy({
        id,
        title,
        description,
        requirements,
        payout,
    }) {
        await axios.patch(`/content/vacancies/${id}/`, {
            title,
            description,
            requirements,
            payout,
        });
    }

    async delete_vacancy({ id }) {
        await axios.delete(`/content/vacancies/${id}/`);
    }
}

// Редактор страниц
export const AdminRedactor = () => {
    const [news, setNews] = useState([]);
    const [articles, setArticles] = useState([]);
    const [projects, setProjects] = useState([]);
    const [services, setServices] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [searchTerms, setSearchTerms] = useState({
        news: "",
        articles: "",
        projects: "",
        services: "",
        contacts: "",
        documents: "",
        vacancies: "",
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
            const result = await axios.get("/content/news/");
            setNews(result.data);
        } catch (e) {
            console.log(`Error occured while loading news: ${e}`);
            setNews([]);
        }
    }

    const loadArticles = async () => {
        try {
            const result = await axios.get("/content/articles/");
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

    const loadServices = async () => {
        try {
            const result = await axios.get("/content/services/");
            setServices(result.data);
        } catch (e) {
            console.log("Error occurde while loading services:", e);
            setServices([]);
        }
    }

    const loadContacts = async () => {
        try {
            const result = await axios.get("/content/contacts/");
            setContacts(result.data);
        } catch (e) {
            console.log("Error occurde while loading contacts:", e);
            setContacts([]);
        }
    }

    const loadDocuments = async () => {
        try {
            const result = await axios.get("/content/documents");
            setDocuments(result.data);
        } catch (e) {
            console.log("Error occurde while loading documents:", e);
            setDocuments([]);
        }
    }

    const loadVacancies = async () => {
        try {
            const result = await axios.get("/content/vacancies");
            setVacancies(result.data);
        } catch (e) {
            console.log("Error occurde while loading vacancies:", e);
            setVacancies([]);    
        }
    }

    const containsTerm = (val, term) => {
        return Object.values(val).join('').toLowerCase().includes(term.toLowerCase());
    }

    useEffect(() => {
        loadNews();
        loadArticles();
        loadProjects();
        loadServices();
        loadContacts();
        loadDocuments();
        loadVacancies();
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
                    <input placeholder='Поиск...' name="rd__news-search" onInput={(e) => setSearchTerms({
                        ...searchTerms, news: e.target.value,
                    })} />
                    <input type='button' value="Создать" onClick={() => {
                        setCurrentCreatingMode({
                            isOpened: true,
                            type: Type.NEW,
                            reload: loadNews,
                            template: {
                                name: "",
                                short_desc: "",
                                text: "",
                            }
                        });
                    }} />

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
                    <input placeholder='Поиск...' name="rd__articles-search" onInput={(e) => setSearchTerms({
                        ...searchTerms, articles: e.target.value,
                    })} />
                    <input type='button' value="Создать" onClick={() => {
                        setCurrentCreatingMode({
                            isOpened: true,
                            type: Type.ARTICLE,
                            reload: loadArticles,
                            template: {
                                name: "",
                                short_desc: "",
                                text: "",
                            }
                        });
                    }} />

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

                <div className='rd__projects-wrapper'>
                    <h2>Сервисы</h2>
                    <input placeholder='Поиск...' name='rd__projects-search' onInput={(e) => setSearchTerms({
                        ...searchTerms, services: e.target.value,
                    })} />
                    <input type='button' value="Создать" onClick={() => {
                        setCurrentCreatingMode({
                            isOpened: true,
                            type: Type.SERVICE,
                            reload: loadServices,
                            template: {
                                title: "",
                                short_desc: "",
                                desc: "",
                                text: "",
                                inputs: "",
                                action_text: "",
                            }
                        });
                    }} />

                    <div className='rd__projects rd__row'>
                        {
                            services.map(
                                (val) => containsTerm(val, searchTerms.services) && <RDPage api={api} reload={loadServices} type={Type.SERVICE}>{val}</RDPage>
                            )
                        }
                    </div>
                </div>

                <div className='rd__projects-wrapper'>
                    <h2>Контакты</h2>
                    <input placeholder='Поиск...' name='rd__projects-search' onInput={(e) => setSearchTerms({
                        ...searchTerms, contacts: e.target.value,
                    })} />
                    <input type='button' value="Создать" onClick={() => {
                        setCurrentCreatingMode({
                            isOpened: true,
                            type: Type.CONTACT,
                            reload: loadContacts,
                            template: {
                                name: "",
                                phone: "",
                                email: "",
                            }
                        });
                    }} />

                    <div className='rd__projects rd__row'>
                        {
                            contacts.map(
                                (val) => containsTerm(val, searchTerms.contacts) && <RDPage api={api} reload={loadContacts} type={Type.CONTACT}>{val}</RDPage>
                            )
                        }
                    </div>
                </div>

                <div className='rd__projects-wrapper'>
                    <h2>Документы</h2>
                    <input placeholder='Поиск...' name='rd__projects-search' onInput={(e) => setSearchTerms({
                        ...searchTerms, documents: e.target.value,
                    })} />
                    <input type='button' value="Создать" onClick={() => {
                        setCurrentCreatingMode({
                            isOpened: true,
                            type: Type.DOCUMENT,
                            reload: loadDocuments,
                            template: {
                                name: "",
                                link: "",
                            }
                        });
                    }} />

                    <div className='rd__projects rd__row'>
                        {
                            documents.map(
                                (val) => containsTerm(val, searchTerms.documents) && <RDPage api={api} reload={loadDocuments} type={Type.DOCUMENT}>{val}</RDPage>
                            )
                        }
                    </div>
                </div>

                <div className='rd__projects-wrapper'>
                    <h2>Вакансии</h2>
                    <input placeholder='Поиск...' name='rd__projects-search' onInput={(e) => setSearchTerms({
                        ...searchTerms, vacancies: e.target.value,
                    })} />
                    <input type='button' value="Создать" onClick={() => {
                        setCurrentCreatingMode({
                            isOpened: true,
                            type: Type.VACANCY,
                            reload: loadVacancies,
                            template: {
                                title: "",
                                description: "",
                                payout: "",
                                requirements: "",
                            }
                        });
                    }} />

                    <div className='rd__projects rd__row'>
                        {
                            vacancies.map(
                                (val) => containsTerm(val, searchTerms.vacancies) && <RDPage api={api} reload={loadVacancies} type={Type.VACANCY}>{val}</RDPage>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}


// viewing/editing tool
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
        console.log(type);

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

            case Type.SERVICE:
                if (isCreating) {
                    await api.add_service(values);
                } else {
                    await api.edit_service({ ...values, id: val.id });
                }
                break;

            case Type.CONTACT:
                if (isCreating) {
                    await api.add_contact(values);
                } else {
                    await api.edit_contact({ ...values, id: val.id });
                }
                break;

            case Type.DOCUMENT:
                if (isCreating) {
                    await api.add_document(values);
                } else {
                    await api.edit_document({ ...values, id: val.id });
                }
                break;

            case Type.VACANCY:
                if (isCreating) {
                    await api.add_vacancy(values);
                } else {
                    await api.edit_vacancy({ ...values, id: val.id });
                }
                break;
        }
    }

    return (<div className='rd__page'>
        {!isCreating && <h2>{val.name ?? val.title}</h2>}

        {!isCreating && <Button text="Редактировать" isAccent onClick={() => {
            setIsEditorOpened(true);
        }} />}

        {!isCreating && <Button text="Удалить" isOnBright onClick={() => {
            [api.delete_project, api.delete_new, api.delete_article, api.delete_service,
            api.delete_contact, api.delete_document, api.delete_vacancy][type]({ id: val.id }).then(reload);
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
                    save()
                        .then(() => {
                            setIsEditorOpened(false);
                            close();
                            reload();
                        }, (r) => { console.log(r) });
                }} />
            </div>
        }
    </div>);
}