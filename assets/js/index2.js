const populateLabels = function (labelsLeft, questionLabels) {
  questionLabels.forEach((label) => {
    const outerDiv = document.createElement('div'),
      innerDiv = document.createElement('div');
    outerDiv.appendChild(innerDiv);
    outerDiv.className = 'label-container col-lg-3 col-md-3 col-xs-4';
    innerDiv.className = 'label-text';
    innerDiv.innerHTML = label.title;
    outerDiv.style.display = label.isVisible ? 'flex' : 'none';
    labelsLeft.appendChild(outerDiv);
  });
};
const populateOptions = function (optionsBox, options) {
  let optionsHTML = '';
  if (!options.length) {
    optionsHTML += `
    <div class="option-container row">
      <div id="main-options" class="option">
        <input id="inputAns" type="number" class="numerical-input form-control" placeholder="Enter your answer" aria-label="numerical">
      </div>
      <div class="option-badge">
        <p class="option-badge-text"></p>
      </div>
    </div>
  `;
  } else {
    options.forEach((opt, idx) => {
      const newOption = `
      <div class="option-container row">
        <div id="${opt.id}" class="option">
          <div class="option-icon"><span class="option-icon-text">${String.fromCharCode(
            65 + idx
          )}</span></div>
          <div class="option-text">${opt.text}</div>
        </div>
​
        <div class="option-badge">
          <p class="option-badge-text"></p>
        </div>
      </div>
      `;
      optionsHTML += newOption;
    });
  }
  optionsBox.innerHTML = optionsHTML;
};
function setQuestion(question, status) {
    Android.showToast(`setQuestion ${question._id} | ${status}`)
  const questionTextPara = document.getElementById('questionText'),
    labelsLeft = document.querySelector('.labels-left'),
    optionsBox = document.getElementById('optionsBox'),
    solutionBox = document.getElementById('solutionBox'),
    solutionTextPara = document.querySelector('.solution-text'),
    errorBox = document.getElementById('error');
  // Populating the question-text paragraph
  questionTextPara.innerHTML = question.question.text;
  // Populating the labels
  populateLabels(labelsLeft, question.questionLabels);
  // Populating the options
  populateOptions(optionsBox, question.options);
  // Populating the solution-text paragraph
  solutionTextPara.innerHTML =
    typeof question.solution === 'object' ? question.solution.text : question.solution;
  // User has attempted the question beforehand
  if (status) {
    const showSolutionsBtn = document.getElementById('action-show-solutions');
    showSolutionsBtn.style.display = 'flex';
    let prevSelectedOptions = status.selectedOption,
      prevNumericalAnswer = status.numericalAnswer,
      prevAnswerStatus = status.answerStatus;
    if (prevSelectedOptions) {
      // Single/Multi-correct based
      // Then add the proper badge on-top of the respective option [Correct Answer | Incorrect Answer]
      checkOptionsAnswer(question, prevSelectedOptions, prevAnswerStatus);
      showSolutionsBtn.addEventListener('click', function () {
        checkOptionsAnswer(question, prevSelectedOptions, prevAnswerStatus);
      });
    } else if (prevNumericalAnswer) {
      // Numerical based
      // Then add the proper badge on-top of the input field option [Correct Answer | Incorrect Answer]
      checkNumericalAnswer(question, prevNumericalAnswer, prevAnswerStatus);
      showSolutionsBtn.addEventListener('click', function () {
        checkNumericalAnswer(question, prevNumericalAnswer, prevAnswerStatus);
      });
    }
    setTimeout(function () {
      solutionBox.scrollIntoView();
    }, 1000);
  }
  const optionsList = document.querySelectorAll('.option');
  // Event Listeners
  if (question.type === 'singleCorrect') {
    for (let i = 0; i < optionsList.length; i++) {
      const item = optionsList[i];
      item.addEventListener('click', function () {
        let selectedEl = document.querySelector('.option_state_selected');
        if (selectedEl) {
          selectedEl.classList.remove('option_state_selected');
        }
        this.classList.add('option_state_selected');
        const optionObject = question.options.find((el) => el.id === item.id);
        Android.onOptionSelected(JSON.stringify(optionObject));
      });
    }
  } else if (question.type === 'multipleCorrect') {
    for (let i = 0; i < optionsList.length; i++) {
      const item = optionsList[i];
      item.addEventListener('click', function (e) {
        const elem = e.target;
        elem.classList.toggle('option_state_selected');
        const optionObject = question.options.find((el) => el.id === item.id);
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
}
function checkNumericalAnswer(question, input, status) {
    Android.showToast(`checkNumerical: ${question._id} | ${input} ${status}`)
  const correctAnswer = question.correctValue;
  const userAnswer = input;
  const solutionBox = document.getElementById('solutionBox'),
    solutionBadge = document.querySelector('.option-badge'),
    solutionBadgeText = document.querySelector('.option-badge-text'),
    numericalInputContainer = document.getElementById('main-options'),
    inputField = document.getElementById('inputAns');
  if (solutionBadgeText) {
    const newDiv = document.createElement('div');
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
    if (userAnswer === correctAnswer) {
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
    if (userAnswer !== correctAnswer) {
      solutionBadgeText.textContent = 'Incorrect Answer';
      solutionBadge.classList.add('incorrect-answer');
      numericalInputContainer.style.border = '1px solid #ff5858';
    } else {
      solutionBadgeText.textContent = 'Correct Answer';
      solutionBadge.classList.add('correct-answer');
      numericalInputContainer.style.border = '1px solid #31d99c';
    }
  }
  afterSubmitFormHandler('numerical');
}
function checkOptionsAnswer(question, selectedOptions, status) {
    Android.showToast(`checkOption: ${question._id} | ${selectedOptions} ${status}`)
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
        optionBadge = option.nextElementSibling,
        optionBadgeText = optionBadge.firstElementChild;
      optionBadgeText.textContent = 'Correct Answer';
      optionBadge.classList.add('correct-answer');
      option.style.border = '1px solid #31d99c';
    }
  }
  for (let i = 0; i < selectedOptions.length; i++) {
    const opt = selectedOptions[i];
    const option = document.getElementById('' + opt),
      optionBadge = option.nextElementSibling,
      optionBadgeText = optionBadge.firstElementChild;
    // Selected option is correct
    if ((options[opt] && status === 1) || (options[opt] && status === 2)) {
      optionBadgeText.textContent = 'You Marked | Correct Answer';
      optionBadge.classList.add('correct-answer');
      option.style.border = '1px solid #31d99c';
    }
    // Selected option is incorrect
    else if (!status || !options[opt]) {
      optionBadgeText.textContent = 'You Marked | Incorrect Answer';
      optionBadge.classList.add('incorrect-answer');
      option.style.border = '1px solid #ff5858';
    }
  }
  afterSubmitFormHandler('single-multi');
}
function afterSubmitFormHandler(type) {
  const solutionBox = document.getElementById('solutionBox'),
    errorBox = document.getElementById('error');
  solutionBox.style.display = 'block';
  errorBox.style.display = 'block';
  if (type != 'numerical') {
    const optionsList = document.querySelectorAll('.option');
    for (let i = 0; i < optionsList.length; i++) {
      const el = optionsList[i];
      el.style.pointerEvents = 'none';
    }
  }
}