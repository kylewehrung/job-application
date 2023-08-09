import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function SignUpForm({ onLogin }) {
  const validationSchema = yup.object({
    username: yup
      .string()
      .required("Username is required.")
      .matches(/^\S+$/, "Username must be one word, no spaces.")
      .min(6, "Username must be at least 6 characters long.")
      .max(15, "Username must be less than 16 characters long."),

    email: yup
      .string()
      .required("Email is required.")
      .matches(/^\S+@\S+\.\S+$/, "Invalid email address."),

    password: yup.string().required("Password is required."),

    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match.")
      .required()
      .min(8, "Password must be at least 8 characters long.")
      .max(15, "Password must be less than 16 characters long."),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const response = await fetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const user = await response.json();
          onLogin(user);
        } else {
          const errorData = await response.json();
          setErrors(errorData.errors);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false); 
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username && (
          <div>{formik.errors.username}</div>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div>{formik.errors.email}</div>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div>{formik.errors.password}</div>
        )}
      </div>

      <div>
        <label htmlFor="passwordConfirmation">Confirm Password</label>
        <input
          type="password"
          id="passwordConfirmation"
          name="passwordConfirmation"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.passwordConfirmation}
        />
        {formik.touched.passwordConfirmation &&
          formik.errors.passwordConfirmation && (
            <div>{formik.errors.passwordConfirmation}</div>
          )}
      </div>

      <button type="submit" disabled={formik.isSubmitting}>
        Sign Up
      </button>
    </form>
  );
}

export default SignUpForm;



