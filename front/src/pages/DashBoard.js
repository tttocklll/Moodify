import React, { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import Factor from "../components/Factor";
import Modal from "react-modal";
import { Container, Button } from "@material-ui/core";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getPostMonthly } from "../api";
import DailyResult from "../components/DailyResult";
import useLoginRedirect from "../hooks/useLoginRedirect";
import ErrorMessage from "./../components/ErrorMessage";

// time functions
const getDayUnix = (year, month, date) => ({
  start: new Date(year, month, date, 0, 0, 0).getTime() / 1000,
  noon: new Date(year, month, date, 12, 0, 0).getTime() / 1000,
  end: new Date(year, month, date, 23, 59, 59).getTime() / 1000,
});

Modal.setAppElement("#root");
const Dashboard = () => {
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [posts, setPosts] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  useLoginRedirect();

  useEffect(() => {
    const f = async () => {
      try {
        const res = await getPostMonthly(
          displayMonth.getFullYear(),
          displayMonth.getMonth() + 1
        );
        setPosts(res.data);
      } catch (err) {
        console.log(err.message);
      }
    };
    f();
  }, [displayMonth]);

  const getPost = () => {
    const { start, noon, end } = getDayUnix(
      displayMonth.getFullYear(),
      displayMonth.getMonth(),
      modalDate
    );
    const am = posts
      ? posts.filter((post) => start <= post.posted_at && post.posted_at < noon)
      : [];
    const pm = posts
      ? posts.filter((post) => noon <= post.posted_at && post.posted_at < end)
      : [];
    return {
      am: am.length !== 0 ? am[0] : null,
      pm: pm.length !== 0 ? pm[0] : null,
    };
  };

  return (
    <Container maxWidth="xs" id="dashboard">
      <ErrorMessage message={errorMessage} />
      {!isModalOpen ? (
        <>
          {posts ? (
            <Calendar
              year={displayMonth.getFullYear()}
              month={displayMonth.getMonth() + 1}
              posts={posts}
              onClick={(date) => {
                setModalDate(date);
                setIsModalOpen(!isModalOpen);
              }}
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
          ) : (
            ""
          )}
          <hr />
          <Factor setErrorMessage={setErrorMessage} />
        </>
      ) : (
        ""
      )}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <div>
          <Button fullWidth onClick={() => setIsModalOpen(false)}>
            close
          </Button>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Button variant={null} onClick={() => setModalDate(modalDate - 1)}>
              <FaChevronLeft />
            </Button>
            <p style={{ fontSize: 20, margin: 0 }}>
              {displayMonth.getFullYear()}/{displayMonth.getMonth() + 1}/
              {modalDate}
            </p>
            <Button variant={null} onClick={() => setModalDate(modalDate + 1)}>
              <FaChevronRight />
            </Button>
          </div>
          <DailyResult {...getPost()} onClose={() => setIsModalOpen(false)} />
        </div>
      </Modal>
    </Container>
  );
};

export default Dashboard;
