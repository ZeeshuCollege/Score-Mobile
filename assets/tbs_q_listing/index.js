"use strict";
​
// let data = [
//   {
//     name: 'Exercises',
//     questions: [
//       {
//         questionId: {
//           _id: '636a6169dc50c4e8d7a85ba6',
//           question: {
//             text: 'State the location and function of different types of meristems.',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a616adc50c4e8d7a85ba7',
//           question: {
//             text: 'Cork cambium forms tissues that form the cork. Do you agree with this statement? Explain.',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a616adc50c4e8d7a85ba8',
//           question: {
//             text: 'Explain the process of secondary growth in the stems of woody angiosperms with the help of schematic diagrams. What is its significance?',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a616cdc50c4e8d7a85ba9',
//           question: {
//             text: 'Draw illustrations to bring out the anatomical difference between\n(a) Monocot root and dicot root\n(b) Monocot stem and dicot stem',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a6170dc50c4e8d7a85baa',
//           question: {
//             text: 'Cut a transverse section of young stem of a plant from your school garden and observe it under microscope. How would you ascertain whether it is a monocot stem or a dicot stem? Give reasons.',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a6172dc50c4e8d7a85bab',
//           question: {
//             text: 'The transverse section of a plant material shows the following anatomical features $-($ a) the vascular bundles are conjoint, scattered and surrounded by a sclerenchymatous bundle sheaths. (b) phloem parenchyma is absent. What will you identify it as?',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a6172dc50c4e8d7a85bac',
//           question: {
//             text: 'Why xylem and phloem are called complex tissues?',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a6172dc50c4e8d7a85bad',
//           question: {
//             text: 'What is stomatal apparatus? Explain the structure of stomata with a labelled diagram.\n<img src="https://cdn-question-pool.getmarks.app/modules/cbse/xA6RdMN7dDKJNkC_DlajKUlB-xevv3dBmfSd0_-1edA.original.fullsize.png"><br>',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a6173dc50c4e8d7a85bae',
//           question: {
//             text: 'Name the three basic tissue systems in the flowering plants. Give the tissue names under each system.',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a6173dc50c4e8d7a85baf',
//           question: {
//             text: 'How is the plant anatomy useful to us?',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a6173dc50c4e8d7a85bb0',
//           question: {
//             text: 'What is periderm? How does periderm formation take place in the dicot stems?',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//       {
//         questionId: {
//           _id: '636a6173dc50c4e8d7a85bb1',
//           question: {
//             text: 'Describe the internal structure of a dorsiventral leaf with the help of labelled diagrams.',
//             image: null,
//           },
//         },
//         isImportant: false,
//         isDroppedFromSyllabus: false,
//       },
//     ],
//   },
// ];
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
// var TextbookNative = {
//   getTheme: () => console.log(theme),
//   onQuestionClicked: (index1, index2) => console.log('Section:', index1, 'Question:', index2),
// };
var theme = 'dark';
var showingAsGrid = false;
var view = 'list';
function setTypeset() {
  window.MathJax.Hub.Config({
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
    }
  });
  window.MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
}
function toggleShowAs() {
  showingAsGrid = !showingAsGrid;
  var btnElem = document.getElementById('showAsBtn');
  var t = TextbookNative.getTheme();
  // img.src = showingAsGrid ? 'https://i.ibb.co/WPfxYRx/border-all.png' : 'https://i.ibb.co/fQfkbMr/format-list-bulleted.png';
  if (showingAsGrid) btnElem.innerHTML = "\n        <img src=\"list.svg\" alt=\"\">\n        Show as List\n        ";else btnElem.innerHTML = "\n            <img src=\"grid.svg\" alt=\"\">\n            Show as Grid\n        ";
  Android.toggleShow(showingAsGrid);
  listQuestions(data, t);
}
function getIndex(number) {
  if (number.toString().length === 1) {
    return "0".concat(number);
  }
  return number;
}
function onQuestionClick(sectionIndex, index) {
  TextbookNative.onQuestionClicked(sectionIndex, "".concat(index));
}
function getLabelIcon(question) {
  console.log('drop: ' + question.isDroppedFromSyllabus);
  var str = '';
  if (question.isDroppedFromSyllabus) str = "".concat(question.isDroppedFromSyllabus ? '<img src="cancel.svg" alt=""fi>' : '');else str = "".concat(question.isImportant ? '<img src="fire.svg" alt=""fi>' : '');
  console.log('str: ' + str);
  return str;
}
function toggleShow() {
  view = view === 'list' ? 'grid' : 'list';
  if (view === 'list') displayQuestions(questionList);else displayQuestionsInGrid();
  setTypeset();
}
function displayQuestionsInGrid() {
  var sections = questionList;
  var sectionsParent = document.getElementById('question-listing');
  sectionsParent.innerHTML = '';
  sections.forEach(function (section, sectionIndex) {
    setSectionHeader(sectionsParent, sectionIndex, section);
    section.questions.forEach(function (question, questionIndex) {
      var questionEl = document.createElement('div');
      questionEl.className = 'col-4 col-sm-3 col-md-2 grid p-0';
      questionEl.innerHTML = "\n        <div class=\"question-grid mt-3\" onclick=\"onQuestionClick(".concat(sectionIndex, ", ").concat(questionIndex, ")\">\n            ").concat(question.isImportant ? '<img class="grid-icon-sm" src="https://cdn-icons-png.flaticon.com/512/740/740842.png" />' : '', "\n            ").concat(question.isDroppedFromSyllabus ? '<img class="grid-icon-sm" src="https://cdn-icons-png.flaticon.com/512/1828/1828665.png" />' : '', "\n            ").concat(getIndex(questionIndex + 1), "\n        </div>\n      ");
      sectionsParent.appendChild(questionEl);
    });
  });
  setTheme();
}
function setSectionHeader(sectionsParent, sectionIndex, section) {
  var sectionHeader = document.createElement('div');
  if (sectionIndex === 0) {
    sectionHeader.className = 'd-flex mt-4 justify-content-between align-items-center';
    sectionHeader.innerHTML = "\n        <p class=\"mb-2 text-primary section-title\">\n            ".concat(section.name, " (").concat(section.questions.length, " Qs)\n        </p>\n\n        <p class=\"mb-2\" id=\"showAsBtn\" onclick=\"toggleShow()\">\n          ").concat(view === 'list' ? '<img src="grid.svg" class="grid-icon" alt=""> Show As Grid' : '<img src="list.svg" alt=""> Show As List', "\n        </p>\n      ");
  } else {
    sectionHeader.className = 'd-flex mt-4';
    sectionHeader.innerHTML = "\n        <p class=\"mb-2 text-primary\">\n            ".concat(section.name, " (").concat(section.questions.length, " Qs)\n        </p>\n      ");
  }
  sectionsParent.appendChild(sectionHeader);
}
function displayQuestions(sections) {
  var sectionsParent = document.getElementById('question-listing');
  sectionsParent.innerHTML = '';
  // add all the sections to this element
  sections.forEach(function (section, sectionIndex) {
    setSectionHeader(sectionsParent, sectionIndex, section);
    section.questions.forEach(function (question, questionIndex) {
      var _question$questionId;
      var questionEl = document.createElement('div');
      if (section.questions.length - 1 === questionIndex) questionEl.className = 'col-12 question-row border-none';else questionEl.className = 'col-12 question-row';
      questionEl.innerHTML = "\n        <div class=\"row align-items-center\" onclick=\"onQuestionClick(".concat(sectionIndex, ", ").concat(questionIndex, ")\">\n            <div class=\"col-2 number-col pr-0\">\n                <p class=\"question-number\">").concat(getIndex(questionIndex + 1), "</p>\n                ").concat(question.isImportant ? '<img class="list-icon-sm" src="fire.svg" />' : '', "\n                ").concat(question.isDroppedFromSyllabus ? '<img class="list-icon-sm" src="cancel.svg" />' : '', "\n            </div>\n            <div class=\"col-10 pl-0\">\n                <div class=\"mb-0 question-text\">\n                    ").concat((_question$questionId = question.questionId) === null || _question$questionId === void 0 ? void 0 : _question$questionId.question.text, "\n                </div>\n            </div>\n        </div>\n      ");
      sectionsParent.appendChild(questionEl);
    });
  });
  setTheme();
  setTypeset();
}
function setTheme() {
  var body = document.querySelector('body');
  if (globalTheme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');
}
function listQuestions(questions, theme) {
  globalTheme = theme;
  displayQuestions(questions);
  questionList = questions;
}
// listQuestions(data, theme);