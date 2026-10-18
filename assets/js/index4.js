// Helper Functions
function populateLabels(labelsLeft, questionLabels) {
  const newLabels = document.createElement('div');
  newLabels.classList = labelsLeft.classList;
  for (let i = 0; i < questionLabels.length; i++) {
    const label = questionLabels[i];
    const outerDiv = document.createElement('div'),
      innerDiv = document.createElement('div');
    outerDiv.className = 'label-container';
    innerDiv.className = 'label-text';
    innerDiv.innerHTML = label.title;
    outerDiv.appendChild(innerDiv);
    outerDiv.style.display = label.isVisible ? 'flex' : 'none';
    newLabels.appendChild(outerDiv);
    labelsLeft.replaceWith(newLabels);
  }
}
function populateOptions(optionsBox, options, type) {
  let optionsHTML = '';
  if (type === 'numerical') {
    optionsHTML +=
      '<div class="option-container row"><div id="main-options" class="option"><input id="inputAns" type="number" class="numerical-input form-control" placeholder="Enter your answer" aria-label="numerical"></div><div class="option-badge"><p class="option-badge-text"></p></div></div>';
  } else {
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const letter = String.fromCharCode(65 + i);
      const optionType = type === 'singleCorrect' ? ' option-single' : ' option-multiple';
      const newOption =
        '<div class="option-container row"><div id="' +
        opt.id +
        '" class="option"><div class="option-icon' +
        optionType +
        '"><span class="option-icon-text">' +
        letter +
        '</span></div><div class="option-text">' +
        opt.text +
        '</div></div><div class="option-badge"><p class="option-badge-text"></p></div></div>';
      optionsHTML += newOption;
    }
  }
  optionsBox.innerHTML = optionsHTML;
}
function formSubmitHandler(question, type) {
  const solutionBox = document.getElementById('solutionBox'),
    solutionTextPara = document.querySelector('.solution-text'),
    answerBox = document.getElementById('answer-box'),
    errorBox = document.getElementById('error');
  // Display showSolutions button
  displayShowSolutions();
  // Populating the solution-text paragraph
  solutionTextPara.innerHTML =
    typeof question.solution === 'object' ? question.solution.text : question.solution;
  solutionBox.style.display = 'block';
  if (answerBox) answerBox.style.display = 'block';
  errorBox.style.display = 'block';
  if (type != 'numerical') {
    const optionsList = document.querySelectorAll('.option');
    for (let i = 0; i < optionsList.length; i++) {
      const el = optionsList[i];
      el.style.pointerEvents = 'none';
    }
  }
  setTypeset()
}
function resetFields() {
  const solutionBox = document.getElementById('solutionBox'),
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
    const answerText = document.querySelector('.answer-text');
    answerText.textContent = '';
  }
  if (numericalInputContainer && inputField) {
    numericalInputContainer.style.border = '1px solid #dcdde2';
    inputField.value = '';
  }
}
function displayShowSolutions() {
  const showSolutionsBtn = document.getElementById('action-show-solutions');
  showSolutionsBtn.style.display = 'flex';
  showSolutionsBtn.addEventListener('click', function () {
    elementScrollTo('solutionBox')
  });
}
function elementScrollTo(element) {
  let elem = document.getElementById(element),
    x = 0,
    y = 0;
  while (elem != null) {
    x += elem.offsetLeft;
    y += elem.offsetTop;
    elem = elem.offsetParent;
  }
  window.scrollTo(x, y);
}
// Main Functions [to be called by Android]
function setTypeset(){
   MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
}
function setQuestion(question, status) {
    Android.showToast(`${JSON.stringify(question.question.text)}`)
  resetFields();
  const questionTextPara = document.getElementById('questionText'),
    labelsLeft = document.querySelector('.labels-left'),
    optionsBox = document.getElementById('optionsBox'),
    solutionBox = document.getElementById('solutionBox'),
    errorBox = document.getElementById('error');
  // Populating the question-text paragraph
  questionTextPara.innerHTML = question.question.text;
  // Populating the labels
  populateLabels(labelsLeft, question.questionLabels);
  // Populating the options
  populateOptions(optionsBox, question.options, question.type);
  // User has attempted the question beforehand
  if (status) {
    let prevSelectedOptions = status.selectedOption,
      prevNumericalAnswer = status.numericalAnswer,
      prevAnswerStatus = status.answerStatus;
    if (prevSelectedOptions) {
      // Single/Multi-correct based
      // Then add the proper badge on-top of the respective option [Correct Answer | Incorrect Answer]
      checkOptionsAnswer(question, prevSelectedOptions, prevAnswerStatus);
    } else if (prevNumericalAnswer) {
      // Numerical based
      // Then add the proper badge on-top of the input field option [Correct Answer | Incorrect Answer]
      checkNumericalAnswer(question, prevNumericalAnswer, prevAnswerStatus);
    }
    displayShowSolutions();
  }
  // Event Listeners
  const optionsList = document.querySelectorAll('.option');
  if (question.type === 'singleCorrect') {
    for (let i = 0; i < optionsList.length; i++) {
      const item = optionsList[i];
      item.addEventListener('click', function () {
        let selectedEl = document.querySelector('.option_state_selected');
        if (selectedEl) {
          selectedEl.classList.remove('option_state_selected');
        }
        this.classList.add('option_state_selected');
        const optionObject = question.options.find(function (el) {
          return el.id === item.id;
        });
        Android.onOptionSelected(JSON.stringify(optionObject));
      });
    }
  } else if (question.type === 'multipleCorrect') {
    for (let i = 0; i < optionsList.length; i++) {
      const item = optionsList[i];
      item.addEventListener('click', function (e) {
        const elem = e.target;
        elem.classList.toggle('option_state_selected');
        const optionObject = question.options.find(function (el) {
          return el.id === item.id;
        });
        Android.onOptionSelected(JSON.stringify(optionObject));
      });
    }
  } else {
    const numericalInput = document.querySelector('.numerical-input');
    numericalInput.addEventListener('input', function (e) {
      Android.onInputChanged(e.target.value);
    });
  }
  errorBox.addEventListener('click', function () {
    Android.showReport();
  });
  setTypeset()
}
function checkNumericalAnswer(question, input, status) {
  const correctAnswer = question.correctValue;
  const userAnswer = input;
  const solutionBox = document.getElementById('solutionBox'),
    solutionBadge = document.querySelector('.option-badge'),
    solutionBadgeText = document.querySelector('.option-badge-text'),
    numericalInputContainer = document.getElementById('main-options'),
    inputField = document.getElementById('inputAns');
  if (solutionBadgeText) {
    const newDiv = document.createElement('div');
    newDiv.id = 'answer-box';
    newDiv.innerHTML =
      '<div class="row"><p class="solution-header">Answer:</p></div><div class="row"><p class="answer-text">' +
      correctAnswer +
      '</p></div>';
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
function checkOptionsAnswer(question, selectedOptions, status) {
  const options = {};
  for (let i = 0; i < question.options.length; i++) {
    const opt = question.options[i];
    if (opt.isCorrect === true) {
      options[opt.id] = true;
    } else {
      options[opt.id] = false;
    }
  }
  for (let key in options) {
    if (options[key] === true) {
      const option = document.getElementById('' + key),
        optionIcon = option.firstElementChild,
        optionIconText = optionIcon.firstElementChild,
        optionBadge = option.nextElementSibling,
        optionBadgeText = optionBadge.firstElementChild;
      optionBadgeText.textContent = 'Correct Answer';
      optionBadge.classList.add('correct-answer');
      option.style.border = '1px solid #31d99c';
      optionIcon.style.background = '#31d99c';
      optionIconText.style.color = '#ffffff';
    }
  }
  for (let i = 0; i < selectedOptions.length; i++) {
    const opt = selectedOptions[i].id;
    const option = document.getElementById('' + opt),
      optionIcon = option.firstElementChild,
      optionIconText = optionIcon.firstElementChild,
      optionBadge = option.nextElementSibling,
      optionBadgeText = optionBadge.firstElementChild;
    // Selected option is correct
    if (options[opt] && (status === 0 || status === 1 || status === 2)) {
      optionBadgeText.textContent = 'You Marked | Correct Answer';
      optionBadge.classList.add('correct-answer');
      option.style.border = '1px solid #31d99c';
      optionIcon.style.background = '#31d99c';
      optionIconText.style.color = '#ffffff';
    }
    // Selected option is incorrect
    else {
      optionBadgeText.textContent = 'You Marked | Incorrect Answer';
      optionBadge.classList.add('incorrect-answer');
      option.style.border = '1px solid #ff5858';
      optionIcon.style.background = '#ff5858';
      optionIconText.style.color = '#ffffff';
    }
  }
  formSubmitHandler(question, 'single-multi');
}