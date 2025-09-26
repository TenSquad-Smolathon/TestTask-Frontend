import { useEffect, useState } from 'react';
import { AdminHeader } from './Header';
import axios from 'axios';

const parsers = {
    "float": (x) => Number.parseFloat(x.replace(",", ".")),
    "integer": Number.parseInt,
    "string": (x) => x,
}

export const AdminInsert = () => {
    const [tables, setTables] = useState([
        {
            "name": "traffic-lights",
            "fields": [
                {name: "latitude", type: "float"},
                {name: "longitude", type: "float"},
                {name: "location_name", type: "string"},
                {name: "type", type: "string"}
            ]
        },
        {
            "name": "accidents/accidents",
            "fields": [
                {name: "latitude", type: "float"},
                {name: "longitude", type: "float"},
                {name: "description", type: "string"}
            ]
        }
    ]);

    const load = async () => {
        return; // TODO:

        try {
            const result = await axios.get('/tables/');
            setTables(result.data);
        } catch (e) {
            console.log("Exception occured while fetching tables:", e);
            setTables([]);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className='admin-root'>
            <AdminHeader />

            <div className="screen">
                <div style={{ height: "20px" }} />
                <h1>Внос данных</h1>

                {
                    tables.map(
                        (v) => <div>
                            <h3>{v.name}</h3>
                            {
                                v.fields.map((v2) => <input type='text' placeholder={v2.name} name={v2.name} id={`${v.name}_${v2.name}`}/>)
                            }
                            <input value='Внести' type='button' onClick={() => {
                                const value = {};

                                for (const field of v.fields) {
                                    const elem = document.getElementById(`${v.name}_${field.name}`);
                                    const val = elem.value;
                                    elem.value = "";

                                    if (!val || val.length < 1) {
                                        return;
                                    }

                                    value[field.name] = parsers[field.type](val);
                                }

                                axios.post(`/${v.name}/`, value);
                            }} />
                        </div>
                    )
                }
            </div>
        </div>

    );
}