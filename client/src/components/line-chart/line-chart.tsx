'use client'; // This directive must be at the very top

import { Line } from 'react-chartjs-2';
import { SignupData } from '../../utils/data';
import Chart, { CategoryScale } from "chart.js/auto";
import { FC } from 'react';

Chart.register(CategoryScale);

interface LineChartProps {
    sData: SignupData[];
};

// Just sends the bar when called.
const LineChart: FC<LineChartProps> = ({ sData }) => {
    // Disables legend
    const options = {
        plugins: {
            legend: {
                display: false
            }
        }
    }

    // Turns rawSignupData into something readable for a line chart in chartjs
    const data = {
        labels: sData.map(item => item.category),
        datasets: [
            {
                label: 'Signups Per Category',
                data: sData.map(item => item.signups),
                backgroundColor: [
                    '#dd4726', '#dd4726', '#dd4726', '#dd4726', '#dd4726'
                ],
                borderWidth: 1
            }
        ]
    }

    return (
        <div>
            <Line data={data} options={options} />
        </div>
    );
}

export default LineChart;