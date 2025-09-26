import { useEffect, useState } from "react";
import { Header } from "../../widgets/Header";
import { FailedPlaceholder } from "../../widgets/FailedPlaceholder";
import { LoadingPlaceholder } from "../../widgets/LoadingPlaceholder";
import axios from "axios";

export const Contacts = () => {
    // contacts format
    // [
    //     {
    //         "name": string,
    //         "phone": string | null,
    //         "email": string | null
    //     }
    // ]
    const [contacts, setContacts] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const load = async () => {
        try {
            const result = await axios.get("/content/contacts");
            setContacts(result.data);
        } catch (e) {
            console.log(`Error while fetching contacts: ${e}`)
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
                {contacts != null ? <div className="myContent">
                    <h1>Контакты</h1>
                    <p>Позвоните или напишите нам на почту, если у вас есть какие-либо вопросы:</p>

                    <div className="contacts">
                        {
                            contacts.map((val, i, arr) => (
                                <div className="contact">
                                    <h3>{val.name}</h3>
                                    {val.phone && <p>Телефон: <a href={`tel://${val.phone}`}>{val.phone}</a></p>}
                                    {val.email && <p>Почта: <a href={`mailto://${val.email}`}>{val.email}</a></p>}
                                </div>
                            ))
                        }
                    </div>
                </div> : <FailedPlaceholder retry={() => console.log("retrying") || load() || setIsLoaded(false)}>контакты</FailedPlaceholder>}
            </div> : <LoadingPlaceholder>контакты</LoadingPlaceholder>}
        </div>
    );
}