import React, { Component } from "react";
import Axios from "axios";
import NewsItem from "./NewsItem";
class News extends Component {
  constructor() {
    super();
    this.state = {
      news: [],
    };
  }
  componentDidMount() {
    const url =
      "https://gnews.io/api/v3/search?q=coronavirus&token=3ff709ba2eacc9542f4e6f1163dd82c5";
    Axios.get(url)
      .then((response) => {
        this.setState({ news: response.data.articles });
      })
      .catch((error) => {});
  }
  render() {
    return (
      <div className="news">
        <h3 id="header">News</h3>
        <ul>
          {this.state.news.map((article) => (
            <NewsItem key={article.url} article={article} />
          ))}
        </ul>
      </div>
    );
  }
}
export default News;
