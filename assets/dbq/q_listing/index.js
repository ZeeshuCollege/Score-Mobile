'use strict';

// var Android = {
//     logMessage: function (message) {
//         console.log(message);
//     },
//     toggleShow: function (toggle) {
//         Android.toast('Toggled: ', toggle);
//     },
//     showToast: function (message) {
//         console.log(message);
//     },
//     onQuestionClick: function (e) {
//         Android.showToast('Question clicked: ', e);
//     },
//     onOptionSelected: function (obj) {
//         Android.showToast('Option selected: ' + obj);
//     },
//     onShowSolutions: function () {
//         Android.showToast('Scrolling down to solution.');
//     },
//     showReport: function () {
//         Android.showToast('Report-question error box opens.');
//     },
// };
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var sortBy = function sortBy(array, order, propertyRetrieverFn) {
  return order.length ? array.sort(function (a, b) {
    return order.indexOf(propertyRetrieverFn(a)) - order.indexOf(propertyRetrieverFn(b));
  }) : array.sort(function (a, b) {
    return propertyRetrieverFn(a) < propertyRetrieverFn(b) ? -1 : propertyRetrieverFn(a) > propertyRetrieverFn(b) ? 1 : 0;
  });
};
var qLabelTypes = {
  // showing topic and concept only on single-question screen, not listing
  // topic: (value) => `Topic: ${value}`,
  // concept: (value) => `Concept: ${value}`,
  pageTextToDisplay: function pageTextToDisplay(value) {
    return "".concat(value);
  },
  paragraphNumber: function paragraphNumber(value) {
    return "Paragraph: ".concat(value);
  }
};
function getFormattedQuestionLabels(questionLabels, order, retrieverFn) {
  var _qLabels;
  var qLabels = [];
  // Condition: isVisible: true + 'title' value matches allowed labels
  questionLabels.forEach(function (label) {
    if (label !== null && label !== void 0 && label.isVisible && qLabelTypes.hasOwnProperty(label === null || label === void 0 ? void 0 : label.title)) qLabels.push(label);
  });
  if (((_qLabels = qLabels) === null || _qLabels === void 0 ? void 0 : _qLabels.length) > 1) {
    // Sort by given order
    qLabels = sortBy(qLabels, order, retrieverFn);
    // Get respective label text, add 'displayText' property to label
    qLabels = qLabels.map(function (el) {
      return _objectSpread(_objectSpread({}, el), {}, {
        displayText: qLabelTypes[el === null || el === void 0 ? void 0 : el.title](el.value)
      });
    });
  }
  return qLabels;
}
function resizeImages(images) {
  var currentScreenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    var imgSize = image.naturalWidth;
    if (imgSize >= currentScreenWidth) {
      console.log('Resized.');
      image.style.height = 'auto';
      image.style.width = '100%';
    }
  }
}
function questionTextResizeAllImages(question) {
  if (question.question.text.includes('<img')) {
    var allQuestionImages = document.querySelectorAll('#questionText img');
    resizeImages(allQuestionImages);
  }
}
function questionSolutionResizeAllImages(question) {
  if (question.solution.text && question.solution.text.includes('<img') || !question.solution.text && question.solution && question.solution.includes('<img')) {
    var allSolutionImages = document.querySelectorAll('.solution-text img');
    resizeImages(allSolutionImages);
  }
}
function questionOptionsResizeAllImages(question) {
  for (var i = 0; i < question.options.length; i++) {
    var opt = question.options[i];
    if (opt.text.includes('<img')) {
      var allOptionImages = document.querySelectorAll('.option-text img');
      resizeImages(allOptionImages);
    }
  }
}
function getQuestionNumber(num) {
  if (Number(num) < 9) return "0".concat(Number(num) + 1);
  return Number(num) + 1;
}
function getQuestionLabels(questionLabels) {
  Android.logMessage("labels ".concat(JSON.stringify(questionLabels)));
  var qLabels = getFormattedQuestionLabels(questionLabels, ['pageTextToDisplay', 'paragraphNumber'], function (obj) {
    return obj === null || obj === void 0 ? void 0 : obj.title;
  });
  var qLabelString = '';
  qLabels.forEach(function (label, index) {
    return qLabelString += "".concat(label.displayText).concat(index !== qLabels.length - 1 ? ', ' : '');
  });
  return qLabelString;
}
function onQuestionClick(index, questionsData) {
  Android.onQuestionClicked("".concat(index));
}
function setTypeset() {
  if (window.MathJax) {
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
}
function setOpacity() {
  var answeredQs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  for (var i = 0; i <= answeredQs.length; i++) {
    var questionClass = document.querySelector(".question-row-".concat(i));
    if (questionClass) questionClass.classList.add('opacity-75');
  }
}
function populateQuestions(questions, theme, filterValue) {
  var body = document.querySelector('body');
  if (theme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');
  var questionsHtml = '';
  for (var i in questions.data) {
    var ques = questions.data[i];
    Android.logMessage("ques: ".concat(JSON.stringify(ques, null, 4)));
    Android.logMessage("i: ".concat(JSON.stringify(i)));
    var qText = ques.question.text.split('</br>').slice(1).join('</br>');
    questionsHtml += "\n            <div\n                class=\"".concat(filterValue === 'all' && ques.isAttempted ? 'opacity-75' : '', " question-row question-row-").concat(i, " mb-4\"\n                onclick=\"onQuestionClick(").concat(i, ")\">\n               <div class=\"question-number\">\n                <p>").concat(getQuestionNumber(i), "</p>\n               </div>\n               <div class=\"question-body\">\n                   <div class=\"question-title\">").concat(qText, "</div>\n                   <p class=\"question-year\">").concat(getQuestionLabels(ques.questionLabels), "</p>\n               </div>\n           </div>\n         ");
    Android.logMessage("questionsHtmlDebug: ".concat(questionsHtml));
  }
  root.innerHTML = questionsHtml;
  setTypeset();
}
// const questions = {
//     data: [
//         {
//             "_id": "65c7caa159d61903e0fdc2ff",
//             "question": {
//                 "text": "<img src=\"https://cdn-question-pool.getmarks.app/modules/dbq/cheas77dtry/HuJE3b6tvo9KOpH1Xp1Kb6m6VQLZNdSMedv43KK3X9403PD0DR.png\"   /></br>select the correct  relative charge of  Proton and neutron ?",
//                 "image": null
//             },
//             "questionLabels": [],
//             "previousYearPapers": [],
//             "type": "singleCorrect",
//             "isAttempted": false
//         },
//         {
//             "_id": "65c7caa159d61903e0fdc300",
//             "question": {
//                 "text": "<img src=\"https://cdn-question-pool.getmarks.app/modules/dbq/cheas77dtry/HuJE3b6tvo9KOpH1Xp1Kb6m6VQLZNdSMedv43KK3X9403PD0DR.png\"   /></br>What is the approx mass/u for proton and neutron ?",
//                 "image": null
//             },
//             "questionLabels": [],
//             "previousYearPapers": [],
//             "type": "singleCorrect",
//             "isAttempted": false
//         },
//         {
//             "_id": "65c7caa159d61903e0fdc301",
//             "question": {
//                 "text": "<img src=\"https://cdn-question-pool.getmarks.app/modules/dbq/cheas77dtry/HuJE3b6tvo9KOpH1Xp1Kb6m6VQLZNdSMedv43KK3X9403PD0DR.png\"   /></br>What is the absolute charge/c of electron , proton and neutron respectively ?",
//                 "image": null
//             },
//             "questionLabels": [],
//             "previousYearPapers": [],
//             "type": "singleCorrect",
//             "isAttempted": false
//         },
//         {
//             "_id": "65c7caa159d61903e0fdc302",
//             "question": {
//                 "text": "<img src=\"https://cdn-question-pool.getmarks.app/modules/dbq/cheas77dtry/HuJE3b6tvo9KOpH1Xp1Kb6m6VQLZNdSMedv43KK3X9403PD0DR.png\"   /></br>If A be the absolute charge of a neutron and B be the absolute mass of a neutron . Find A+B.",
//                 "image": null
//             },
//             "questionLabels": [],
//             "previousYearPapers": [],
//             "type": "singleCorrect",
//             "isAttempted": false
//         }
//     ],
// };
// populateQuestions(questions, 'dark');
// populateQuestions(questions, 'light');