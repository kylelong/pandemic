import React from "react";
import TimeAgo from "javascript-time-ago";

// Load locale-specific relative date/time formatting rules.
import en from "javascript-time-ago/locale/en";
function NewsItem(props) {
  let date = new Date(props.article.publishedAt);
  TimeAgo.addLocale(en);

  // Create relative date/time formatter.
  const timeAgo = new TimeAgo("en-US");
  return (
    <a className="link" href={props.article.url}>
      <div>
        <h3>{props.article.title}</h3>
        <p>{props.article.description}</p>
        <p>
          {props.article.source.name} - {timeAgo.format(date)}
        </p>
      </div>
    </a>
  );
}
export default NewsItem;
