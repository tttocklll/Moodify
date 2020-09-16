import React from "react";
import { Navbar, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

function ChatHeader() {
  // const [talkWith, setTalkWith] = useState("ロボットくん");
  return (
    <Navbar
      style={{ backgroundColor: "#a7adb5" }}
      className="justify-content-center"
    >
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip>
            「先生」や「スクールカウンセラー」とのチャットスペースを実装？
          </Tooltip>
        }
      >
        <Dropdown>
          <Dropdown.Toggle
            style={{ backgroundColor: "transparent", border: 0 }}
            id="dropdown-basic"
          >
            Dropdown Button
          </Dropdown.Toggle>

          {/* <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
        </Dropdown.Menu> */}
        </Dropdown>
      </OverlayTrigger>
    </Navbar>
  );
}

export default ChatHeader;