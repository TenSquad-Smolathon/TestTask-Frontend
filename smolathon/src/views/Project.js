import axios from "axios";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom"
import { FailedPlaceholder } from "../widgets/FailedPlaceholder";
import { LoadingPlaceholder } from "../widgets/LoadingPlaceholder";
import { Header } from "../widgets/Header";

// Страница отображения проекта
export const Project = () => {
    const { name } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const load = async () => {
        try {
            const result = await axios.get(`/projects/${name}`);
            setProjectData(result.data);
        } catch (e) {
            console.log(`Error occured while fetching project data: ${e}`);
            setProjectData(null);
        }

        setIsLoaded(true);
    }

    useEffect(() => {
        load();
    }, [name]);

    return (
        <div>
            <Header />
            <div style={{ height: "70px" }} />

            {isLoaded ? <div className="content">
                {projectData != null ? <div className="myContent">
                    <h1>Проект {projectData.name}</h1>
                    <Markdown>
                        {projectData.description}
                    </Markdown>
                </div> : <FailedPlaceholder retry={() => console.log("retrying") || load() || setIsLoaded(false)}>проект</FailedPlaceholder>}
            </div> : <LoadingPlaceholder>проект</LoadingPlaceholder>}
        </div>
    );
}