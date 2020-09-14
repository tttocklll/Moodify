import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

function SelectScene(props) {
  const [selectedScene, setSelectedScene] = useState([]);
  const [isSelected, setIsSelected] = useState({});

  const hundleSelectButton = (scene) => {
    let newSelectedScene;
    newSelectedScene = [...selectedScene, scene];
    setSelectedScene(newSelectedScene);

    //  I can't explain why the following codes work...
    let newIsSelected = Object.create(isSelected);
    newIsSelected[scene] = !newIsSelected[scene];
    setIsSelected(newIsSelected);
  };

  const createButton = (scenes) =>
    scenes.map((scene, index) => (
      <Col key={index}>
        {scene && (
          <Button
            variant={isSelected[scene] ? "success" : "primary"}
            onClick={() => hundleSelectButton(scene)}
          >
            {scene}
          </Button>
        )}
      </Col>
    ));

  // コメント実装まで
  return (
    <Container>
      <Row style={{ margin: 10 }}>授業</Row>
      <Row style={{ margin: 10 }}>
        {createButton(["国語", "数学", "理科", "社会", "英語"])}
      </Row>
      <Row style={{ margin: 10 }}>
        {createButton(["美術", "保健体育", "技術", "家庭", "音楽"])}
      </Row>
      <Row style={{ margin: 10 }}>趣味</Row>
      <Row style={{ margin: 10 }}>
        {createButton(["読書", "スポーツ", "旅行", "ゲーム", "友達と遊ぶ"])}
      </Row>
      <Row style={{ margin: 10 }}>
        {createButton(["音楽", "料理", "工作", "", ""])}
      </Row>
      <Row style={{ margin: 10 }}>
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