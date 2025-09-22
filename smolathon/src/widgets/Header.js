import { ReactComponent as Logo } from '../static/images/logo.svg';
import '../static/styles/Header.css';
import { Button } from './Button';
import Dropdown from './DropdownMenu';

export const Header = () => {
    return (
        <header>
            <div className='logo'>
                <Logo />
                <p className='header-title'>СЦОДД</p>
            </div>

            <div className='nav'>
                <Dropdown value="Проекты" options={[
                    <Button text="Проект 1" isOnBright={false} />,
                    <Button text="Проект 2" isOnBright={false} />
                ]} />

                <Dropdown value="Услуги" options={[
                    <Button text="Вызов эвакуатора"/>,
                    <Button text="Аренда автовышки"/>,
                    <Button text="Документация"/>,
                ]} />

                <Dropdown value="Другое" options={[
                    <Button text="Контакты" />,
                    <Button text="Вакансии" />,
                    <Button text="Документы" />,
                    <Button text="Команда" />,
                ]} />

                <Button text="Новости" />
                <Button text="Статьи" />

                <Button text="О ЦОДД" isAccent="true" />
            </div>
        </header>
    );
}