import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import { getUserPosts, getAllStudents } from "../api";

const ShowPosts = () => {
  const [id, setId] = useState(8);
  const [posts, setPosts] = useState(null);
  const [students, setStudents] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    const f = async () => {
      try {
        const res = await getAllStudents();
        setStudents(res.data);
      } catch (err) {
        setErrorMessage(err.message);
      }
    };
    f();
  }, []);

  useEffect(() => {
    const f = async () => {
      try {
        const res = await getUserPosts(id);
        setPosts(res.data.reverse());
      } catch (err) {
        setErrorMessage(err.message);
      }
    };
    f();
  }, [id]);

  console.log(posts);

  return (
    <Container maxWidth="xs">
      <hr />
      {students && (
        <select value={id} onChange={(e) => setId(Number(e.target.value))}>
          {students.map((item) => {
            return (
              <option
                key={item.id}
                value={item.id}
                disabled={item.name === "a"}
              >
                {item.name}
              </option>
            );
          })}
        </select>
      )}
      {posts &&
        posts.map((post) => {
          const posted_at = new Date(post.posted_at * 1000).toString();
          return (
            <div key={post.id}>
              <p>{posted_at}</p>
              {post.answers.map((answer) => (
                <div key={answer.id}>
                  <p>{answer.question.question}</p>
                  <p>{answer.answer}</p>
                </div>
              ))}
              <hr />
            </div>
          );
        })}
    </Container>
  );
};

export default ShowPosts;
