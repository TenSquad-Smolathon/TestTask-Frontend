import { useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../static/images/logo.svg';
import '../static/styles/Header.css';
import { Button } from './Button';
import Dropdown from './DropdownMenu';

export const Header = () => {
    const navigate = useNavigate();

    return (
        <header>
            <div className='logo'>
                <Logo />
                <p className='header-title'>СЦОДД</p>
            </div>

            <div className='nav'>
                <Dropdown value="Проекты" options={[
                    <Button text="Жалоба на дороги" isOnBright={false} />,
                    <Button text="Светофоры 2.0" isOnBright={false} />
                ]} />

                <Dropdown value="Услуги" options={[
                    <Button text="Вызов эвакуатора" onClick={() => navigate("/services/evacuate")}/>,
                    <Button text="Аренда автовышки" onClick={() => navigate("/services/rent-auto")}/>,
                    <Button text="Документация"  onClick={() => navigate("/services/documents")}/>,
                ]} />

                <Dropdown value="Другое" options={[
                    <Button text="Контакты" />,
                    <Button text="Вакансии" />,
                    <Button text="Документы" />,
                    <Button text="Команда" />,
                ]} />

                <Button text="Новости" onClick={() => navigate("/news")}/>
                <Button text="Статьи" onClick={() => navigate("/articles")} />

                <Button text="О ЦОДД" isAccent="true" />
            </div>
        </header>
    );
}