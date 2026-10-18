'use strict';

// var Android = {
//   toggleShow: function (toggle) {
//     Android.toast('Toggled: ', toggle);
//   },
//   showToast: function (message) {
//     console.log(message);
//   },
//   logMessage: function (message) {
//     console.log(message);
//   },
//   onQuestionClick: function (e) {
//     Android.showToast('Question clicked: ', e);
//   },
//   onOptionSelected: function (obj) {
//     Android.showToast('Option selected: ' + obj);
//   },
//   onShowSolutions: function () {
//     Android.showToast('Scrolling down to solution.');
//   },
//   showReport: function () {
//     Android.showToast('Report-question error box opens.');
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
    'HTML-CSS': {
      linebreaks: {
        automatic: true
      }
    },
    SVG: {
      linebreaks: {
        automatic: true
      }
    },
    messageStyle: 'none',
    tex2jax: {
      preview: 'none'
    },
    CommonHTML: {
      linebreaks: {
        automatic: false
      }
    }
  });
  MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
}
function setOpacity() {
  var answeredQs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  for (var i = 0; i <= answeredQs.length; i++) {
    var position = answeredQs[i];
    var questionClass = document.querySelector(".question-row-".concat(position));
    if (questionClass) questionClass.classList.add('opacity-75');
  }
}

function getContentAfterFirstClosingBrTag() {
  var htmlString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var brTagPosition = htmlString.indexOf("</br>");
  if (brTagPosition === -1) return htmlString;
  var contentAfterBr = htmlString.substring(brTagPosition + 5);
  return contentAfterBr;
}

function populateQuestions(questions, screenType, theme,filterValue = 'all') {
  var filterValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'all';
  if (typeof screenType === 'undefined') return Android.logMessage("screenType: undefined");
  var body = document.querySelector('body');
  if (theme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');
  var questionsHtml = "";
  for (var i in questions.data) {
    var ques = questions.data[i];
//    Android.logMessage("ques,i,filterValue: ".concat(JSON.stringify(ques, i, filterValue)));
    var attemptStatus = void 0;
    if (screenType === 'quick_concepts') attemptStatus = ques.evalStatus || 'notAttempted';
var title = getContentAfterFirstClosingBrTag(ques.title);
    questionsHtml += "\n          <div\n              class=\"question-row question-row-".concat(i, "\"\n              onclick=\"onQuestionClick(").concat(i, ")\">\n               <div class=\"question-number\">\n                  <div>").concat(getQuestionNumber(i), "</div>\n                  ").concat(attemptStatus === "correct" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                  <path d=\"M13.5 4.5L6.5 11.5L3 8\" stroke=\"#00A150\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  </svg> " : attemptStatus === "incorrect" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                  <path d=\"M10.6666 5.33337L5.33325 10.6667\" stroke=\"#FD6B6B\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  <path d=\"M10.6666 10.6667L5.33325 5.33337\" stroke=\"#FD6B6B\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  </svg>" : attemptStatus === "partiallyCorrect" ? "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                  <path d=\"M13.5 4.5L6.5 11.5L3 8\" stroke=\"#FACC14\" stroke-width=\"1.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                  </svg>" : "", "\n               </div>\n               <div class=\"question-body\">\n                <h2 class=\"question-title\">").concat(title, "</h2>\n               </div>\n           </div>\n         ");
//    Android.logMessage("questionsHtmlDebug: ".concat(questionsHtml));
  }

  root.innerHTML = questionsHtml;
  setTypeset();
}

/* dummy data below for testing */
// const questions = {
//   "data": [
//     {
//       "_id": "648b5a71417cc3fb48d685a4",
//       "title": "Topic 1",
//       "isAttempted": true,
//       "evalStatus": "incorrect"
//     },
//     {
//       "_id": "648b5a71417cc3fb48d68711",
//       "title": "Topic 2",
//       "isAttempted": true,
//       "evalStatus": "correct"
//     },
//     {
//       "_id": "6120dea1b72eab7ee718cff2",
//       "title": "Topic 3",
//       "isAttempted": false,
//       "evalStatus": "notAttempted"
//     }
//   ]
// };

// populateQuestions(questions, 'quick_concepts', 'dark');
// populateQuestions(questions, 'quick_concepts', 'light');