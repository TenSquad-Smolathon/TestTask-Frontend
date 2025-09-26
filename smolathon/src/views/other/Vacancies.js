import { useEffect, useState } from "react";
import { Header } from "../../widgets/Header";
import { FailedPlaceholder } from "../../widgets/FailedPlaceholder";
import { LoadingPlaceholder } from "../../widgets/LoadingPlaceholder";
import axios from "axios";
import Markdown from "react-markdown";
import { Button } from "../../widgets/Button";

export const Vacancies = () => {
    // vacancies format
    // [
    //     {
    //         "title": string,
    //         "description": string,
    //         "requirements": string,
    //         "payout": number
    //     }
    // ]
    const [vacancies, setVacancies] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const load = async () => {
        try {
            const result = await axios.get("/content/vacancies");
            setVacancies(result.data);
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
                {vacancies != null ? <div className="myContent">
                    <h1>Вакансии</h1>
                    <p>Сейчас в нашей компании доступны эти должности:</p>

                    <div className="vacancies">
                        {
                            vacancies.map((val, i, arr) => (
                                <div className="vacancy">
                                    <h3>{val.title}</h3>
                                    <p>{val.desctiption}</p>
                                    <Markdown>{val.requirements}</Markdown>
                                    <h5>{val.payout}</h5>

                                    <Button isAccent={true} onClick={() => {
                                        // TODO: отправить ответ
                                    }} text={"Откликнуться"}/>
                                </div>
                            ))
                        }
                    </div>
                </div> : <FailedPlaceholder retry={() => console.log("retrying") || load() || setIsLoaded(false)}>вакансии</FailedPlaceholder>}
            </div> : <LoadingPlaceholder>вакансии</LoadingPlaceholder>}
        </div>
    );
}