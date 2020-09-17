import React, { useState } from "react";
import { Container, Row, Button } from "react-bootstrap";

function SelectScene(props) {
  const [selectedScene, setSelectedScene] = useState([]);
  const [isSelected, setIsSelected] = useState({});

  const hundleSelectButton = (scene) => {
    let newSelectedScene;

    if (selectedScene.some((item) => item === scene)) {
      newSelectedScene = selectedScene.filter((item) => item !== scene);
    } else {
      newSelectedScene = [...selectedScene, scene];
    }
    setSelectedScene(newSelectedScene);

    let newIsSelected = Object.create(isSelected);
    newIsSelected[scene] = !newIsSelected[scene];
    setIsSelected(newIsSelected);
  };
  const createButton = (scenes) =>
    scenes.map(
      (scene, index) =>
        scene && (
          <Button
            key={index}
            variant={isSelected[scene] ? "success" : "none"}
            onClick={() => hundleSelectButton(scene)}
            style={{
              padding: "none",
              borderRadius: "50%",
              boxShadow: "1px 1px 1px 1px rgba(0,0,0,0.2)",
              margin: 5,
            }}
          >
            {scene}
          </Button>
        )
    );

  return (
    <Container>
      授業
      <div>
        {createButton(["国語", "数学", "理科", "社会", "英語"])}

        {createButton(["美術", "保健体育", "技術", "家庭", "音楽"])}
      </div>
      趣味
      <div>
        {createButton(["読書", "スポーツ", "旅行", "ゲーム", "友達と遊ぶ"])}

        {createButton(["料理", "工作", "", ""])}
      </div>
      <Row style={{ margin: 5 }}>
        <Button
          onClick={() => props.triggerNextStep({ value: selectedScene })}
          variant="dark"
        >
          完了
        </Button>
      </Row>
    </Container>
  );
}

export default SelectScene;
