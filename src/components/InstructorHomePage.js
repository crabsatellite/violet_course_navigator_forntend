import {
  message,
  Tabs,
  List,
  Card,
  Image,
  Carousel,
  Button,
  Tooltip,
  Space,
  Modal,
} from "antd";
import {
  LeftCircleFilled,
  RightCircleFilled,
  InfoCircleOutlined,
  HomeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import {
  deleteCourse,
  getCoursesByInstructor,
  getReservationsByCourse,
} from "../utils";
import UploadCourse from "./UploadCourse";
import "./css/InstructorHomePage.css";

const { TabPane } = Tabs;

class ReservationList extends React.Component {
  state = {
    loading: false,
    reservations: [],
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({ loading: true });

    try {
      const resp = await getReservationsByCourse(this.props.courseId);
      console.log(resp);
      this.setState({
        reservations: resp,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, reservations } = this.state;

    return (
      <div>
        <h3>Total Registrations: {reservations.length}</h3>{" "}
        {/* Display the total number of reservations */}
        <List
          loading={loading}
          dataSource={reservations}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Text>Student Name: {item.student.username}</Text>}
                description={
                  <>
                    <Text>Registered Date: {item.reservation_date}</Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

class ViewReservationsButton extends React.Component {
  state = {
    modalVisible: false,
  };

  openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { course } = this.props;
    const { modalVisible } = this.state;

    const modalTitle = `Registrations for ${course.name}`;

    return (
      <>
        <Button onClick={this.openModal} shape="round">
          View Registrations
        </Button>
        {modalVisible && (
          <Modal
            title={modalTitle}
            centered={true}
            visible={modalVisible}
            closable={false}
            footer={null}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            <ReservationList courseId={course.id} />
          </Modal>
        )}
      </>
    );
  }
}

class RemoveCourseButton extends React.Component {
  state = {
    loading: false,
  };

  handleRemoveCourse = async () => {
    const { course, onRemoveSuccess } = this.props;
    this.setState({
      loading: true,
    });

    try {
      await deleteCourse(course.id);
      onRemoveSuccess();
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
      <Button
        loading={this.state.loading}
        onClick={this.handleRemoveCourse}
        danger={true}
        shape="round"
        type="primary"
      >
        Remove Course
      </Button>
    );
  }
}

export class CourseDetailInfoButton extends React.Component {
  state = {
    modalVisible: false,
  };

  openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { course } = this.props;
    const { name, description, address, capacity } = course;
    const { modalVisible } = this.state;
    return (
      <>
        <Tooltip title="View Course Details">
          <Button
            onClick={this.openModal}
            style={{ border: "none" }}
            size="large"
            icon={<InfoCircleOutlined />}
          />
        </Tooltip>
        {modalVisible && (
          <Modal
            title={name}
            centered={true}
            visible={modalVisible}
            closable={false}
            footer={null}
            onCancel={this.handleCancel}
          >
            <Space direction="vertical">
              <Text strong={true}>Description</Text>
              <Text type="secondary">{description}</Text>
              <Text strong={true}>Address</Text>
              <Text type="secondary">{address}</Text>
              <Text strong={true}>Capacity</Text>
              <Text type="secondary">{capacity}</Text>
            </Space>
          </Modal>
        )}
      </>
    );
  }
}

class MyCourses extends React.Component {
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
      const resp = await getCoursesByInstructor();
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
                  color: "#57068c",
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
              actions={[<ViewReservationsButton course={item} />]}
              extra={
                <RemoveCourseButton
                  course={item}
                  onRemoveSuccess={this.loadData}
                />
              }
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
    );
  }
}

class InstructorHomePage extends React.Component {
  render() {
    return (
      <div className="host-home-page">
        <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
          <TabPane
            tab={
              <span>
                <HomeOutlined />
                My Courses
              </span>
            }
            key="1"
          >
            <MyCourses />
          </TabPane>
          <TabPane
            tab={
              <span>
                <UploadOutlined />
                Upload Course
              </span>
            }
            key="2"
          >
            <UploadCourse />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default InstructorHomePage;
