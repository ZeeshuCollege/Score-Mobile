"use strict";

// var Android = {
//   toggleShow: function (toggle) {
//     Android.toast("Toggled: ", toggle);
//   },
//   showToast: function (message) {
//     console.log(message);
//   },
//   logMessage: function (message) {
//     console.log(message);
//   },
//   onQuestionClick: function (e) {
//     Android.showToast("Question clicked: ", e);
//   },
//   onOptionSelected: function (obj) {
//     Android.showToast("Option selected: " + obj);
//   },
//   onShowSolutions: function () {
//     Android.showToast("Scrolling down to solution.");
//   },
//   showReport: function () {
//     Android.showToast("Report-question error box opens.");
//   },
// };

/*Above Android object, only for testing purposes.*/
function resizeImages(images) {
  var currentScreenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    var imgSize = image.naturalWidth;
    if (imgSize >= currentScreenWidth) {
      console.log("Resized.");
      image.style.height = "auto";
      image.style.width = "100%";
    }
  }
}
function questionTextResizeAllImages(question) {
  if (question.question.text.includes("<img")) {
    var allQuestionImages = document.querySelectorAll("#questionText img");
    resizeImages(allQuestionImages);
  }
}
function questionSolutionResizeAllImages(question) {
  if (question.solution.text && question.solution.text.includes("<img") || !question.solution.text && question.solution && question.solution.includes("<img")) {
    var allSolutionImages = document.querySelectorAll(".solution-text img");
    resizeImages(allSolutionImages);
  }
}
function questionOptionsResizeAllImages(question) {
  for (var i = 0; i < question.options.length; i++) {
    var opt = question.options[i];
    if (opt.text.includes("<img")) {
      var allOptionImages = document.querySelectorAll(".option-text img");
      resizeImages(allOptionImages);
    }
  }
}
function getQuestionNumber(num) {
  if (Number(num) < 9) return "0".concat(Number(num) + 1);
  return Number(num) + 1;
}
function onQuestionClick(index, questionsData) {
  Android.onQuestionClicked("".concat(index));
}
function setTypeset() {
  MathJax.Hub.Config({
    "HTML-CSS": {
      linebreaks: {
        automatic: true
      }
    },
    SVG: {
      linebreaks: {
        automatic: true
      }
    },
    messageStyle: "none",
    tex2jax: {
      preview: "none"
    },
    CommonHTML: {
      linebreaks: {
        automatic: false
      }
    }
  });
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
function setOpacity() {
  var answeredQs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  for (var i = 0; i <= answeredQs.length; i++) {
    var position = answeredQs[i];
    var questionClass = document.querySelector(".question-row-".concat(position));
    if (questionClass) questionClass.classList.add("opacity-75");
  }
}
function populateQuestions(questions, theme, filterValue) {
  var body = document.querySelector("body");
  if (theme === "dark") {
    if (!body.classList.contains("dark_mode")) body.classList.add("dark_mode");
  } else body.classList.remove("dark_mode");
  var questionsHtml = "";
  Android.logMessage("overall screen: ".concat(JSON.stringify(questions.exams)));
  for (var i in questions.data) {
    var ques = questions.data[i];
    Android.logMessage("overall screen: ".concat(JSON.stringify(ques.exams)));
    Android.logMessage("ques: ".concat(JSON.stringify(ques, null, 4)));
    Android.logMessage("i: ".concat(JSON.stringify(i)));
    Android.logMessage("filter: ".concat(filterValue));
    var quesLastAttemptStatus = (ques === null || ques === void 0 ? void 0 : ques.evalStatus) || "notAttempted";
    console.log({
      quesLastAttemptStatus: quesLastAttemptStatus,
      staus: ques.evalStatus,
      theme: theme
    });
    questionsHtml += "\n          <div\n              class=\"".concat(filterValue === "all" && ques.isAttempted ? "opacity-75" : "", "\n              question-row question-row-").concat(i, " mb-4\"\n              onclick=\"onQuestionClick(").concat(i, ")\">\n               <div class=\"question-number\">\n                <p>").concat(getQuestionNumber(i), "</p>\n                ").concat(quesLastAttemptStatus === "correct" ? "<img src=\"../assets/svg/GreenTick.svg\" />" : quesLastAttemptStatus === "incorrect" ? "<img src=\"../assets/svg/RedCross.svg\" />" : "", "\n               </div>\n               <div class=\"question-body question-title\">\n                ").concat(ques.title.text, "\n               </div>\n           </div>\n         ");
    Android.logMessage("questionsHtmlDebug: ".concat(questionsHtml));
  }
  root.innerHTML = questionsHtml;
  setTypeset();
}
/* dummy data below for testing */
// const questions = [
//   {
//     _id: "64b16a53f23ac7d519f9b363",
//     isAttempted: true,
//     evalStatus: "partiallyCorrect",
//     lastPractised: "2024-12-10T09:09:48.695Z",
//     title: {
//       text: 'In an experiment to determine the acceleration due to gravity g, the formula used for the time period of a periodic motion is <math><mi>T</mi><mo>=</mo><mn>2</mn><mi>&#960;</mi><msqrt><mfrac><mrow><mn>7</mn><mfenced separators="|"><mrow><mi>R</mi><mo>-</mo><mi>r</mi></mrow></mfenced></mrow><mrow><mn>5</mn><mi>g</mi></mrow></mfrac></msqrt><mo>.</mo></math> The values of R and r are measured to be <math><mfenced separators="|"><mrow><mn>60</mn><mo>&#177;</mo><mn>1</mn></mrow></mfenced><mi>&#160;</mi><mi>m</mi><mi>m</mi><mi>&#160;</mi><mi>a</mi><mi>n</mi><mi>d</mi><mi>&#160;</mi><mfenced separators="|"><mrow><mn>10</mn><mo>&#177;</mo><mn>1</mn></mrow></mfenced><mi>m</mi><mi>m</mi><mo>,</mo><mi>&#160;</mi></math> respectively. In five successive measurements, the time period is found to be 0.52s, 0.56s, 0.57s, 0.54s and 0.59s. The least count of the watch used for the measurement of time period is 0.01s. Which of the following statements (s) is (are) true?',
//       image: null,
//     },
//     questionType: "multipleCorrect",
//     level: 2,
//   },
//   {
//     _id: "648b5a71417cc3fb48d68711",
//     isAttempted: false,
//     evalStatus: "correct",
//     lastPractised: "2024-09-17T04:50:42.223Z",
//     title: {
//       text: 'A vector in <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi><mo>-</mo><mi>y</mi></math>&nbsp;plane makes an angle of <math xmlns="http://www.w3.org/1998/Math/MathML"><msup><mn>30</mn><mi mathvariant="normal">o</mi></msup></math> with <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>y</mi></math>-axis. The magnitude of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>y</mi></math>-component of vector is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><msqrt><mn>3</mn></msqrt></math>. The magnitude of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>-component of the vector will be :',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a71417cc3fb48d68604",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-03-04T17:16:13.722Z",
//     title: {
//       text: '<p>Three forces <math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>F</mi><mn>1</mn></msub><mo>=</mo><mn>10</mn><mo>&#160;</mo><mi mathvariant="normal">N</mi><mo>,</mo><mo>&#160;</mo><msub><mi>F</mi><mn>2</mn></msub><mo>=</mo><mn>8</mn><mo>&#160;</mo><mi mathvariant="normal">N</mi><mo>,</mo><mo>&#160;</mo><msub><mi>F</mi><mn>3</mn></msub><mo>=</mo><mn>6</mn><mo>&#160;</mo><mi mathvariant="normal">N</mi></math> are acting on a particle of mass <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>5</mn><mo>&#160;</mo><mi>kg</mi></math>. The forces <math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>F</mi><mn>2</mn></msub></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>F</mi><mn>3</mn></msub></math> are applied perpendicularly so that particle remains at rest. If the force <math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>F</mi><mn>1</mn></msub></math> is removed, then the acceleration of the particle is</p>',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a71417cc3fb48d685a4",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-09-17T04:50:33.131Z",
//     title: {
//       text: 'When vector <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>A</mi><mo>&#8594;</mo></mover><mo>=</mo><mn>2</mn><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>3</mn><mover><mi>j</mi><mo>^</mo></mover><mo>+</mo><mn>2</mn><mover><mi>k</mi><mo>^</mo></mover></math> is subtracted from vector <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>B</mi><mo>&#8594;</mo></mover></math>, it gives a vector equal to <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mover><mi>j</mi><mo>^</mo></mover></math>. Then the magnitude of vector&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>B</mi><mo>&#8594;</mo></mover></math>&nbsp;will be:',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a70417cc3fb48d68490",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-04-19T06:44:43.865Z",
//     title: {
//       text: 'A physical quantity <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>P</mi></math> is given as&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>P</mi><mo>=</mo><mfrac><mrow><msup><mi>a</mi><mn>2</mn></msup><msup><mi>b</mi><mn>3</mn></msup></mrow><mrow><mi>c</mi><msqrt><mi>d</mi></msqrt></mrow></mfrac></math>.&nbsp;The percentage error in the measurement of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><mo>,</mo><mo>&#160;</mo><mi>b</mi><mo>,</mo><mo>&#160;</mo><mi>c</mi></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>d</mi></math> are <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>%</mo><mo>,</mo><mo>&#160;</mo><mn>2</mn><mo>%</mo><mo>,</mo><mo>&#160;</mo><mn>3</mn><mo>%</mo></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>4</mn><mo>%</mo></math> respectively. The percentage error in the measurement of quantity <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>P</mi></math> will be',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a70417cc3fb48d683e0",
//     isAttempted: true,
//     evalStatus: "correct",
//     lastPractised: "2024-09-17T04:50:24.936Z",
//     title: {
//       text: 'A cylindrical wire of mass<math xmlns="http://www.w3.org/1998/Math/MathML"><mo>&#160;</mo><mo>(</mo><mn>0</mn><mo>.</mo><mn>4</mn><mo>&#160;</mo><mo>&#177;</mo><mo>&#160;</mo><mn>0</mn><mo>.</mo><mn>01</mn><mo>)</mo><mo>&#160;</mo><mi mathvariant="normal">g</mi></math> has length <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>(</mo><mn>8</mn><mo>&#160;</mo><mo>&#177;</mo><mo>&#160;</mo><mn>0</mn><mo>.</mo><mn>04</mn><mo>)</mo><mo>&#160;</mo><mi>cm</mi></math> and radius <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>(</mo><mn>6</mn><mo>&#160;</mo><mo>&#177;</mo><mo>&#160;</mo><mn>0</mn><mo>.</mo><mn>03</mn><mo>)</mo><mo>&#160;</mo><mi>mm</mi></math>. The maximum error in its density will be',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 2,
//   },
//   {
//     _id: "648b5a70417cc3fb48d683ea",
//     isAttempted: true,
//     evalStatus: "correct",
//     lastPractised: "2024-04-09T07:36:55.769Z",
//     title: {
//       text: 'Two forces having magnitude <math xmlns="http://www.w3.org/1998/Math/MathML"><mi mathvariant="normal">A</mi></math>&nbsp;and <math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mi mathvariant="normal">A</mi><mn>2</mn></mfrac></math>&nbsp;are perpendicular to each other. The magnitude of their resultant is:',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a70417cc3fb48d68330",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-09-17T04:50:13.356Z",
//     title: {
//       text: '<p>Two resistance are given as <math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>R</mi><mn>1</mn></msub><mo>=</mo><mo>(</mo><mn>10</mn><mo>&#177;</mo><mn>0</mn><mo>.</mo><mn>5</mn><mo>)</mo><mo>&#160;</mo><mi mathvariant="normal">&#937;</mi></math>&nbsp;and <math xmlns="http://www.w3.org/1998/Math/MathML"><msub><mi>R</mi><mn>2</mn></msub><mo>=</mo><mo>(</mo><mn>15</mn><mo>&#177;</mo><mn>0</mn><mo>.</mo><mn>5</mn><mo>)</mo><mo>&#160;</mo><mi mathvariant="normal">&#937;</mi><mo>.</mo></math> The percentage error in the measurement of equivalent resistance when they are connected in parallel is</p>',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 2,
//   },
//   {
//     _id: "648b5a70417cc3fb48d68343",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-09-17T04:50:19.443Z",
//     title: {
//       text: '<p>The length of a metallic wire is increased by <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>20</mn><mo>%</mo></math> and its area of cross-section is reduced by <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>4</mn><mo>%</mo><mo>.</mo></math> The percentage change in resistance of the metallic wire is&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>_</mi><mi>_</mi><mi>_</mi><mi>_</mi><mi>_</mi><mi>_</mi><mi>_</mi><mi>_</mi><mo>.</mo></math></p>',
//       image: null,
//     },
//     questionType: "numerical",
//     level: 2,
//   },
//   {
//     _id: "648b5a70417cc3fb48d682d3",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-03-07T13:01:20.395Z",
//     title: {
//       text: 'A body is moving with constant speed, in a circle of radius <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>10</mn><mo>&#160;</mo><mi mathvariant="normal">m</mi></math>. The body completes one revolution in <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>4</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math>. At the end of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn><mi>r</mi><mi>d</mi></math> second, the displacement of body (in <math xmlns="http://www.w3.org/1998/Math/MathML"><mi mathvariant="normal">m</mi></math>) from its starting point is:',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a6f417cc3fb48d6817d",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-04-18T17:58:07.787Z",
//     title: {
//       text: 'In an experiment of measuring the refractive index of a glass slab using travelling microscope in physics lab, a student measures real thickness of the glass slab as <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>5</mn><mo>.</mo><mn>25</mn><mo>&#160;</mo><mi>mm</mi></math> and apparent thickness of the glass slab at <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>5</mn><mo>.</mo><mn>00</mn><mo>&#160;</mo><mi>mm</mi></math>. Travelling microscope has <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>20</mn></math> divisions in one <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>cm</mi></math> on main scale and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>50</mn></math> divisions on Vernier scale is equal to <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>49</mn></math> divisions on main scale. The estimated uncertainty in the measurement of refractive index of the slab is&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mi>x</mi><mn>10</mn></mfrac><mo>&#215;</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>3</mn></mrow></msup></math>, where&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>&nbsp;is ______',
//       image: null,
//     },
//     questionType: "numerical",
//     level: 3,
//   },
//   {
//     _id: "648b5a6f417cc3fb48d68071",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-09-17T04:50:07.922Z",
//     title: {
//       text: 'If <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>P</mi><mo>&#8594;</mo></mover><mo>=</mo><mn>3</mn><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover><mo>+</mo><msqrt><mn>3</mn></msqrt><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>+</mo><mn>2</mn><mover><mi mathvariant="normal">k</mi><mo>^</mo></mover></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>Q</mi><mo>&#8594;</mo></mover><mo>=</mo><mn>4</mn><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover><mo>+</mo><msqrt><mn>3</mn></msqrt><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>+</mo><mn>2</mn><mo>.</mo><mn>5</mn><mover><mi mathvariant="normal">k</mi><mo>^</mo></mover></math>&nbsp; then, the unit vector in the direction of <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>P</mi><mo>&#8594;</mo></mover><mo>&#215;</mo><mover><mi>Q</mi><mo>&#8594;</mo></mover></math> is <math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>1</mn><mi>x</mi></mfrac><mo>(</mo><msqrt><mn>3</mn></msqrt><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover><mo>+</mo><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>-</mo><mn>2</mn><msqrt><mn>3</mn></msqrt><mover><mi mathvariant="normal">k</mi><mo>^</mo></mover><mo>)</mo></math>. The value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math> is',
//       image: null,
//     },
//     questionType: "numerical",
//     level: 1,
//   },
//   {
//     _id: "648b5a6f417cc3fb48d68008",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-09-17T04:50:00.163Z",
//     title: {
//       text: 'If two vectors&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>P</mi><mo>&#8594;</mo></mover><mo>=</mo><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover><mo>+</mo><mn>2</mn><mi>m</mi><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>+</mo><mi>m</mi><mover><mi mathvariant="normal">k</mi><mo>^</mo></mover></math>&nbsp; and&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>Q</mi><mo>&#8594;</mo></mover><mo>=</mo><mn>4</mn><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover><mo>-</mo><mn>2</mn><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>+</mo><mi>m</mi><mover><mi mathvariant="normal">k</mi><mo>^</mo></mover></math>&nbsp; are perpendicular to each other. Then, the value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>m</mi></math> will be&nbsp;',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a6f417cc3fb48d67fbc",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2023-10-26T09:08:33.215Z",
//     title: {
//       text: 'Vectors <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mi>b</mi><mover><mi>j</mi><mo>^</mo></mover><mo>+</mo><mover><mi>k</mi><mo>^</mo></mover></math>&nbsp;and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mover><mi>i</mi><mo>^</mo></mover><mo>-</mo><mn>3</mn><mover><mi>j</mi><mo>^</mo></mover><mo>+</mo><mn>4</mn><mover><mi>k</mi><mo>^</mo></mover></math>&nbsp;are perpendicular to each other when <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn><mi>a</mi><mo>+</mo><mn>2</mn><mi>b</mi><mo>=</mo><mn>7</mn></math>, the ratio of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi></math> to <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>b</mi></math> is <math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mi>x</mi><mn>2</mn></mfrac></math>. The value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math> is _____.',
//       image: null,
//     },
//     questionType: "numerical",
//     level: 1,
//   },
//   {
//     _id: "648b5a6d417cc3fb48d67c96",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2023-08-25T13:40:17.472Z",
//     title: {
//       text: 'In an experiment to find acceleration due to gravity <math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced><mi>g</mi></mfenced></math> using simple pendulum, time period of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>5</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math> is measured from time of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>100</mn></math> oscillation with a watch of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math> resolution. If measured value of length is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>10</mn><mo>&#160;</mo><mi>cm</mi></math> known to <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi>mm</mi></math>&nbsp;accuracy. The accuracy in the determination of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>g</mi></math> is found to be <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi><mo>%</mo></math>. The value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math> is',
//       image: null,
//     },
//     questionType: "numerical",
//     level: 2,
//   },
//   {
//     _id: "648b5a6d417cc3fb48d67c33",
//     isAttempted: true,
//     evalStatus: "correct",
//     lastPractised: "2024-09-17T04:49:54.432Z",
//     title: {
//       text: 'If the projection of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>4</mn><mover><mi>j</mi><mo>^</mo></mover><mo>-</mo><mn>2</mn><mover><mi>k</mi><mo>^</mo></mover></math> on <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>2</mn><mover><mi>j</mi><mo>^</mo></mover><mo>+</mo><mi>&#945;</mi><mover><mi>k</mi><mo>^</mo></mover></math> is zero. Then, the value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#945;</mi></math> will be',
//       image: null,
//     },
//     questionType: "numerical",
//     level: 1,
//   },
//   {
//     _id: "648b5a6d417cc3fb48d67ab7",
//     isAttempted: true,
//     evalStatus: "correct",
//     lastPractised: "2024-09-17T04:49:48.655Z",
//     title: {
//       text: 'A torque meter is calibrated to reference standards of mass, length and time each with <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>5</mn><mo>%</mo></math> accuracy. After calibration, the measured torque with this torque meter will have net accuracy of&nbsp;',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a6d417cc3fb48d679bd",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2023-10-26T09:08:47.231Z",
//     title: {
//       text: 'If <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>A</mi><mo>&#8594;</mo></mover><mo>=</mo><mfenced><mrow><mn>2</mn><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover><mo>+</mo><mn>3</mn><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>-</mo><mover><mi mathvariant="normal">k</mi><mo>^</mo></mover></mrow></mfenced><mo>&#160;</mo><mi mathvariant="normal">m</mi></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>B</mi><mo>&#8594;</mo></mover><mo>=</mo><mfenced><mrow><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover><mo>+</mo><mn>2</mn><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>+</mo><mn>2</mn><mover><mi mathvariant="normal">k</mi><mo>^</mo></mover></mrow></mfenced><mo>&#160;</mo><mi mathvariant="normal">m</mi></math>. The magnitude of component of vector <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>A</mi><mo>&#8594;</mo></mover></math> along vector <math xmlns="http://www.w3.org/1998/Math/MathML"><mover accent="true"><mi>B</mi><mo>&#8594;</mo></mover></math> will be _____&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi mathvariant="normal">m</mi></math>.',
//       image: null,
//     },
//     questionType: "numerical",
//     level: 1,
//   },
//   {
//     _id: "648b5a6c417cc3fb48d67965",
//     isAttempted: true,
//     evalStatus: "correct",
//     lastPractised: "2023-10-26T09:08:52.486Z",
//     title: {
//       text: 'In an experiment of determine the Young&#39;s modulus of wire of a length exactly <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">m</mi></math>, the extension in the length of the wire is measured as <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>4</mn><mo>&#160;</mo><mi>mm</mi></math> with an uncertainty of <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>&#177;</mo><mn>0</mn><mo>.</mo><mn>02</mn><mo>&#160;</mo><mi>mm</mi></math> when a load of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi>kg</mi></math> is applied. The diameter of the wire is measured as <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>4</mn><mo>&#160;</mo><mi>mm</mi></math> with an uncertainty of <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>&#177;</mo><mn>0</mn><mo>.</mo><mn>01</mn><mo>&#160;</mo><mi>mm</mi></math>. The error in the measurement of Young&#39;s modulus <math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced><mrow><mi>&#916;</mi><mi mathvariant="normal">Y</mi></mrow></mfenced></math> is found to be <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi><mo>&#215;</mo><msup><mn>10</mn><mn>10</mn></msup><mo>&#160;</mo><mi mathvariant="normal">N</mi><mo>&#160;</mo><msup><mi mathvariant="normal">m</mi><mrow><mo>-</mo><mn>2</mn></mrow></msup></math>. The value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math> is _____ .',
//       image: null,
//     },
//     questionType: "numerical",
//     level: 2,
//   },
//   {
//     _id: "648b5a6c417cc3fb48d67853",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2023-10-03T10:27:41.966Z",
//     title: {
//       text: 'The maximum error in the measurement of resistance, current and time for which current flows in an electrical circuit are <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>%</mo><mo>,</mo><mn>2</mn><mo>%</mo></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn><mo>%</mo></math> respectively. The maximum percentage error in the detection of the dissipated heat will be:',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a6c417cc3fb48d677e9",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-09-17T04:49:30.605Z",
//     title: {
//       text: '<p>A person moved from <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>A</mi></math>&nbsp;to <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>B</mi></math> on a circular path as shown in figure. If the distance travelled by him is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>60</mn><mo>&#160;</mo><mi mathvariant="normal">m</mi></math>, then the magnitude of displacement would be : (Given <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>cos</mi><mn>135</mn><mo>&#176;</mo><mo>=</mo><mo>-</mo><mn>0</mn><mo>.</mo><mn>7</mn></math>)</p><p><img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/63bb7d82cb755babaefa1a6c.jpg" style="width: 130px; height: 118px;" /></p>',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a6e417cc3fb48d67e47",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-04-23T05:59:34.891Z",
//     title: {
//       text: 'Two vectors <math xmlns="http://www.w3.org/1998/Math/MathML"><mover accent="true"><mi>A</mi><mo>&#8594;</mo></mover></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mover accent="true"><mi>B</mi><mo>&#8594;</mo></mover></math> have equal magnitudes. If magnitude of <math xmlns="http://www.w3.org/1998/Math/MathML"><mover accent="true"><mi>A</mi><mo>&#8594;</mo></mover><mo>+</mo><mover accent="true"><mi>B</mi><mo>&#8594;</mo></mover></math> is equal to two times the magnitude of <math xmlns="http://www.w3.org/1998/Math/MathML"><mover accent="true"><mi>A</mi><mo>&#8594;</mo></mover><mo>-</mo><mover accent="true"><mi>B</mi><mo>&#8594;</mo></mover></math>, then the angle between <math xmlns="http://www.w3.org/1998/Math/MathML"><mover accent="true"><mi>A</mi><mo>&#8594;</mo></mover></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mover accent="true"><mi>B</mi><mo>&#8594;</mo></mover></math>&nbsp;will be&nbsp;',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     questionType: "singleCorrect",
//     level: 1,
//   },
//   {
//     _id: "648b5a6d417cc3fb48d67bc6",
//     isAttempted: true,
//     evalStatus: "correct",
//     lastPractised: "2023-08-08T09:19:28.766Z",
//     title: {
//       text: 'The distance of the Sun from earth is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>.</mo><mn>5</mn><mo>&#215;</mo><msup><mn>10</mn><mn>11</mn></msup><mo>&#160;</mo><mi mathvariant="normal">m</mi></math> and its angular diameter is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2000</mn><mo>\'\'</mo></math> when observed from the earth. The diameter of the Sun will be',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 2,
//   },
//   {
//     _id: "648b5a6d417cc3fb48d67b6d",
//     isAttempted: true,
//     evalStatus: "correct",
//     lastPractised: "2023-08-08T09:19:44.902Z",
//     title: {
//       text: 'A silver wire has a mass <math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced><mrow><mn>0</mn><mo>.</mo><mn>6</mn><mo>&#177;</mo><mn>0</mn><mo>.</mo><mn>006</mn></mrow></mfenced><mi mathvariant="normal">g</mi></math>, radius <math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced><mrow><mn>0</mn><mo>.</mo><mn>5</mn><mo>&#177;</mo><mn>0</mn><mo>.</mo><mn>005</mn></mrow></mfenced><mi>mm</mi></math>&nbsp;and length <math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced><mrow><mn>4</mn><mo>&#177;</mo><mn>0</mn><mo>.</mo><mn>04</mn></mrow></mfenced><mi>cm</mi></math>. The maximum percentage error in the measurement of its density will be',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 2,
//   },
//   {
//     _id: "648b5a6c417cc3fb48d67909",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2023-08-08T09:19:57.453Z",
//     title: {
//       text: 'For <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>z</mi><mo>=</mo><msup><mi>a</mi><mn>2</mn></msup><msup><mi>x</mi><mn>3</mn></msup><msup><mi>y</mi><mfrac><mn>1</mn><mn>2</mn></mfrac></msup></math>, where &#39;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi></math>&#39; is a constant. If percentage error in measurement of&nbsp; &#39;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>&#39; and &#39;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>y</mi></math>&#39; are <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>4</mn><mo>%</mo></math>and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>12</mn><mo>%</mo></math>, respectively, then the percentage error for &#39;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>z</mi></math>&#39; will be _____<math xmlns="http://www.w3.org/1998/Math/MathML"><mo>%</mo></math>.',
//       image: null,
//     },
//     questionType: "numerical",
//     level: 1,
//   },
//   {
//     _id: "648b5a6c417cc3fb48d6789b",
//     isAttempted: true,
//     evalStatus: "incorrect",
//     lastPractised: "2024-09-17T04:49:36.342Z",
//     title: {
//       text: 'If <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>Z</mi><mo>=</mo><mfrac><mrow><msup><mi>A</mi><mn>2</mn></msup><msup><mi>B</mi><mn>3</mn></msup></mrow><msup><mi>C</mi><mn>4</mn></msup></mfrac></math>, then the relative error in <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>Z</mi></math>&nbsp;will be&nbsp;',
//       image: null,
//     },
//     questionType: "singleCorrect",
//     level: 1,
//   },
// ];

/* main function */
// populateQuestions({ data: questions }, "light");
// populateQuestions({ data: questions }, "dark");
