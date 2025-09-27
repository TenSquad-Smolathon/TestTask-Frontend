import { useState } from 'react';
import { ReactComponent as Menu } from '../../static/images/menu.svg';
import '../../static/styles/AdminHeader.css';

// Меню панели администратора. Отображается слева
export const AdminHeader = () => {
    const [isNavOpened, setIsNavOpened] = useState(false);

    return (
        <>
            <div onClick={() => setIsNavOpened(false)} className='out-click-listener' style={{ transform: isNavOpened ? "none" : "translateX(-100%)", opacity: isNavOpened * 1 }}></div>
            <div className={`sidebar ${isNavOpened ? "sidebar-opened" : ""}`}>
                <h1>Меню</h1>
                <a href="/admin">Главная</a>
                <a href="/admin/stats">Статистика</a>
                <a href="/admin/maps">Карты</a>
                <a href="/admin/orders">Заказы</a>
                <a href="/admin/redactor">Редактор страниц</a>
                <a href="/admin/import">Импорт данных</a>
                <a href="/admin/insert">Внос данных</a>
            </div>

            <Menu style={{ width: "40px", height: "40px" }} className='menu-button' onClick={(e) => { setIsNavOpened(!isNavOpened) }} />
        </>
    );
}