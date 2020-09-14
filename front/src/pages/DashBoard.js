import React, { useState } from "react";
import Calendar from "../components/Calendar";
import { Container } from "@material-ui/core";

export default function Dashboard() {
  const [displayMonth, setDisplayMonth] = useState(new Date());
  return (
    <Container maxWidth="xs" >
      <Calendar
        year={displayMonth.getFullYear()}
        month={displayMonth.getMonth() + 1}
        onClickLeft={() => {
          displayMonth.setMonth(displayMonth.getMonth() - 1);
          setDisplayMonth(
            new Date(displayMonth.getFullYear(), displayMonth.getMonth())
          );
        }}
        onClickRight={() => {
          displayMonth.setMonth(displayMonth.getMonth() + 1);
          setDisplayMonth(
            new Date(displayMonth.getFullYear(), displayMonth.getMonth())
          );
        }}
      />
    </Container>
  );
}