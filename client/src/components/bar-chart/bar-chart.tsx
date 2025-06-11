'use client'; // This directive must be at the very top

import { Bar, Line } from 'react-chartjs-2';
import { rawSignupData, SignupData } from '../../utils/data';
import Chart, { CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

interface BarChartProps {
    sData: SignupData[];
};

// Just sends the bar when called.
const BarChart = () => {
    // Disables legend
    const options = {
        plugins: {
            legend: {
                display: false
            }
        }
    }

    // Turns rawSignupData into something readable for a bar chart in chartjs
    const data = {
        labels: rawSignupData.map(item => item.category),
        datasets: [
            {
                label: 'Signups Per Category',
                data: rawSignupData.map(item => item.signups),
                backgroundColor: [
                    '#dd4726', '#dd4726', '#dd4726', '#dd4726', '#dd4726'
                ],
                borderWidth: 1
            }
        ]
    }

    return (
        <div>
            <Bar data={data} options={options} />
            <Line data={data} options={options}></Line>
        </div>
    );
}

export default BarChart;