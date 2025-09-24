import { AdminHeader } from './Header';
import '../../static/styles/Admin.css';


export const Admin = () => {
    return (
        <div className='admin-root'>
            <AdminHeader />

            <div className="screen">
                <div style={{ height: "20px" }} />
                <h1>Главная</h1>
                <p>Это - главная страница админ-панели. В меню вы можете выбрать, какой раздел панели администратора вам нужен.</p>

                {/* TODO: fill content */}
            </div >
        </div>

    );
}