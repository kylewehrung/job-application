import React, { useState } from "react";
import SignUpForm from "./SignUpForm"; 
import styled from "styled-components";
import Button from "./styles/Button";
import Input from "./styles/Input";
import { useFormik } from "formik";
import * as yup from "yup";



function Login({ handleLogin }) {
  const [showLogin, setShowLogin] = useState(false);


  const validationSchema = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      fetch("/login", {
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

          <StyledLabel htmlFor="email">Email</StyledLabel>
          <Column>
          <Input
            type="text"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            autoComplete="off"
          />
          </Column>

          <StyledLabel htmlFor="password">Password</StyledLabel>
          <Column>
          <Input
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            autoComplete="current-password"
          />
          </Column>
          <Button type="submit">
            {formik.isSubmitting ? "Loading..." : "Login"}
          </Button>
          {formik.errors &&
            Object.values(formik.errors).map((err) => (
              <Error key={err}>{err}</Error>
            ))}
            <Column>
          <p>
            Not an Only Choss member?&nbsp;
            <Button color="secondary" onClick={() => setShowLogin(false)}>
              Sign Up
            </Button>
          </p>
          </Column>
        </form>
      ) : (
        <FormBackground>
          <SignUpForm handleLogin={handleLogin} />
          
          <p>
            Already a Choss Member?&nbsp;
            <Button color="secondary" onClick={() => setShowLogin(true)}>
              Log In
            </Button>
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



const Error = styled.div`
  color: red;
`;


export default Login;


