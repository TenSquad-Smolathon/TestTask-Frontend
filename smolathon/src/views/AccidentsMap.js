import { useEffect, useState } from "react"
import { Header } from "../widgets/Header"
import OpenLayersMap from "../widgets/Map"
import axios from "axios";

export const AccidentsMap = () => {
    const [features, setFeatures] = useState([]);

    const load = async () => {
        try {
            const result = await axios.get("/accidents");
            setFeatures(result.data);
        } catch (e) {
            console.log(`Error occured while fetching features: ${e}`);
            setFeatures([]);
        }
    }

    useEffect(() => {
        load();
    }, []);
    
    return <div>
        <Header />
        <div style={{height: "70px"}}/>
        <h1>Онлайн-карта аварий</h1>
        <br />
        <OpenLayersMap features={features} reload={load}/>
    </div>
}