'use client'; // This directive must be at the very top

import { Line } from 'react-chartjs-2';
import { SignupData } from '../../utils/data';
import Chart, { CategoryScale } from "chart.js/auto";
import { FC } from 'react';
import { SignupLineChartRequestDTO } from '../../dtos/SignupLineChartRequestDTO';
import { SignupLineChartResponseDTO } from '../../dtos/SignupLineChartResponseDTO';

Chart.register(CategoryScale);

interface LineChartProps {
    sData: Array<SignupLineChartResponseDTO>;
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
    if (sData.length == 0) {
        return;
    }
    const signupData = {
        labels: sData[0].data.map((obj) => obj.x),
        datasets: sData.map((obj) => {
            return {
                label: obj.signupMethodCategory,
                data: obj.data
            }
        })
    }

    //alert(signupData.labels)

    //const data = {
    //    labels: sData.map(item => item.category),
    //    datasets: [
    //        {
    //            label: 'Signups Per Category',
    //            data: sData.map(item => item.signups),
    //            backgroundColor: [
    //                '#dd4726', '#dd4726', '#dd4726', '#dd4726', '#dd4726'
    //            ],
    //            borderWidth: 1
    //        }
    //    ]
    //}

    return (
        <div>
            <Line data={signupData} options={options} />
        </div>
    );
}

export default LineChart;