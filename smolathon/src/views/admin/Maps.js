import { useState } from 'react';
import { APIInterface } from '../../api/api';
import { AdminHeader } from './Header';

export const AdminMaps = () => {
    const [maps, setMaps] = useState([]);

    const load = async () => {
        try {
            setMaps(await APIInterface.fetch_maps());
        } catch (e) {
            console.log("Exception occured while fetching maps:", e);
            setMaps([]);
        }
    }

    useState(() => {
        load();
    }, []);

    return (
        <div className='admin-root'>
            <AdminHeader />

            <div className="screen">
                <div style={{ height: "20px" }} />
                <h1>Информационные карты</h1>

                {/* TODO: handle maps */}
            </div>
        </div>
    );
}