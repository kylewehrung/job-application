import React, { useState } from "react";
import SignUpForm from "./SignUpForm"; 
import styled from "styled-components";
import { useFormik } from "formik";
import * as yup from "yup";

function Login({ handleLogin }) {
  const [showLogin, setShowLogin] = useState(false);

  const validationSchema = yup.object({
    // username: yup.string().required(),
    password: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      // username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((r) => {
          setSubmitting(false);
          if (r.ok) {
            r.json().then((user) => handleLogin(user));
          } else {
            r.json().then((err) => setErrors(err.errors));
          }
        })
        .catch((error) => {
          setSubmitting(false);
          console.log(`Error: ${error}`);
        });
    },
  });

  return (
    <BaseBackground>
    <Wrapper>
    <FormBackground>
      {showLogin ? (
        <form onSubmit={formik.handleSubmit}>

          {/* <StyledLabel htmlFor="username">Username</StyledLabel>
          <Column>
          <StyledInput
            type="text"
            id="username"
            autoComplete="off"
            value={formik.values.username}
            onChange={formik.handleChange}
          />
          </Column> */}

          <StyledLabel htmlFor="email">Email</StyledLabel>
          <Column>
          <StyledInput
            type="text"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            autoComplete="off"
          />
          </Column>

          <StyledLabel htmlFor="password">Password</StyledLabel>
          <Column>
          <StyledInput
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            autoComplete="current-password"
          />
          </Column>
          <button type="submit">
            {formik.isSubmitting ? "Loading..." : "Login"}
          </button>
          {formik.errors &&
            Object.values(formik.errors).map((err) => (
              <Error key={err}>{err}</Error>
            ))}
            <Column>
          <p>
            Not an Only Choss member?&nbsp;
            <button color="secondary" onClick={() => setShowLogin(false)}>
              Sign Up
            </button>
          </p>
          </Column>
        </form>
      ) : (
        <FormBackground>
          <SignUpForm handleLogin={handleLogin} />
          
          <p>
            Already a Choss Member?&nbsp;
            <button color="secondary" onClick={() => setShowLogin(true)}>
              Log In
            </button>
          </p>
        </FormBackground>
      )}
    </FormBackground>
      </Wrapper>
      </BaseBackground>
  );
}





const BaseBackground = styled.section`
  height: 100vh;
  background-image: url("https://i.pinimg.com/originals/cc/9d/37/cc9d37ab453a095b985de4ca33d4b7fc.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.9;
  overflow: hidden;
`;


const FormBackground= styled.section`
  height: 100vh;
  width: 900px;
  background-image: url("https://i.pinimg.com/originals/cc/9d/37/cc9d37ab453a095b985de4ca33d4b7fc.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ;
  overflow: hidden;
`;


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 900px;
`;


const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;


const StyledLabel = styled.label`
  color: #f8f0e3;
  font-size: 2em;
`;


const StyledInput = styled.input`
  width: 500px;
  height: 40px; 
  padding: 20px;
  border-radius: 25px;
  font-size: 24px;
  opacity: 0.8;
`;


const Error = styled.div`
  color: red;
`;


export default Login;


