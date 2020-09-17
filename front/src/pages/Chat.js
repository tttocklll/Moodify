import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ChatBot from "react-simple-chatbot";
import useWindowDimensions from "../misc/useWindowDimensions.js";
import SelectScene from "../components/SelectScene";
import ErrorMessage from "./../components/ErrorMessage";
import useLoginRedirect from "../hooks/useLoginRedirect";
import { chatQuestions, postChat } from "../api";

const sleep = (msec) => new Promise((res) => setTimeout(res, msec));

function CustomChatbot(props) {
  const [questions, setQuestions] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { height, width } = useWindowDimensions();
  useLoginRedirect();
  const history = useHistory();

  useEffect(() => {
    const f = async () => {
      try {
        const res = await chatQuestions();
        setQuestions(res.data);
      } catch (err) {
        setErrorMessage(err.message);
      }
    };
    f();
  }, []);

  const handleSubmit = async (steps) => {
    const body = {
      emotion_value: steps.emotionValue.value,
      emotion_phrase: steps["Positive emotion"]
        ? steps["Positive emotion"].value
        : steps["Negative emotion"].value,
      comment: steps.comment ? steps.comment.value : "",
      temp_scenes: steps["Displaying options of scene"].value,
      answers: [
        { answer: steps.A1.value, question_id: questions[0].id },
        { answer: steps.A2.value, question_id: questions[1].id },
        { answer: steps.A3.value, question_id: questions[2].id },
      ],
    };
    try {
      await postChat(body);
      await sleep(1000);
      history.push("/dashboard");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const waitTime = 750;
  const config = {
    width: `${width}px`,
    height: `${height}px`,
    botDelay: waitTime,
    userDelay: waitTime,
    customDelay: waitTime,
    style: {
      borderRadius: 0,
    },
    bubbleStyle: {
      backgroundColor: "white",
      color: "black",
    },
    bubbleOptionStyle: {
      backgroundColor: "white",
      color: "black",
    },
    headerComponent: <div />,
  };

  const createOptions = (values, labels, trigger, setter) => {
    console.assert(values.length === labels.length);
    let res = [];
    for (let i in values) {
      let cur_option = {
        value: values[i],
        label: labels[i],
        trigger: () => {
          setter && setter(values[i]);
          return trigger;
        },
      };
      res.push(cur_option);
    }
    return res;
  };

  const steps = questions && [
    {
      id: "Greet",
      message: "こんにちは！",
      trigger: "Ask user to answer questions",
    },
    {
      id: "Ask user to answer questions",
      message: "まずはいくつかの質問に答えてね。",
      trigger: "Q1",
    },
    {
      id: "Q1",
      message: questions[0].question,
      trigger: "A1",
    },
    {
      id: "A1",
      options: createOptions(["はい", "いいえ"], ["はい", "いいえ"], "Q2"),
    },
    {
      id: "Q2",
      message: questions[1].question,
      trigger: "A2",
    },
    {
      id: "A2",
      options: createOptions(["はい", "いいえ"], ["はい", "いいえ"], "Q3"),
    },
    {
      id: "Q3",
      message: questions[2].question,
      trigger: "A3",
    },
    {
      id: "A3",
      options: createOptions(["はい", "いいえ"], ["はい", "いいえ"], "Thanks"),
    },
    {
      id: "Thanks",
      message: "ありがとう！",
      trigger: "Asking options of emotionValue",
    },
    {
      id: "Asking options of emotionValue",
      message: "今はどんな気持ち？",
      trigger: "emotionValue",
    },
    {
      id: "emotionValue",
      options: createOptions(
        [6, 5, 4, 3, 2, 1],
        ["😆", "😄", "😃", "😓", "😫", "😨"],
        "Asking options of positive emotion"
      ),
    },
    {
      id: "Asking options of positive emotion",
      message: `言葉にするとどんな感情かな？`,
      trigger: ({ steps }) => {
        return `${
          steps.emotionValue.value > 3 ? "Positive" : "Negative"
        } emotion`;
      },
    },
    {
      id: "Positive emotion",
      options: createOptions(
        [
          "楽しい",
          "嬉しい",
          "感謝",
          "驚き",
          "わくわく",
          "穏やか",
          "爽やか",
          "愛おしい",
          "恥ずかしい",
        ],
        [
          "楽しい",
          "嬉しい",
          "感謝",
          "驚き",
          "わくわく",
          "穏やか",
          "爽やか",
          "愛おしい",
          "恥ずかしい",
        ],
        "Confirm emotion"
      ),
    },
    {
      id: "Negative emotion",
      options: createOptions(
        [
          "焦り",
          "不安",
          "怒り",
          "重圧",
          "恐怖",
          "恥ずかしい",
          "悲しい",
          "罪悪感",
          "緊張",
          "孤独",
          "嫉妬",
          "嫌悪",
        ],
        [
          "焦り",
          "不安",
          "怒り",
          "重圧",
          "恐怖",
          "恥ずかしい",
          "悲しい",
          "罪悪感",
          "緊張",
          "孤独",
          "嫉妬",
          "嫌悪",
        ],
        "Confirm emotion"
      ),
    },
    {
      id: "Confirm emotion",
      message: `「{previousValue}」という感情なんだね！`,
      trigger: "Asking options of scene",
    },
    {
      id: "Asking options of scene",
      message: `何をしてその感情になったのかな？`,
      trigger: "Displaying options of scene",
    },
    {
      id: "Displaying options of scene",
      component: <SelectScene />,
      trigger: "Confirm scene",
      waitAction: true,
    },
    {
      id: "Confirm scene",
      message: `{previousValue}をしたからなんだね`,
      trigger: "Asking comment",
    },
    {
      id: "Asking comment",
      message: "最後にひとこと日記を書く？",
      trigger: "Asking comment options",
    },
    {
      id: "Asking comment options",
      options: [
        {
          label: "はい",
          value: "yes",
          trigger: "comment",
        },
        {
          label: "いいえ",
          value: "no",
          trigger: ({ steps }) =>
            steps.emotionValue.value > 3 ? "bye" : "Confirm consulting",
        },
      ],
    },
    {
      id: "comment",
      user: true,
      trigger: ({ steps }) =>
        steps.emotionValue.value > 3 ? "bye" : "Confirm consulting",
      placeholder: "振り返りコメントを入力しましょう！",
    },

    {
      id: "Confirm consulting",
      message: "先生やスクールカウンセラーに相談したいことはある？",
      trigger: "Display options of consulting",
    },
    {
      id: "Display options of consulting",
      options: [
        {
          value: "yes",
          label: "はい",
          trigger: "Asking who to consult",
        },
        {
          value: "no",
          label: "いいえ",
          trigger: "bye",
        },
      ],
    },
    {
      id: "Asking who to consult",
      message: "誰に相談したいかな？",
      trigger: "consultant",
    },
    {
      id: "consultant",
      options: [
        {
          value: "スクールカウンセラー",
          label: "スクールカウンセラー",
          trigger: "Asking details of consultation",
        },
        {
          value: "担任の先生",
          label: "担任の先生",
          trigger: "Asking details of consultation",
        },
      ],
    },
    {
      id: "Asking details of consultation",
      message: "どんなことを相談しようかな？",
      trigger: "Details of consultation",
    },
    {
      id: "Details of consultation",
      user: true,
      trigger: "Confirm consultant",
    },
    {
      id: "Confirm consultant",
      message: ({ steps }) =>
        `わかりました！\n${steps.consultant.value}に伝えておくね。`,
      trigger: "bye",
    },
    {
      id: "bye",
      message: ({ steps }) => {
        // setComment(steps.comment ? steps.comment.comment : "");
        handleSubmit(steps);
        return "お疲れさまでした！";
      },
      end: true,
    },
  ];

  return (
    <div>
      <ErrorMessage message={errorMessage} />
      {questions ? <ChatBot steps={steps} {...config} /> : ""}
    </div>
  );
}
export default CustomChatbot;
