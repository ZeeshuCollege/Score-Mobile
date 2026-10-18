'use strict';

// var Android = {
//   toggleShow: function (toggle) {
//     Android.toast('Toggled: ', toggle);
//   },
//   logMessage: function (message) {
//     console.log(message);
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
/*Above Android object, only for testing purposes.*/
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
function getYears(years, questionLabels) {
  Android.logMessage("labels years ".concat(JSON.stringify(years)));
  Android.logMessage("labels ".concat(JSON.stringify(questionLabels)));
  var labels = [];
  if (years.length > 0) {
    if (years.length <= 1) {
      labels.push(years[0].title);
    } else {
      for (var i = 0; i < years.length; i++) {
        labels.push(years[i].title);
      }
    }
  } else if (questionLabels && questionLabels.length > 0) {
    var filteredLabels = [];
    for (var _i2 = 0; _i2 < questionLabels.length; _i2++) {
      var label = questionLabels[_i2];
      if (label.isVisible) {
        filteredLabels.push(label);
      }
    }
    if (filteredLabels && filteredLabels.length > 0) {
      labels.push("".concat(filteredLabels[0].title, " ").concat(filteredLabels[0].value));
    } else {
      return '';
    }
  }
  return labels.join(', ');
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
function populateQuestions(questions, theme, hasAccess) {
  var body = document.querySelector('body');
  if (theme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');
  var questionsHtml = '';
  for (var i in questions.data) {
    var _questions$data$i = questions.data[i],
      ques = _questions$data$i.question,
      isLocked = _questions$data$i.isLocked,
      isAttempted = _questions$data$i.isAttempted;
    var lightThumbnail = ques.videoSolution.thumbnailLight;
    var darkThumbnail = ques.videoSolution.thumbnailDark;
    var syllabusStatus = ques === null || ques === void 0 ? void 0 : ques.syllabusCategory;
    Android.logMessage("ques: ".concat(JSON.stringify(ques, null, 4)));
    Android.logMessage("i: ".concat(JSON.stringify(i)));
    Android.logMessage("accessStatus: ".concat(hasAccess));
    questionsHtml += "\n            <div\n                class=\"question-row question-row-".concat(i, " mb-4\"\n                onclick=\"onQuestionClick(").concat(i, ")\">\n               <div class=\"question-image\">\n                <img crossorigin=\"anonymous\" src=").concat(theme === 'light' ? lightThumbnail : darkThumbnail, " alt=\"thumbnail\"></img>\n               </div>\n               <div class=\"question-body\">\n                   <div class=\"question-title ").concat(isAttempted ? 'opacity-75' : '', "\">").concat(ques.question.text, "</div>\n                   <div class=\"tags\">\n                  ").concat(hasAccess === false ? isLocked === false ? "<div class=\"free-badge\">Free</div>" : "<div class=\"premium-badge\">Premium</div>" : "", "\n                      <p class=\"question-year\">").concat(getYears(ques.previousYearPapers, ques.questionLabels), "</p>\n                   </div>\n                   ").concat(syllabusStatus === 'outOfSyllabus' ? "<div class=\"out-of-syllabus\">Out of Syllabus</div>" : syllabusStatus === 'outOfSyllabusButGoodToSolve' ? "<div class=\"good-to-solve\">Out of Syllabus but Good to Solve</div>" : "", "\n                </div>\n           </div>\n         ");
    Android.logMessage("questionsHtmlDebug: ".concat(questionsHtml));
  }
  root.innerHTML = questionsHtml;
  setTypeset();
}

/* dummy data below for testing */

// const questions = {
//   "data": [
//     {
//       "question": {
//         "_id": "648b5a6f417cc3fb48d67fc0",
//         "previousYearPapers": [
//           {
//             "_id": "63f499801d196b49d9cd6b09",
//             "title": "JEE Main 2023 (24 Jan Shift 1)",
//             "shortName": "2023 (24 Jan Shift 1)",
//             "isVisible": true,
//             "heldOn": "2023-01-24T09:00:00.000Z"
//           }
//         ],
//         "question": {
//           "text": "A hole is drilled in a metal sheet. At <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>27</mn><mo>&#160;</mo><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi></math>, the diameter of hole is <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>5</mn><mo>&#160;</mo><mi>cm</mi></math>. When the sheet is heated to <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>177</mn><mo>&#160;</mo><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi></math>, the change in the diameter of hole is <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>d</mi><mo>&#215;</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>3</mn></mrow></msup><mo>&#160;</mo><mi>cm</mi></math> . The value of <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>d</mi></math> will be _____, if coefficient of linear expansion of the metal is <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>1</mn><mo>.</mo><mn>6</mn><mo>&#215;</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>5</mn></mrow></msup><mo>/</mo><mmultiscripts><mi mathvariant=\"normal\">C</mi><mprescripts></mprescripts><none></none><mo>&#8728;</mo></mmultiscripts></math>&nbsp;",
//           "image": null
//         },
//         "videoSolution": {
//           "videoId": "8db470c9ad3045b6a0c4c3b88a33ca17",
//           "provider": "vdocipher",
//           "thumbnailLight": "https://d1z78r8i505acl.cloudfront.net/poster/wjV4D3uyu8Fen.480.jpeg",
//           "thumbnailDark": "https://d1z78r8i505acl.cloudfront.net/poster/wjV4D3uyu8Fen.480.jpeg",
//           "premiumModules": [
//             {
//               "premiumModuleId": "64c7e8e829737784b294e469",
//               "isFree": false
//             }
//           ],
//           "description": "JEE Main"
//         },
//         "questionLabels": [],
//         "syllabusCategory": "outOfSyllabus"
//       },
//       "isFree": false,
//       "isAttempted": false,
//       "isLocked": false
//     },
//     {
//       "question": {
//         "_id": "648b5a6f417cc3fb48d680c3",
//         "previousYearPapers": [
//           {
//             "_id": "63f499841d196b49d9cd6b0c",
//             "title": "JEE Main 2023 (25 Jan Shift 2)",
//             "shortName": "2023 (25 Jan Shift 2)",
//             "isVisible": true,
//             "heldOn": "2023-01-25T14:00:00.000Z"
//           }
//         ],
//         "question": {
//           "text": "<p>The graph between two temperature scales <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>P</mi></math> and <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>Q</mi></math> is shown in the figure. Between upper fixed point and lower fixed point there are <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>150</mn></math> equal divisions of scale <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>P</mi></math> and <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>100</mn></math> divisions on scale <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>Q</mi></math>. The relationship for conversion between the two scales is given by :</p><p><img src=\"https://cdn-question-pool.getmarks.app/pyq/jee_main/fed11c89-6c38-4d03-ac2c-5e6a689da0b5-9894157.png\" style=\"width: 300px; height: 283px;\" />.</p>",
//           "image": null
//         },
//         "videoSolution": {
//           "videoId": "532b95958a8c422c941948c3a7914b62",
//           "provider": "vdocipher",
//           "thumbnailLight": "https://d1z78r8i505acl.cloudfront.net/poster/J6MtinHSgzMyI.480.jpeg",
//           "thumbnailDark": "https://d1z78r8i505acl.cloudfront.net/poster/J6MtinHSgzMyI.480.jpeg",
//           "premiumModules": [
//             {
//               "premiumModuleId": "64c7e8e829737784b294e469",
//               "isFree": false
//             }
//           ],
//           "description": "JEE Main"
//         },
//         "questionLabels": []
//       },
//       "isFree": false,
//       "isAttempted": false,
//       "isLocked": false
//     },
//     {
//       "question": {
//         "_id": "648b5a70417cc3fb48d6828e",
//         "previousYearPapers": [
//           {
//             "_id": "63f499871d196b49d9cd6b11",
//             "title": "JEE Main 2023 (31 Jan Shift 1)",
//             "shortName": "2023 (31 Jan Shift 1)",
//             "isVisible": true,
//             "heldOn": "2023-01-31T09:00:00.000Z"
//           }
//         ],
//         "question": {
//           "text": "A thin rod having a length of <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>1</mn><mo>&#160;</mo><mi mathvariant=\"normal\">m</mi></math>&nbsp;and area of cross-section <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>3</mn><mo>&#215;</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>6</mn></mrow></msup><mo>&#160;</mo><msup><mi mathvariant=\"normal\">m</mi><mn>2</mn></msup></math> is suspended vertically from one end. The rod is cooled from <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>210</mn><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi></math>&nbsp;to <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>160</mn><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi></math>. After cooling, a mass <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>M</mi></math> is attached at the lower end of the rod such that the length of rod again becomes <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>1</mn><mo>&#160;</mo><mi mathvariant=\"normal\">m</mi></math>. Young&#39;s modulus and coefficient of linear expansion of the rod are <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>2</mn><mo>&#215;</mo><msup><mn>10</mn><mn>11</mn></msup><mo>&#160;</mo><mi mathvariant=\"normal\">N</mi><mo>&#160;</mo><msup><mi mathvariant=\"normal\">m</mi><mrow><mo>-</mo><mn>2</mn></mrow></msup></math> and <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>2</mn><mo>&#215;</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>5</mn></mrow></msup><mo>&#160;</mo><msup><mi mathvariant=\"normal\">K</mi><mrow><mo>-</mo><mn>1</mn></mrow></msup></math>, respectively. The value of <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>M</mi></math> is ______ <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>kg</mi></math>. (Take&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>g</mi><mo>=</mo><mn>10</mn><mo>&#160;</mo><mi mathvariant=\"normal\">m</mi><mo>&#160;</mo><msup><mi mathvariant=\"normal\">s</mi><mrow><mo>-</mo><mn>2</mn></mrow></msup></math>)",
//           "image": null
//         },
//         "videoSolution": {
//           "videoId": "fe2e5b29fd9045cf8576cc6ca487f9ae",
//           "provider": "vdocipher",
//           "thumbnailLight": "https://d1z78r8i505acl.cloudfront.net/poster/dAjgiNVoJisHo.480.jpeg",
//           "thumbnailDark": "https://d1z78r8i505acl.cloudfront.net/poster/dAjgiNVoJisHo.480.jpeg",
//           "premiumModules": [
//             {
//               "premiumModuleId": "64c7e8e829737784b294e469",
//               "isFree": false
//             }
//           ],
//           "description": "JEE Main"
//         },
//         "questionLabels": []
//       },
//       "isFree": false,
//       "isAttempted": true,
//       "isLocked": false
//     }
//   ]
// }

/*
questions:[{question,isFree,isLocked},{question,...}...]}
theme:'light'/'dark'
hasAccess:true/false; boolean ( user has access to these solutions.)
*/

// populateQuestions(questions, 'dark', false);
// populateQuestions(questions, 'dark', true);
// populateQuestions(questions, 'light', false);
// populateQuestions(questions, 'light', true);