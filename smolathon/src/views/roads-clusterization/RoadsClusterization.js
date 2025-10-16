import { useEffect, useState } from "react";
import { FailedPlaceholder } from "../../widgets/FailedPlaceholder";
import { Header } from "../../widgets/Header";
import { LoadingPlaceholder } from "../../widgets/LoadingPlaceholder";
import { ClusterVizualizer } from "./ClusterVizualizer";
import axios from "axios";

export const RoadsClusterization = ({ }) => {
    const [isLoaded, setIsLoaded] = useState(true);
    const [clusters, setClusters] = useState([]);
    const [file, setFile] = useState(null);

    const send = async () => {
        if (file != null) {
            try {
                const formData = new FormData();
                formData.append("file", file);
                const response = await axios.post("clusters/", formData, {
                    headers: {
                        'Content-Type': "multipart/form-data",
                    }
                });
                setClusters(response.data);
            } catch (e) {
                alert(e)
            }
        } else {
            alert("Не выбран ни один файл")
        }

        setIsLoaded(true);
    }

    return (
        <div>
            <Header />
            <div style={{ height: "70px" }} />

            {isLoaded ? <div className="content">
                {clusters != null ? <div className="myContent">
                    <h1>Кластеризация дорог</h1>

                    <label for="c-file">Выберите Excel/CSV файл для обработки:</label>
                    <input name="c-file" type="file" id="clusters-file" onChange={(e) => { if (e.target.files.length > 0) { setFile(e.target.files[0]) } else setFile(null) }} />
                    <input type="button" value="Отправить" onClick={send} />

                    {clusters != null && <ClusterVizualizer data={clusters} />}
                </div> : <FailedPlaceholder retry={() => { console.log("retrying") || send() || setIsLoaded(false) }}>кластеры</FailedPlaceholder>}
            </div> : <LoadingPlaceholder>кластеры</LoadingPlaceholder>}
        </div>
    );
}