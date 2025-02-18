import React, { useState, useContext } from "react";

import { Checkbox, Input, message } from "antd";

import authContext from "../../context/auth/authContext";
import globalContext from "../../context/global/globalContext";

import { AuthDisplay, StyledButton } from "./LandingPage.styles";

const LoginForm = props => {
  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
    remember: false
  });

  const [isPending, setIsPending] = useState(false);

  const AuthContext = useContext(authContext);
  const GlobalContext = useContext(globalContext);

  const { login } = AuthContext;

  const onChange = e =>
    setLoginState({ ...loginState, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    if (isPending) {
      return;
    }
    setIsPending(true);

    const { email, password, remember } = loginState;

    const loginResponse = await login(email, password);

    const { success, token, msg } = loginResponse;

    setIsPending(false);

    if (success) {
      message.success("Login successful");
      AuthContext.setState({
        isAuthenticated: true
      });
      GlobalContext.setState({
        authToken: token,
        remember
      });
      props.isLoggedIn();
    } else {
      message.error(msg);
    }
  };

  return (
    <AuthDisplay>
      <h1>Welcome Back</h1>
      <h3 style={{ color: "#808080" }}>Login to continue</h3>
      <form onSubmit={onSubmit}>
        <Input
          type="email"
          name="email"
          value={loginState.email}
          onChange={onChange}
          placeholder="Email"
          size="large"
          style={{ marginBottom: "40px" }}
        />
        <Input.Password
          type="password"
          name="password"
          value={loginState.password}
          onChange={onChange}
          placeholder="Password"
          size="large"
          style={{ marginBottom: "40px" }}
        />
        <Checkbox
          checked={loginState.remember}
          onChange={event => {
            setLoginState({
              ...loginState,
              remember: event.target.checked
            });
          }}
          style={{ marginBottom: "40px" }}
        >
          Remember Me
        </Checkbox>
        <StyledButton
          type="primary"
          htmlType="submit"
          block
          loading={isPending}
        >
          <span style={{ fontSize: "16px" }}>Login</span>
        </StyledButton>
      </form>
      <a style={{ color: "#3b5999" }} href="/">
        Forgot Password?
      </a>
    </AuthDisplay>
  );
};

export default LoginForm;
