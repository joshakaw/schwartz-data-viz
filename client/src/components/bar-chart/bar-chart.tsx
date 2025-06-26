'use client'; // This directive must be at the very top

import { Bar } from 'react-chartjs-2';
import { SignupData } from '../../utils/data';
import Chart, { CategoryScale } from "chart.js/auto";
import { FC } from 'react';
import { SignupsByCategoryResponseDTO } from '../../dtos/SignupsByCategoryResponseDTO';

Chart.register(CategoryScale);

interface BarChartProps {
    sData: Array<SignupsByCategoryResponseDTO>;
};

// Just sends the bar when called.
const BarChart: FC<BarChartProps> = ({ sData }) => {
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
            <Bar data={data} options={options} />
        </div>
    );
}

export default BarChart;