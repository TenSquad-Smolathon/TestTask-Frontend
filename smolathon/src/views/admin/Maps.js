import { useEffect, useState } from 'react';
import { AdminHeader } from './Header';
import OpenLayersMap from '../../widgets/Map';
import axios from 'axios';

// Страница просмотра карты. Сейчас ничем не отличается от карты в ../AccidentsMap.js
export const AdminMaps = () => {
    const [trafficLights, setTrafficLights] = useState([]);
    const [accidents, setAccidents] = useState([]);

    // load maps data
    const load = async () => {
        try {
            const result = await axios.get("/traffic-lights/");
            setTrafficLights(result.data);
        } catch (e) {
            console.log(`Error occured while fetching traffic-lights: ${e}`);
            setTrafficLights([]);
        }

        try {
            const result = await axios.get("/accidents/");
            setAccidents(result.data);
        } catch (e) {
            console.log(`Error occured while fetching accidents: ${e}`);
            setAccidents([]);
        }
    }

    useEffect(() => {
        load();
    }, []);

    // TODO:
    // const load = async () => {
    //     try {
    //         setMaps(await APIInterface.fetch_maps());
    //     } catch (e) {
    //         console.log("Exception occured while fetching maps:", e);
    //         setMaps([]);
    //     }
    // }
    //
    // useState(() => {
    //     load();
    // }, []);

    return (
        <div className='admin-root'>
            <AdminHeader />

            <div className="screen">
                <div style={{ height: "20px" }} />
                <h1>Информационные карты</h1>

                <OpenLayersMap features={{ "Светофор": trafficLights, "Авария": accidents }} reload={load} />
            </div>
        </div>
    );
}