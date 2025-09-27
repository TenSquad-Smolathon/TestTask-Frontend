import axios from "axios";
import { useEffect, useState } from "react";
import { LoadingPlaceholder } from "../widgets/LoadingPlaceholder";
import { FailedPlaceholder } from "../widgets/FailedPlaceholder";
import { Header } from "../widgets/Header";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../widgets/Button";

// Страница отображения услуги
// Можно подать заявку на оказание услуги
export const Services = () => {
    const { name } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [service, setService] = useState(null);
    const navigate = useNavigate();

    const load_service = async () => {
        try {
            const response = await axios.get(`/content/services/${name}/`);
            setService(response.data);
        } catch (e) {
            console.log(`Exception while loading service '${name}': ${e}`);
            setService(null);
        }

        setIsLoaded(true);
    }

    const post_data = async (values) => {
        const description = Object.values(values).join("; ");
        await axios.post("/content/service-requests/", {
            description,
            status: "new",
            user: null,
            service: name,
        });
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
                            <p>{service.text}</p>

                            <hr />

                            <h3>Заполните форму для использования услуги:</h3>

                            {/* TODO: make a WORKING sending */}
                            <form style={{ display: "flex", flexDirection: "column", width: "max(250px, 50%)", padding: "20px", gap: "10px" }} action={null} children={
                                <>
                                    {service.inputs.split(",").map((v, i, a) => <><label style={{ margin: 0 }}>{v}</label><input style={{ margin: 0 }} placeholder={v} id={`val_${v}`} /></>)}
                                    <br />
                                    <Button text={service.action_text} isAccent onClick={() => {
                                        // Post data
                                        const data = {};

                                        for (const inp of service.inputs.split(",")) {
                                            data[inp] = document.getElementById(`val_${inp}`).value;
                                        }
                                        
                                        post_data(data).then(() => {
                                            navigate("/");
                                        });
                                    }}/>
                                </>
                            } />
                        </div>
            }
        </div>
    );
}