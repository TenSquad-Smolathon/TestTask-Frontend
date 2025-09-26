import { GraphWrapper } from '../Stats';
import { LoadingPlaceholder } from '../../widgets/LoadingPlaceholder';
import { FailedPlaceholder } from '../../widgets/FailedPlaceholder';
import { AdminHeader } from './Header';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../static/styles/AdminStats.css';

export const AdminStats = () => {
    // CHARTS FMT:
    /*
    [
        {
            "name": string,
            "y_axis_name": string,
            "x_axis_name": string,
            "type": "line" | "bar" | "area", 
            "fields": [string],
            "values": [{
                "x": string,
                "y_{field1}": int | float,
                "y_{field2}": int | float,
            }]
        }
    ]
    */

    const [charts, setCharts] = useState([
        {
            "name": "Суммы штрафов",
            "type": "line", // !!!
            "fields": ["2024", "2025"],
            "values": [
                {
                    "x": "Март",
                    "y_2024": 30000,
                    "y_2025": 46000,
                },
                {
                    "x": "Апрель",
                    "y_2024": 30000,
                    "y_2025": 47000,
                },
                {
                    "x": "Май",
                    "y_2024": 30000,
                    "y_2025": 48000,
                },
                {
                    "x": "Июнь",
                    "y_2024": 30000,
                    "y_2025": 49000,
                }
            ],
        }
    ]);
    const [searchedCharts, setSearchedCharts] = useState(charts);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [tableValues, setTableValues] = useState([]);

    const load = async () => {

        try {
            const result = await axios.get("/admin-charts");
            setCharts(result);
        } catch (e) {
            // setCharts(null);
            console.log(`Error while fetching charts: ${e}`);
        }

        setIsLoaded(true);
    }

    const applySearch = () => {
        let result = [];

        for (const chart of charts) {
            if (chart.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                result.push(chart);
            }
        }

        setSearchedCharts(result);
    }

    const addOrRemove = (x) => {
        if (tableValues.includes(x)) {
            let vals = [...tableValues];
            const ind = vals.indexOf(x);
            vals.splice(ind, 1);

            setTableValues(vals);
        } else {
            let vals = [...tableValues];
            vals.push(x);

            setTableValues(vals);
        }
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        applySearch();
    }, [searchTerm]);

    return (
        <div className='admin-root'>
            <AdminHeader />

            <div className="screen">
                <div style={{ height: "20px" }} />

                {
                    isLoaded ? charts != null ? <div className="content">
                        <h1>Статистика</h1>

                        <input placeholder="Поиск..." type="search" onChange={(e) => setSearchTerm(e.target.value)}></input>

                        <div className="graphs-grid">
                            {searchedCharts.length === 0 ? <p>По вашему запросу ничего не найдено</p> : searchedCharts.map((val, ind, arr) => <GraphWrapper admin isInMatching={tableValues.includes(val.name)} addInMatching={addOrRemove}>{val}</GraphWrapper>)}
                        </div>

                        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            {/* TODO: create a table logic */}
                            {/* <table style={{ alignSelf: "center" }}>
                                <tbody>
                                    <tr>
                                        <th>Период</th>
                                        {tableValues.map((v, i, a) => <th>{v}</th>)}
                                    </tr>

                                    {
                                        tableValues.length > 0 && charts.filter((x, i, arr) => x.name == tableValues[0])[0].fields.map((val, i, arr) => <tr>
                                            {
                                                tableValues.map((val2, i2, arr2) => {
                                                    return <td></td>
                                                })
                                            }
                                        </tr>)
                                    }
                                </tbody>

                            </table> */}
                        </div>
                    </div> : <FailedPlaceholder retry={() => console.log("retrying") || setIsLoaded(false) || load()}>статистику</FailedPlaceholder> : <LoadingPlaceholder>статистику</LoadingPlaceholder>
                }
            </div>
        </div>
    );
}