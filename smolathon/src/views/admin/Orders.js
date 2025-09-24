import { AdminHeader } from './Header';

export const AdminOrders = () => {
    return (
        <div className='admin-root'>
            <AdminHeader />

            <div className="screen">
                <div style={{ height: "20px" }} />
                <h1>Заявки на оказание услуг</h1>
            </div>
        </div>
    );
}