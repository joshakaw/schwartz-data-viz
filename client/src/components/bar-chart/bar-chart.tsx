'use client'; // This directive must be at the very top

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart, { CategoryScale, ChartOptions, Colors } from "chart.js/auto";
import { FC } from 'react';
import { SignupsByCategoryResponseDTO } from '../../dtos/SignupsByCategoryResponseDTO';

Chart.register(CategoryScale);

interface BarChartProps {
    sData: Array<SignupsByCategoryResponseDTO>;
    loading: boolean;
};

// Just sends the bar when called.
const BarChart: FC<BarChartProps> = ({ sData, loading }) => {
    // Disables legend. Adds labels
    const options: ChartOptions<'bar'> = {
        // May remove this later, recall Dylan mentioning something about only wanting the numbers in the bar chart itself
        scales: {
            y: {
                display: false
            },
        },
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: 'white'
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

    if (loading) {
        return <Skeleton height={250} />;
    }

    if (sData.length == 0) {
        return <div style={{ textAlign: 'center', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No results found.</div>;
    }

    return (
        <div>
            <Bar data={data} options={options} plugins={[ChartDataLabels]} />
        </div>
    );
}

export default BarChart;