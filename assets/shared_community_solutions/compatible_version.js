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
//   onShowVSSolutions: function () {
//     Android.showToast('Show video solution btn toggle');
//   },
//   showReport: function () {
//     Android.showToast('Report-question error box opens.');
//   },
//   reportVS: function () {
//     Android.showToast('Report VS toggle');
//   },
// };
// Helper Functions
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var globalTheme = 'light';
var qLabelTypes = {
  topic: function topic(value) {
    return 'Topic: ' + value;
  },
  Topic: function Topic(value) {
    return 'Topic: ' + value;
  },
  concept: function concept(value) {
    return 'Concept: ' + value;
  },
  Concept: function Concept(value) {
    return 'Concept: ' + value;
  },
  pageTextToDisplay: function pageTextToDisplay(value) {
    return value;
  },
  paragraphNumber: function paragraphNumber(value) {
    return 'Paragraph: ' + value;
  }
};
function sortBy(array, order, propertyRetrieverFn) {
  if (order.length) return array.sort(function (a, b) {
    return order.indexOf(propertyRetrieverFn(a)) - order.indexOf(propertyRetrieverFn(b));
  });
  return array.sort(function (a, b) {
    if (propertyRetrieverFn(a) < propertyRetrieverFn(b)) {
      return -1;
    } else if (propertyRetrieverFn(a) > propertyRetrieverFn(b)) {
      return 1;
    } else {
      return 0;
    }
  });
}
function getFormattedQuestionLabels(questionLabels, order, retrieverFn) {
  var qLabels = [];
  // Condition: isVisible: true + 'title' value matches allowed labels
  questionLabels.forEach(function (label) {
    if (label && label.title && qLabelTypes.hasOwnProperty(label.title)) qLabels.push(label);
  });
  if (qLabels && qLabels.length > 1) {
    // Sort by given order
    qLabels = sortBy(qLabels, order, retrieverFn);
    // Get respective label text, add 'displayText' property to label
    qLabels = qLabels.map(function (el) {
      var obj = Object.assign({}, el);
      if (el.title) obj.displayText = qLabelTypes[el.title](el.value);
      return obj;
    });
  }
  return qLabels;
}
function getQuestionLabels(questionLabels) {
  var qLabels = getFormattedQuestionLabels(questionLabels, ['topic', 'concept', 'pageTextToDisplay', 'paragraphNumber'], function (obj) {
    return obj.title;
  });
  var qLabelString = '';
  qLabels.forEach(function (label, index) {
    qLabelString += label.displayText + (index !== qLabels.length - 1 ? ', ' : '');
  });
  return qLabelString;
}
function populateLabels(labelsLeft, questionLabels, previousYearPapers, screenType, screenLabels) {
  var newLabels = document.createElement('div');
  var labelsLeftParent;
  if (labelsLeft) {
    labelsLeftParent = labelsLeft.parentNode;
    newLabels.classList = labelsLeft.classList;
  }
  if (screenType === 'notebookQuestion') {
    //  Need to Append Subject
    for (var i = 0; i < screenLabels.length; i++) {
      var label = screenLabels[i];
      var outerDiv = document.createElement('div'),
        innerDiv = document.createElement('div');
      outerDiv.className = 'label-container';
      innerDiv.className = 'label-text';
      innerDiv.innerHTML = label;
      outerDiv.appendChild(innerDiv);
      newLabels.appendChild(outerDiv);
    }
  } else if (screenType === 'lblqQuestion' || screenType === 'dbqQuestion') {
    var qLabels = getFormattedQuestionLabels(screenLabels, ['topic', 'concept', 'pageTextToDisplay', 'paragraphNumber'], function (obj) {
      return obj.title;
    });
    for (var i = 0; i < qLabels.length; i++) {
      var label = qLabels[i];
      var outerDiv = document.createElement('div'),
        innerDiv = document.createElement('div');
      outerDiv.className = 'label-container';
      innerDiv.className = 'label-text';
      innerDiv.innerHTML = label.displayText;
      outerDiv.appendChild(innerDiv);
      newLabels.appendChild(outerDiv);
    }
  }
  if (previousYearPapers.length) {
    for (var i = 0; i < previousYearPapers.length; i++) {
      var paper = previousYearPapers[i];
      var outerDiv = document.createElement('div'),
        innerDiv = document.createElement('div');
      outerDiv.className = 'label-container';
      innerDiv.className = 'label-text';
      innerDiv.innerHTML = paper.title;
      outerDiv.appendChild(innerDiv);
      newLabels.appendChild(outerDiv);
    }
    if (labelsLeftParent) {
      labelsLeftParent.removeChild(labelsLeft);
      labelsLeftParent.insertBefore(newLabels, labelsLeftParent.firstChild);
    }
  } else if (questionLabels.length) {
    var ql = [];
    for (var i = 0; i < questionLabels.length; i++) {
      var el = questionLabels[i];
      if (el.isVisible) ql.push(el);
    }
    questionLabels = ql;
    if (questionLabels.length) {
      var label = questionLabels[0];
      var outerDiv = document.createElement('div'),
        innerDiv = document.createElement('div');
      if (screenType === 'top500question') {
        if (label.value === 'Incorrect') {
          outerDiv.className = 'label-container incorrect-label';
          innerDiv.className = 'label-text text-incorrect';
        } else if (label.value === 'Correct') {
          outerDiv.className = 'label-container correct-label';
          innerDiv.className = 'label-text text-correct';
        } else if (label.value === 'Partially Correct') {
          outerDiv.className = 'label-container partial-label';
          innerDiv.className = 'label-text text-partial';
        } else {
          outerDiv.className = 'label-container';
          innerDiv.className = 'label-text';
        }
        innerDiv.innerHTML = label.title + ': ' + label.value;
      } else {
        outerDiv.className = 'label-container';
        innerDiv.className = 'label-text';
        innerDiv.innerHTML = label.title + ': ' + label.value;
      }
      outerDiv.appendChild(innerDiv);
      newLabels.appendChild(outerDiv);
      if (labelsLeftParent) {
        labelsLeftParent.removeChild(labelsLeft);
        labelsLeftParent.insertBefore(newLabels, labelsLeftParent.firstChild);
      }
    }
  } else {
    if (labelsLeftParent) {
      labelsLeftParent.removeChild(labelsLeft);
      labelsLeftParent.insertBefore(newLabels, labelsLeftParent.firstChild);
    }
  }
}
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
function formSubmitHandler(question, type, screenType) {
  var solutionBox = document.getElementById('solutionBox'),
    solutionTextPara = document.querySelector('.solution-text'),
    errorBox = document.getElementById('error');
  // Display showSolutions button
  displayShowSolutions();
  // Populating the solution-text paragraph
  solutionTextPara.innerHTML = _typeof(question.solution) === 'object' ? question.solution.text : question.solution;
  solutionBox.style.display = 'none';
  errorBox.style.display = 'none';
  if (type != 'numerical') {
    var optionsList = document.querySelectorAll('.option');
    for (var i = 0; i < optionsList.length; i++) {
      var el = optionsList[i];
      el.style.pointerEvents = 'none';
    }
  }
  questionSolutionResizeAllImages(question);
  setTypeset();
}
function getOptionsByState(questionType, state, theme) {
  var type = questionType === 'singleCorrect' ? 'single' : 'multiple';

  switch (state) {
        case 'selected':
          if (theme === 'dark') {
            return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_selected_dark.svg', '../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_selected_dark.svg', '../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_selected_dark.svg', '../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_selected_dark.svg'];
          } else {
            return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_selected.svg', '../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_selected.svg', '../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_selected.svg', '../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_selected.svg'];
          }
        case 'correct':
          return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_correct.svg', '../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_correct.svg', '../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_correct.svg', '../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_correct.svg'];
        case 'incorrect':
          return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_incorrect.svg', '../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_incorrect.svg', '../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_incorrect.svg', '../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_incorrect.svg'];
        default:
          if (theme === 'dark') {
            return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_default_dark.svg', '../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_default_dark.svg', '../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_default_dark.svg', '../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_default_dark.svg'];
          } else {
            return ['../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_default.svg', '../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_default.svg', '../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_default.svg', '../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_default.svg'];
          }
      }

//  switch (state) {
//    case 'selected':
//      if (theme === 'dark') {
//        return ['../../../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_selected_dark.svg', '../../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_selected_dark.svg', '../../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_selected_dark.svg', '../../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_selected_dark.svg'];
//      } else {
//        return ['../../../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_selected.svg', '../../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_selected.svg', '../../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_selected.svg', '../../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_selected.svg'];
//      }
//    case 'correct':
//      return ['../../../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_correct.svg', '../../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_correct.svg', '../../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_correct.svg', '../../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_correct.svg'];
//    case 'incorrect':
//      return ['../../../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_incorrect.svg', '../../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_incorrect.svg', '../../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_incorrect.svg', '../../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_incorrect.svg'];
//    default:
//      if (theme === 'dark') {
//        return ['../../../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_default_dark.svg', '../../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_default_dark.svg', '../../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_default_dark.svg', '../../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_default_dark.svg'];
//      } else {
//        return ['../../../assets/svg/options/' + type + '/A/type_' + type + '_option_A_state_default.svg', '../../../assets/svg/options/' + type + '/B/type_' + type + '_option_B_state_default.svg', '../../../assets/svg/options/' + type + '/C/type_' + type + '_option_C_state_default.svg', '../../../assets/svg/options/' + type + '/D/type_' + type + '_option_D_state_default.svg'];
//      }
//  }
}
function isNumberKey(txt, evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode == 46) {
    //Check if the text already contains the . character
    if (txt.value.indexOf('.') === -1) {
      return true;
    } else {
      return false;
    }
  } else if (charCode == 45) {
    return true;
  } else {
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
  }
  return true;
}
function resetFields() {
  var solutionBox = document.getElementById('solutionBox'),
    solutionText = document.querySelector('.solution-text'),
    questionText = document.getElementById('questionText'),
    answerBox = document.getElementById('answer-box'),
    errorBox = document.getElementById('error'),
    showSolutionsBtn = document.getElementById('action-show-solutions'),
    showVSSolutionsBtn = document.getElementById('action-show-vs-solutions'),
    numericalInputContainer = document.getElementById('main-options'),
    inputField = document.getElementById('inputAns');
  solutionBox.style.display = 'none';
  solutionText.textContent = '';
  questionText.innerHTML = '';
  errorBox.style.display = 'none';
  showSolutionsBtn.style.display = 'none';
  showVSSolutionsBtn.style.display = 'none';
  if (answerBox) {
    answerBox.remove();
  }
  if (numericalInputContainer && inputField) {
    numericalInputContainer.style.border = '1px solid #dcdde2';
    inputField.value = '';
  }
}
function displayShowVSSolutions() {
  var showSolutionsBtn = document.getElementById('action-show-vs-solutions');
  showSolutionsBtn.style.display = 'none';
  var imgs = showSolutionsBtn.getElementsByTagName('img');
  if ((imgs === null || imgs === void 0 ? void 0 : imgs.length) > 0) showSolutionsBtn.style.cursor = 'no-drop';
  showSolutionsBtn === null || showSolutionsBtn === void 0 || showSolutionsBtn.addEventListener('click', function () {
    Android.onShowVSSolutions('vsSolutionBox');
  });
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
function questionReplaceNewLine(question) {
  var searchFor = /\n/g;
  var replaceWith = '<br>';
  question.question.text = question.question.text.replace(searchFor, replaceWith);
  if (question.solution.text) question.solution.text = question.solution.text.replace(searchFor, replaceWith);else {
    if (question.solution) question.solution = question.solution.replace(searchFor, replaceWith);
  }
  for (var i = 0; i < question.options.length; i++) {
    question.options[i].text = question.options[i].text.replace(searchFor, replaceWith);
  }
}
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
    var quesOpt = question.options[x];
    if (quesOpt.text.includes('<img')) {
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
function setSolutionConsent(question, isConsent) {
  var solutionConsent = document.getElementById('solutionConsent');
  if (!solutionConsent) return;
  //  var isConsent = localStorage.getItem('isConsent')
  if (!isConsent) {
    solutionConsent.checked = false;
    //Android.onShowSolutions('solutionBox');
    showSolution(question);
  } else {
    solutionConsent.checked = true;
    hideSolution();
  }
  solutionConsent.addEventListener('change', function () {
    if (solutionConsent.checked) {
      //Android.onShowSolutions('solutionBox');
      Android.hideSolutions();
      //localStorage.setItem('isConsent', 'true')
      showSolution(question);
    } else {
      Android.showSolutions();
      //      localStorage.setItem('isConsent', 'false')
    }
    //    localStorage.setItem('isConsent', solutionConsent.checked)
  });
}

function showSolution(question) {
  var solutionBox = document.getElementById('solutionBox');
  if (!solutionBox) return;
  solutionBox.style.display = 'none';
  var errorBox = document.getElementById('error');
  errorBox.style.display = 'none';
  solutionBox.innerHTML = '<div class="row">' + '<p class="solution-header mb-1" style="font-family: \'SF Pro Display\';">Solution:</p>' + '</div>' + '<div class="row">' + '<span class="solution-text">' + question.solution.text + '</span>' + '</div>';
  questionSolutionResizeAllImages(question);
  setTypeset();
}
function hideSolution() {
  var solutionBox = document.getElementById('solutionBox');
  solutionBox.style.display = 'none';
  var errorBox = document.getElementById('error');
  errorBox.style.display = 'none';
}
function setSubjectiveQuestion(question) {
  var showSolutionByDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  setSolutionConsent(question, showSolutionByDefault);
  var actionShowSolutions = document.getElementById('action-show-solutions');
  actionShowSolutions.style.display = 'flex';
  var errorBox = document.getElementById('error');
  errorBox.style.display = 'none';
  errorBox.addEventListener('click', function () {
    Android.showReport();
  });
  var questionTextPara = document.getElementById('questionText');
  if (questionTextPara) questionTextPara.innerHTML = question.question.text;
  setTypeset();
}
// Main Functions [to be called by Android]
// screenType | ['question', 'notebookQuestion', 'top500question', 'lblqQuestion','dbqQuestion']
function setQuestion(question, status, screenType, additionalData, theme, showSolutionByDefault, breadcrumbList) {
  var _question$options;
  status = {
    selectedOption: (question === null || question === void 0 || (_question$options = question.options) === null || _question$options === void 0 ? void 0 : _question$options.length) > 0 ? [] : null,
    numericalAnswer: (question === null || question === void 0 ? void 0 : question.correctValue) || null,
    answerStatus: null
  };
  console.log({
    question: question,
    status: status
  });
  var quesType = question ? question.type : undefined;
  resetDoc();
  createDoc({
    qType: quesType
  });
  resetFields();
  screenType = typeof screenType !== 'undefined' ? screenType : 'question';
  var body = document.querySelector('body');
  Android.showToast(JSON.stringify(question._id));
  Android.showToast(theme);
  if (theme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');
  globalTheme = theme;
  if (quesType === 'subjective') {
    try {
      setSubjectiveQuestion(question, showSolutionByDefault);
    } catch (e) {
      Android.showToast('Error - Question Text: ' + JSON.stringify(e));
    }
    return null;
  }
  var questionTextPara = document.getElementById('questionText'),
    qTypeId = document.getElementById('questionType'),
    labelsLeft = document.querySelector('.labels-left'),
    breadcrumbsContainer = document.querySelector('.breadcrumbs'),
    optionsBox = document.getElementById('optionsBox'),
    solutionBox = document.getElementById('solutionBox'),
    viewMoreLink = document.getElementById('view_more'),
    solutionConainer = document.querySelectorAll('.full-view-elements'),
    errorBox = document.getElementById('error'),
    vsErrorBox = document.getElementById('vs-error');
  var getQType = {
    singleCorrect: 'Single Correct',
    numerical: 'Numerical',
    multipleCorrect: 'Multiple Correct',
    subjective: 'Subjective'
  };
  qTypeId.innerText = getQType[question === null || question === void 0 ? void 0 : question.type] || "Question";
  questionReplaceNewLine(question);
  var showOneLine = true;
  if (showOneLine) {
    questionTextPara.classList.add('truncated');
    solutionConainer.forEach(function (e) {
      return e.style.display = 'none';
    });
  } else {
    questionTextPara.classList.remove('truncated');
    solutionConainer.forEach(function (e) {
      return e.style.display = 'flex';
    });
  }

  //adding breadcumbs
  if ((breadcrumbList === null || breadcrumbList === void 0 ? void 0 : breadcrumbList.length) > 0) {
    breadcrumbsContainer.innerHTML = breadcrumbList.join(' > ');
  }

  // Populating the question-text paragraph
  if (screenType === 'dbqQuestion') {
    var qText = question.question.text.split('</br>').slice(1).join('</br>');
    questionTextPara.innerHTML = qText;
  } else {
    questionTextPara.innerHTML = question.question.text;
  }
  if (viewMoreLink) {
    viewMoreLink.addEventListener('click', function () {
      if (showOneLine) {
        viewMoreLink.style.display = 'none';
        questionTextPara.classList.remove('truncated');
        solutionConainer.forEach(function (e) {
          return e.style.display = 'flex';
        });
        showOneLine = false;
      } else {
        viewMoreLink.style.display = 'flex';
        questionTextPara.classList.add('truncated');
        solutionConainer.forEach(function (e) {
          return e.style.display = 'none';
        });
        showOneLine = true;
      }
    });
  }
  questionTextResizeAllImages(question);
  // Populating the labels
  var labels = [];
  if (screenType != 'question' && screenType != 'top500question' && screenType != 'lblqQuestion' && screenType != 'dbqQuestion') {
    Android.showToast('additionalData : ' + JSON.stringify(additionalData));
    var exams = additionalData.exams;
    var subjects = additionalData.subjects;
    var chapters = additionalData.chapters;
    if (subjects && subjects.length) labels.push(subjects[0].title);
    if (chapters && chapters.length) labels.push(chapters[0].title);
  } else if (screenType === 'lblqQuestion' || screenType === 'dbqQuestion') {
    populateLabels(labelsLeft, [], [], screenType, question.questionLabels);
  } else populateLabels(labelsLeft, question.questionLabels, question.previousYearPapers, screenType, labels);

  // get latest labels left
  labelsLeft = document.querySelector('.labels-left');
  if (screenType === 'question' && question.syllabusCategory) {
    // add syllabus category label
    var outerDiv = document.createElement('div'),
      innerDiv = document.createElement('div');
    outerDiv.className = 'label-container';
    outerDiv.style.backgroundColor = question.syllabusCategory === 'outOfSyllabus' ? '#FEF1F1' : '#FEF9C3';
    innerDiv.className = 'label-text';
    innerDiv.style.color = question.syllabusCategory === 'outOfSyllabus' ? '#DC2828' : '#733F12';
    innerDiv.innerHTML = question.syllabusCategory === 'outOfSyllabus' ? 'Out of Syllabus' : 'Out of Syllabus but Good to Solve';
    outerDiv.appendChild(innerDiv);
    labelsLeft.appendChild(outerDiv);
  }

  // Populating the options
  populateOptions(optionsBox, question.options, quesType);
  questionOptionsResizeAllImages(question);
  // User has attempted the question beforehand
  if (status) {
    var prevSelectedOptions = status.selectedOption,
      prevNumericalAnswer = status.numericalAnswer,
      prevAnswerStatus = status.answerStatus;
    if (prevSelectedOptions) {
      // Single/Multi-correct based
      // Then add the proper badge on-top of the respective option [Correct Answer | Incorrect Answer]
      checkOptionsAnswer(question, prevSelectedOptions, prevAnswerStatus, null, screenType);
    } else if (prevNumericalAnswer) {
      // Numerical based
      // Then add the proper badge on-top of the input field option [Correct Answer | Incorrect Answer]
      checkNumericalAnswer(question, prevNumericalAnswer, prevAnswerStatus, screenType);
    }
  }
  // Event Listeners
  var optionsList = document.querySelectorAll('.option');
  if (quesType === 'singleCorrect') {
    var optionContainers = document.querySelectorAll('.option-container');
    var optionsBoxIndexes = {};
    for (var x = 0; x < optionContainers.length; x++) {
      var optionBoxEl = optionContainers[x];
      optionsBoxIndexes[optionBoxEl.firstElementChild.id] = x;
    }
    var _loop = function _loop() {
      var item = optionsList[i];
      item.addEventListener('click', function () {
        var lastSelectedEl = document.querySelector('.option_state_selected');
        if (lastSelectedEl) {
          lastSelectedEl.classList.remove('option_state_selected');
          lastSelectedEl.firstElementChild.src = getOptionsByState('singleCorrect', 'default')[optionsBoxIndexes[lastSelectedEl.id]];
        }
        if (lastSelectedEl !== this) {
          this.firstElementChild.src = getOptionsByState('singleCorrect', 'selected')[optionsBoxIndexes[this.id]];
          this.classList.add('option_state_selected');
        }
        var optionObject;
        for (var i = 0; i < question.options.length; i++) {
          var el = question.options[i];
          if (el.id == item.id) {
            optionObject = el;
            break;
          }
        }
        Android.onOptionSelected(JSON.stringify(optionObject));
      });
    };
    for (var i = 0; i < optionsList.length; i++) {
      _loop();
    }
  } else if (quesType === 'multipleCorrect') {
    for (var i = 0; i < optionsList.length; i++) {
      (function (index) {
        // Using an IIFE to capture the current index
        var item = optionsList[index];
        item.addEventListener('click', function () {
          if (item.getAttribute('class').includes('option_state_selected')) {
            item.firstElementChild.src = getOptionsByState('multiple', 'default')[index];
          } else {
            item.firstElementChild.src = getOptionsByState('multiple', 'selected')[index];
          }
          item.classList.toggle('option_state_selected');
          var optionObject = question.options.find(function (el) {
            return el.id === item.id;
          });
          Android.onOptionSelected(JSON.stringify(optionObject));
        });
      })(i); // Pass the current index to the IIFE
    }
  } else {
    var numericalInput = document.querySelector('.numerical-input');
    numericalInput.addEventListener('input', function (e) {
      Android.onInputChanged(e.target.value);
    });
  }
  vsErrorBox === null || vsErrorBox === void 0 || vsErrorBox.addEventListener('click', function () {
    Android.reportVS();
  });
  errorBox.addEventListener('click', function () {
    Android.showReport();
  });
  setTypeset();
}
function checkNumericalAnswer(question, input, status, screenType) {
  var newValue = null;
  if (input[input.length - 1] === '.') newValue = input + '0';
  var correctAnswer = question.correctValue;
  var solutionBox = document.getElementById('solutionBox'),
    solutionBadge = document.querySelector('.option-badge'),
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
      solutionBox.insertBefore(newDiv, solutionBox.firstChild);
    }
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
  formSubmitHandler(question, 'numerical', screenType);
}
function checkOptionsAnswer(question, selectedOptions, status, theme, screenType) {
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
  for (var i = 0; i < selectedOptions.length; i++) {
    var opt = selectedOptions[i].id;
    var option = document.getElementById('' + opt),
      optionIcon = option.firstElementChild,
      optionBadge = option.nextElementSibling,
      optionBadgeText = optionBadge.firstElementChild;
    // Selected option is correct
    if (options[opt] && (status === 0 || status === 1 || status === 2)) {
      optionBadgeText.textContent = 'You Marked | Correct Answer';
      optionBadge.classList.add('correct-answer');
      option.style.border = '1px solid #31d99c';
      optionIcon.src = getOptionsByState(question.type, 'correct', theme)[optionsBoxIndexes[opt]];
    }
    // Selected option is incorrect
    else {
      optionBadgeText.textContent = 'You Marked | Incorrect Answer';
      optionBadge.classList.add('incorrect-answer');
      option.style.border = '1px solid #ff5858';
      optionIcon.src = getOptionsByState(question.type, 'incorrect', theme)[optionsBoxIndexes[opt]];
    }
  }
  formSubmitHandler(question, 'single-multi', screenType);
}
function createDoc(_ref) {
  var qType = _ref.qType;
  var sectionElement = document.querySelector('.container-fluid');
  sectionElement.innerHTML = '<section class="row d-flex">' + '<div id="questionType" class="col-12"></div>' + '<div class="d-flex align-items-end">' + '<p id="questionText">' + '</p>' + '<span id="view_more">view more</span>' + '</div>' + '</section>' + '<div class="breadcrumbs row col-12"></div>' + '<section id="labelBox" class="row">' + '<div class="labels-left col-12"></div>' + '<div style="display:none" class="labels-right col-12">' + '<div id="action-show-solutions" class="label-text">' + 'Show Solutions' + '</div>' + '<div id="action-show-vs-solutions" class="">' + '</div>' + '</div>' + '</section>' + '<section id="optionsBox" class="full-view-elements"></section>' + '<section id="solutionBox">' + '<div class="row px-0">' + '<p class="solution-header" style="font-family: \'SF Pro Display\';">Solution:</p>' + '</div>' + '<div class="row">' + '<p class="solution-text"></p>' + '</div>' + '</section>' + '<section id="error" class="row">' + '<div class="error-container">' + '<object class="error-icon" data="../../../assets/svg/Vector.svg" width="20" height="20"></object>' + '<span class="error-text">' + 'Report Error' + '</span>' + '</div>' + '</section>' + (qType === 'subjective' ? '<div class="solution-consent"><div class="form-group form-check"><input type="checkbox" class="form-check-input" id="solutionConsent" /><label class="form-check-label" for="solutionConsent">Do not automatically show solution for subjective question</label></div></div>' : '');
}
function resetDoc() {
  var sectionElement = document.querySelector('.container-fluid');
  sectionElement.innerHTML = '';
}
/* dummy Questions */
// var Qs = {
//   data: {
//     _id: '64188b587ebcc385cff03201',
//     type: 'singleCorrect',
//     level: null,
//     category: null,
//     approximateTimeRequired: null,
//     imageBaseUrl: null,
//     helperText: null,
//     source: 'MOG',
//     classes: [],
//     exams: ['615d76e4c52ffa3c944600e1'],
//     subjects: ['615d70f9a489afa3080ade2d'],
//     chapters: ['615d6ff02b295b085ab6ebf4'],
//     topics: [],
//     concepts: [],
//     microConcepts: [],
//     questionLabels: [
//       {
//         title: 'topic',
//         value: 'Tissue System',
//         isVisible: true,
//       },
//       {
//         title: 'concept',
//         value: 'General Characters',
//         isVisible: true,
//       },
//       {
//         title: 'paragraphNumber',
//         value: '2',
//         isVisible: true,
//       },
//       {
//         title: 'level',
//         value: '1',
//         isVisible: false,
//       },
//       {
//         title: 'approximateTimeRequired',
//         value: '30',
//         isVisible: false,
//       },
//       {
//         title: 'pageTextToDisplay',
//         value: 'Page No 84',
//         isVisible: true,
//       },
//       {
//         title: 'pdfUrl',
//         value: 'https://cdn-assets.getmarks.app/app_assets/pdfs/Class 11.pdf',
//         isVisible: false,
//       },
//       {
//         title: 'pageNumber',
//         value: '3',
//         isVisible: false,
//       },
//       {
//         title: 'fileName',
//         value: 'Class 11.pdf',
//         isVisible: false,
//       },
//     ],
//     previousYearPapers: [],
//     question: {
//       text: 'What are the two main groups of tissues in plants on the basis of capability of division?',
//       image: null,
//     },
//     options: [
//       {
//         id: 'K5K7H',
//         text: 'Meristematic and temporary',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: 'HNINF',
//         text: 'Meristematic and permanent',
//         image: null,
//         isCorrect: true,
//       },
//       {
//         id: 'GQLV4',
//         text: 'Temporary and permanent',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: 'F7650',
//         text: 'Meristematic and non-meristematic',
//         image: null,
//         isCorrect: false,
//       },
//     ],
//     correctValue: null,
//     solution: {
//       text: 'Tissues in plants are classified into two main groups: those that are capable of dividing (meristematic) and those that are not (permanent).',
//       image: null,
//     },
//     videoSolution: null,
//     cpyqbSubjects: ['616057290283de43c87e3e1a', '616057b00283de43c87e3e20'],
//     cpyqbChapters: ['61602587fcf5b78a8bab79b1', '616025886537648b42b3b9d9'],
//     cpyqbExams: ['616059d70283de43c87e3e24', '616059730283de43c87e3e22'],
//   },
//   data2: {
//     _id: '6151e863e4404ffefabf652c',
//     type: 'singleCorrect',
//     level: null,
//     category: null,
//     approximateTimeRequired: null,
//     imageBaseUrl: null,
//     helperText: null,
//     source: 'NTAS1',
//     classes: [],
//     exams: ['615d76b2c52ffa3c944600df'],
//     subjects: ['615d708dbd4a37c4058ee5a8'],
//     chapters: ['615d6feb2b295b085ab6eb8a'],
//     topics: [],
//     concepts: [],
//     microConcepts: [],
//     questionLabels: [
//       {
//         title: 'NTA Abhyas Paper',
//         value: '01',
//         isVisible: true,
//       },
//     ],
//     previousYearPapers: [],
//     question: {
//       text: 'The resultant of two vectors is perpendicular to first vector of magnitude <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>6</mn><mo>&nbsp;</mo><mi mathvariant="normal">N</mi></math>. If the resultant has magnitude <math><mn>6</mn><msqrt><mn>3</mn></msqrt><mtext>&nbsp;N</mtext></math>, then magnitude of second vector is',
//       image: null,
//     },
//     options: [
//       {
//         id: 'HzT7l',
//         text: '<math><mn>6</mn><msqrt><mn>2</mn></msqrt><mi mathvariant="normal">&nbsp;N</mi></math>',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: '2cUOC',
//         text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>12</mn><mo>&nbsp;</mo><mi mathvariant="normal">N</mi></math>',
//         image: null,
//         isCorrect: true,
//       },
//       {
//         id: 'L4oSx',
//         text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>9</mn><msqrt><mn>3</mn></msqrt><mo>&nbsp;</mo><mi mathvariant="normal">N</mi></math>',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: 'fi7DV',
//         text: '<math><mn>6</mn><msqrt><mn>3</mn></msqrt><mi mathvariant="normal">&nbsp;N</mi></math>',
//         image: null,
//         isCorrect: false,
//       },
//     ],
//     correctValue: null,
//     solution: {
//       text: '<img src="https://cdn-question-pool.getmarks.app/nta_abhyas/jee_main/images/zmthevymlndgmxnrohxtnijnnvhfngvzhikpyhkkurmkjqybza.png" /><br /><br /><math xmlns="http://www.w3.org/1998/Math/MathML"><mi>B Cos&nbsp;θ</mi><mo>=</mo><mn>6</mn></math><br /><br /><math xmlns="http://www.w3.org/1998/Math/MathML"><mi>B Sin</mi><mo>&nbsp;</mo><mi mathvariant="normal">θ</mi><mo>=</mo><mn>6</mn><msqrt><mn>3</mn></msqrt></math><br /><br /><math><mtext>B</mtext><mo>=</mo><msqrt><msup><mrow><mn>6</mn></mrow><mrow><mn>2</mn></mrow></msup><mo>+</mo><msup><mrow><mfenced separators="|"><mrow><mn>6</mn><msqrt><mn>3</mn></msqrt></mrow></mfenced></mrow><mrow><mn>2</mn></mrow></msup></msqrt><mo>=</mo><mn>12</mn></math>',
//       image: null,
//     },
//     videoSolution: null,
//     cpyqbSubjects: [
//       '616057750283de43c87e3e1b',
//       '61964f81a5a526011886801d',
//       '61a8a2c2e8ce0dc8a5c62d2d',
//       '62962075e7f8e9ac4daeafd7',
//       '629f385f263330a77be9fa7d',
//       '616056cd0283de43c87e3e15',
//       '616057190283de43c87e3e18',
//       '629f39e4ac11b26562e0625b',
//       '615f0c729476412f48314dab',
//       '616057920283de43c87e3e1e',
//       '61bb58181213731910ea0b70',
//       '61c055eae8ce0dc8a5c62d33',
//       '61964fe0a5a5260118868021',
//       '629105adee9e3ae00d63352b',
//     ],
//     cpyqbChapters: [
//       '6160239e5c11c06c0fa49406',
//       '61e7bd79c8ca5ec1f00e8ceb',
//       '61964c721898e31221afc8be',
//       '6160239f750c8acf0af5535d',
//       '61c089a1b1e0bbdce92d07ab',
//       '61964c71a1c097e7f417f9d3',
//       '6160239d176977e9a4bf6528',
//       '629109eee350a2a3f2ae46d2',
//       '629621236200b1bfd3f21914',
//       '629f390c223683dd760c786e',
//       '620ab20a58b33b9d42624168',
//       '629f3a914a1915704dbd7206',
//     ],
//     cpyqbExams: ['616059af0283de43c87e3e23', '615f0e999476412f48314daf'],
//   },

//   //syllabus-category data
//   data3: {
//     _id: '648b5a61417cc3fb48d653c0',
//     type: 'singleCorrect',
//     level: 3,
//     category: null,
//     approximateTimeRequired: 120,
//     imageBaseUrl: null,
//     helperText: null,
//     source: 'MOG',
//     classes: [],
//     exams: ['615d76b2c52ffa3c944600df'],
//     subjects: ['615d708dbd4a37c4058ee5a8'],
//     chapters: ['615d6feb2b295b085ab6eb8a'],
//     topics: [],
//     concepts: [],
//     microConcepts: [],
//     questionLabels: [
//       {
//         title: 'Topic',
//         value: 'Addition and Subtraction of Vectors',
//         isVisible: false,
//       },
//       {
//         title: 'Concept',
//         value: 'Triangle Law Of Vector Addition',
//         isVisible: false,
//       },
//     ],
//     previousYearPapers: [
//       {
//         _id: '615d92e9de3d91842a5cf7c2',
//         title: 'JEE Main 2002',
//       },
//     ],
//     question: {
//       text: 'Two forces are such that the sum of their magnitudes is $18 \\mathrm{~N}$ and their resultant is $12 \\mathrm{~N}$ which is perpendicular to the smaller force. Then the magnitudes of the forces are',
//       image: null,
//     },
//     options: [
//       {
//         id: 'vGUEz',
//         text: '\n$12 \\mathrm{~N}, 6 \\mathrm{~N}$\n',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: 'P19sZ',
//         text: '\n$13 \\mathrm{~N}, 5 \\mathrm{~N}$\n',
//         image: null,
//         isCorrect: true,
//       },
//       {
//         id: 'RoREl',
//         text: '\n$10 \\mathrm{~N}, 8 \\mathrm{~N}$\n',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: 'zUOZB',
//         text: '\n$16 \\mathrm{~N}, 2 \\mathrm{~N}$',
//         image: null,
//         isCorrect: false,
//       },
//     ],
//     correctValue: null,
//     solution: {
//       text: 'Use $\\tan \\alpha=\\frac{P \\sin \\theta}{Q+P \\cos \\theta} \\Rightarrow \\tan 90^{\\circ}=\\frac{P \\sin \\theta}{Q+P \\cos \\theta}=\\infty$\n$\\therefore Q+P \\cos \\theta=0 \\Rightarrow P \\cos \\theta=-Q$\n$\\mathrm{R}=\\sqrt{\\mathrm{P}^2+\\mathrm{Q}^2+2 \\mathrm{PQ} \\cos \\theta} \\mathrm{R}=\\sqrt{\\mathrm{P}^2+\\mathrm{Q}^2-2 \\mathrm{Q}^2}$ or $\\mathrm{R}=\\sqrt{\\mathrm{P}^2-\\mathrm{Q}^2}=12$\n$144=(\\mathrm{P}+\\mathrm{Q})(\\mathrm{P}-\\mathrm{Q})$ or $\\mathrm{P}-\\mathrm{Q}=144 / 18=8 \\quad \\therefore \\mathrm{P}=13 \\mathrm{~N}$ and $\\mathrm{Q}=5 \\mathrm{~N}$',
//       image: null,
//     },
//     videoSolution: null,
//     masterId: 'MOGJMPYQ80049311',
//     numericalLowerLimit: '',
//     numericalUpperLimit: '',
//     bucket: '',
//     isRemoved: false,
//     syllabusCategory: 'outOfSyllabusButGoodToSolve',
//     cpyqbSubjects: [
//       '616057920283de43c87e3e1e',
//       '616057750283de43c87e3e1b',
//       '61964fe0a5a5260118868021',
//       '616056cd0283de43c87e3e15',
//       '615f0c729476412f48314dab',
//       '616057190283de43c87e3e18',
//       '61bb58181213731910ea0b70',
//       '61964f81a5a526011886801d',
//       '61c055eae8ce0dc8a5c62d33',
//       '629105adee9e3ae00d63352b',
//       '62962075e7f8e9ac4daeafd7',
//       '629f385f263330a77be9fa7d',
//       '629f39e4ac11b26562e0625b',
//       '64d50bd73df7f4a7f3017f6f',
//       '61a8a2c2e8ce0dc8a5c62d2d',
//     ],
//     cpyqbChapters: [
//       '6160239e5c11c06c0fa49406',
//       '6160239f750c8acf0af5535d',
//       '61964c721898e31221afc8be',
//       '61c089a1b1e0bbdce92d07ab',
//       '6160239d176977e9a4bf6528',
//       '620ab20a58b33b9d42624168',
//       '61964c71a1c097e7f417f9d3',
//       '629109eee350a2a3f2ae46d2',
//       '629621236200b1bfd3f21914',
//       '629f390c223683dd760c786e',
//       '629f3a914a1915704dbd7206',
//       '641b35f576a2b9001ebc2fc9',
//       '64b93b160c5ddc56daf1bdfe',
//       '64db813c4ce2a65f7bd74f1b',
//       '64e853a91e014c40646fdcc0',
//       '64e45901ec226f2f4360a802',
//       '64eb06c53118f713ecfef0a8',
//       '61e7bd79c8ca5ec1f00e8ceb',
//     ],
//     cpyqbExams: ['616059af0283de43c87e3e23', '615f0e999476412f48314daf'],
//   },

//   //dbq testing dummy data
//   dbqdataOld: {
//     _id: '650d3e39938d405eaed76fb2',
//     type: 'singleCorrect',
//     level: null,
//     category: null,
//     approximateTimeRequired: null,
//     imageBaseUrl: null,
//     helperText: null,
//     source: 'MOG',
//     classes: [],
//     exams: ['615d76e4c52ffa3c944600e1'],
//     subjects: ['615d70f9a489afa3080ade2d'],
//     chapters: ['615d6ff02b295b085ab6ebef'],
//     topics: [],
//     concepts: [],
//     microConcepts: [],
//     questionLabels: [
//       {
//         title: 'topic',
//         value: 'Introduction',
//         isVisible: true,
//       },
//       {
//         title: 'concept',
//         value: 'History of Taxonomy',
//         isVisible: true,
//       },
//       {
//         title: 'paragraphNumber',
//         value: '1',
//         isVisible: true,
//       },
//       {
//         title: 'pageTextToDisplay',
//         value: 'Page No 2',
//         isVisible: true,
//       },
//     ],
//     previousYearPapers: [],
//     question: {
//       text: "What was the main focus of Ernst Mayr's research?",
//       image: null,
//     },
//     options: [
//       {
//         id: 'L40NT',
//         text: 'Ornithology',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: '1OGST',
//         text: 'Taxonomy',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: 'CELK8',
//         text: 'The origin of species diversity',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: 'YVFQ4',
//         text: 'All of the above',
//         image: null,
//         isCorrect: true,
//       },
//     ],
//     correctValue: null,
//     solution: {
//       text: "Ernst Mayr's research spanned a wide range of fields, including ornithology, taxonomy, zoogeography, evolution, systematics, and the history and philosophy of biology. He made the origin of species diversity the central question of evolutionary biology.",
//       image: null,
//     },
//     videoSolution: null,
//     cpyqbSubjects: ['616057b00283de43c87e3e20', '616057290283de43c87e3e1a', '64d50cd33df7f4a7f3017f71'],
//     cpyqbChapters: ['6160257531d5b34759c487a0', '61602575187508697aeef5d5', '64e8541caa9540cfa96ca7fb'],
//     cpyqbExams: ['616059d70283de43c87e3e24', '616059730283de43c87e3e22'],
//   },
//   dbqdataNew: {
//     "_id": "65c7caa059d61903e0fdc1e0",
//     "type": "singleCorrect",
//     "ques_number": 1,
//     "level": null,
//     "category": null,
//     "approximateTimeRequired": null,
//     "imageBaseUrl": null,
//     "helperText": null,
//     "source": "MOG",
//     "classes": [],
//     "exams": [
//       "615d76e4c52ffa3c944600e1"
//     ],
//     "subjects": [
//       "615d70bd9948bc1b21da2b1f"
//     ],
//     "chapters": [
//       "615d6fee2b295b085ab6ebb7"
//     ],
//     "topics": [],
//     "concepts": [],
//     "microConcepts": [],
//     "questionLabels": [],
//     "previousYearPapers": [],
//     "question": {
//       "text": "<img src=\"https://cdn-question-pool.getmarks.app/modules/dbq/cheas77dtry/qFSnNOp9pJxJ3aUOmhbOUIaMVaFP2EdxMH5qvLAxGpAS5aPcPc.png\"   /></br>What is the IUPAC name of Methylacetylene?",
//       "image": null
//     },
//     "options": [
//       {
//         "id": "RnS52",
//         "text": "But-1-yne",
//         "image": null,
//         "isCorrect": false
//       },
//       {
//         "id": "YwXvD",
//         "text": "Prop-2-ene",
//         "image": null,
//         "isCorrect": false
//       },
//       {
//         "id": "vBdPL",
//         "text": "Propyne",
//         "image": null,
//         "isCorrect": true
//       },
//       {
//         "id": "AkNYy",
//         "text": "But-2-yne",
//         "image": null,
//         "isCorrect": false
//       }
//     ],
//     "correctValue": null,
//     "solution": {
//       "text": "Correct Option is : 3 <br> Propyne",
//       "image": null
//     },
//     "videoSolution": null,
//     "masterId": "MOGNCERTDBQ85520604",
//     "cpyqbSubjects": [
//       "615f0cf69476412f48314dac",
//       "62962075e7f8e9ac4daeafd8",
//       "61a8a2cce8ce0dc8a5c62d2e",
//       "6160577e0283de43c87e3e1c",
//       "61964f94a5a526011886801e",
//       "61c055f6e8ce0dc8a5c62d34",
//       "616057210283de43c87e3e19",
//       "629f39e4ac11b26562e0625c",
//       "61bb58281213731910ea0b71",
//       "64d50c263df7f4a7f3017f70",
//       "6160579d0283de43c87e3e1f",
//       "616057040283de43c87e3e16",
//       "61964ff3a5a5260118868022",
//       "629105adee9e3ae00d63352c",
//       "629f385f263330a77be9fa7e"
//     ],
//     "cpyqbChapters": [
//       "61bb8222c1499f3d7c41dde3",
//       "616024bd6b57f6fc00613ebe",
//       "616024ba1114e5121ec36d78",
//       "616024bb467f9675e49b3249",
//       "61964ca51e63030a2a0cf3c8",
//       "61c089a897043a3adb5e03e8",
//       "616024bbd3b573c057bb25e2",
//       "629109dd6fc875a470bb7b72",
//       "61964ca437be8eeade806cbf",
//       "616024b99d2606a21d244446",
//       "629621198e6275b611dba4ac",
//       "629f3a85e49e9029be7d3023",
//       "629f39001f1cd0c137126633",
//       "64e853b21e014c40646fdd0a",
//       "64eb06cc3118f713ecfef0f2",
//       "61e7bd7be3185dfa4b36d843"
//     ],
//     "cpyqbExams": [
//       "616059d70283de43c87e3e24",
//       "616059730283de43c87e3e22"
//     ]
//   },

//   //lblq testing dummy data
//   lblqdata3: {
//     _id: '6486f3bb25f4f9591544bbcd',
//     type: 'singleCorrect',
//     level: 1,
//     category: null,
//     approximateTimeRequired: 90,
//     imageBaseUrl: null,
//     helperText: null,
//     source: '1',
//     classes: [],
//     exams: ['615d76b2c52ffa3c944600df'],
//     subjects: ['615d708dbd4a37c4058ee5a8'],
//     chapters: ['615d6fec2b295b085ab6eb8e'],
//     topics: [],
//     concepts: [],
//     microConcepts: [],
//     questionLabels: [
//       {
//         title: 'Topic',
//         value: "Newton's laws of motion",
//         isVisible: false,
//       },
//       {
//         title: 'Concept',
//         value: "Newton's laws of motion",
//         isVisible: false,
//       },
//     ],
//     previousYearPapers: [
//       {
//         _id: '6486f36a359a7055d5a58b1a',
//         title: 'JEE Main 2023 (15 Apr Shift 1)',
//       },
//     ],
//     question: {
//       text: 'The position vector of a particle related to time <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>t</mi></math> is given by&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>r</mi><mo>&#8594;</mo></mover><mo>=</mo><mfenced><mrow><mn>10</mn><mi>t</mi><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>15</mn><msup><mi>t</mi><mn>2</mn></msup><mover><mi>j</mi><mo>^</mo></mover><mo>+</mo><mn>7</mn><mover><mi>k</mi><mo>^</mo></mover></mrow></mfenced><mi mathvariant="normal">m</mi></math>.&nbsp;The direction of net force experienced by the particle is :',
//       image: null,
//     },
//     options: [
//       {
//         id: 'pMAWJ',
//         text: 'Positive <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>-axis',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: '30p7A',
//         text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>In</mi><mo>&#160;</mo><mi>x</mi><mo>-</mo><mi>y</mi></math> plane',
//         image: null,
//         isCorrect: false,
//       },
//       {
//         id: 'Iqfbs',
//         text: 'Positive <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>y</mi></math>-axis',
//         image: null,
//         isCorrect: true,
//       },
//       {
//         id: '8IeIq',
//         text: 'Positive <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>z</mi></math>-axis',
//         image: null,
//         isCorrect: false,
//       },
//     ],
//     correctValue: null,
//     solution: {
//       text: '<blockquote><p>Given, the position vector of the particle is</p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>r</mi><mo>&#8594;</mo></mover><mo>=</mo><mn>10</mn><mi>t</mi><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>15</mn><msup><mi>t</mi><mn>2</mn></msup><mover><mi>j</mi><mo>^</mo></mover><mo>+</mo><mn>7</mn><mover><mi>k</mi><mo>^</mo></mover></math></p><p>The velocity of the particle can be calculated as follows:</p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mtable columnalign="right center left" columnspacing="0px"><mtr><mtd><mover><mi>v</mi><mo>&#8594;</mo></mover></mtd><mtd><mo>=</mo></mtd><mtd><mfrac><mrow><mi>d</mi><mover><mi>r</mi><mo>&#8594;</mo></mover></mrow><mrow><mi>d</mi><mi>t</mi></mrow></mfrac></mtd></mtr><mtr><mtd></mtd><mtd><mo>=</mo></mtd><mtd><mfrac><mi>d</mi><mrow><mi>d</mi><mi>t</mi></mrow></mfrac><mfenced><mrow><mn>10</mn><mi>t</mi><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>15</mn><msup><mi>t</mi><mn>2</mn></msup><mover><mi>j</mi><mo>^</mo></mover><mo>+</mo><mn>7</mn><mover><mi>k</mi><mo>^</mo></mover></mrow></mfenced></mtd></mtr><mtr><mtd></mtd><mtd><mo>=</mo></mtd><mtd><mo>&#160;</mo><mn>10</mn><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>30</mn><mi>t</mi><mover><mi>j</mi><mo>^</mo></mover></mtd></mtr></mtable></math></p><p>And, the acceleration of the particle is given by</p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mtable columnalign="right center left" columnspacing="0px"><mtr><mtd><mover><mi>a</mi><mo>&#8594;</mo></mover></mtd><mtd><mo>=</mo></mtd><mtd><mfrac><mrow><mi>d</mi><mover><mi>v</mi><mo>&#8594;</mo></mover></mrow><mrow><mi>d</mi><mi>t</mi></mrow></mfrac></mtd></mtr><mtr><mtd></mtd><mtd><mo>=</mo></mtd><mtd><mfrac><mi>d</mi><mrow><mi>d</mi><mi>t</mi></mrow></mfrac><mfenced><mrow><mn>10</mn><mover><mi>i</mi><mo>^</mo></mover><mo>+</mo><mn>30</mn><mi>t</mi><mover><mi>j</mi><mo>^</mo></mover></mrow></mfenced></mtd></mtr><mtr><mtd></mtd><mtd><mo>=</mo></mtd><mtd><mn>30</mn><mover><mi>j</mi><mo>^</mo></mover></mtd></mtr></mtable></math></p><p>Hence, the force on the particle can be written as</p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mtable columnalign="right center left" columnspacing="0px"><mtr><mtd><mover><mi>F</mi><mo>&#8594;</mo></mover></mtd><mtd><mo>=</mo></mtd><mtd><mi>m</mi><mover><mi>a</mi><mo>&#8594;</mo></mover></mtd></mtr><mtr><mtd></mtd><mtd><mo>=</mo></mtd><mtd><mn>30</mn><mi>m</mi><mover><mi>j</mi><mo>^</mo></mover></mtd></mtr></mtable></math></p></blockquote>',
//       image: null,
//     },
//     videoSolution: null,
//     masterId: 'MOGJMPYQ02453484',
//     numericalLowerLimit: '',
//     numericalUpperLimit: '',
//     bucket: 'Must Do Ques (JEE Main) - Any Difficulty',
//     isRemoved: false,
//     cpyqbSubjects: [
//       '616057750283de43c87e3e1b',
//       '61c055eae8ce0dc8a5c62d33',
//       '629105adee9e3ae00d63352b',
//       '61964fe0a5a5260118868021',
//       '616056cd0283de43c87e3e15',
//       '616057190283de43c87e3e18',
//       '61a8a2c2e8ce0dc8a5c62d2d',
//       '62962075e7f8e9ac4daeafd7',
//       '616057920283de43c87e3e1e',
//       '61bb58181213731910ea0b70',
//       '615f0c729476412f48314dab',
//       '61964f81a5a526011886801d',
//       '629f385f263330a77be9fa7d',
//       '629f39e4ac11b26562e0625b',
//     ],
//     cpyqbChapters: [
//       '616023b9c2e3bbfc3f2ecdd2',
//       '61964c76bae973f89e899882',
//       '61964c74ec1ca6c1a7365dcf',
//       '61bb821fa52006d37a60e707',
//       '616023b74026d68c120f2ba9',
//       '616023b542cfec4323be20b3',
//       '61e7bd7991a3d691658409aa',
//       '616023b78dba43da23bef37e',
//       '61c089a30f62a0d239520145',
//       '616023b36f5a53c6a5d4ce42',
//       '629621223df2fbbc95bf297f',
//       '629109ec048d30f09d45ec7c',
//       '629f3a90cf4faea06a760897',
//       '629f390ce1a391b9376aa0de',
//     ],
//     cpyqbExams: ['616059af0283de43c87e3e23', '615f0e999476412f48314daf'],
//   },
//   cs: {
//     "_id": "64b169fbf23ac7d519f9b040",
//     "type": "multipleCorrect",
//     "level": 1,
//     "category": null,
//     "approximateTimeRequired": 90,
//     "imageBaseUrl": null,
//     "helperText": null,
//     "source": "MOG",
//     "classes": [],
//     "exams": [
//       "615d76cfc52ffa3c944600e0"
//     ],
//     "subjects": [
//       "615d708dbd4a37c4058ee5a8"
//     ],
//     "chapters": [
//       "615d6feb2b295b085ab6eb8a"
//     ],
//     "topics": [
//       "6602cbde88c01ba3321ca134"
//     ],
//     "concepts": [],
//     "microConcepts": [],
//     "questionLabels": [],
//     "previousYearPapers": [
//       {
//         "_id": "620a8a1f77301f65c2f92c46",
//         "title": "JEE Advanced 2010 (Paper 1)",
//         "isVisible": true
//       }
//     ],
//     "question": {
//       "text": "A student uses a simple pendulum of exactly $1 \\mathrm{~m}$ length to determine $g$, the acceleration due to gravity. He uses a stop watch with the least count of $1 \\mathrm{~s}$ for this and records $40 \\mathrm{~s}$ for 20 oscillations. For this observation, which of the following statement(s) is/are true?",
//       "image": null
//     },
//     "options": [
//       {
//         "id": "LySd3",
//         "text": "\nError $\\Delta T$ in measuring $T$, the time period, is $0.05 \\mathrm{~s}$\n",
//         "image": null,
//         "isCorrect": true
//       },
//       {
//         "id": "azW4q",
//         "text": "\nError $\\Delta T$ in measuring $T$, the time period, is $1 \\mathrm{~s}$\n",
//         "image": null,
//         "isCorrect": false
//       },
//       {
//         "id": "65q8F",
//         "text": "\nPercentage error in the determination of $g$ is $5 \\%$\n",
//         "image": null,
//         "isCorrect": true
//       },
//       {
//         "id": "yexg9",
//         "text": "\nPercentage error in the determination of $g$ is $2.5 \\%$",
//         "image": null,
//         "isCorrect": false
//       }
//     ],
//     "correctValue": null,
//     "solution": {
//       "text": "$T=\\frac{40 \\mathrm{~s}}{20}=2 \\mathrm{~s}$.\nFurther, $t=n T=20 T$ or $\\Delta t=20 \\Delta T$\n$\\therefore \\quad \\frac{\\Delta t}{t}=\\frac{\\Delta T}{T}$\nor $\\Delta T=\\frac{T}{t} \\cdot \\Delta t=\\left(\\frac{2}{40}\\right)(1)=0.05 \\mathrm{~s}$\nFurther, $T=2 \\pi \\sqrt{\\frac{l}{g}}$ or $\\quad T \\propto g^{-1 / 2}$\n$$\n\\therefore \\frac{\\Delta T}{T} \\times 100=-\\frac{1}{2} \\times \\frac{\\Delta g}{g} \\times 100\n$$\nor $\\%$ error in determination of $g$ is\n$$\n\\begin{aligned}\n\\frac{\\Delta g}{g} \\times 100 & =-200 \\times \\frac{\\Delta T}{T} \\\\\n& =-\\frac{200 \\times 0.05}{2}=-5 \\%\n\\end{aligned}\n$$\n$\\therefore$ correct options are (a) and (c).",
//       "image": null
//     },
//     "videoSolution": null,
//     "masterId": "MOGJAPYQ39923000",
//     "numericalLowerLimit": "",
//     "numericalUpperLimit": "",
//     "bucket": "",
//     "isRemoved": false,
//     "cpyqbSubjects": [
//       "616057920283de43c87e3e1e",
//       "616057750283de43c87e3e1b",
//       "61964fe0a5a5260118868021",
//       "616056cd0283de43c87e3e15",
//       "615f0c729476412f48314dab",
//       "616057190283de43c87e3e18",
//       "61bb58181213731910ea0b70",
//       "61964f81a5a526011886801d",
//       "61c055eae8ce0dc8a5c62d33",
//       "629105adee9e3ae00d63352b",
//       "62962075e7f8e9ac4daeafd7",
//       "629f385f263330a77be9fa7d",
//       "629f39e4ac11b26562e0625b",
//       "64d50bd73df7f4a7f3017f6f",
//       "61a8a2c2e8ce0dc8a5c62d2d"
//     ],
//     "cpyqbChapters": [
//       "6160239e5c11c06c0fa49406",
//       "6160239f750c8acf0af5535d",
//       "61964c721898e31221afc8be",
//       "61c089a1b1e0bbdce92d07ab",
//       "6160239d176977e9a4bf6528",
//       "620ab20a58b33b9d42624168",
//       "61964c71a1c097e7f417f9d3",
//       "629109eee350a2a3f2ae46d2",
//       "629621236200b1bfd3f21914",
//       "629f390c223683dd760c786e",
//       "629f3a914a1915704dbd7206",
//       "641b35f576a2b9001ebc2fc9",
//       "64b93b160c5ddc56daf1bdfe",
//       "64db813c4ce2a65f7bd74f1b",
//       "64e853a91e014c40646fdcc0",
//       "64e45901ec226f2f4360a802",
//       "64eb06c53118f713ecfef0a8",
//       "61e7bd79c8ca5ec1f00e8ceb"
//     ],
//     "cpyqbExams": [
//       "616059150283de43c87e3e21"
//     ]
//   }
// };

/*dummy funs*/
// screenTypes
// ['question', 'notebookQuestion', 'top500question', 'lblqQuestion','dbqQuestion'];

// var currentQ = Qs.cs;
// var nextBtn = document.getElementById('nextQbutton');
// nextBtn.addEventListener('click', function (e) {
//   e.preventDefault();
//   if (currentQ._id !== Qs.data3._id) {
//     currentQ = Qs.data3;
//     setQuestion(
//       currentQ,
//       {
//         selectedOption: [
//           {
//             id: 'vGUEz',
//             text: '\n$12 \\mathrm{~N}, 6 \\mathrm{~N}$\n',
//             image: null,
//             isCorrect: false,
//           },
//         ],
//         numericalAnswer: undefined,
//         answerStatus: 'incorrect',
//       },
//       'question',
//       { data: 'hidden' },
//       'dark',
//       false,
//     );
//   }
// });

// question
// setQuestion(
//   currentQ,
//   null,
//   'question',
//   { data: true }, // additonalData contains true(boolean) if it is the first time user is viewing a dbq question.
//   'dark',
//   true,
//   ['JEE Main', 'Mathematics', 'Basic of Mathematics'] //elements in the breadcrumbs
// );
/* old-code */
// dbq
// setQuestion(
//   currentQ,
//   {
//     selectedOption: [
//       {
//         "id": "RnS52",
//         "text": "But-1-yne",
//         "image": null,
//         "isCorrect": false
//       },
//     ],
//     numericalAnswer: undefined,
//     answerStatus: 'incorrect',
//   },
//   'dbqQuestion',
//   {},
//   'dark',
//   false,
// );

// lblq
// setQuestion(
//   currentQ,
//   {
//     selectedOption: [
//       {
//         id: 'pMAWJ',
//         text: 'Positive <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>-axis',
//         image: null,
//         isCorrect: false,
//       },
//     ],
//     numericalAnswer: undefined,
//     answerStatus: 'incorrect',
//   },
//   'lblqQuestion',
//   {},
//   'dark',
//   false,
// );
