'use client'; // This directive must be at the very top

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Line } from 'react-chartjs-2';
import Chart, { CategoryScale, ChartOptions } from "chart.js/auto";
import { FC } from 'react';
import { SignupLineChartResponseDTO } from '../../dtos/SignupLineChartResponseDTO';

Chart.register(CategoryScale);

interface LineChartProps {
    sData: Array<SignupLineChartResponseDTO>;
    loading: boolean;
};

// Just sends the bar when called.
const LineChart: FC<LineChartProps> = ({ sData, loading }) => {
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

    if (loading) {
        return <Skeleton height={250} />;
    }

    if (sData.length == 0) {
        return <div style={{ textAlign: 'center', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No results found.</div>;
    }

    return (
        <div>
            <Line data={signupData} options={options} />
        </div>
    );
}

export default LineChart;