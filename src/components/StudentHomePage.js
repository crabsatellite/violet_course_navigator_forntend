import React from "react";
import {
  Image,
  message,
  Tabs,
  List,
  Typography,
  Form,
  Input,
  Button,
  Card,
  Carousel,
  Modal,
} from "antd";
import {
  getReservations,
  searchCourses,
  registerCourse,
  cancelReservation,
} from "../utils";
import {
  LeftCircleFilled,
  RightCircleFilled,
  SearchOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { CourseDetailInfoButton } from "./InstructorHomePage";
import Background from "./BackGround";
import "./css/StudentHomePage.css";

const { Text } = Typography;
const { TabPane } = Tabs;

class CancelReservationButton extends React.Component {
  state = {
    loading: false,
  };

  handleCancelReservation = async () => {
    const { reservationId, onCancelSuccess } = this.props;
    this.setState({
      loading: true,
    });

    try {
      await cancelReservation(reservationId);
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }

    onCancelSuccess();
  };

  render() {
    return (
      <Button
        loading={this.state.loading}
        onClick={this.handleCancelReservation}
        danger={true}
        shape="round"
        type="primary"
      >
        Cancel Registration
      </Button>
    );
  }
}

class MyReservations extends React.Component {
  state = {
    loading: false,
    data: [],
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({
      loading: true,
    });

    try {
      const resp = await getReservations();
      this.setState({
        data: resp,
      });
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
      <List
        style={{ width: 1000, margin: "auto" }}
        loading={this.state.loading}
        dataSource={this.state.data}
        locale={{
          emptyText: (
            <div style={{ textAlign: "center" }}>
              <img
                src={`${process.env.PUBLIC_URL}/images/empty.png`}
                alt="empty"
                style={{ width: 50, height: 50 }}
              ></img>
              <div
                style={{
                  color: "#fff",
                  fontFamily: "Courier New",
                }}
              >
                No Data
              </div>
            </div>
          ),
        }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <CancelReservationButton
                onCancelSuccess={this.loadData}
                reservationId={item.id}
              />,
            ]}
          >
            <Card
              style={{
                width: "100%",
                backgroundColor: "#f0f0f0",
                opacity: 0.9,
                borderRadius: 10,
              }}
            >
              {" "}
              {/* add Card component here, you can customize the style */}
              <List.Item.Meta
                title={<Text>{item.course.name}</Text>}
                description={
                  <div>
                    <Text>{item.course.description}</Text>
                    <br />
                    <Text>{item.course.address}</Text>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    );
  }
}

class RegisterCourseButton extends React.Component {
  state = {
    loading: false,
    modalVisible: false,
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleSubmit = async (values) => {
    const { course } = this.props;
    this.setState({
      loading: true,
    });

    try {
      await registerCourse({
        course: {
          id: course.id,
        },
      });
      message.success("Successfully register the course");
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const { course } = this.props;
    return (
      <>
        <Button onClick={this.handleSubmit} shape="round" type="primary">
          Register Course
        </Button>
        <Modal
          destroyOnClose={true}
          title={course.name}
          visible={this.state.modalVisible}
          footer={null}
          onCancel={this.handleCancel}
        ></Modal>
      </>
    );
  }
}

class SearchCourses extends React.Component {
  state = {
    data: [],
    loading: false,
  };

  componentDidMount() {
    // Call the search method to load all courses on component mount
    this.search();
  }

  search = async (query = "") => {
    // Set a default empty query
    this.setState({
      loading: true,
    });

    try {
      const resp = await searchCourses(query);
      this.setState({
        data: resp,
      });
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
      <>
        <Form onFinish={this.search} layout="inline">
          <Form.Item
            label={<label className="form-item-label">Key Words</label>}
            name="key_words"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              loading={this.state.loading}
              type="primary"
              htmlType="submit"
              className="submit-button"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        <List
          style={{ marginTop: 20 }}
          loading={this.state.loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          locale={{
            emptyText: (
              <div style={{ textAlign: "center" }}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/empty.png`}
                  alt="empty"
                  style={{ width: 50, height: 50 }}
                ></img>
                <div
                  style={{
                    color: "#fff",
                    fontFamily: "Courier New",
                  }}
                >
                  No Data
                </div>
              </div>
            ),
          }}
          dataSource={this.state.data}
          renderItem={(item) => (
            <List.Item>
              <Card
                key={item.id}
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Text ellipsis={true} style={{ maxWidth: 150 }}>
                      {item.name}
                    </Text>
                    <CourseDetailInfoButton course={item} />
                  </div>
                }
                extra={<RegisterCourseButton course={item} />}
              >
                {
                  <Carousel
                    dots={false}
                    arrows={true}
                    prevArrow={<LeftCircleFilled />}
                    nextArrow={<RightCircleFilled />}
                  >
                    {item.images.map((image, index) => (
                      <div key={index}>
                        <Image src={image.url} width="100%" />
                      </div>
                    ))}
                  </Carousel>
                }
              </Card>
            </List.Item>
          )}
        />
      </>
    );
  }
}

class StudentHomePage extends React.Component {
  render() {
    return (
      <div className="guest-home-page">
        <Background
          videoSource={`https://personalwebpage-videos.s3.us-east-2.amazonaws.com/crab_stay_guest_background.mp4`}
          posterSource={`${process.env.PUBLIC_URL}/images/crab_stay_guest_background_poster.jpg`}
        />
        <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
          <TabPane
            tab={
              <span>
                <SearchOutlined />
                Search Courses
              </span>
            }
            key="1"
          >
            <SearchCourses />
          </TabPane>
          <TabPane
            tab={
              <span>
                <CalendarOutlined />
                My Registrations
              </span>
            }
            key="2"
          >
            <MyReservations />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default StudentHomePage;
