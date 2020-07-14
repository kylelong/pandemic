import React, { Component } from "react";
import medicine from "./medicine.svg";
import Axios from "axios";
import { Doughnut } from "react-chartjs-2";

class App extends Component {
  constructor() {
    super();
    this.state = {
      newConfirmed: 0,
      totalConfirmed: 0,
      newDeaths: 0,
      totalDeaths: 0,
      newRecovered: 0,
      totalRecovered: 0,
      loading: false,
      labels: [
        "New Confirmed",
        "Total Confirmed",
        "New Deaths",
        "Total Deaths",
        "New Recovered",
        "Total Recovered",
      ],
    };

    this.formatNumber = this.formatNumber.bind(this);
  }
  componentDidMount() {
    const url = `https://api.covid19api.com/summary`;
    this.setState({ loading: true });
    Axios.get(url)
      .then((response) => {
        const global = response.data.Global;
        this.setState({
          newConfirmed: global["NewConfirmed"],
          totalConfirmed: global["TotalConfirmed"],
          newDeaths: global["NewDeaths"],
          totalDeaths: global["TotalDeaths"],
          newRecovered: global["NewRecovered"],
          totalRecovered: global["TotalRecovered"],
          loading: false,
        });
      })
      .catch((error) => {});
  }
  formatNumber(num) {
    let str = "";
    if (num > 1e6) {
      num = num / 1e6;
      str = "M";
    }
    if (num > 1e3) {
      num = num / 1e3;
      str = "K";
    }
    return num.toFixed(1) + str;
  }
  render() {
    const datasets = [
      {
        data: [
          this.state.newConfirmed,
          this.state.totalConfirmed,
          this.state.newDeaths,
          this.state.totalDeaths,
          this.state.newRecovered,
          this.state.totalRecovered,
        ],
        backgroundColor: [
          "#ffff99",
          "yellow",
          "#FF4747",
          "red",
          "#99FF99",
          "green",
        ],
      },
    ];
    return (
      <div className="container">
        <h3 id="headerText">Pandemic Visualization</h3>
        <img src={medicine} alt="logo" height="300" width="300" />

        <Doughnut
          data={{
            labels: this.state.labels,
            datasets: datasets,
          }}
          options={{
            responsive: true,
            maintainAspectRatio: true,
          }}
        />
        <br />
        {this.state.loading && <p>Loading...</p>}
        {this.state.loading === false && (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-world"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="#607D8B"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx="12" cy="12" r="9" />
              <line x1="3.6" y1="9" x2="20.4" y2="9" />
              <line x1="3.6" y1="15" x2="20.4" y2="15" />
              <path d="M11.5 3a17 17 0 0 0 0 18" />
              <path d="M12.5 3a17 17 0 0 1 0 18" />
            </svg>

            <h3>Global Stats</h3>
            <p>{`Total cases: ${this.formatNumber(
              this.state.totalConfirmed
            )}`}</p>
            <p>{`Total recovered: ${this.formatNumber(
              this.state.totalRecovered
            )}`}</p>
            <p>{`Total deaths: ${this.formatNumber(
              this.state.totalDeaths
            )}`}</p>
            <select>
              <option>Arkansas</option>
            </select>
          </div>
        )}
      </div>
    );
  }
}

export default App;
