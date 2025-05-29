import { Bar } from 'react-chartjs-2';
import { rawSignupData } from '../../utils/data';
import Chart, { CategoryScale } from "chart.js/auto";

Chart.register(CategoryScale);

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
                'blue', 'red', 'green', 'purple', 'yellow'
            ],
            borderWidth: 1
        }
    ]
}

// Just sends the bar when called.
const BarChart = () => {
    return (
        <div>
            <Bar data={data} options={options} />
        </div>
    );
}

export default BarChart;