import { Header } from "../widgets/Header";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import { useEffect, useRef, useState } from "react";
import { LoadingPlaceholder } from "../widgets/LoadingPlaceholder";
import { FailedPlaceholder } from "../widgets/FailedPlaceholder";
import { Checkbox, FormControl, FormControlLabel } from "@mui/material";
import MultiRangeSlider from "multi-range-slider-react";
import axios from "axios";
import "../static/styles/Stats.css";
import { Button } from "../widgets/Button";
import ExcelJS from 'exceljs';

function randomRGB() {
    const x = Math.floor(Math.random() * 255);
    const y = Math.floor(Math.random() * 255);
    const z = Math.floor(Math.random() * 255);

    return `rgb(${x}, ${y}, ${z})`;
}

export const Stats = () => {
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

    const [charts, setCharts] = useState(null);
    const [searchedCharts, setSearchedCharts] = useState(charts);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    const load = async () => {
        try {
            const result = await axios.get("/public-charts");
            setCharts(result);
        } catch (e) {
            setCharts(null);
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

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (charts) applySearch();
    }, [searchTerm]);

    return (
        <div className="screen" style={{ padding: "0", margin: "0" }}>
            <div style={{ height: "70px" }} />

            <Header />

            {
                isLoaded ? charts != null ? <div className="content">
                    <h1>Статистика</h1>
                    <p>Открытые статистические данные для исследований и аналитики</p>

                    <input placeholder="Поиск..." type="search" onChange={(e) => setSearchTerm(e.target.value)}></input>

                    <div className="graphs-grid">
                        {searchedCharts.map((val, ind, arr) => <GraphWrapper>{val}</GraphWrapper>)}
                    </div>
                </div> : <FailedPlaceholder retry={() => console.log("retrying") || setIsLoaded(false) || load()}>статистику</FailedPlaceholder> : <LoadingPlaceholder>статистику</LoadingPlaceholder>
            }
        </div >
    );
}

export const Graph = ({ children: val, gridEnabled = true, axesEnabled = true, legendEnabled = true, interpolate = true, gRef }) => {
    const [colors, setColors] = useState({});

    useEffect(() => {
        for (const field of val.fields) {
            colors[field] = randomRGB();
        }

        setColors({ ...colors });
    }, []);

    switch (val.type) {
        case "line":
            return (
                <LineChart ref={gRef} data={val.values} width={300 + 0} height={250}>
                    {axesEnabled && <YAxis stroke="black" width={"auto"}></YAxis>}
                    {axesEnabled && <XAxis stroke="black" dataKey="x"></XAxis>}
                    {gridEnabled && <CartesianGrid />}
                    {legendEnabled && <Legend />}

                    {
                        val.fields.map((field, _, __) => {
                            return <Line type={interpolate ? "natural" : "linear"} dataKey={`y_${field}`} name={field} stroke={colors[field]} fill={colors[field]}></Line>
                        })
                    }
                </LineChart>
            );

        case "bar":
            return (
                <BarChart ref={gRef} data={val.values} width={300 + 0} height={250}>
                    {axesEnabled && <YAxis stroke="black" width={"auto"}></YAxis>}
                    {axesEnabled && <XAxis stroke="black" dataKey="x"></XAxis>}
                    {gridEnabled && <CartesianGrid />}
                    {legendEnabled && <Legend />}

                    {
                        val.fields.map((field, _, __) => {
                            return <Bar dataKey={`y_${field}`} name={field} stroke={colors[field]} fill={colors[field]}></Bar>
                        })
                    }
                </BarChart>
            );

        case "area":
            return (
                <AreaChart ref={gRef} data={val.values} width={300 + 0} height={250}>
                    {axesEnabled && <YAxis stroke="black" width={"auto"}></YAxis>}
                    {axesEnabled && <XAxis stroke="black" dataKey="x"></XAxis>}
                    {gridEnabled && <CartesianGrid />}
                    {legendEnabled && <Legend />}

                    {
                        val.fields.map((field, _, __) => {
                            return <Area type={interpolate ? "natural" : "linear"} name={field} dataKey={`y_${field}`} stroke={colors[field]} fill={colors[field]}></Area>
                        })
                    }
                </AreaChart>
            );

        default:
            return <></>
    }
}

export const GraphWrapper = ({ children, admin = false, isInMatching = false, addInMatching = (v) => {} }) => {
    const [enableGrid, setEnableGrid] = useState('on');
    const [enableAxes, setEnableAxes] = useState('on');
    const [enableLegend, setEnableLegend] = useState('on');
    const [enableInterpolate, setEnableInterpolate] = useState('on');

    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(children.fields.length);
    const [minCaption, setMinCaption] = useState("");
    const [maxCaption, setMaxCaption] = useState("");

    const [val, setVal] = useState(children);

    const gRef = useRef(null);

    const filterValues = () => {
        let res = [];
        let fields = [];

        let min = Number.parseInt(minCaption);
        let max = Number.parseInt(maxCaption);

        if (isNaN(min)) {
            min = Number.parseInt(children.fields[0]);
            max = Number.parseInt(children.fields[children.fields.length - 1]) + 1;
        }

        for (const field of children.fields) {
            const i = Number.parseInt(field);

            if (i >= min && i < max) {
                fields.push(field);
            }
        }

        for (const val of children.values) {
            let newVal = { x: val.x };

            for (const field of fields) {
                newVal[`y_${field}`] = val[`y_${field}`];
            }

            res.push(newVal);
        }

        return [res, fields];
    }

    const downloadCSV = () => {
        let data = 'month';

        for (var field of children.fields) {
            data += `,${field}`;
        }

        data += '\n';

        for (var value of children.values) {
            data += `${value.x}`

            for (var field of children.fields) {
                data += `,${value[`y_${field}`]}`
            }

            data += '\n';
        }

        const blob = new Blob([data], { type: "text/csv" });
        const download_object = document.createElement('a');

        download_object.href = URL.createObjectURL(blob);
        download_object.download = `${children.name}.csv`;
        download_object.click();
    }

    const downloadXLXS = async () => {
        let data = 'month';

        for (var field of children.fields) {
            data += `,${field}`;
        }

        data += '\n';

        for (var value of children.values) {
            data += `${value.x}`

            for (var field of children.fields) {
                data += `,${value[`y_${field}`]}`
            }

            data += '\n';
        }

        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Data");

        const rows = data.split('\n').map(row => row.split(','));

        rows.forEach((row) => ws.addRow(row));

        const buf = await wb.xlsx.writeBuffer();

        const blob = new Blob([buf], {
            type: "application/vnd.ms-excel"
        });
        const download_object = document.createElement('a');

        download_object.href = URL.createObjectURL(blob);
        download_object.download = `${children.name}.xlsx`;
        download_object.click();
    }

    const downloadSVG = () => {
        let data = gRef.current;
        const svgUrl = (new XMLSerializer()).serializeToString(data);

        const blob = new Blob([svgUrl], { type: "image/svg+xml;charset=utf-8" });
        const download_object = document.createElement('a');

        download_object.href = URL.createObjectURL(blob);
        download_object.download = `${children.name}.svg`;
        download_object.click();
    }

    const calculateMidVals = () => {
        let y_sums = {};
        let sum = 0;

        for (const value of val.values) {
            for (const field of val.fields) {
                if (!y_sums[field]) y_sums[field] = 0;
                y_sums[field] += value[`y_${field}`];
                sum += value[`y_${field}`];
            }
        }

        let data = `всё время: ${sum / (val.values.length * val.fields.length)}`;

        for (const field of val.fields) {
            data += `; ${field}: ${y_sums[field] / val.values.length}`
        }

        return data;
    }

    const calculateMaxVals = () => {
        let y_max = {};
        let max = -1000000000;

        for (const value of val.values) {
            for (const field of val.fields) {
                if (!y_max[field]) y_max[field] = value[`y_${field}`];

                y_max[field] = Math.max(value[`y_${field}`], y_max[field]);
                max = Math.max(value[`y_${field}`], max)
            }
        }

        let data = `всё время: ${max}`;

        for (const field of val.fields) {
            data += `; ${field}: ${y_max[field]}`
        }

        return data;
    }

    const calculateMinVals = () => {
        let y_min = {};
        let min = 1000000000000;

        for (const value of val.values) {
            for (const field of val.fields) {
                if (!y_min[field]) y_min[field] = value[`y_${field}`];

                y_min[field] = Math.min(value[`y_${field}`], y_min[field]);
                min = Math.min(value[`y_${field}`], min)
            }
        }

        let data = `всё время: ${min}`;

        for (const field of val.fields) {
            data += `; ${field}: ${y_min[field]}`
        }

        return data;
    }

    useEffect(() => {
        const [values, fields] = filterValues(minValue, maxValue);

        setVal({ ...children, values, fields });
    }, [minCaption, maxCaption]);

    return (
        <div className="chart-wrapper">
            <div className="chart">
                <div>
                    <h2>{children.name}</h2>
                    <Graph gRef={gRef} gridEnabled={enableGrid} axesEnabled={enableAxes} legendEnabled={enableLegend} interpolate={enableInterpolate}>{val}</Graph>
                </div>

                {/* Controls */}
                <div className="controls">
                    <h2>Параметры</h2>

                    <FormControl className="form">
                        <FormControlLabel label="Сетка" control={<Checkbox defaultChecked color="custom" style={{ color: "#62A744" }}></Checkbox>} onChange={() => setEnableGrid(!enableGrid)} />
                        <FormControlLabel label="Оси" control={<Checkbox defaultChecked color="custom" style={{ color: "#62A744" }}></Checkbox>} onChange={() => setEnableAxes(!enableAxes)} />
                        <FormControlLabel label="Легенда" control={<Checkbox defaultChecked color="custom" style={{ color: "#62A744" }}></Checkbox>} onChange={() => setEnableLegend(!enableLegend)} />
                        <FormControlLabel label="Интерполяция" control={<Checkbox defaultChecked color="custom" style={{ color: "#62A744" }}></Checkbox>} onChange={() => setEnableInterpolate(!enableInterpolate)} />

                        <MultiRangeSlider style={{ boxShadow: "none" }} step={1} labels={[...children.fields, Number.parseInt(children.fields[children.fields.length - 1]) + 1]} min={0} max={children.fields.length} minValue={minValue} maxValue={maxValue} minCaption={minCaption} maxCaption={maxCaption} onChange={(e) => {
                            setMinValue(e.minValue);
                            setMaxValue(e.maxValue);
                        }} onInput={(e) => {
                            setMinValue(e.minValue);
                            setMaxValue(e.maxValue);
                            setMinCaption([...children.fields, Number.parseInt(children.fields[children.fields.length - 1]) + 1][e.minValue]);
                            setMaxCaption([...children.fields, Number.parseInt(children.fields[children.fields.length - 1]) + 1][e.maxValue]);
                        }}></MultiRangeSlider>

                        <br />
                    </FormControl>
                </div>
            </div>

            {
                admin && <div className="chart">
                    <div>
                        <p>Сред. знач.: {calculateMidVals()}</p>
                        <p>Макс. знач.: {calculateMaxVals()}</p>
                        <p>Мин. знач. : {calculateMinVals()}</p>
                    </div>

                    <Button text={isInMatching ? "Удалить из сравнения" : "Добавить в сравнение"} onClick={() => addInMatching(children.name)}/>
                </div>
            }

            <div className="chart">
                <Button isOnBright={true} text={"Экспорт CSV"} onClick={downloadCSV}></Button>
                <Button isOnBright={true} text={"Экспорт XLXS"} onClick={downloadXLXS}></Button>
                <Button isOnBright={true} text={"Скачать график"} onClick={downloadSVG}></Button>
            </div>
        </div>
    );
}

// TODO: add filtering by x-value