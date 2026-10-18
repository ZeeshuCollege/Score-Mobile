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
    if (screenType === "quick_concepts") attemptStatus = ques.evalStatus || "notAttempted";
    var title = getContentAfterFirstClosingBrTag(ques.question.text);
    questionsHtml += "\n          <div\n              class=\"question-row question-row-".concat(i, "\"\n              onclick=\"onQuestionClick(").concat(i, ")\">\n               <div class=\"question-number\">\n                  <div>").concat(getQuestionNumber(i), "</div>\n                  ").concat(attemptStatus === "correct" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                  <path d=\"M13.5 4.5L6.5 11.5L3 8\" stroke=\"#00A150\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  </svg> " : attemptStatus === "incorrect" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                  <path d=\"M10.6666 5.33337L5.33325 10.6667\" stroke=\"#FD6B6B\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  <path d=\"M10.6666 10.6667L5.33325 5.33337\" stroke=\"#FD6B6B\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  </svg>" : attemptStatus === "partiallyCorrect" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                  <path d=\"M13.5 4.5L6.5 11.5L3 8\" stroke=\"#FACC14\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  </svg>" : "", "\n               </div>\n               <div class=\"question-body\">\n                <h2 class=\"question-title\">").concat(title, "</h2>\n               </div>\n           </div>\n         ");
    Android.logMessage("questionsHtmlDebug: ".concat(questionsHtml));
  }
  root.innerHTML = questionsHtml;
  setTypeset();
}

/* dummy data below for testing */
// const questions = {
//   unattempted_data: [
//     {
//       _id: "66584e581814fc7e94209e22",
//       title:
//         "A sample of calcium carbonate $\\left(\\mathrm{CaCO}_3\\right)$ has the following percentage composition : $\\mathrm{Ca}=40 \\% ; \\mathrm{C}=$ $12 \\% ; O=48 \\%$\nIf the law of constant proportions is true, then the weight of calcium in $4 g$ of a sample of calcium carbonate obtained from another source will be",
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//     {
//       _id: "66584e581814fc7e94209e23",
//       title:
//         "$n g$ of substance $X$ reacts with $m g$ of substance $Y$ to form $p g$ of substance $R$ and $q g$ of substance $S$. This reaction can be represented as, $X+Y=R+S$. The relation which can be established in the amounts of the reactants and the products will be",
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//     {
//       _id: "66584e581814fc7e94209e24",
//       title:
//         "$2.76 \\mathrm{~g}$ of silver carbonate on being strongly heated yield a residue weighing",
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//     {
//       _id: "66584e581814fc7e94209e25",
//       title:
//         "The percentage of $\\mathrm{P}_2 \\mathrm{O}_5$ in diammonium hydrogen phosphate $\\left(\\mathrm{NH}_4\\right)_2 \\mathrm{HPO}_4$ is",
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//     {
//       _id: "66584e581814fc7e94209e26",
//       title:
//         "$\\mathrm{H}_2$ evolved at STP on complete reaction of $27 \\mathrm{~g}$ of Aluminium with excess of aqueous $\\mathrm{NaOH}$ would be",
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//     {
//       _id: "66584e581814fc7e94209e27",
//       title:
//         "Under similar conditions of pressure and temperature, $40 \\mathrm{~m} /$ of slightly moist hydrogen chloride gas is mixed with $20 \\mathrm{~m} /$ of ammonia gas, the final volume of gas at the same temperature and pressure will be",
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//     {
//       _id: "66584e581814fc7e94209e28",
//       title:
//         "A hydrocarbon contains $86 \\%$ carbon, $488 \\mathrm{ml}$ of the hydrocarbon weight $1.68 \\mathrm{~g}$ at STP. Then the hydrocarbon is an",
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//     {
//       _id: "66584e581814fc7e94209e29",
//       title:
//         "The mass of $\\mathrm{BaCO}_3$ produced when excess $\\mathrm{CO}_2$ is bubbled through a solution of $0.205 \\mathrm{~mol}$ $\\mathrm{Ba}(\\mathrm{OH})_2$ is",
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//     {
//       _id: "66584e581814fc7e94209e2a",
//       title:
//         "In the reaction, $4 \\mathrm{NH}_3(\\mathrm{~g})+5 \\mathrm{O}_2(\\mathrm{~g}) \\rightarrow 4 \\mathrm{NO}(\\mathrm{g})+6 \\mathrm{H}_2 \\mathrm{O}(\\mathrm{g})$, When 1 mole of ammonia and 1 mole of $\\mathrm{O}_2$ are made to react to completion",
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//     {
//       _id: "66584e581814fc7e94209e2b",
//       title:
//         '<img src="images/wQNeeh4QsrVM7l8VInYV-CKSFo_kTvObD2sxqcEYeO8.original.fullsize.png"/><br/>',
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//     {
//       _id: "66584e581814fc7e94209e2c",
//       title:
//         "If isobutane and n-butane are present in a gas, then how much oxygen should be required for complete combustion of $5 \\mathrm{~kg}$ of this gas",
//       isAttempted: false,
//       evalStatus: "notAttempted",
//     },
//   ],
//   attempted_data: [
//     {
//       _id: "665850fe1ebdecde60539cb3",
//       title:
//         "You lift a heavy book from the floor of the room and keep it in the book-shelf having a height $2 \\mathrm{~m}$. In this process you take 5 seconds. The work done by you will depend upon",
//       isAttempted: true,
//       evalStatus: "correct",
//     },
//     {
//       _id: "665850fe1ebdecde60539cb4",
//       title:
//         "A force $\\boldsymbol{F}=(5 \\hat{i}+3 \\hat{j})$ mewton is applied over a particle which displaces it from its origin to the point $r=(2 \\hat{i}-1 \\hat{j})$ metres. The work done on the particle is",
//       isAttempted: true,
//       evalStatus: "incorrect",
//     },
//     {
//       _id: "665850fe1ebdecde60539cb5",
//       title:
//         "A force acts on a $30 \\mathrm{gm}$ particle in such a way that the position of the particle as a function of time is given by $x=3 t-4 t^2+t^3$, where $x$ is in metres and $t$ is in seconds. The work done during the first 4 seconds is",
//       isAttempted: true,
//       evalStatus: "incorrect",
//     },
//     {
//       _id: "665850fe1ebdecde60539cb6",
//       title:
//         "A spring $40 \\mathrm{~mm}$ long is stretched by the application of a force. If $10 \\mathrm{~N}$ force required to stretch the spring through 1 $\\mathrm{mm}$, then work done in stretching the spring through $40 \\mathrm{~mm}$ is",
//       isAttempted: true,
//       evalStatus: "incorrect",
//     },
//     {
//       _id: "665850fe1ebdecde60539cb7",
//       title:
//         "$m v^2$\nA body of mass $m$ is moving in a circle of radius $r$ with a constant speed $v$. The force on the body is $\\frac{m v^2}{r}$ and is directed towards the centre. What is the work done by this force in moving the body over half the circumference of the circle",
//       isAttempted: true,
//       evalStatus: "incorrect",
//     },
//   ],
// };

// populateQuestions(
//   { data: questions.attempted_data },
//   "quick_concepts",
//   "light"
// );
// populateQuestions({ data: questions.attempted_data }, "quick_concepts", "light");