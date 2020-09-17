import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

const emoji = ["😆", "😄", "😃", "😓", "😫", "😨"];

const ResultDetails = (props) => {
  const { post, postDetails } = props;

  console.log(postDetails);
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", height: 50 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 30,
          }}
        >
          {emoji[6 - post.emotion_value]}
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>「{post.emotion_phrase}」</div>
        </div>
      </div>
      <Card style={{ marginBottom: 5 }}>
        <CardContent>
          <Typography style={{ fontSize: 14 }} color="textSecondary">
            ひとこと日記
          </Typography>
        </CardContent>
        <CardContent>
          <Typography>{post.comment}</Typography>
        </CardContent>
      </Card>
      <Card style={{ marginBottom: 5 }}>
        <CardContent>
          <Typography style={{ fontSize: 14 }} color="textSecondary">
            Q&A
          </Typography>
        </CardContent>
        {postDetails.answers.map((item) => (
          <CardContent key={item.id}>
            <Typography>{item.question.question}</Typography>
            <Typography>{item.answer}</Typography>
          </CardContent>
        ))}
      </Card>
      <Card style={{ marginBottom: 5 }}>
        <CardContent>
          <Typography style={{ fontSize: 14 }} color="textSecondary">
            行動要因
          </Typography>
        </CardContent>
        {postDetails.scenes.map((item) => (
          <CardContent key={item.id}>
            <Typography>{item.scene}</Typography>
          </CardContent>
        ))}
      </Card>
    </div>
  );
};

export default ResultDetails;
