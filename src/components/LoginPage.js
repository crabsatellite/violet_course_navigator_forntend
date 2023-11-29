import React from "react";
import { Form, Button, Input, Space, Checkbox, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { login, register } from "../utils";
import "./css/LoginPage.css";

class LoginPage extends React.Component {
  formRef = React.createRef();
  state = {
    asHost: false,
    loading: false,
  };

  onFinish = () => {
    console.log("finish form");
  };

  handleLogin = async () => {
    const formInstance = this.formRef.current;

    try {
      await formInstance.validateFields();
    } catch (error) {
      return;
    }

    this.setState({
      loading: true,
    });

    try {
      const { asHost } = this.state;
      const resp = await login(formInstance.getFieldsValue(true), asHost);
      this.props.handleLoginSuccess(resp.token, asHost);
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  handleRegister = async () => {
    const formInstance = this.formRef.current;

    try {
      await formInstance.validateFields();
    } catch (error) {
      return;
    }

    this.setState({
      loading: true,
    });

    try {
      await register(formInstance.getFieldsValue(true), this.state.asHost);
      message.success("Register Successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  handleCheckboxOnChange = (e) => {
    this.setState({
      asHost: e.target.checked,
    });
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div style={{ width: 500 }}>
          <Form
            ref={this.formRef}
            onFinish={this.onFinish}
            className="fadeIn"
            style={{
              width: 500,
            }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input
                disabled={this.state.loading}
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
                size="large"
                style={{
                  padding: "10px 20px",
                  fontSize: "18px",
                  borderRadius: 10,
                  opacity: 0.8,
                }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                disabled={this.state.loading}
                placeholder="Password"
                size="large"
                style={{
                  padding: "10px 20px",
                  fontSize: "18px",
                  borderRadius: 10,
                  opacity: 0.8,
                }}
              />
            </Form.Item>
          </Form>
          <Space className="fadeIn">
            <div
              className="login_btn_checkbox"
              style={{
                width: 500,
                display: "vertical",
              }}
            >
              <Button
                onClick={this.handleLogin}
                disabled={this.state.loading}
                shape="round"
                type="primary"
                className="login_btn"
              >
                Log in
              </Button>
              <Button
                onClick={this.handleRegister}
                disabled={this.state.loading}
                shape="round"
                type="primary"
                className="register_btn"
              >
                Register
              </Button>
              <Checkbox
                disabled={this.state.loading}
                checked={this.state.asHost}
                onChange={this.handleCheckboxOnChange}
                style={{ color: "#8900e1", fontFamily: "arial", fontSize: 15 }}
              >
                I am a instructor
              </Checkbox>
            </div>
          </Space>
        </div>
      </div>
    );
  }
}

export default LoginPage;
