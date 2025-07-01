'use client'; // This directive must be at the very top

import { Line } from 'react-chartjs-2';
import Chart, { CategoryScale, ChartOptions } from "chart.js/auto";
import { FC } from 'react';
import { SignupLineChartResponseDTO } from '../../dtos/SignupLineChartResponseDTO';

Chart.register(CategoryScale);

interface LineChartProps {
    sData: Array<SignupLineChartResponseDTO>;
};

// Just sends the bar when called.
const LineChart: FC<LineChartProps> = ({ sData }) => {
    // Sets the line chart to be able to show all data points when hovering over one
    const options: ChartOptions<'line'> = {
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            colors: {
                forceOverride: true
            }
        }
    }

    // Turns rawSignupData into something readable for a line chart in chartjs
    const signupData = {
        // New implementation
        datasets: sData.map(obj => ({
            label: obj.signupMethodCategory,
            data: obj.data.map(point => ({
                x: new Date(point.x).toLocaleDateString("en-US", {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                y: point.y
            }))
        })),
    }

    console.log(signupData);

    return (
        <div>
            <Line data={signupData} options={options} />
        </div>
    );
}

export default LineChart;