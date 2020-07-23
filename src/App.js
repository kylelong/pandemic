import React, { Component } from "react";
import medicine from "./medicine.svg";
import Axios from "axios";
import { Doughnut } from "react-chartjs-2";
import News from "./News";
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
      key: 0,
      loading: false,
      location: "Global",
      state: "NY",
      states: {
        AL: "Alabama",
        AK: "Alaska",
        AZ: "Arizona",
        AR: "Arkansas",
        CA: "California",
        CO: "Colorado",
        CT: "Connecticut",
        DE: "Delaware",
        FL: "Florida",
        GA: "Georgia",
        HI: "Hawaii",
        ID: "Idaho",
        IL: "Illinois",
        IN: "Indiana",
        IA: "Iowa",
        KS: "Kansas",
        KY: "Kentucky",
        LA: "Louisiana",
        ME: "Maine",
        MD: "Maryland",
        MA: "Massachuesetts",
        MI: "Michigan",
        MN: "Minnesota",
        MS: "Mississippi",
        MO: "Missouri",
        MT: "Montana",
        NE: "Nebraska",
        NV: "Nevada",
        NH: "New Hampshire",
        NJ: "New Jersey",
        NM: "New Mexico",
        NY: "New York",
        NC: "North Carolina",
        ND: "North Dakota",
        OH: "Ohio",
        OK: "Oklahoma",
        OR: "Oregon",
        PA: "Pennsylvania",
        RI: "Rhode Island",
        SC: "South Carolina",
        SD: "South Dakota",
        TN: "Tennessee",
        TX: "Texas",
        UT: "Utah",
        VT: "Vermont",
        VA: "Virginia",
        WA: "Washington",
        WV: "West Virginia",
        WI: "Wisconsin",
        WY: "Wyoming",
      },
      data: [],
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
    this.handleChange = this.handleChange.bind(this);
    this.buildOptions = this.buildOptions.bind(this);
    this.compare = this.compare.bind(this);
  }
  compare(a, b) {
    const positiveA = a.positive;
    const positiveB = b.positive;
    let result = 0;
    if (positiveA > positiveB) {
      result = 1;
    } else if (positiveA < positiveB) {
      result = -1;
    }
    return result;
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

    const url2 = "https://covidtracking.com/api/v1/states/current.json";
    Axios.get(url2)
      .then((response) => {
        this.setState({ data: response.data });
        //set state to the entire data array at once onload when the
        this.state.data
          .sort((a, b) => (a.positive > b.positive ? 1 : -1))
          .reverse();
      })
      .catch((error) => {});
  }
  //Handles changes for state dropdown menu
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.setState({ state: value });
    this.setState({ location: this.state.states[value] });
    // this.state.data.forEach(function (item) {

    // });
    for (const [k, v] of Object.entries(this.state.data)) {
      if (v.state === value) {
        this.setState({ key: k });
        this.setState({ totalConfirmed: v.positive });
        this.setState({ totalDeaths: v.death });
        this.setState({
          totalRecovered: v.recovered == null ? 0 : v.recovered,
        });
        this.setState({ newDeaths: v.deathIncrease });
        //newConfirmed
        this.setState({ newConfirmed: v.positiveIncrease });
        //newRecovered
        this.setState({ newRecovered: 0 }); //put + N/A as text
      }
    }
  }
  /* 
  
  */
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

  //Builds the options list for list of states
  buildOptions() {
    let abbrv = [];
    this.state.data.forEach((element) => abbrv.push(element.state));
    //default list of states

    /* 
    make arr sorted by state abbreviation
    */
    let arr = [];
    abbrv.forEach((element) => {
      if (Object.keys(this.state.states).indexOf(element) !== -1) {
        arr.push(
          <option key={this.state.key + element} value={element}>
            {this.state.states[element]}
          </option>
        );
      }
    });

    return arr;
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
        <img
          src={medicine}
          className="img"
          alt="logo"
          height="300"
          width="300"
        />
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
          <div id="data">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-world"
              id="world"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="#607D8B"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <circle cx="12" cy="12" r="9" />
              <line x1="3.6" y1="9" x2="20.4" y2="9" />
              <line x1="3.6" y1="15" x2="20.4" y2="15" />
              <path d="M11.5 3a17 17 0 0 0 0 18" />
              <path d="M12.5 3a17 17 0 0 1 0 18" />
            </svg>
            <h3>{this.state.location} Statistics</h3>
            <select
              value={this.state.state}
              onChange={this.handleChange}
              name="state"
            >
              {this.buildOptions()}
            </select>

            <p>{`Total cases: ${this.formatNumber(
              this.state.totalConfirmed
            )}`}</p>
            <p>
              {this.state.totalRecovered === 0
                ? "Total recovered: N/A"
                : `Total recovered: ${this.formatNumber(
                    this.state.totalRecovered
                  )}`}
            </p>
            <p>{`Total deaths: ${this.formatNumber(
              this.state.totalDeaths
            )}`}</p>
          </div>
        )}
        <News />
      </div>
    );
  }
}

export default App;
