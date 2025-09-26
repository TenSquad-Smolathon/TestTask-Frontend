import axios from "axios";
import { useEffect, useState } from "react";
import { LoadingPlaceholder } from "../widgets/LoadingPlaceholder";
import { FailedPlaceholder } from "../widgets/FailedPlaceholder";
import { Header } from "../widgets/Header";
import { useParams } from "react-router-dom";

export const Services = () => {
    const { name } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [service, setService] = useState(null);

    const load_service = async () => {
        try {
            const response = await axios.post("/content/services", {
                name: name
            });
            setService(response.data);
        } catch (e) {
            console.log(`Exception while loading service '${name}': ${e}`);
            setService(null);
        }

        setIsLoaded(true);
    }

    useEffect(() => {
        load_service();
    }, [])

    return (
        <div>
            <Header />
            <div style={{ height: "70px" }} />
            {
                !isLoaded ?
                    <LoadingPlaceholder>услугу</LoadingPlaceholder> :
                    service == null ?
                        <FailedPlaceholder retry={() => setIsLoaded(false) || load_service()}>услугу</FailedPlaceholder>
                        : <div>
                            <h1>{service.title}</h1>
                            <p>{service.desc}</p>

                            <hr />

                            <h3>Заполните форму для использования услуги {service.name}:</h3>

                            {/* TODO: make a WORKING sending */}
                            <form action={null} children={
                                <>
                                    {service.inputs.map((v, i, a) => <input placeholder={v} name={`val_${i}`}/>)}
                                    <button type="submit">{service.action_text}</button>
                                </>
                            } />
                        </div>
            }
        </div>
    );
}