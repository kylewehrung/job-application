import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Login({ onLogin }) {
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div>
      <h2>Login</h2>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setErrors, setSubmitting }) => {
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
                r.json().then((user) => onLogin(user));
              } else {
                r.json().then((err) => setErrors(err.errors));
              }
            })
            .catch((error) => {
              setSubmitting(false);
              console.log(`Error: ${error}`);
            });
        }}
      >
        <Form>
          <div>
            <label htmlFor="username">Username:</label>
            <Field type="text" id="username" name="username" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default Login;


