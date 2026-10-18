use strict";

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
//   onQuestionClicked: function (e) {
//     console.log(e);
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
      preview: "none",
      processEscapes: true,
      inlineMath: [["$", "$"], ["\\(", "\\)"], ["{tex}", "{/tex}"]]
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
function getContentAfterFirstClosingBrTag() {
  var htmlString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var brTagPosition = htmlString.indexOf("</br>");
  if (brTagPosition === -1) return htmlString;
  var contentAfterBr = htmlString.substring(brTagPosition + 5);
  return contentAfterBr;
}
function populateQuestions(questions, screenType, theme) {
  var filterValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "all";
  if (typeof screenType === "undefined") return Android.logMessage("screenType: undefined");
  var body = document.querySelector("body");
  if (theme === "dark") {
    if (!body.classList.contains("dark_mode")) body.classList.add("dark_mode");
  } else body.classList.remove("dark_mode");
  var questionsHtml = "";
  for (var i in questions.data) {
    var ques = questions.data[i];
    Android.logMessage("ques,i,filterValue: ".concat(JSON.stringify(ques, i, filterValue)));
    var attemptStatus = void 0;
    if (screenType === "quick_concepts") attemptStatus = (ques === null || ques === void 0 ? void 0 : ques.evalStatus) || "notAttempted";
    var title = getContentAfterFirstClosingBrTag(ques.questionId.question.text);
    questionsHtml += "\n          <div\n              class=\"question-row question-row-".concat(i, "\"\n              onclick=\"onQuestionClick(").concat(i, ")\">\n               <div class=\"question-number\">\n                  <div>").concat(getQuestionNumber(i), "</div>\n                  ").concat(attemptStatus === "correct" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                  <path d=\"M13.5 4.5L6.5 11.5L3 8\" stroke=\"#00A150\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  </svg> " : attemptStatus === "incorrect" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                  <path d=\"M10.6666 5.33337L5.33325 10.6667\" stroke=\"#FD6B6B\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  <path d=\"M10.6666 10.6667L5.33325 5.33337\" stroke=\"#FD6B6B\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  </svg>" : attemptStatus === "partiallyCorrect" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                  <path d=\"M13.5 4.5L6.5 11.5L3 8\" stroke=\"#FACC14\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  </svg>" : "", "\n               </div>\n               <div class=\"question-body\">\n                <h2 class=\"question-title\">").concat(title, "</h2>\n               </div>\n           </div>\n         ");
    Android.logMessage("questionsHtmlDebug: ".concat(questionsHtml));
  }
  root.innerHTML = questionsHtml;
  setTypeset();
}

/* dummy data below for testing */
// const questions = [
//   {
//     questionId: {
//       question: {
//         text: "A particle of mass $4 \\mathrm{~m}$ explodes into three pieces of masses $m, m$ and $2 m$. The equal masses move along $\\mathrm{X}$-axis and $\\mathrm{Y}$-axis with velocities $4 \\mathrm{~ms}^{-1}$ and $6 \\mathrm{~ms}^{-1}$ respectively. The magnitude of the velocity of the heavier mass is",
//         image: null,
//       },
//       _id: "61bb206979f9baf37cc8173c",
//     },
//     dppSetId: "66da84715e9d8c9e8bae61d3",
//     level: 1,
//     createdAt: "2024-09-13T00:43:50.451Z",
//     _id: "66e38ac68273faa2c8e62975",
//   },
//   {
//     questionId: {
//       question: {
//         text: "A body of mass $5 \\mathrm{~kg}$ makes an elastic collision with another body at rest and continues to move in the original direction after collision with a velocity equal to $\\frac{1}{10}$ th of its original velocity. Then the mass of the second body is",
//         image: null,
//       },
//       _id: "61bb20690d5d8e9417c4dd53",
//     },
//     dppSetId: "66da84715e9d8c9e8bae61d3",
//     level: 1,
//     createdAt: "2024-09-13T18:58:24.850Z",
//     _id: "66e48b508273faa2c8e66e6b",
//   },
//   {
//     questionId: {
//       question: {
//         text: "A body of mass $2 \\mathrm{~kg}$ moving with velocity of $6 \\mathrm{~m} / \\mathrm{s}$ strikes in elastically with another body of same mass mass at rest. The amount of heat evolved during collision is",
//         image: null,
//       },
//       _id: "61bb206a578792699b53ffba",
//     },
//     dppSetId: "66da84715e9d8c9e8bae61d3",
//     level: 1,
//     createdAt: "2024-09-13T18:58:43.276Z",
//     _id: "66e48b638273faa2c8e6706c",
//   },
//   {
//     questionId: {
//       question: {
//         text: "The principle of conservation of linear momentum can be strictly applied during a collision between two particles provided the time of impact",
//         image: null,
//       },
//       _id: "61bb206aaa3731eeacf46e6d",
//     },
//     dppSetId: "66da84715e9d8c9e8bae61d3",
//     level: 1,
//     createdAt: "2024-09-13T18:58:51.917Z",
//     _id: "66e48b6b8273faa2c8e67246",
//   },
//   {
//     questionId: {
//       question: {
//         text: "A $5000 \\mathrm{~kg}$ rocket is set for vertical firing. The exhaust speed is $800 \\mathrm{~m} / \\mathrm{s}$. To give an initial upward acceleration of $20 \\mathrm{~m} / \\mathrm{s}^{2}$, the amount of gas ejected per second to supply the needed thrust will be (Take $\\mathrm{g}=10 \\mathrm{~m} / \\mathrm{s}^{2}$ )",
//         image: null,
//       },
//       _id: "61bb206a6c00efe6751c98e9",
//     },
//     dppSetId: "66da84715e9d8c9e8bae61d3",
//     level: 1,
//     createdAt: "2024-09-13T18:59:01.852Z",
//     _id: "66e48b758273faa2c8e67425",
//   },
//   {
//     questionId: {
//       question: {
//         text: "A sping balance is adjusted at zero. Elastic collisions are brought about by dropping particles of one gram each on the pan of the balance. They recoil upwards without change is their speeds. If the height of fall of particles is \\( 2 \\) meter and the rate of particle dropping is \\( 100 \\) per seconds, then the reading of the balance is -",
//         image: null,
//       },
//       _id: "6182767e3df30917ff94c0e9",
//     },
//     dppSetId: "66da84715e9d8c9e8bae62cf",
//     level: 2,
//     createdAt: "2024-09-13T19:12:14.975Z",
//     _id: "66e48e8e36ca090aff749cdb",
//   },
// ];

// populateQuestions({ data: questions }, "quick_concepts", "light");