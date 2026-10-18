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
// Helper Functions
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function resizeImages(images) {
  var currentScreenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    var imgSize = image.naturalWidth;
    if (imgSize >= currentScreenWidth) {
      image.style.height = 'auto';
      image.style.width = '100%';
    }
  }
}
function questionTextResizeAllImages(question) {
  if (question.question.text.includes('<img')) {
    var allQuestionImages = document.querySelectorAll('#questionText img');
    resizeImages(allQuestionImages);
    var finalImages = [],
      htmlToImages = Array.prototype.slice.call(document.images);
    for (var i = 0; i < htmlToImages.length; i++) {
      var image = htmlToImages[i];
      if (!image.complete) finalImages.push(new Promise(function (resolve) {
        image.onload = image.onerror = resolve;
      }));
    }
    Promise.all(finalImages).then(function () {
      resizeImages(allQuestionImages);
    });
  }
}
function questionSolutionResizeAllImages(question) {
  if (question.solution.text && question.solution.text.includes('<img') || !question.solution.text && question.solution && question.solution.includes('<img')) {
    var finalImages = [],
      htmlToImages = Array.prototype.slice.call(document.images);
    for (var i = 0; i < htmlToImages.length; i++) {
      var image = htmlToImages[i];
      if (!image.complete) finalImages.push(new Promise(function (resolve) {
        image.onload = image.onerror = resolve;
      }));
    }
    Promise.all(finalImages).then(function () {
      var allSolutionImages = document.querySelectorAll('.solution-text img');
      resizeImages(allSolutionImages);
    });
  }
}
function questionOptionsResizeAllImages(question) {
  for (var x = 0; x < question.options.length; x++) {
    var opt = question.options[x];
    if (opt.text.includes('<img')) {
      var finalImages = [],
        htmlToImages = Array.prototype.slice.call(document.images);
      for (var i = 0; i < htmlToImages.length; i++) {
        var image = htmlToImages[i];
        if (!image.complete) finalImages.push(new Promise(function (resolve) {
          image.onload = image.onerror = resolve;
        }));
      }
    }
  }
}
function populateLabels(labelsLeft, questionLabels, previousYearPapers, screenType, screenLabels) {
  var newLabels = document.createElement('div');
  newLabels.style.display = 'flex';
  newLabels.style.flexWrap = 'wrap';
  // newLabels.style.cssText = labelsLeft.classList;
  if (screenType === 'notebookQuestion') {
    //  Need to Append Subject
    for (var i = 0; i < screenLabels.length; i++) {
      var outerDiv = document.createElement('div'),
        innerDiv = document.createElement('div');
      outerDiv.className = 'label-container';
      innerDiv.className = 'label-text';
      innerDiv.innerHTML = label;
      outerDiv.appendChild(innerDiv);
      newLabels.appendChild(outerDiv);
    }
  }
  if (previousYearPapers && previousYearPapers.length) {
    for (var _i2 = 0; _i2 < previousYearPapers.length; _i2++) {
      var paper = previousYearPapers[_i2];
      var _outerDiv = document.createElement('div'),
        _innerDiv = document.createElement('div');
      _outerDiv.className = 'label-container';
      _innerDiv.className = 'label-text';
      _innerDiv.innerHTML = paper.title;
      _outerDiv.appendChild(_innerDiv);
      newLabels.appendChild(_outerDiv);
      labelsLeft.appendChild(newLabels);
    }
  } else if (questionLabels.length) {
    var ql = [];
    for (var _i4 = 0; _i4 < questionLabels.length; _i4++) {
      var el = questionLabels[_i4];
      if (el.isVisible) {
        ql.push(el);
      }
    }
    questionLabels = ql;
    if (questionLabels.length) {
      var _label = questionLabels[0];
      var _outerDiv2 = document.createElement('div'),
        _innerDiv2 = document.createElement('div');
      _outerDiv2.className = 'label-container';
      _innerDiv2.className = 'label-text';
      _innerDiv2.innerHTML = "".concat(_label.title, " ").concat(_label.value);
      _outerDiv2.appendChild(_innerDiv2);
      newLabels.appendChild(_outerDiv2);
      labelsLeft.appendChild(newLabels);
    }
  }
  if (screenType === 'customTest') {
    //  Need to Append Subject
    for (var _i6 = 0; _i6 < screenLabels.length; _i6++) {
      var _label2 = screenLabels[_i6];
      Android.showToast("CUTSOMTESET: ".concat(_label2));
      var _outerDiv3 = document.createElement('div'),
        _innerDiv3 = document.createElement('div');
      _outerDiv3.className = 'label-container';
      _innerDiv3.className = 'label-text';
      _innerDiv3.innerHTML = _label2;
      _outerDiv3.appendChild(_innerDiv3);
      newLabels.appendChild(_outerDiv3);
    }
  }
}
function populateOptions(optionsBox, options, type, selectedOptions, numericalAnswer, theme, status) {
  Android.showToast("Selected options: ".concat(selectedOptions, " - ").concat(numericalAnswer, " - ").concat(options, " - ").concat(status, " "));
  var optionsHTML = '';
  if (type === 'numerical') {
    if (status === 'answered') {
      optionsHTML += "\n      <div class=\"option-container row\">\n        <div class=\"option-badge\">\n            <p class=\"option-badge-text\"></p>\n        </div>\n            <div id=\"main-options\" class=\"option\">\n                <input id=\"inputAns\" value=\"".concat(numericalAnswer ? numericalAnswer : '', "\" type=\"number\" class=\"numerical-input form-control\" placeholder=\"\" aria-label=\"numerical\">\n            </div>\n        </div>\n    ");
    } else {
      optionsHTML += "\n      <div class=\"option-container row\">\n        <div class=\"option-badge\">\n            <p class=\"option-badge-text\"></p>\n        </div>\n            <div id=\"main-options\" class=\"option\">\n                <input id=\"inputAns\" type=\"number\" class=\"numerical-input form-control\" placeholder=\"No input\" aria-label=\"numerical\">\n            </div>\n        </div>\n    ";
    }
  } else {
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var state = 'default';
      var isSelected = ' ';
      if (selectedOptions) {
        var contains = false;
        for (var _i8 = 0; _i8 < selectedOptions.length; _i8++) {
          if (selectedOptions[_i8] == opt.id) {
            state = 'selected';
            isSelected = ' option_state_selected';
            break;
          }
        }
      }
      var getOptionsArray = getOptionsByState(type, state, theme);
      var optionSrc = getOptionsArray[i];
      var newOption = "\n                <div class=\"option-container row\">\n                    <div class=\"option-badge\" id=\"badge_".concat(opt.id, "\">\n                        <p class=\"option-badge-text\"></p>\n                    </div>\n                    <div id=\"").concat(opt.id, "\" class=\"option ").concat(isSelected, "\">\n                        <img src=\"").concat(optionSrc, "\" class=\"option-icon\"></img>\n                        <div class=\"option-text\">").concat(opt.text, "</div>\n                    </div>\n                </div>\n            ");
      optionsHTML += newOption;
    }
  }
  Android.showToast("OPTIONSHTML: ".concat(optionsHTML));
  optionsBox.innerHTML = optionsHTML;
}
function formSubmitHandler(question, type) {
  var solutionBox = document.getElementById('solutionBox'),
    solutionTextPara = document.querySelector('.solution-text'),
    answerBox = document.getElementById('answer-box'),
    errorBox = document.getElementById('error');
  // Display showSolutions button
  displayShowSolutions();
  // Populating the solution-text paragraph
  solutionTextPara.innerHTML = _typeof(question.solution) === 'object' ? question.solution.text : question.solution;
  solutionBox.style.display = 'block';
  if (answerBox) answerBox.style.display = 'block';
  errorBox.style.display = 'block';
  if (type != 'numerical') {
    var optionsList = document.querySelectorAll('.option');
    for (var i = 0; i < optionsList.length; i++) {
      var el = optionsList[i];
      el.style.pointerEvents = 'none';
    }
  }
  setTypeset();
  questionSolutionResizeAllImages(question);
}
function getOptionsByState(questionType, state, theme) {
  var type = questionType === 'singleCorrect' ? 'single' : 'multiple';
  switch (state) {
    case 'selected':
      return theme === 'dark' ? ["../assets/svg/options/".concat(type, "/A/type_").concat(type, "_option_A_state_selected_dark.svg"), "../assets/svg/options/".concat(type, "/B/type_").concat(type, "_option_B_state_selected_dark.svg"), "../assets/svg/options/".concat(type, "/C/type_").concat(type, "_option_C_state_selected_dark.svg"), "../assets/svg/options/".concat(type, "/D/type_").concat(type, "_option_D_state_selected_dark.svg")] : ["../assets/svg/options/".concat(type, "/A/type_").concat(type, "_option_A_state_selected.svg"), "../assets/svg/options/".concat(type, "/B/type_").concat(type, "_option_B_state_selected.svg"), "../assets/svg/options/".concat(type, "/C/type_").concat(type, "_option_C_state_selected.svg"), "../assets/svg/options/".concat(type, "/D/type_").concat(type, "_option_D_state_selected.svg")];
    case 'correct':
      return ["../assets/svg/options/".concat(type, "/A/type_").concat(type, "_option_A_state_correct.svg"), "../assets/svg/options/".concat(type, "/B/type_").concat(type, "_option_B_state_correct.svg"), "../assets/svg/options/".concat(type, "/C/type_").concat(type, "_option_C_state_correct.svg"), "../assets/svg/options/".concat(type, "/D/type_").concat(type, "_option_D_state_correct.svg")];
    case 'incorrect':
      return ["../assets/svg/options/".concat(type, "/A/type_").concat(type, "_option_A_state_incorrect.svg"), "../assets/svg/options/".concat(type, "/B/type_").concat(type, "_option_B_state_incorrect.svg"), "../assets/svg/options/".concat(type, "/C/type_").concat(type, "_option_C_state_incorrect.svg"), "../assets/svg/options/".concat(type, "/D/type_").concat(type, "_option_D_state_incorrect.svg")];
    default:
      return theme === 'dark' ? ["../assets/svg/options/".concat(type, "/A/type_").concat(type, "_option_A_state_default_dark.svg"), "../assets/svg/options/".concat(type, "/B/type_").concat(type, "_option_B_state_default_dark.svg"), "../assets/svg/options/".concat(type, "/C/type_").concat(type, "_option_C_state_default_dark.svg"), "../assets/svg/options/".concat(type, "/D/type_").concat(type, "_option_D_state_default_dark.svg")] : ["../assets/svg/options/".concat(type, "/A/type_").concat(type, "_option_A_state_default.svg"), "../assets/svg/options/".concat(type, "/B/type_").concat(type, "_option_B_state_default.svg"), "../assets/svg/options/".concat(type, "/C/type_").concat(type, "_option_C_state_default.svg"), "../assets/svg/options/".concat(type, "/D/type_").concat(type, "_option_D_state_default.svg")];
  }
}
function resetFields() {
  var solutionBox = document.getElementById('solutionBox'),
    solutionText = document.querySelector('.solution-text'),
    answerBox = document.getElementById('answer-box'),
    errorBox = document.getElementById('error'),
    showSolutionsBtn = document.getElementById('action-show-solutions'),
    numericalInputContainer = document.getElementById('main-options'),
    inputField = document.getElementById('inputAns');
  solutionBox.style.display = 'none';
  solutionText.textContent = '';
  errorBox.style.display = 'none';
  showSolutionsBtn.style.display = 'none';
  if (answerBox) {
    answerBox.style.display = 'none';
    var answerText = document.querySelector('.answer-text');
    answerText.textContent = '';
  }
  if (numericalInputContainer && inputField) {
    numericalInputContainer.style.border = '1px solid #dcdde2';
    inputField.value = '';
  }
}
function displayShowSolutions() {
  var showSolutionsBtn = document.getElementById('action-show-solutions');
  showSolutionsBtn.style.display = 'flex';
  showSolutionsBtn.addEventListener('click', function () {
    var el = document.getElementById('solutionBox');
    if (el) el.scrollIntoView({
      behavior: 'smooth'
    });
    Android.onShowSolutions('solutionBox');
  });
}
function elementScrollTo(element) {
  var elem = document.getElementById(element),
    x = 0,
    y = 0;
  while (elem != null) {
    x += elem.offsetLeft;
    y += elem.offsetTop;
    elem = elem.offsetParent;
  }
  window.scrollTo(x, y);
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
    }
  });
  MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
}
// Main Functions [to be called by Android]
function setQuestion(question, theme, status, screenType) {
  resetDoc();
  createDoc();
  Android.showToast("CUTSOMTESET: srceen ".concat(screenType));
  var body = document.querySelector('body');
  if (theme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');
  try {
    document.getElementById('numeric-label').remove();
  } catch (err) {
    Android.showToast("Remove label: ".concat(JSON.stringify(err)));
  }
  var selectedOptions = question.selectedOptions;
  var inputValue = question.inputValue;
  var numericalAnswer = inputValue;
  resetFields();
  var questionTextPara = document.getElementById('questionText'),
    labelsLeft = document.querySelector('.labels-left'),
    optionsBox = document.getElementById('optionsBox'),
    solutionBox = document.getElementById('solutionBox'),
    errorBox = document.getElementById('error');
  // Populate labels
  //  Android.showToast(`Labels: ${JSON.stringify(question?.questionLabels)}`);
  //  Android.showToast(`Labels: ${JSON.stringify(question?.previousYearPapers)}`);
  var sc = [];
  if (screenType === 'customTest') {
    sc.push(question.subject);
    for (var i = 0; i < question.chapters.length; i++) {
      var chapter = question.chapters[i];
      sc.push(chapter.title);
    }
  }
  populateLabels(labelsLeft, question.questionLabels, question.previousYearPapers, screenType, sc);
  // Populating the question-text paragraph
  questionTextPara.innerHTML = question.question.text;

  // Resizing Images in Question Title
  questionTextResizeAllImages(question);
  // Populating the options
  if (numericalAnswer) {
    populateOptions(optionsBox, question.options, question.type, selectedOptions, numericalAnswer, theme, question === null || question === void 0 ? void 0 : question.status);
  } else {
    populateOptions(optionsBox, question.options, question.type, [], false, theme, question === null || question === void 0 ? void 0 : question.status);
  }
  displayShowSolutions();
  questionOptionsResizeAllImages(question);
  if (question.type === 'numerical') {
    checkNumericalAnswer(question, numericalAnswer, numericalAnswer === question.correctValue, (question === null || question === void 0 ? void 0 : question.status) === 'answered');
  } else {
    checkOptionsAnswer(question, selectedOptions, theme);
  }
  errorBox.addEventListener('click', function () {
    Android.showReport();
  });
  // setTypeset();
}

function checkNumericalAnswer(question, input, status, isAttempted) {
  var correctAnswer = question.correctValue;
  var userAnswer = input;
  var solutionBox = document.getElementById('solutionBox'),
    solutionBadge = document.querySelector('.option-badge'),
    solutionBadgeText = document.querySelector('.option-badge-text'),
    numericalInputContainer = document.getElementById('main-options'),
    inputField = document.getElementById('inputAns');
  if (solutionBadgeText) {
    var newDiv = document.createElement('div');
    newDiv.id = 'answer-box';
    newDiv.innerHTML = '<div class="row" id="numeric-label"><p class="solution-header">Answer:</p></div><div class="row"><p class="answer-text">' + correctAnswer + '</p></div>';
    solutionBox.insertBefore(newDiv, solutionBox.firstChild);
  }
  if (!input && status) {
    inputField.value = correctAnswer;
  } else {
    inputField.value = userAnswer;
  }
  inputField.disabled = true;
  // If the answer is correct
  if (isAttempted) {
    if ((question === null || question === void 0 ? void 0 : question.evalStatus) === 'correct') {
      solutionBadgeText.textContent = 'Correct Answer';
      solutionBadge.classList.add('correct-answer');
      numericalInputContainer.style.border = '1px solid #31d99c';
    } else {
      solutionBadgeText.textContent = 'Incorrect Answer';
      solutionBadge.classList.add('incorrect-answer');
      numericalInputContainer.style.border = '1px solid #ff5858';
    }
  }
  // If the answer is incorrect
  // else {
  //   if (Number(userAnswer) !== Number(correctAnswer)) {
  //     solutionBadgeText.textContent = "Incorrect Answer";
  //     solutionBadge.classList.add("incorrect-answer");
  //     numericalInputContainer.style.border = "1px solid #ff5858";
  //   } else {
  //     solutionBadgeText.textContent = "Correct Answer";
  //     solutionBadge.classList.add("correct-answer");
  //     numericalInputContainer.style.border = "1px solid #31d99c";
  //   }
  // }
  formSubmitHandler(question, 'numerical');
}
function checkOptionsAnswer(question, selectedOptions, theme) {
  var optionsBox = document.querySelectorAll('.option-container');
  var optionsBoxIndexes = {};
  for (var i = 0; i < optionsBox.length; i++) {
    var el = optionsBox[i];
    optionsBoxIndexes[el.firstElementChild.id] = i;
  }
  var options = {};
  for (var _i10 = 0; _i10 < question.options.length; _i10++) {
    var opt = question.options[_i10];
    if (opt.isCorrect === true) {
      options[opt.id] = true;
    } else {
      options[opt.id] = false;
    }
  }
  for (var key in options) {
    if (options[key] === true) {
      var option = document.getElementById('' + key),
        optionIcon = option.firstElementChild;
      var optionBadge = document.getElementById('badge_' + key),
        optionBadgeText = optionBadge.firstElementChild;
      optionBadgeText.textContent = 'Correct Answer';
      optionBadge.classList.add('correct-answer');
      option.style.border = '1px solid #31d99c';
      optionIcon.src = getOptionsByState(question.type, 'correct', theme)[optionsBoxIndexes['badge_' + key]];
    }
  }
  for (var _i12 = 0; _i12 < selectedOptions.length; _i12++) {
    var _opt = selectedOptions[_i12];
    if (_opt) {
      // const option = document.getElementById('' + opt),
      //     optionIcon = option.firstElementChild,
      //     optionBadge = option.nextElementSibling,
      //     optionBadgeText = optionBadge.firstElementChild;
      var _option = document.getElementById('' + _opt),
        _optionIcon = _option.firstElementChild;
      var optionId = 'badge_' + _opt;
      var _optionBadge = document.getElementById(optionId),
        _optionBadgeText = _optionBadge.firstElementChild;
      if (options[_opt]) {
        _optionBadgeText.textContent = 'You Marked | Correct Answer';
        _optionBadge.classList.add('correct-answer');
        _option.style.border = '1px solid #31d99c';
        _optionIcon.src = getOptionsByState(question.type, 'correct', theme)[optionsBoxIndexes[optionId]];
      }
      // Selected option is incorrect
      else {
        _optionBadgeText.textContent = 'You Marked | Incorrect Answer';
        _optionBadge.classList.add('incorrect-answer');
        _option.style.border = '1px solid #ff5858';
        _optionIcon.src = getOptionsByState(question.type, 'incorrect', theme)[optionsBoxIndexes[optionId]];
        Android.showToast("option src: ".concat(_optionIcon));
      }
    }
  }
  formSubmitHandler(question, 'single-multi');
}
function createDoc() {
  var sectionTag = document.querySelector('.container-fluid');
  sectionTag.innerHTML = "\n        <section class=\"row\">\n            <p id=\"questionText\"></p>\n        </section>\n\n        <section id=\"labelBox\" class=\"row\">\n\n            <!-- Left-side-actions -->\n            <div class=\"labels-left col-md-6 col-12\"></div>\n\n            <!-- Right-side-actions -->\n            <div class=\"labels-right col-md-6 col-12 justify-content-end\">\n                <div id=\"action-show-solutions\" class=\"label-text\">\n                    Show Solutions\n                </div>\n            </div>\n        </section>\n\n        <section id=\"optionsBox\"></section>\n\n        <section id=\"solutionBox\">\n            <div class=\"row\">\n                <p class=\"solution-header\" style=\"font-family: 'SF Pro Display';\">Solution:</p>\n            </div>\n\n            <div class=\"row\">\n                <p class=\"solution-text\"></p>\n            </div>\n        </section>\n\n        <section id=\"error\" class=\"row\">\n            <div class=\"error-container\">\n                <object class=\"error-icon\" data=\"../assets/svg/Vector.svg\" width=\"20\" height=\"20\"></object>\n\n                <span class=\"error-text\">\n                    Report Error\n                </span>\n            </div>\n        </section>\n    ";
}
function resetDoc() {
  var bodyElement = document.querySelector('.container-fluid');
  bodyElement.innerHTML = '';
}
// var data3 = {
//   _id: '6486f3bb25f4f9591544bbcd',
//   type: 'singleCorrect',
//   level: 1,
//   category: null,
//   approximateTimeRequired: 90,
//   imageBaseUrl: null,
//   helperText: null,
//   source: '1',
//   classes: [],
//   exams: ['615d76b2c52ffa3c944600df'],
//   subjects: ['615d708dbd4a37c4058ee5a8'],
//   chapters: ['615d6fec2b295b085ab6eb8e'],
//   topics: [],
//   concepts: [],
//   microConcepts: [],
//   questionLabels: [
//     {
//       title: 'Topic',
//       value: "Newton's laws of motion",
//       isVisible: false,
//     },
//     {
//       title: 'Concept',
//       value: "Newton's laws of motion",
//       isVisible: false,
//     },
//   ],
//   previousYearPapers: [
//     {
//       _id: '6486f36a359a7055d5a58b1a',
//       title: 'JEE Main 2023 (15 Apr Shift 1)',
//     },
//   ],
//   question: {
//     text: 'The position vector of a particle related to time <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>t</mi></math> is given by&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>r</mi><mo>&#8594;</mo></mover><mo>=</mo><mfenced><mrow><mn>10</mn><mi>t</mi><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>15</mn><msup><mi>t</mi><mn>2</mn></msup><mover><mi>j</mi><mo>^</mo></mover><mo>+</mo><mn>7</mn><mover><mi>k</mi><mo>^</mo></mover></mrow></mfenced><mi mathvariant="normal">m</mi></math>.&nbsp;The direction of net force experienced by the particle is :',
//     image: null,
//   },
//   options: [
//     {
//       id: 'pMAWJ',
//       text: 'Positive <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>-axis',
//       image: null,
//       isCorrect: false,
//     },
//     {
//       id: '30p7A',
//       text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>In</mi><mo>&#160;</mo><mi>x</mi><mo>-</mo><mi>y</mi></math> plane',
//       image: null,
//       isCorrect: false,
//     },
//     {
//       id: 'Iqfbs',
//       text: 'Positive <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>y</mi></math>-axis',
//       image: null,
//       isCorrect: true,
//     },
//     {
//       id: '8IeIq',
//       text: 'Positive <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>z</mi></math>-axis',
//       image: null,
//       isCorrect: false,
//     },
//   ],
//   correctValue: null,
//   solution: {
//     text: '<blockquote><p>Given, the position vector of the particle is</p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>r</mi><mo>&#8594;</mo></mover><mo>=</mo><mn>10</mn><mi>t</mi><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>15</mn><msup><mi>t</mi><mn>2</mn></msup><mover><mi>j</mi><mo>^</mo></mover><mo>+</mo><mn>7</mn><mover><mi>k</mi><mo>^</mo></mover></math></p><p>The velocity of the particle can be calculated as follows:</p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mtable columnalign="right center left" columnspacing="0px"><mtr><mtd><mover><mi>v</mi><mo>&#8594;</mo></mover></mtd><mtd><mo>=</mo></mtd><mtd><mfrac><mrow><mi>d</mi><mover><mi>r</mi><mo>&#8594;</mo></mover></mrow><mrow><mi>d</mi><mi>t</mi></mrow></mfrac></mtd></mtr><mtr><mtd></mtd><mtd><mo>=</mo></mtd><mtd><mfrac><mi>d</mi><mrow><mi>d</mi><mi>t</mi></mrow></mfrac><mfenced><mrow><mn>10</mn><mi>t</mi><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>15</mn><msup><mi>t</mi><mn>2</mn></msup><mover><mi>j</mi><mo>^</mo></mover><mo>+</mo><mn>7</mn><mover><mi>k</mi><mo>^</mo></mover></mrow></mfenced></mtd></mtr><mtr><mtd></mtd><mtd><mo>=</mo></mtd><mtd><mo>&#160;</mo><mn>10</mn><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>30</mn><mi>t</mi><mover><mi>j</mi><mo>^</mo></mover></mtd></mtr></mtable></math></p><p>And, the acceleration of the particle is given by</p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mtable columnalign="right center left" columnspacing="0px"><mtr><mtd><mover><mi>a</mi><mo>&#8594;</mo></mover></mtd><mtd><mo>=</mo></mtd><mtd><mfrac><mrow><mi>d</mi><mover><mi>v</mi><mo>&#8594;</mo></mover></mrow><mrow><mi>d</mi><mi>t</mi></mrow></mfrac></mtd></mtr><mtr><mtd></mtd><mtd><mo>=</mo></mtd><mtd><mfrac><mi>d</mi><mrow><mi>d</mi><mi>t</mi></mrow></mfrac><mfenced><mrow><mn>10</mn><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>30</mn><mi>t</mi><mover><mi>j</mi><mo>^</mo></mover></mrow></mfenced></mtd></mtr><mtr><mtd></mtd><mtd><mo>=</mo></mtd><mtd><mn>30</mn><mover><mi>j</mi><mo>^</mo></mover></mtd></mtr></mtable></math></p><p>Hence, the force on the particle can be written as</p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mtable columnalign="right center left" columnspacing="0px"><mtr><mtd><mover><mi>F</mi><mo>&#8594;</mo></mover></mtd><mtd><mo>=</mo></mtd><mtd><mi>m</mi><mover><mi>a</mi><mo>&#8594;</mo></mover></mtd></mtr><mtr><mtd></mtd><mtd><mo>=</mo></mtd><mtd><mn>30</mn><mi>m</mi><mover><mi>j</mi><mo>^</mo></mover></mtd></mtr></mtable></math></p></blockquote>',
//     image: null,
//   },
//   videoSolution: null,
//   masterId: 'MOGJMPYQ02453484',
//   numericalLowerLimit: '',
//   numericalUpperLimit: '',
//   bucket: 'Must Do Ques (JEE Main) - Any Difficulty',
//   isRemoved: false,
//   cpyqbSubjects: [
//     '616057750283de43c87e3e1b',
//     '61c055eae8ce0dc8a5c62d33',
//     '629105adee9e3ae00d63352b',
//     '61964fe0a5a5260118868021',
//     '616056cd0283de43c87e3e15',
//     '616057190283de43c87e3e18',
//     '61a8a2c2e8ce0dc8a5c62d2d',
//     '62962075e7f8e9ac4daeafd7',
//     '616057920283de43c87e3e1e',
//     '61bb58181213731910ea0b70',
//     '615f0c729476412f48314dab',
//     '61964f81a5a526011886801d',
//     '629f385f263330a77be9fa7d',
//     '629f39e4ac11b26562e0625b',
//   ],
//   cpyqbChapters: [
//     '616023b9c2e3bbfc3f2ecdd2',
//     '61964c76bae973f89e899882',
//     '61964c74ec1ca6c1a7365dcf',
//     '61bb821fa52006d37a60e707',
//     '616023b74026d68c120f2ba9',
//     '616023b542cfec4323be20b3',
//     '61e7bd7991a3d691658409aa',
//     '616023b78dba43da23bef37e',
//     '61c089a30f62a0d239520145',
//     '616023b36f5a53c6a5d4ce42',
//     '629621223df2fbbc95bf297f',
//     '629109ec048d30f09d45ec7c',
//     '629f3a90cf4faea06a760897',
//     '629f390ce1a391b9376aa0de',
//   ],
//   cpyqbExams: ['616059af0283de43c87e3e23', '615f0e999476412f48314daf'],
// };
// setQuestion({ ...data3, selectedOptions: ['Iqfbs'], status: 'incorrect' }, 'dark');