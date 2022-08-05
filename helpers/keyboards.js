const keyboardText = require("./keyboards_text");

const { read } = require("../utils/FS.readWrite");

const allCourses = read("courses.model.json");

const courses = [];

for (let i = 0; i < allCourses.length; i += 2) {
  const arr = [];

  arr.push(
    { text: allCourses[i]?.course },
    allCourses[i + 1] ? { text: allCourses[i + 1].course } : null
  );

  courses.push(arr.filter((e) => e));
}

courses.push([keyboardText.prev]);

module.exports = {
  info: [[keyboardText.courses, keyboardText.location], [keyboardText.aboutUs]],
  courses,
};
