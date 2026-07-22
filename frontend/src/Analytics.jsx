import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function Analytics({ history }) {

  const realCount = history.filter(
    (item) => item[2] === "REAL"
  ).length;

  const fakeCount = history.filter(
    (item) => item[2] === "DEEPFAKE"
  ).length;

  const total = realCount + fakeCount;

  const realPercentage =
    total === 0
      ? 0
      : ((realCount / total) * 100).toFixed(1);

  const fakePercentage =
    total === 0
      ? 0
      : ((fakeCount / total) * 100).toFixed(1);

  const data = {
    labels: ["REAL", "DEEPFAKE"],
    datasets: [
      {
        label: "Prediction Statistics",
        data: [realCount, fakeCount],
        backgroundColor: [
          "#28a745",
          "#dc3545"
        ],
        borderColor: [
          "#ffffff",
          "#ffffff"
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (

    <div className="card shadow mt-4 p-4">

      <h3 className="text-center mb-4">

        Analytics Dashboard

      </h3>

      <div
        style={{
          width: "350px",
          margin: "0 auto",
        }}
      >

        <Pie
          data={data}
          options={options}
        />

      </div>

      <hr />

      <div className="row text-center">

        <div className="col-md-4">

          <div className="card border-primary p-3">

            <h5>Total Scans</h5>

            <h2>{total}</h2>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-success p-3">

            <h5>REAL</h5>

            <h2 className="text-success">

              {realCount}

            </h2>

            <p>

              {realPercentage}%

            </p>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-danger p-3">

            <h5>DEEPFAKE</h5>

            <h2 className="text-danger">

              {fakeCount}

            </h2>

            <p>

              {fakePercentage}%

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Analytics;