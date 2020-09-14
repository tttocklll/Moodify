import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import useWindowDimensions from "../misc/useWindowDimensions.js";
import SelectScene from "../components/SelectScene";
import ChatHeader from "../components/ChatHeader";

function CustomChatbot(props) {
  const [emotionGrade, setEmotionGrade] = useState(0);
  const [emotionPhrase, setEmotionPhrase] = useState("");
  const [selectedScene, setSelectedScene] = useState([]);
  const { height, width } = useWindowDimensions();

  const waitTime = 1000;
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
    handleEnd: ({ steps }) => {
      setSelectedScene(steps["Displaying options of scene"].value);
    },
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

  const steps = [
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
      message: "昨日は良く眠れましたか？",
      trigger: "A1",
    },
    {
      id: "A1",
      options: createOptions(["yes", "no"], ["はい", "いいえ"], "Q2"),
    },
    {
      id: "Q2",
      message: "やるべきことに追われていますか？",
      trigger: "A2",
    },
    {
      id: "A2",
      options: createOptions(["yes", "no"], ["はい", "いいえ"], "Q3"),
    },
    {
      id: "Q3",
      message: "授業は楽しかったですか？",
      trigger: "A3",
    },
    {
      id: "A3",
      options: createOptions(["yes", "no"], ["はい", "いいえ"], "Thanks"),
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
        "Asking options of positive emotion",
        setEmotionGrade
      ),
    },
    {
      id: "Asking options of positive emotion",
      message: `言葉にするとどんな感情かな？`,
      trigger: ({ steps }) => {
        return `Displaying options of ${steps.emotionValue.value > 3 ? "positive" : "negative"
          } emotion`;
      },
    },
    {
      id: "Displaying options of positive emotion",
      options: createOptions(
        ["楽しい", "嬉しい"],
        ["楽しい", "嬉しい"],
        "Confirm emotion",
        setEmotionPhrase
      ),
    },
    {
      id: "Displaying options of negative emotion",
      options: createOptions(
        ["悲しい", "残念な"],
        ["悲しい", "残念な"],
        "Confirm emotion",
        setEmotionPhrase
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
      message: "おつかれさま！",
      end: true,
    },
  ];

  return <ChatBot steps={steps} {...config} />;
}
export default CustomChatbot;