const domain = "http://localhost:8080";

export const login = (credential, asHost) => {
  const loginUrl = `${domain}/authenticate/${
    asHost ? "student" : "instructor"
  }`;
  return fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to log in");
    }

    return response.json();
  });
};

export const register = (credential, asHost) => {
  const registerUrl = `${domain}/register/${asHost ? "student" : "instructor"}`;
  return fetch(registerUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credential),
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to register");
    }
  });
};

export const getReservations = () => {
  const authToken = localStorage.getItem("authToken");
  const listReservationsUrl = `${domain}/course_reservations`;

  return fetch(listReservationsUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get reservation list");
    }

    return response.json();
  });
};

export const getCoursesByInstructor = () => {
  const authToken = localStorage.getItem("authToken");
  const listCoursesUrl = `${domain}/courses/`;

  return fetch(listCoursesUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get course list");
    }

    return response.json();
  });
};

export const searchCourses = (query) => {
  const authToken = localStorage.getItem("authToken");
  const searchCoursesUrl = new URL(`${domain}/course_search/`);
  searchCoursesUrl.searchParams.append("key_words", query.key_words || "");

  return fetch(searchCoursesUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to search courses");
    }

    return response.json();
  });
};

export const deleteCourse = (courseId) => {
  const authToken = localStorage.getItem("authToken");
  const deleteCourseUrl = `${domain}/courses/${courseId}`;

  return fetch(deleteCourseUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to delete course");
    }
  });
};

export const registerCourse = (data) => {
  const authToken = localStorage.getItem("authToken");
  const registerCourseUrl = `${domain}/course_reservations`;

  return fetch(registerCourseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status !== 200) {
      throw Error(
        "Fail to register course. Please check if you have already registered this course."
      );
    }
  });
};

export const cancelReservation = (reservationId) => {
  const authToken = localStorage.getItem("authToken");
  const cancelReservationUrl = `${domain}/course_reservations/${reservationId}`;

  return fetch(cancelReservationUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to cancel registration");
    }
  });
};

export const getReservationsByCourse = (courseId) => {
  const authToken = localStorage.getItem("authToken");
  const getReservationByCourseUrl = `${domain}/course_reservations/${courseId}`;

  return fetch(getReservationByCourseUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to get registrations by course");
    }

    return response.json();
  });
};

export const uploadCourse = (data) => {
  const authToken = localStorage.getItem("authToken");
  const uploadCourseUrl = `${domain}/courses`;

  return fetch(uploadCourseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: data,
  }).then((response) => {
    if (response.status !== 200) {
      throw Error("Fail to upload course");
    }
  });
};
