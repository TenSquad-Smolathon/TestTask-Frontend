import { useEffect, useState } from "react";
import { Header } from "../../widgets/Header";
import { FailedPlaceholder } from "../../widgets/FailedPlaceholder";
import { LoadingPlaceholder } from "../../widgets/LoadingPlaceholder";
import axios from "axios";

export const Documents = () => {
    // contacts format
    // [
    //     {
    //         "name": string,
    //         "link": string
    //     }
    // ]
    const [documents, setDocuments] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const load = async () => {
        try {
            const result = await axios.get("/documents");
            setDocuments(result.data);
        } catch (e) {
            console.log(`Error while fetching documents: ${e}`)
        }

        setIsLoaded(true);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <Header />
            <div style={{ height: "70px" }} />

            {isLoaded ? <div className="content">
                {documents != null ? <div className="myContent">
                    <h1>Документы</h1>
                    <p>Юридические документы компании:</p>

                    <div className="documents">
                        {
                            documents.map((val, i, arr) => (
                                <div className="document">
                                    <h3><a href={val.link}>{val.name}</a></h3>
                                </div>
                            ))
                        }
                    </div>
                </div> : <FailedPlaceholder retry={() => console.log("retrying") || load() || setIsLoaded(false)}>документы</FailedPlaceholder>}
            </div> : <LoadingPlaceholder>документы</LoadingPlaceholder>}
        </div>
    );
}