import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Container } from "@material-ui/core";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import EachDate from "./EachDate";

// time functions
const getDayUnix = (year, month, date) => ({
  start: new Date(year, month, date, 0, 0, 0).getTime() / 1000,
  noon: new Date(year, month, date, 12, 0, 0).getTime() / 1000,
  end: new Date(year, month, date, 23, 59, 59).getTime() / 1000,
});

const Calendar = (props) => {
  const createIndex = ["日", "月", "火", "水", "木", "金", "土"].map(
    (day, i) => {
      return (
        <Col key={`day${i}`} style={{ padding: 0 }}>
          {day}
        </Col>
      );
    }
  );

  const createCalendar = (year, month) => {
    // 引数monthは1月なら1が来ることを想定
    const createWeek = () => {
      let week = [];
      if (curDate.getDate() === 1 && curDate.getDay()) {
        for (let j = 0; j < curDate.getDay(); j++)
          week.push(<Col key={100 + j} style={{ padding: "10px 0px" }} />);
      }
      for (let i = 0; i < 7; i++) {
        const date = curDate.getDate();
        const { start, noon, end } = getDayUnix(year, month - 1, date);
        const am = props.posts.filter(
          (post) => start <= post.posted_at && post.posted_at < noon
        );
        const pm = props.posts.filter(
          (post) => noon <= post.posted_at && post.posted_at < end
        );
        week.push(
          <Col key={date} style={{ padding: "10px 0px" }}>
            <EachDate
              date={date}
              height={40}
              left={am.length !== 0 ? am[0].emotion_value : 0}
              right={pm.length !== 0 ? pm[0].emotion_value : 0}
              onClick={() => props.onClick(date)}
            />
          </Col>
        );

        if (curDate.getDay() === 6) return week;
        curDate.setDate(date + 1);
        if (curDate.getMonth() + 1 !== month) {
          for (let j = 0; j < 7 - curDate.getDay(); j++)
            week.push(<Col key={200 + j} style={{ padding: "10px 0px" }} />);
          return week;
        }
      }
    };

    let calendar = [];
    let curDate = new Date(year, month - 1, 1);

    for (let i = 0; i < 31; i++) {
      if (curDate.getMonth() + 1 !== month) break;
      calendar.push(<Row key={i}>{createWeek()}</Row>);
      curDate.setDate(curDate.getDate() + 1);
    }
    return calendar;
  };
  return (
    <Container component="main" maxWidth="xs">
      <Row style={{ justifyContent: "space-around" }}>
        <Button variant={null} onClick={props.onClickLeft}>
          <FaChevronLeft />
        </Button>
        <p style={{ fontSize: 25, margin: 0 }}>
          {props.year}年 {props.month}月
        </p>
        <Button variant={null} onClick={props.onClickRight}>
          <FaChevronRight />
        </Button>
      </Row>
      <Row>{createIndex}</Row>
      {createCalendar(props.year, props.month)}
    </Container>
  );
};

export default Calendar;
