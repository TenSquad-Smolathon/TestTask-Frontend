import { useEffect, useState } from "react"
import { Header } from "../widgets/Header"
import OpenLayersMap from "../widgets/Map"
import axios from "axios";

export const AccidentsMap = () => {
    const [trafficLights, setTrafficLights] = useState([]);
    const [accidents, setAccidents] = useState([]);

    const load = async () => {
        try {
            const result = await axios.get("/traffic-lights/");
            setTrafficLights(result.data);
        } catch (e) {
            console.log(`Error occured while fetching traffic-lights: ${e}`);
            setTrafficLights([]);
        }

        try {
            const result = await axios.get("/accidents/accidents/");
            setAccidents(result.data);
        } catch (e) {
            console.log(`Error occured while fetching accidents: ${e}`);
            setAccidents([]);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return <div>
        <Header />
        <div style={{ height: "70px" }} />
        <h1>Онлайн-карта аварий</h1>
        <br />
        <OpenLayersMap features={{ "Светофор": trafficLights, "Авария": accidents }} reload={load} />
    </div>
}