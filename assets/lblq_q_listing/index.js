'use strict';

// var Android = {
//   toggleShow: function (toggle) {
//     Android.toast('Toggled: ', toggle);
//   },
//   showToast: function (message) {
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
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
// not using this:
// function getYears(years, questionLabels, screenType, screenLabels) {
//   screenType = typeof screenType !== 'undefined' ? screenType : 'question';
//   screenLabels = typeof screenLabels !== 'undefined' ? screenLabels : [];
//   Android.logMessage(`labels years ${JSON.stringify(years)}`);
//   Android.logMessage(`labels ${JSON.stringify(questionLabels)}`);
//   let labels = [];
//   if (screenType === 'notebookListing') {
//     labels = screenLabels;
//   }
//   if (years.length > 0) {
//     if (years.length <= 1) {
//       labels.push(years[0].title);
//     } else {
//       for (let i = 0; i < years.length; i++) {
//         labels.push(years[i].title);
//       }
//     }
//   } else if (questionLabels && questionLabels.length > 0) {
//     let filteredLabels = [];
//     for (let i = 0; i < questionLabels.length; i++) {
//       const label = questionLabels[i];
//       if (label.isVisible) {
//         filteredLabels.push(label);
//       }
//     }
//     if (filteredLabels && filteredLabels.length > 0) {
//       labels.push(`${filteredLabels[0].title} ${filteredLabels[0].value}`);
//     } else {
//       return '';
//     }
//   }

//   return labels.join(', ');
// }
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
    questionsHtml += "\n            <div\n                class=\"".concat(filterValue === 'all' && ques.isAttempted ? 'opacity-75' : '', " question-row question-row-").concat(i, " mb-4\"\n                onclick=\"onQuestionClick(").concat(i, ")\">\n               <div class=\"question-number\">\n                <p>").concat(getQuestionNumber(i), "</p>\n               </div>\n               <div class=\"question-body\">\n                   <div class=\"question-title\">").concat(ques.question.text, "</div>\n                   <p class=\"question-year\">").concat(getQuestionLabels(ques.questionLabels), "</p>\n               </div>\n           </div>\n         ");
    Android.logMessage("questionsHtmlDebug: ".concat(questionsHtml));
  }
  root.innerHTML = questionsHtml;
  setTypeset();
}
// const questions = {
//   data: [
//     {
//       _id: '64188b5800f7ce4cdacb0a59',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Secondary Growth',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Secondary Growth in Dicot Stem',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '4',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 96',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What is the function of the suberin deposition in the cell wall of cork?',
//         image: null,
//       },
//       isAttempted: true,
//     },
//     {
//       _id: '64188b58032489e8e597403c',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Permanent Tissues',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '1',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 87',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'Which of the following best describes the function of sclerenchyma in plants?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b58045329562c7a98cc',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Anatomy of Plant Parts',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Internal Structure of Monocotyledon Root',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '2',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 93',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What is the characteristic of the vascular bundles in monocot stem?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5804f927138cda9021',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Meristematic Tissues',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '1',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 85',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What do cells "left behind" from the shoot apical meristem constitute in the formation of leaves and elongation of stem?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5805bdfdcf48b8d433',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Anatomy of Plant Parts',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Internal Structure of Dicotyledon Root',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '1',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 91',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'Casparian strips are found on?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5807ea9c856989aebc',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Permanent Tissues',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '3',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 87',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What type of substances do vessel cells store in the form of starch or fat?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b580963beb67d8c1044',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Permanent Tissues',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '3',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 86',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'In which layers of dicotyledonous plants is collenchyma found?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b580f5675234c2ba075',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Anatomy of Plant Parts',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Internal Structure of Dicot Stem',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '1',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 92',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What is the outermost layer of a typical young dicotyledonous stem?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b580fc446d21816ef1f',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Permanent Tissues',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '3',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 87',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What is the function of xylem in plants?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b58107cc9e0aaf76904',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Anatomy of Plant Parts',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Internal Structure of Dicotyledon Root',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '3',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 90',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What is the outermost layer of a dicot root ?',
//         image: null,
//       },
//       isAttempted: true,
//     },
//     {
//       _id: '64188b58115de60f363d6db8',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Tissue System',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '2',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 88',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What are the three types of tissue systems on the basis of their structure and location?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5812a4735996d028ce',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Secondary Growth',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Secondary Growth in Dicot Root',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '1',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 98',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'Which type of plant typically shows secondary growth?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5813bedc5a65c3dae3',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Tissue System',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '3',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 89',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What is the ground tissue in leaves called?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5814d576307bbce54d',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Tissue System',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '2',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 89',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What are the types of epidermal hairs found on the stem of a plant?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5816408013f5ca798e',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Permanent Tissues',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '1',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 88',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'Which of the following statements about phloem parenchyma is true?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b581892e61d4f3bb35a',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Anatomy of Plant Parts',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Internal Structure of Dorsiventral Leaves',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '3',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 93',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'Which type of leaf venation is characterized by varying thickness of veins?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5818adad6cbaeaf844',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Permanent Tissues',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '1',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 88',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What controls the functions of sieve tubes?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5819ba333628bde1a3',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Permanent Tissues',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'General Characters',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '3',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 87',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What are the four different elements that compose xylem in plants?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b581b2bc207c1c642f3',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Anatomy of Plant Parts',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Internal Structure of Dicotyledon Root',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '1',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 91',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'Where does the initiation of lateral roots and vascular cambium take place during secondary growth?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b581dfb461a6864e168',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Anatomy of Plant Parts',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Internal Structure of Dicotyledon Root',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '3',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 90',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'Unicellular root hair arises from which part of Dicot root?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b581ff38151da268e57',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Secondary Growth',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Secondary Growth in Dicot Stem',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '3',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 96',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What are the characteristics of the heartwood in old trees?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5820355698ba72f5a7',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Secondary Growth',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Secondary Growth in Dicot Stem',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '1',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 95',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What type of cells form the interfascicular cambium in dicot stems?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b582074ac423f2308f3',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Secondary Growth',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Secondary Growth in Dicot Stem',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '2',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 95',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What are secondary medullary rays formed by the cambium?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b5823242d207f93aa97',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Secondary Growth',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Secondary Growth in Dicot Root',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '1',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 98',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What is the main function of plant tissues?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//     {
//       _id: '64188b58299e61f9c8554051',
//       questionLabels: [
//         {
//           title: 'topic',
//           value: 'Secondary Growth',
//           isVisible: true,
//         },
//         {
//           title: 'concept',
//           value: 'Secondary Growth in Dicot Stem',
//           isVisible: true,
//         },
//         {
//           title: 'paragraphNumber',
//           value: '3',
//           isVisible: true,
//         },
//         {
//           title: 'level',
//           value: '1',
//           isVisible: false,
//         },
//         {
//           title: 'approximateTimeRequired',
//           value: '30',
//           isVisible: false,
//         },
//         {
//           title: 'pageTextToDisplay',
//           value: 'Page No 96',
//           isVisible: true,
//         },
//         {
//           title: 'pdfUrl',
//           value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//           isVisible: false,
//         },
//         {
//           title: 'pageNumber',
//           value: '3',
//           isVisible: false,
//         },
//         {
//           title: 'fileName',
//           value: 'Class 11.pdf',
//           isVisible: false,
//         },
//       ],
//       previousYearPapers: [],
//       question: {
//         text: 'What is the function of the sapwood in old trees?',
//         image: null,
//       },
//       isAttempted: false,
//     },
//   ],
// };
// populateQuestions(questions, 'dark');
// populateQuestions(questions, 'light');