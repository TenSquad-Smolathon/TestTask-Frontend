import { ReactComponent as Logo } from '../static/images/logo.svg';
import { ReactComponent as Menu } from '../static/images/menu.svg';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { useEffect, useState } from 'react';
import Dropdown from './DropdownMenu';
import axios from 'axios';
import '../static/styles/Header.css';

// Шапка
export const Header = () => {
    const navigate = useNavigate();

    const [isNavOpened, setIsNavOpened] = useState(false);

    // projects format:
    // [
    //     {
    //         "name": string,
    //         "path": string,
    //     }
    // ]

    const [projects, setProjects] = useState([]);
    const [services, setServices] = useState([])

    const load = async () => {
        try {
            const result = await axios.get("/projects");
            setProjects(result.data);
        } catch (e) {
            console.log(`Error while fetching projects: ${e}`);
            setProjects([]);
        }

        try {
            const result = await axios.get("/content/services");
            setServices(result.data);
        } catch (e) {
            console.log(`Error while fetching projects: ${e}`);
            setServices([]);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <header>
            <div onClick={() => setIsNavOpened(false)} className='out-click-listener' style={{ transform: isNavOpened ? "none" : "translateX(100%)", opacity: isNavOpened * 1 }}></div>

            <div className='logo'>
                <Logo />
                <p className='header-title'>СЦОДД</p>
            </div>

            <div className={`nav ${isNavOpened ? "nav-opened" : ""}`}>
                <Dropdown value="Проекты" options={[
                    ...projects.map((val, i, arr) => <Button text={val.name} onClick={() => navigate(`/project/${val.id}`)} />),
                    <Button text="Интерактивная карта" onClick={() => navigate("/services/accidents-map")} />,
                    <Button text="Кластеризация" onClick={() => navigate("/services/clusterization")} />,
                    <Button text="Статистика" onClick={() => navigate("/services/stats")} />,
                ]} />

                <Dropdown value="Услуги" options={
                    services.map((val, i, arr) =>
                        <Button text={val.title} onClick={() => navigate(`/services/${val.id}`)} />
                    )
                } />

                <Dropdown value="Другое" options={[
                    <Button text="Контакты" onClick={() => navigate("/contacts")}/>,
                    <Button text="Вакансии" onClick={() => navigate("/vacancies")}/>,
                    <Button text="Документы" onClick={() => navigate("/documents")}/>
                ]} />

                <Button text="Новости" isOnBright={true} onClick={() => navigate("/news")} />
                <Button text="Статьи" isOnBright={true} onClick={() => navigate("/articles")} />
                <Button text="О ЦОДД" isOnBright={true} onClick={() => navigate("/about")} />
                <Button text="Главная" isOnBright={true} onClick={() => navigate("/")} />
            </div>

            <Menu style={{ width: "40px", height: "40px" }} className='menu-button' onClick={(e) => { setIsNavOpened(!isNavOpened) }} />
        </header>
    );
}