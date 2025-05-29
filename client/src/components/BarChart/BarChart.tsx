import { Bar } from 'react-chartjs-2';
import { rawSignupData } from '../../utils/data';

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

const BarChart = () => {
    return (
        <div>
            <Bar data= {data}/>
        </div>
    );
}

export default BarChart;