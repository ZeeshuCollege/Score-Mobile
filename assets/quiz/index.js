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
  for (var j = 0; i < question.options.length; j++) {
    var opt = question.options[j];
    if (opt.text.includes('<img')) {
      var finalImages = [],
        htmlToImages = Array.prototype.slice.call(document.images);
      for (var i = 0; i < htmlToImages.length; i++) {
        var image = htmlToImages[i];
        if (!image.complete) finalImages.push(new Promise(function (resolve) {
          image.onload = image.onerror = resolve;
        }));
      }
      Promise.all(finalImages).then(function () {
        var allOptionImages = document.querySelectorAll('.option-text img');
        resizeImages(allOptionImages);
      });
    }
  }
}
function populateLabels(labelsLeft, questionLabels) {
  var newLabels = document.createElement('div');
  newLabels.style.cssText = labelsLeft.classList;
  for (var i = 0; i < questionLabels.length; i++) {
    var label = questionLabels[i];
    var outerDiv = document.createElement('div'),
      innerDiv = document.createElement('div');
    outerDiv.className = 'label-container';
    innerDiv.className = 'label-text';
    innerDiv.innerHTML = label.title;
    outerDiv.appendChild(innerDiv);
    outerDiv.style.display = label.isVisible ? 'flex' : 'none';
    newLabels.appendChild(outerDiv);
    labelsLeft.appendChild(newLabels);
  }
}
function populateOptions(optionsBox, options, type, selectedOptions, numericalAnswer, theme) {
  var optionsHTML = '';
  if (type === 'numerical') {
    optionsHTML += "\n            <div class=\"option-container row\">\n                <div id=\"main-options\" class=\"option\">\n                    <input id=\"inputAns\" value=\"".concat(numericalAnswer ? numericalAnswer : '', "\" type=\"number\" class=\"numerical-input form-control\" placeholder=\"Enter your answer\" aria-label=\"numerical\">\n                </div>\n                <div class=\"option-badge\">\n                    <p class=\"option-badge-text\"></p>\n                </div>\n            </div>\n        ");
  } else {
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var state = 'default';
      var isSelected = ' ';
      if (selectedOptions) {
        var contains = false;
        for (var _i2 = 0; _i2 < selectedOptions.length; _i2++) {
          if (selectedOptions[_i2] == opt.id) {
            state = 'selected';
            isSelected = ' option_state_selected';
            break;
          }
        }
      }
      var getOptionsArray = getOptionsByState(type, state, theme);
      var optionSrc = getOptionsArray[i];
      var newOption = "\n                <div class=\"option-container row\">\n                    <div id=\"".concat(opt.id, "\" class=\"option ").concat(isSelected, "\">\n                        <img src=\"").concat(optionSrc, "\" class=\"option-icon\"></img>\n                        <div class=\"option-text\">").concat(opt.text, "</div>\n                    </div>\n                    <div class=\"option-badge\">\n                        <p class=\"option-badge-text\"></p>\n                    </div>\n                </div>\n            ");
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
  // displayShowSolutions();
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
function setQuestion(question, status, theme) {
  Android.showToast("question: ".concat(JSON.stringify(status)));
  var body = document.querySelector('body');
  if (theme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');
  resetFields();
  var questionTextPara = document.getElementById('questionText'),
    labelsLeft = document.querySelector('.labels-left'),
    optionsBox = document.getElementById('optionsBox'),
    solutionBox = document.getElementById('solutionBox'),
    errorBox = document.getElementById('error');
  // Populating the question-text paragraph
  questionTextPara.innerHTML = question.question.text;
  // Resizing Images in Question Title
  questionTextResizeAllImages(question);
  // Populating the options
  if (status != undefined) {
    Android.showToast("question: Inside status");
    populateOptions(optionsBox, question.options, question.type, status.selectedOptions, status.numericalAnswer, theme);
  } else {
    Android.showToast("question: Not Inside status");
    populateOptions(optionsBox, question.options, question.type, [], false, theme);
  }
  questionOptionsResizeAllImages(question);
  // User has attempted the question beforehand
  //    if (status.status === 'answered') {
  //        // Populating the labels
  //        populateLabels(labelsLeft, question.questionLabels);
  //        console.log('Status')
  //        console.log(status)
  //        console.log(status)
  //        let prevSelectedOptions = status.optionsMarked,
  //            prevNumericalAnswer = status.numericalAnswer,
  //            prevAnswerStatus = status.evalStatus;
  //        if (prevSelectedOptions) {
  //            // Single/Multi-correct based
  //            // Then add the proper badge on-top of the respective option [Correct Answer | Incorrect Answer]
  //            checkOptionsAnswer(question, prevSelectedOptions, prevAnswerStatus);
  //        } else if (prevNumericalAnswer) {
  //            // Numerical based
  //            // Then add the proper badge on-top of the input field option [Correct Answer | Incorrect Answer]
  //            checkNumericalAnswer(question, prevNumericalAnswer, prevAnswerStatus);
  //        }
  //        // displayShowSolutions();
  //    }
  // Event Listeners
  var optionsList = document.querySelectorAll('.option');
  if (question.type === 'singleCorrect') {
    var optionContainers = document.querySelectorAll('.option-container');
    var optionsBoxIndexes = {};
    for (var i = 0; i < optionContainers.length; i++) {
      var el = optionContainers[i];
      optionsBoxIndexes[el.firstElementChild.id] = i;
    }
    var _loop = function _loop() {
      var item = optionsList[_i3];
      item.addEventListener('click', function () {
        //Android.onOptionSelected(JSON.stringify({ msg: "option clicked" }));
        var lastSelectedEl = document.querySelector('.option_state_selected');
        if (lastSelectedEl) {
          lastSelectedEl.classList.remove('option_state_selected');
          lastSelectedEl.firstElementChild.src = getOptionsByState('singleCorrect', 'default', theme)[optionsBoxIndexes[lastSelectedEl.id]];
        }
        this.firstElementChild.src = getOptionsByState('singleCorrect', 'selected', theme)[optionsBoxIndexes[this.id]];
        this.classList.add('option_state_selected');
        var optionObject;
        for (var j = 0; j < question.options.length; j++) {
          var _el = question.options[j];
          if (_el.id === item.id) {
            optionObject = _el;
            break;
          }
        }
        if (lastSelectedEl && this.id === lastSelectedEl.id) {
          this.classList.remove('option_state_selected');
          this.firstElementChild.src = getOptionsByState('singleCorrect', 'default', theme)[optionsBoxIndexes[this.id]];
          optionObject = null;
        }
        Android.onOptionSelected(JSON.stringify(optionObject));
      });
    };
    for (var _i3 = 0; _i3 < optionsList.length; _i3++) {
      _loop();
    }
  } else if (question.type === 'multipleCorrect') {
    var _loop2 = function _loop2(_i4) {
      var item = optionsList[_i4];
      item.addEventListener('click', function () {
        var selected = false;
        if (this.getAttribute('class').includes('option_state_selected')) {
          this.firstElementChild.src = getOptionsByState('multipleCorrect', 'default', theme)[_i4];
          selected = false;
        } else {
          this.firstElementChild.src = getOptionsByState('multipleCorrect', 'selected', theme)[_i4];
          selected = true;
        }
        this.classList.toggle('option_state_selected');
        var optionObject = question.options.find(function (el) {
          return el.id === item.id;
        });
        //optionObject['isAlreadySelected'] = status?.selectedOptions?.includes(optionObject.id)
        optionObject['select'] = selected;
        Android.showToast("question: ".concat(JSON.stringify(optionObject)));
        Android.onOptionSelected(JSON.stringify(optionObject));
      });
    };
    for (var _i4 = 0; _i4 < optionsList.length; _i4++) {
      _loop2(_i4);
    }
  } else {
    var numericalInput = document.querySelector('.numerical-input');
    numericalInput.addEventListener('input', function (e) {
      Android.onInputChanged(e.target.value);
    });
  }
  errorBox.addEventListener('click', function () {
    Android.showReport();
  });
  setTypeset();
}
function checkNumericalAnswer(question, input, status) {
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
    newDiv.innerHTML = '<div class="row"><p class="solution-header">Answer:</p></div><div class="row"><p class="answer-text">' + correctAnswer + '</p></div>';
    solutionBox.prepend(newDiv);
  }
  if (!input && status) {
    inputField.value = correctAnswer;
  } else {
    inputField.value = userAnswer;
  }
  inputField.disabled = true;
  // If the answer is correct
  if (status) {
    if (Number(userAnswer) === Number(correctAnswer)) {
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
  else {
    if (Number(userAnswer) !== Number(correctAnswer)) {
      solutionBadgeText.textContent = 'Incorrect Answer';
      solutionBadge.classList.add('incorrect-answer');
      numericalInputContainer.style.border = '1px solid #ff5858';
    } else {
      solutionBadgeText.textContent = 'Correct Answer';
      solutionBadge.classList.add('correct-answer');
      numericalInputContainer.style.border = '1px solid #31d99c';
    }
  }
  formSubmitHandler(question, 'numerical');
}
function checkOptionsAnswer(question, selectedOptions, status, theme) {
  var optionsBox = document.querySelectorAll('.option-container');
  var optionsBoxIndexes = {};
  for (var i = 0; i < optionsBox.length; i++) {
    var el = optionsBox[i];
    optionsBoxIndexes[el.firstElementChild.id] = i;
  }
  var options = {};
  for (var _i6 = 0; _i6 < question.options.length; _i6++) {
    var opt = question.options[_i6];
    console.log('in option');
    console.log(opt);
    if (opt.isCorrect === true) {
      options[opt.id] = true;
    } else {
      options[opt.id] = false;
    }
  }
  for (var key in options) {
    if (options[key] === true) {
      var option = document.getElementById('' + key),
        optionIcon = option.firstElementChild,
        optionBadge = option.nextElementSibling,
        optionBadgeText = optionBadge.firstElementChild;
      optionBadgeText.textContent = 'Correct Answer';
      optionBadge.classList.add('correct-answer');
      option.style.border = '1px solid #31d99c';
      optionIcon.src = getOptionsByState(question.type, 'correct', theme)[optionsBoxIndexes[key]];
    }
  }
  for (var _i8 = 0; _i8 < selectedOptions.length; _i8++) {
    var _opt = selectedOptions[_i8].id;
    if (_opt) {
      var _option = document.getElementById('' + _opt),
        _optionIcon = _option.firstElementChild,
        _optionBadge = _option.nextElementSibling,
        _optionBadgeText = _optionBadge.firstElementChild;
      // Selected option is correct
      console.log('In Options');
      console.log(options);
      console.log(options[_opt]);
      console.log(status);
      if (options[_opt]) {
        _optionBadgeText.textContent = 'You Marked | Correct Answer';
        _optionBadge.classList.add('correct-answer');
        _option.style.border = '1px solid #31d99c';
        _optionIcon.src = getOptionsByState(question.type, 'correct', theme)[optionsBoxIndexes[_opt]];
      }
      // Selected option is incorrect
      else {
        _optionBadgeText.textContent = 'You Marked | Incorrect Answer';
        _optionBadge.classList.add('incorrect-answer');
        _option.style.border = '1px solid #ff5858';
        _optionIcon.src = getOptionsByState(question.type, 'incorrect', theme)[optionsBoxIndexes[_opt]];
        Android.showToast("option src: ".concat(_optionIcon));
      }
    }
  }
  formSubmitHandler(question, 'single-multi');
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
// setQuestion(
//   data3,
//   {
//     selectedOptions: ['pMAWJ'],
//     numericalAnswer: false,
//   },
//   'dark',
// );