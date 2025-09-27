import { useEffect, useState } from 'react';
import { AdminHeader } from './Header';
import axios from 'axios';
import '../../static/styles/Orders.css';
import { Button } from '../../widgets/Button';

// Страница заказов услуг
export const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    const load = async () => {
        try {
            const response = await axios.get("/content/service-requests/");
            setOrders(response.data);
        } catch (e) {
            console.log("Error occured while fetching orders:", e);
            setOrders([]);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className='admin-root'>
            <AdminHeader />

            <div className="screen">
                <div style={{ height: "20px" }} />
                <h1>Заявки на оказание услуг</h1>

                <div className='or__orders-wrapper'>
                    {orders.map((v) => <div className='or__order'>
                        {v.description.split(";").map((x) => <p>{x}</p>)}
                        <Button isOnBright onClick={() => axios.delete(`/content/service-requests/${v.id}/`).then(load)} text="Удалить" />
                    </div>)}
                </div>
            </div>
        </div>
    );
}