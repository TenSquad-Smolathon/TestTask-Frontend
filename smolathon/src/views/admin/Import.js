import { AdminHeader } from './Header';
import { useEffect, useState } from 'react';
import ExcelJS from 'exceljs';
import { FormControl, MenuItem, Select, Slider, Typography } from '@mui/material';
import { APIInterface } from '../../api/api';

export const AdminImport = () => {
    const [file, setFile] = useState(null);
    const [worksheets, setWorksheets] = useState([]);
    const [excelBook, setExcelBook] = useState(null);
    const [tableData, setTableData] = useState([]);

    const [tables, setTables] = useState([
        { "name": "trafficlights", "fields": ["lat", "long", "type"] },
        { "name": "evacuations", "fields": ["lat", "long"] },
        { "name": "fines", "fields": ["amount", "date"] },
    ]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [startIndex, setStartIndex] = useState(1);

    // TODO: match columns from table to DB tables
    // and then push data to DB

    useEffect(() => {
        (async () => {
            try {
                setTables(await APIInterface.fetch_tables());
            } catch (e) {
                console.log("An error occured while fetching tables:", e);
                setTables([]);
            }
        })();
    }, []);

    const handleFiles = (e) => {
        const files = e.target.files;

        if (files.length != 0) {
            setFile(files[0]);
        } else {
            setFile(null);
        }

        setWorksheets([]);
        setExcelBook(null);
        setTableData([]);
    }

    const loadFile = async () => {
        const name = file.name.split(".");
        const ext = name[name.length - 1];

        let data;
        switch (ext) {
            case "csv":
                data = await file.text();

                setTableData(data.split("\n").map((v) => v.split(",")))

                break;

            case "xls", "xlsx":
                data = new ExcelJS.Workbook();
                data = await data.xlsx.load(await file.arrayBuffer());

                setWorksheets(data.worksheets.map((v) => v.name));
                setExcelBook(data);
                setTableData([]);

                break;
        }
    }

    const handleWorksheetSelection = (e) => {
        try {
            const ws_name = e.target.textContent;
            const idx = worksheets.indexOf(ws_name);
            const ws = excelBook.worksheets[idx];

            let new_data = []

            for (const row of ws._rows) {
                new_data.push(row._cells.map((v) => v._value.model.value));
            }
            setTableData(new_data);
        } catch (e) {
            console.log(e);
            alert("Не удалось загрузить таблицу");
        }
    }

    const handleTableSelect = (e) => {
        const val = e.target.value;
        setSelectedTable(tables[val]);
    }

    return (
        <div className='admin-root'>
            <AdminHeader />

            <div className="screen">
                <div style={{ height: "20px" }} />
                <h1>Импорт данных из файлов</h1>

                <label htmlFor='file'>Выберите файл:</label>
                <input type='file' name='file' accept='text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' onChange={handleFiles}></input>

                <input type='button' value="Загрузить" onClick={loadFile}></input>

                {
                    file != null && excelBook != null && worksheets.length > 0 && <div>
                        <h3>В выбранном файле есть следующие листы (нажмите, чтобы выбрать):</h3>
                        <ul>
                            {worksheets.map((v) => <li style={{ textDecoration: "underline", cursor: "pointer" }} key={v} onClick={handleWorksheetSelection}>{v}</li>)}
                        </ul>
                    </div>
                }

                {tableData.length > 0 && <div style={{ padding: "0px 20px" }}>
                    <h3 style={{ margin: 0 }}>Данные таблицы:</h3>
                    <br />

                    <table>
                        <tbody>
                            {
                                tableData.slice(0, tableData.length - 1 * (tableData[tableData.length - 1].length != tableData[0].length)).map((v, i, arr) =>
                                    i < 30 ? <tr>
                                        {
                                            [i + 1, ...v].map((v2) =>
                                                <td>{(v2 ?? "").toString()}</td>
                                            )
                                        }
                                    </tr> : i == 30 ? <tr>
                                        <td>Данные обрезаны до строки 30 для удобства</td>
                                    </tr> : <></>
                                )
                            }
                        </tbody>
                    </table>

                    <div className='import-block'>
                        <br />
                        <h3 style={{ margin: 0 }}>Настройки импорта</h3>

                        <Typography>Начать с ряда №:</Typography>
                        <Slider color='custom' style={{ color: "#62A744" }} name='start-from' defaultValue={1} min={1} step={1} shiftStep={1} marks max={tableData.length - 1} valueLabelDisplay='auto' onChange={(_, v, __) => setStartIndex(v)}></Slider>

                        <Typography>Внести данные в таблицу:</Typography>
                        <Select label={"Таблица"} onChange={handleTableSelect} defaultValue={-1}>
                            {
                                [null, ...tables].map((v, i, arr) => <MenuItem value={i - 1}>{v != null ? v.name : ""}</MenuItem>)
                            }
                        </Select>

                        <br />

                        {
                            !!selectedTable && <div>
                                <Typography>Сопоставьте столбцы:</Typography>
                                <div className='selection-grid' style={{ display: "grid", gridTemplateColumns: `repeat(${tableData[0].length}, 1fr)` }}>
                                    {
                                        tableData[startIndex - 1].map((v) => <p style={{margin: 0}}>{v}</p>)
                                    }
                                    {
                                        tableData[startIndex - 1].map((_) => <Select label="Столбец" onChange={(e) => {}} defaultValue={-1}>
                                            {
                                                [null, ...selectedTable.fields].map((v2, i, arr) => <MenuItem value={i - 1}>{v2 != null ? v2 : ""}</MenuItem>)
                                            }
                                        </Select>)
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
                }
            </div >
        </div>

    );
}