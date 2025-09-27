import { useEffect, useState } from 'react';
import { AdminHeader } from './Header';
import axios from 'axios';

// data parsers for different datatypes
const parsers = {
    "number": (x) => Number.parseFloat(x.replace(",", ".")),
    "text": (x) => x,
    "date": (x) => x,
}


// Страница вноса данных в БД
export const AdminInsert = () => {
    // available tables
    // TODO: make fetch from DB logic
    const [tables, setTables] = useState([
        {
            name: "traffic-lights",
            fields: [
                {
                    name: "location_name",
                    type: "text",
                },
                {
                    name: "latitude",
                    type: "number",
                },
                {
                    name: "longitude",
                    type: "number",
                },
                {
                    name: "type",
                    type: "text"
                },
                {
                    name: "install_date",
                    type: "date"
                },
                {
                    name: "status",
                    type: "text"
                },
                {
                    name: "is_public",
                    type: "number"
                }
            ]
        },
        {
            name: "fines",
            fields: [
                {
                    name: "issued_at",
                    type: "date"
                },
                {
                    name: "amount",
                    type: "number",
                },
                {
                    name: "description",
                    type: "text",
                }
            ]
        },
        {
            name: "evacuations",
            fields: [
                {
                    name: "requested_at",
                    type: "date"
                },
                {
                    name: "location",
                    type: "text"
                },
                {
                    name: "status",
                    type: "text"
                }
            ]
        },
        {
            name: "accidents",
            fields: [
                {
                    name: "description",
                    type: "text"
                },
                {
                    name: "latitude",
                    type: "number"
                },
                {
                    name: "longitude",
                    type: "number"
                },
                {
                    name: "reported_at",
                    type: "date",
                }
            ]
        }
    ]);

    // TODO:
    // const load = async () => {
    //     return;
    //
    //     try {
    //         const result = await axios.get('../tables/');
    //         let vals = [];
    //         for (const f of Object.keys(result.data)) {
    //             if (['django_migrations', 'sqlite_sequence',
    //                 'auth_group_permissions', 'auth_user_groups',
    //                 'auth_user_user_permissions', 'django_admin_log',
    //                 'django_content_type', 'auth_permission', 'auth_group',
    //                 'auth_user', 'django_session'
    //             ].includes(f)) continue;
    //
    //             const r = result.data;
    //             let fs = [];
    //
    //             for (const n of r[f]) {
    //                 if (['id', 'requested_at', 'reported_at', 'recorded_at',
    //                     'issued_at', 'is_public', 'created_at', 'install_date',
    //                     'updated_at'].includes(n)) continue;
    //
    //                 fs.push({
    //                     name: n,
    //                     type: ""
    //                 });
    //             }
    //
    //             vals.push({
    //                 name: f,
    //                 fields: fs,
    //             })
    //         }
    //         setTables(vals);
    //     } catch (e) {
    //         console.log("Exception occured while fetching tables:", e);
    //         setTables([]);
    //     }
    // }
    //
    // useEffect(() => {
    //     load();
    // }, []);

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
                                // render inputs
                                v.fields.map((v2) => <div> <label>{v2.name}</label> <input type={v2.type} placeholder={v2.name} name={v2.name} id={`${v.name}_${v2.name}`} /> </div>)
                            }

                            <input value='Внести' type='button' onClick={() => {
                                const value = {};

                                for (const field of v.fields) {
                                    // get every value
                                    const elem = document.getElementById(`${v.name}_${field.name}`);
                                    const val = elem.value;
                                    elem.value = "";

                                    if (!val || val.length < 1) {
                                        return; // reject if any value is empty
                                    }

                                    value[field.name] = parsers[field.type](val);
                                }
                                
                                // post to specified table
                                axios.post(`/${v.name}/`, value);
                            }} />
                        </div>
                    )
                }
            </div>
        </div>

    );
}