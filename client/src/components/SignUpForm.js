import React from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import * as yup from "yup";

function SignUpForm({ handleLogin }) {
  const validationSchema = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
    passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
  });

  const formik = useFormik({
    initialValues: {
      // username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((r) => {
          setSubmitting(false);
          console.log("Response:", r);
          if (r.ok) {
            r.json().then((user) => handleLogin(user));
          } else {
            r.json().then((err) => setErrors(err.errors));
          }
        })
        .catch((error) => {
          setSubmitting(false);
          console.error(error);
        });
    },
  });

  return (
    <Wrapper>
      <form onSubmit={formik.handleSubmit}>


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

      <StyledLabel htmlFor="passwordConfirmation">Password Confirmation</StyledLabel>
      <Column>
      <StyledInput
        type="password"
        id="passwordConfirmation"
        value={formik.values.passwordConfirmation}
        onChange={formik.handleChange}
        autoComplete="current-password"
      />
      </Column>

          <button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Loading..." : "Sign Up"}
          </button>

          {formik.errors &&
            Object.values(formik.errors).map((err) => (
              <Error key={err}>{err}</Error>
            ))}
        
      </form>
    </Wrapper>
  );
}




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




export default SignUpForm;




