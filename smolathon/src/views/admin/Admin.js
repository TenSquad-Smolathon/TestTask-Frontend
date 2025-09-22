import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import '../../static/styles/Admin.css';
import { useState } from 'react';

export const Admin = () => {
    const [finesData, setFinesData] = useState([

        // { x1: 1, x2: 2, x3,  year: "2022" },
        { x: 3, y: 5, year: "2022" },
        { x: 6, y: 7, year: "2022" },
        { x: 1, y: 2, year: "2023" },
        { x: 3, y: 2, year: "2023" },
        { x: 6, y: 3, year: "2023" },
        { x: 1, y: 1, year: "2024" },
        { x: 3, y: 5, year: "2024"},
        { x: 6, y: 10, year: "2024" },
    ]);



    return (
        <div className="admin">
            {/* <h1>Графики и отчёты</h1>

            <div className='chartBlock'>
                <h3>Штрафы</h3>
                <LineChart width={300} height={200} data={finesData}>
                    <XAxis dataKey="year" name="Количество" min={0} max={20}></XAxis>
                    <YAxis name="Месяц"></YAxis>

                    <CartesianGrid stroke='gray' strokeDasharray="5 5"></CartesianGrid>

                    <Legend align='right'></Legend>

                    <Line dataKey="x"></Line>
                    <Line dataKey="y"></Line>
                </LineChart>
            </div> */}

        </div>
    );
}