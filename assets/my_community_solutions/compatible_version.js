'use strict';

// var Android = {
//   questionClicked: function (toggle) {
//     Android.toast('Toggled: ', toggle);
//   },
//   onQuestionClick: function () {
//     console.log('Question clicked')
//   }
// };

/*Above Android object, only for testing purposes.*/
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
      preview: 'none',
      processEscapes: true,
      inlineMath: [['$', '$'], ['\\(', '\\)'], ['{tex}', '{/tex}']]
    },
    CommonHTML: {
      linebreaks: {
        automatic: false
      }
    }
  });
  MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
}

///////
function questionReplaceNewLine(question) {
  var searchFor = /\n/g;
  var replaceWith = '<br>';
  question.question.text = question.question.text.replace(searchFor, replaceWith);
  for (var i = 0; i < question.options.length; i++) {
    question.options[i].text = question.options[i].text.replace(searchFor, replaceWith);
  }
}

///////
/*populate function -->*/

function populateOptions(optionsBox, options, type, theme) {
  var optionsHTML = '';
  if (type === 'numerical') {
    optionsHTML += '<div class="option-container row"><div id="main-options" class="option"><input id="inputAns" type="text" class="numerical-input form-control" placeholder="Enter your answer" aria-label="numerical" onkeypress="return isNumberKey(this, event);"></div><div class="option-badge"><p class="option-badge-text"></p></div></div>';
  } else {
    var getOptionsArray = getOptionsByState(type, 'default', theme);
    for (var i = 0; i < options.length; i++) {
      var opt = options[i],
        optionSrc = getOptionsArray[i],
        newOption = '<div class="option-container row"><div id="' + opt.id + '" class="option"><img src="' + optionSrc + '" class="option-icon"></img><div class="option-text">' + opt.text + '</div></div><div class="option-badge"><p class="option-badge-text"></p></div></div>';
      optionsHTML += newOption;
    }
  }
  optionsBox.innerHTML = optionsHTML;
}
/*<-- populate function*/

/*get options image function-->*/
function getOptionsByState(questionType, state, theme) {
  var type = questionType === 'singleCorrect' ? 'single' : 'multiple';
  switch (state) {
    case 'selected':
      if (theme === 'dark') {
        return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_selected_dark.svg', '../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_selected_dark.svg', '../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_selected_dark.svg', '../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_selected_dark.svg'];
      } else {
        return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_selected.svg', '../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_selected.svg', '../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_selected.svg', '../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_selected.svg'];
      }
    case 'correct':
      return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_correct.svg', '../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_correct.svg', '../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_correct.svg', '../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_correct.svg'];
    case 'incorrect':
      return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_incorrect.svg', '../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_incorrect.svg', '../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_incorrect.svg', '../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_incorrect.svg'];
    default:
      if (theme === 'dark') {
        return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_default_dark.svg', '../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_default_dark.svg', '../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_default_dark.svg', '../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_default_dark.svg'];
      } else {
        return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_default.svg', '../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_default.svg', '../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_default.svg', '../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_default.svg'];
      }
  }
}
/*<--get options image function*/
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
/* resize images inside question-text -->*/
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
/* <-- resize images inside question-text*/
/* resize images inside options -->*/
function questionOptionsResizeAllImages(question) {
  for (var x = 0; x < question.options.length; x++) {
    var _quesOpt;
    var quesOpt = question === null || question === void 0 ? void 0 : question.options[x];
    if ((_quesOpt = quesOpt) !== null && _quesOpt !== void 0 && (_quesOpt = _quesOpt.text) !== null && _quesOpt !== void 0 && _quesOpt.includes('<img')) {
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
/* <-- resize images inside options*/
/*show correct value function -->*/
function checkOptionsAnswer(question) {
  var optionsBox = document.querySelectorAll('.option-container');
  var optionsBoxIndexes = {};
  for (var x = 0; x < optionsBox.length; x++) {
    var optionBoxEl = optionsBox[x];
    optionsBoxIndexes[optionBoxEl.firstElementChild.id] = x;
  }
  var options = {};
  for (var i = 0; i < question.options.length; i++) {
    var opt = question.options[i];
    if (opt.isCorrect === true) {
      options[opt.id] = true;
    } else {
      options[opt.id] = false;
    }
  }
  for (var key in options) {
    if (options[key] === true) {
      var option = document.getElementById('' + key);
      if (!option) {
        console.log('not found', {
          option: option,
          key: key
        });
        return;
      }
      var optionIcon = option.firstElementChild,
        optionBadge = option.nextElementSibling,
        optionBadgeText = optionBadge.firstElementChild;
      optionBadgeText.textContent = 'Correct Answer';
      optionBadge.classList.add('correct-answer');
      option.style.border = '1px solid #31d99c';
      optionIcon.src = getOptionsByState(question.type, 'correct', null)[optionsBoxIndexes[key]];
    }
  }
}
function checkNumericalAnswer(question, input) {
  var newValue = null;
  if (input[input.length - 1] === '.') newValue = input + '0';
  var correctAnswer = question.correctValue;
  var solutionBadge = document.querySelector('.option-badge'),
    solutionBadgeText = document.querySelector('.option-badge-text'),
    numericalInputContainer = document.getElementById('main-options'),
    inputField = document.getElementById('inputAns'),
    userAnswer = newValue ? newValue : input;
  if (solutionBadgeText) {
    var answerBox = document.getElementById('answer-box');
    if (answerBox) {
      answerBox.innerHTML = '<div class="row"><p class="solution-header">Answer:</p></div><div class="row"><p class="answer-text">' + correctAnswer + '</p></div>';
    } else {
      var newDiv = document.createElement('div');
      newDiv.id = 'answer-box';
      newDiv.innerHTML = '<div class="row"><p class="solution-header">Answer:</p></div><div class="row"><p class="answer-text">' + correctAnswer + '</p></div>';
    }
  }
  if (!input) {
    inputField.value = correctAnswer;
  } else {
    inputField.value = userAnswer;
  }
  inputField.disabled = true;

  // If the answer is incorrect
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
/*<--show correct value function*/

/*toggle view [Android function call]--> */
function toggleView() {
  var questionText = document.getElementById('id-q-title');
  var questionOptions = document.getElementById('id-q-options');
  if (questionText.classList.contains('truncated')) {
    questionText.classList.remove('truncated');
    questionOptions.style.display = 'grid';
  } else if (!questionText.classList.contains('truncated')) {
    questionText.classList.add('truncated');
    questionOptions.style.display = 'none';
  }
}
/*<--toggle view [Android function call]*/

function loadQuestionTitle(qText, question, theme) {
  var _qText, _question, _question6, _question7, _question8;
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hide';
  qText = (_qText = qText) === null || _qText === void 0 ? void 0 : _qText.data;
  question = (_question = question) === null || _question === void 0 ? void 0 : _question.data;
  if (!qText || !question) return console.log('qText or question is undefined');
  var showOneLine = true;
  if (typeof qText === 'undefined' || typeof question === 'undefined') return Android.logMessage("screenType: undefined");
  var body = document.querySelector('body');
  if (theme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');
  var questionText = document.createElement('div');
  var questionOptions = document.createElement('div');
  questionText.classList.add('question-title');
  questionText.setAttribute('id', 'id-q-title');
  questionOptions.classList.add('question-options');
  questionOptions.setAttribute('id', 'id-q-options');

  //show options
  populateOptions(questionOptions, question.options, question.type);
  questionOptionsResizeAllImages(question);
  questionText.innerHTML = qText;
  questionTextResizeAllImages({
    question: {
      text: qText
    }
  });
  questionReplaceNewLine({
    question: {
      text: qText
    },
    options: question.options
  });
  root.onclick = function () {
    if (type === 'default' && showOneLine) {
      var _question2, _question3, _question4;
      questionText.classList.remove('truncated');
      questionOptions.style.display = 'grid';
      if (((_question2 = question) === null || _question2 === void 0 ? void 0 : _question2.type) === 'singleCorrect' || ((_question3 = question) === null || _question3 === void 0 ? void 0 : _question3.type) === 'multipleCorrect') {
        checkOptionsAnswer(question);
      } else if (((_question4 = question) === null || _question4 === void 0 ? void 0 : _question4.type) === 'numerical') {
        var _question5;
        checkNumericalAnswer(question, (_question5 = question) === null || _question5 === void 0 ? void 0 : _question5.correctValue);
      }
      showOneLine = !showOneLine;
    } else if (type === 'default' && !showOneLine) {
      questionText.classList.add('truncated');
      questionOptions.style.display = 'none';
      showOneLine = !showOneLine;
    }
  };
  root.appendChild(questionText);
  root.appendChild(questionOptions);
  if (type === 'default' && showOneLine || type === 'hide') {
    questionText.classList.add('truncated');
    questionOptions.style.display = 'none';
  } else if (type === 'show' || showOneLine === false) {
    questionText.classList.remove('truncated');
    questionOptions.style.display = 'grid';
  }
  if (((_question6 = question) === null || _question6 === void 0 ? void 0 : _question6.type) === 'singleCorrect' || ((_question7 = question) === null || _question7 === void 0 ? void 0 : _question7.type) === 'multipleCorrect') {
    checkOptionsAnswer(question);
  } else if (((_question8 = question) === null || _question8 === void 0 ? void 0 : _question8.type) === 'numerical') {
    var _question9;
    checkNumericalAnswer(question, (_question9 = question) === null || _question9 === void 0 ? void 0 : _question9.correctValue);
  }
  setTypeset();
}

/* dummy data below for testing */
// const text = {
//   "data": '<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mi>Assertion</mi><mo>&#160;</mo><mi>A</mi><mo>:</mo></math> If <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>A</mi><mo>,</mo><mo>&#160;</mo><mi>B</mi><mo>,</mo><mo>&#160;</mo><mi>C</mi><mo>,</mo><mo>&#160;</mo><mi>D</mi></math> are four points on a semi-circular arc with a centre at <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>O</mi></math> such that <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>|</mo><mover><mrow><mi>A</mi><mi>B</mi></mrow><mo>&#8594;</mo></mover><mo>|</mo><mo>=</mo><mo>|</mo><mover><mrow><mi>B</mi><mi>C</mi></mrow><mo>&#8594;</mo></mover><mo>|</mo><mo>=</mo><mo>|</mo><mover><mrow><mi>C</mi><mi>D</mi></mrow><mo>&#8594;</mo></mover><mo>|</mo><mo>.</mo></math>&nbsp;Then,&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mrow><mi>A</mi><mi>B</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>A</mi><mi>C</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>A</mi><mi>D</mi></mrow><mo>&#8594;</mo></mover><mo>=</mo><mn>4</mn><mover><mrow><mi mathvariant="italic">A</mi><mi mathvariant="italic">O</mi></mrow><mo mathvariant="italic">&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>O</mi><mi>B</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>O</mi><mi>C</mi></mrow><mo>&#8594;</mo></mover></math></p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mi>Reason</mi><mo>&#160;</mo><mi>R</mi><mo>:</mo></math> Polygon law of vector addition yields <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mrow><mi>A</mi><mi>B</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>B</mi><mi>C</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>C</mi><mi>D</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>A</mi><mi>D</mi></mrow><mo>&#8594;</mo></mover><mo>=</mo><mn>2</mn><mover><mrow><mi mathvariant="italic">A</mi><mi mathvariant="italic">O</mi></mrow><mo mathvariant="italic">&#8594;</mo></mover></math></p><p><img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/ca64fd8d-ea77-4c07-93d2-d3ab941483f5-image.png" style="width: 192px; height: 106px;" /></p><p>In the light of the above statements, choose the most appropriate answer from the options given below.</p>'
// };
// const question = {
//   "data": {
//     "_id": "64b16a83f23ac7d519f9b517",
//     "type": "multipleCorrect",
//     "options": [
//       {
//         "id": "z1vHq",
//         "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>a</mi><mi>x</mi></msub><mo>=</mo><mn>1</mn><mo>&#160;</mo><mi mathvariant=\"normal\">m</mi><mo>&#160;</mo><msup><mi mathvariant=\"normal\">s</mi><mrow><mo>-</mo><mn>2</mn></mrow></msup></math> implies that when the particle is at the origin, <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>a</mi><mi>y</mi></msub><mo>=</mo><mn>1</mn><mo>&#160;</mo><mi mathvariant=\"normal\">m</mi><mo>&#160;</mo><msup><mi mathvariant=\"normal\">s</mi><mrow><mo>-</mo><mn>2</mn></mrow></msup></math>",
//         "isCorrect": true,
//         "image": null
//       },
//       {
//         "id": "JrSid",
//         "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>a</mi><mi>x</mi></msub><mo>=</mo><mn>0</mn></math> implies&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>a</mi><mi>y</mi></msub><mo>=</mo><mn>1</mn><mo>&#160;</mo><mi mathvariant=\"normal\">m</mi><mo>&#160;</mo><msup><mi mathvariant=\"normal\">s</mi><mrow><mo>-</mo><mn>2</mn></mrow></msup></math>&nbsp;at all times",
//         "isCorrect": true,
//         "image": null
//       },
//       {
//         "id": "4in3i",
//         "text": "at&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>t</mi><mo>=</mo><mn>0</mn><mo>,</mo></math> the particle&#39;s velocity points in the&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi></math>-direction",
//         "isCorrect": true,
//         "image": null
//       },
//       {
//         "id": "qODYC",
//         "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>a</mi><mi>x</mi></msub><mo>=</mo><mn>0</mn></math> implies that at&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>t</mi><mo>=</mo><mn>1</mn><mi mathvariant=\"normal\">s</mi><mo>,</mo></math> the angle between the particle&#39;s velocity and the&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi></math> axis is&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>45</mn><mo>&#176;</mo></math>",
//         "isCorrect": true,
//         "image": null
//       }
//     ],
//     "correctValue": null
//   }
// };
// 'show'/'hide'/'default'

// var nextBtn = document.getElementById('fullViewBtn');
// nextBtn.addEventListener('click', function (e) {
//   e.preventDefault();
//   toggleView(question);
// });

// loadQuestionTitle(text, question, 'dark');
