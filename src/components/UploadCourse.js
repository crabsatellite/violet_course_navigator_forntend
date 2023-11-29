import React from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import { uploadCourse } from "../utils";
import "./css/UploadCourse.css";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class UploadCourse extends React.Component {
  state = {
    loading: false,
  };

  fileInputRef = React.createRef();

  handleSubmit = async (values) => {
    const formData = new FormData();
    const { files } = this.fileInputRef.current;

    if (files.length > 5) {
      message.error("You can at most upload 5 pictures.");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    formData.append("name", values.name);
    formData.append("address", values.address);
    formData.append("description", values.description);
    formData.append("capacity", values.capacity);

    this.setState({
      loading: true,
    });
    try {
      await uploadCourse(formData);
      message.success("upload successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    return (
      <div className="host-page">
        <Form
          {...layout}
          name="nest-messages"
          onFinish={this.handleSubmit}
          style={{ maxWidth: 1000, margin: "auto", opacity: 0.8 }}
        >
          <Form.Item
            name="name"
            label={<label className="form-item-label">Name</label>}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label={<label className="form-item-label">Address</label>}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={<label className="form-item-label">Description</label>}
            rules={[{ required: true }]}
          >
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
          <Form.Item
            name="capacity"
            label={<label className="form-item-label">Capacity</label>}
            rules={[{ required: true, type: "number", min: 1 }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="picture"
            label={<label className="form-item-label">Picture</label>}
            rules={[{ required: true }]}
          >
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={this.fileInputRef}
              multiple={true}
              // white font
              style={{ color: "white" }}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
              className="upload-course-button"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default UploadCourse;
