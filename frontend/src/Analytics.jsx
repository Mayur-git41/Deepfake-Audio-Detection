import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Analytics({ history }) {

  const realCount =
    history.filter(
      item => item[2] === "REAL"
    ).length;

  const fakeCount =
    history.filter(
      item => item[2] === "DEEPFAKE"
    ).length;

  const data = {
    labels: ["REAL", "DEEPFAKE"],
    datasets: [
      {
        data: [realCount, fakeCount]
      }
    ]
  };

  return (
    <div className="card mt-4 p-3">

      <h3>Analytics Dashboard</h3>

      <Pie data={data} />

    </div>
  );
}

export default Analytics;