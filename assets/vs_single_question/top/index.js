"use strict";
// var Android = {
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
//     reportVS: function () {
//         Android.showToast('Report VS toggle')
//     }
// };
// Helper Functions
var globalTheme = "light";
var qLabelTypes = {
  topic: function (value) {
    return "Topic: " + value;
  },
  Topic: function (value) {
    return "Topic: " + value;
  },
  concept: function (value) {
    return "Concept: " + value;
  },
  Concept: function (value) {
    return "Concept: " + value;
  },
  pageTextToDisplay: function (value) {
    return value;
  },
  paragraphNumber: function (value) {
    return "Paragraph: " + value;
  },
};
function sortBy(array, order, propertyRetrieverFn) {
  if (order.length)
    return array.sort(function (a, b) {
      return (
        order.indexOf(propertyRetrieverFn(a)) -
        order.indexOf(propertyRetrieverFn(b))
      );
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
    if (label && label.title && qLabelTypes.hasOwnProperty(label.title))
      qLabels.push(label);
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
  var qLabels = getFormattedQuestionLabels(
    questionLabels,
    ["topic", "concept", "pageTextToDisplay", "paragraphNumber"],
    function (obj) {
      return obj.title;
    }
  );
  var qLabelString = "";
  qLabels.forEach(function (label, index) {
    qLabelString +=
      label.displayText + (index !== qLabels.length - 1 ? ", " : "");
  });
  return qLabelString;
}
function populateLabels(labelsLeft, questionLabels, previousYearPapers) {
  var newLabels = document.createElement("div");
  var labelsLeftParent;
  if (labelsLeft) {
    labelsLeftParent = labelsLeft.parentNode;
    newLabels.classList = labelsLeft.classList;
  }

  if (previousYearPapers.length) {
    for (var i = 0; i < previousYearPapers.length; i++) {
      var paper = previousYearPapers[i];
      var outerDiv = document.createElement("div"),
        innerDiv = document.createElement("div");
      outerDiv.className = "label-container";
      innerDiv.className = "label-text";
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
      var outerDiv = document.createElement("div"),
        innerDiv = document.createElement("div");

      outerDiv.className = "label-container";
      innerDiv.className = "label-text";
      innerDiv.innerHTML = label.title + ": " + label.value;

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
  var optionsHTML = "";
  if (type === "numerical") {
    optionsHTML +=
      '<div class="option-container row"><div id="main-options" class="option"><input id="inputAns" type="text" class="numerical-input form-control" placeholder="Enter your answer" aria-label="numerical" onkeypress="return isNumberKey(this, event);"></div><div class="option-badge"><p class="option-badge-text"></p></div></div>';
  } else {
    var getOptionsArray = getOptionsByState(type, "default", theme);
    for (var i = 0; i < options.length; i++) {
      var opt = options[i],
        optionSrc = getOptionsArray[i],
        newOption =
          '<div class="option-container row"><div id="' +
          opt.id +
          '" class="option"><img src="' +
          optionSrc +
          '" class="option-icon"></img><div class="option-text">' +
          opt.text +
          '</div></div><div class="option-badge"><p class="option-badge-text"></p></div></div>';
      optionsHTML += newOption;
    }
  }
  optionsBox.innerHTML = optionsHTML;
}
function formSubmitHandler(question, type) {
  var solutionBox = document.getElementById("solutionBox"),
    errorBox = document.getElementById("error");
  // Display showSolutions button
  displayShowSolutions();
  solutionBox.style.display = "none";
  errorBox.style.display = "none";
  if (type != "numerical") {
    var optionsList = document.querySelectorAll(".option");
    for (var i = 0; i < optionsList.length; i++) {
      var el = optionsList[i];
      el.style.pointerEvents = "none";
    }
  }
  questionSolutionResizeAllImages(question);
  setTypeset();
}
function getOptionsByState(questionType, state, theme) {
  var type = questionType === "singleCorrect" ? "single" : "multiple";
  switch (state) {
    case "selected":
      if (theme === "dark") {
        return [
          "../assets/svg/options/" +
            type +
            "/A/type_" +
            type +
            "_option_A_state_selected_dark.svg",
          "../assets/svg/options/" +
            type +
            "/B/type_" +
            type +
            "_option_B_state_selected_dark.svg",
          "../assets/svg/options/" +
            type +
            "/C/type_" +
            type +
            "_option_C_state_selected_dark.svg",
          "../assets/svg/options/" +
            type +
            "/D/type_" +
            type +
            "_option_D_state_selected_dark.svg",
        ];
      } else {
        return [
          "../assets/svg/options/" +
            type +
            "/A/type_" +
            type +
            "_option_A_state_selected.svg",
          "../assets/svg/options/" +
            type +
            "/B/type_" +
            type +
            "_option_B_state_selected.svg",
          "../assets/svg/options/" +
            type +
            "/C/type_" +
            type +
            "_option_C_state_selected.svg",
          "../assets/svg/options/" +
            type +
            "/D/type_" +
            type +
            "_option_D_state_selected.svg",
        ];
      }
    case "correct":
      return [
        "../assets/svg/options/" +
          type +
          "/A/type_" +
          type +
          "_option_A_state_correct.svg",
        "../assets/svg/options/" +
          type +
          "/B/type_" +
          type +
          "_option_B_state_correct.svg",
        "../assets/svg/options/" +
          type +
          "/C/type_" +
          type +
          "_option_C_state_correct.svg",
        "../assets/svg/options/" +
          type +
          "/D/type_" +
          type +
          "_option_D_state_correct.svg",
      ];
    case "incorrect":
      return [
        "../assets/svg/options/" +
          type +
          "/A/type_" +
          type +
          "_option_A_state_incorrect.svg",
        "../assets/svg/options/" +
          type +
          "/B/type_" +
          type +
          "_option_B_state_incorrect.svg",
        "../assets/svg/options/" +
          type +
          "/C/type_" +
          type +
          "_option_C_state_incorrect.svg",
        "../assets/svg/options/" +
          type +
          "/D/type_" +
          type +
          "_option_D_state_incorrect.svg",
      ];
    default:
      if (theme === "dark") {
        return [
          "../assets/svg/options/" +
            type +
            "/A/type_" +
            type +
            "_option_A_state_default.webp",
          "../assets/svg/options/" +
            type +
            "/B/type_" +
            type +
            "_option_B_state_default.webp",
          "../assets/svg/options/" +
            type +
            "/C/type_" +
            type +
            "_option_C_state_default.webp",
          "../assets/svg/options/" +
            type +
            "/D/type_" +
            type +
            "_option_D_state_default.webp",
        ];
      } else {
        return [
          "../assets/svg/options/" +
            type +
            "/A/type_" +
            type +
            "_option_A_state_default.webp",
          "../assets/svg/options/" +
            type +
            "/B/type_" +
            type +
            "_option_B_state_default.webp",
          "../assets/svg/options/" +
            type +
            "/C/type_" +
            type +
            "_option_C_state_default.webp",
          "../assets/svg/options/" +
            type +
            "/D/type_" +
            type +
            "_option_D_state_default.webp",
        ];
      }
  }
}
function isNumberKey(txt, evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode == 46) {
    //Check if the text already contains the . character
    if (txt.value.indexOf(".") === -1) {
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
  var solutionBox = document.getElementById("solutionBox"),
    questionText = document.getElementById("questionText"),
    answerBox = document.getElementById("answer-box"),
    errorBox = document.getElementById("error"),
    showSolutionsBtn = document.getElementById("action-show-solutions"),
    numericalInputContainer = document.getElementById("main-options"),
    inputField = document.getElementById("inputAns");
  solutionBox.style.display = "none";
  questionText.innerHTML = "";
  errorBox.style.display = "none";
  showSolutionsBtn.style.display = "none";
  if (answerBox) {
    answerBox.remove();
  }
  if (numericalInputContainer && inputField) {
    numericalInputContainer.style.border = "1px solid #dcdde2";
    inputField.value = "";
  }
}
function displayShowSolutions() {
  var showSolutionsBtn = document.getElementById("action-show-solutions");
  showSolutionsBtn.style.display = "flex";
  showSolutionsBtn.addEventListener("click", function () {
    Android.onShowSolutions("solutionBox");
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
  var replaceWith = "<br>";
  question.question.text = question.question.text.replace(
    searchFor,
    replaceWith
  );
  if (question.solution.text)
    question.solution.text = question.solution.text.replace(
      searchFor,
      replaceWith
    );
  else {
    if (question.solution)
      question.solution = question.solution.replace(searchFor, replaceWith);
  }
  for (var i = 0; i < question.options.length; i++) {
    question.options[i].text = question.options[i].text.replace(
      searchFor,
      replaceWith
    );
  }
}
function resizeImages(images) {
  var currentScreenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    var imgSize = image.naturalWidth;
    if (imgSize >= currentScreenWidth) {
      image.style.height = "auto";
      image.style.width = "100%";
    }
  }
}
function questionTextResizeAllImages(question) {
  if (question.question.text.includes("<img")) {
    var allQuestionImages = document.querySelectorAll("#questionText img");
    resizeImages(allQuestionImages);

    var finalImages = [],
      htmlToImages = Array.prototype.slice.call(document.images);

    for (var i = 0; i < htmlToImages.length; i++) {
      var image = htmlToImages[i];
      if (!image.complete)
        finalImages.push(
          new Promise(function (resolve) {
            image.onload = image.onerror = resolve;
          })
        );
    }

    Promise.all(finalImages).then(function () {
      resizeImages(allQuestionImages);
    });
  }
}
function questionSolutionResizeAllImages(question) {
  if (
    (question.solution.text && question.solution.text.includes("<img")) ||
    (!question.solution.text &&
      question.solution &&
      question.solution.includes("<img"))
  ) {
    var finalImages = [],
      htmlToImages = Array.prototype.slice.call(document.images);

    for (var i = 0; i < htmlToImages.length; i++) {
      var image = htmlToImages[i];
      if (!image.complete)
        finalImages.push(
          new Promise(function (resolve) {
            image.onload = image.onerror = resolve;
          })
        );
    }

    Promise.all(finalImages).then(function () {
      var allSolutionImages = document.querySelectorAll(".solution-text img");
      resizeImages(allSolutionImages);
    });
  }
}
function questionOptionsResizeAllImages(question) {
  for (var x = 0; x < question.options.length; x++) {
    var quesOpt = question.options[x];
    if (quesOpt.text.includes("<img")) {
      var finalImages = [],
        htmlToImages = Array.prototype.slice.call(document.images);

      for (var i = 0; i < htmlToImages.length; i++) {
        var image = htmlToImages[i];
        if (!image.complete)
          finalImages.push(
            new Promise(function (resolve) {
              image.onload = image.onerror = resolve;
            })
          );
      }

      Promise.all(finalImages).then(function () {
        var allOptionImages = document.querySelectorAll(".option-text img");
        resizeImages(allOptionImages);
      });
    }
  }
}
function setTypeset() {
  MathJax.Hub.Config({
    "HTML-CSS": { linebreaks: { automatic: true } },
    SVG: { linebreaks: { automatic: true } },
    messageStyle: "none",
    tex2jax: {
      preview: "none",
      processEscapes: true,
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
        ["{tex}", "{/tex}"],
      ],
    },
    CommonHTML: {
      linebreaks: { automatic: false },
    },
  });
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
function setSolutionConsent(question, isConsent) {
  var solutionConsent = document.getElementById("solutionConsent");
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
  solutionConsent.addEventListener("change", function () {
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
  var solutionBox = document.getElementById("solutionBox");
  if (!solutionBox) return;
  solutionBox.style.display = "none";
  var errorBox = document.getElementById("error");
  errorBox.style.display = "none";
  solutionBox.innerHTML =
    '<div class="row">' +
    '<p class="solution-header mb-1" style="font-family: \'SF Pro Display\';">Video Solution:</p>' +
    "</div>";
  questionSolutionResizeAllImages(question);
  setTypeset();
}
function hideSolution() {
  var solutionBox = document.getElementById("solutionBox");
  solutionBox.style.display = "none";
  var errorBox = document.getElementById("error");
  errorBox.style.display = "none";
}
function setSubjectiveQuestion(question, showSolutionByDefault = false) {
  setSolutionConsent(question, showSolutionByDefault);
  var actionShowSolutions = document.getElementById("action-show-solutions");
  actionShowSolutions.style.display = "none";
  var errorBox = document.getElementById("error");
  errorBox.style.display = "none";
  errorBox.addEventListener("click", function () {
    Android.showReport();
  });
  var questionTextPara = document.getElementById("questionText");
  if (questionTextPara) questionTextPara.innerHTML = question.question.text;
  setTypeset();
}
// Main Functions [to be called by Android]

function setQuestion(
  question,
  status,
  screenType,
  additionalData,
  theme,
  showSolutionByDefault
) {
  var quesType = question ? question.type : undefined;
  resetDoc();
  createDoc({ qType: quesType });
  resetFields();
  screenType = typeof screenType !== "undefined" ? screenType : "videoQuestion";
  var body = document.querySelector("body");
  if (theme === "dark") {
    if (!body.classList.contains("dark_mode")) body.classList.add("dark_mode");
  } else body.classList.remove("dark_mode");
  globalTheme = theme;
  if (quesType === "subjective") {
    try {
      setSubjectiveQuestion(question, showSolutionByDefault);
    } catch (e) {
      console.error("Error - Question Text:", e);
    }
    return null;
  }
  var questionTextPara = document.getElementById("questionText"),
    labelsLeft = document.querySelector(".labels-left"),
    optionsBox = document.getElementById("optionsBox"),
    solutionBox = document.getElementById("solutionBox"),
    errorBox = document.getElementById("error"),
    vsErrorBox = document.getElementById("vs-error");
  questionReplaceNewLine(question);

  // Populating the question-text paragraph
  questionTextPara.innerHTML = question.question.text;
  questionTextResizeAllImages(question);
  // Populating the labels
  populateLabels(
    labelsLeft,
    question.questionLabels,
    question.previousYearPapers
  );

  // get latest labels left
  labelsLeft = document.querySelector(".labels-left");
  if (screenType === "videoQuestion" && question.syllabusCategory) {
    // add syllabus category label
    let outerDiv = document.createElement("div"),
      innerDiv = document.createElement("div");
    outerDiv.className = "label-container";
    outerDiv.style.backgroundColor =
      question.syllabusCategory === "outOfSyllabus" ? "#FEF1F1" : "#FEF9C3";
    innerDiv.className = "label-text";
    innerDiv.style.color =
      question.syllabusCategory === "outOfSyllabus" ? "#DC2828" : "#733F12";
    innerDiv.innerHTML =
      question.syllabusCategory === "outOfSyllabus"
        ? "Out of Syllabus"
        : "Out of Syllabus but Good to Solve";
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
      checkOptionsAnswer(question, prevSelectedOptions, prevAnswerStatus, null);
    } else if (prevNumericalAnswer) {
      // Numerical based
      // Then add the proper badge on-top of the input field option [Correct Answer | Incorrect Answer]
      checkNumericalAnswer(question, prevNumericalAnswer, prevAnswerStatus);
    }
    //these functions are being called twice./*warning*/
    // displayShowSolutions();
  }
  // Event Listeners
  var optionsList = document.querySelectorAll(".option");
  if (quesType === "singleCorrect") {
    var optionContainers = document.querySelectorAll(".option-container");
    var optionsBoxIndexes = {};
    for (var x = 0; x < optionContainers.length; x++) {
      var optionBoxEl = optionContainers[x];
      optionsBoxIndexes[optionBoxEl.firstElementChild.id] = x;
    }
    for (var i = 0; i < optionsList.length; i++) {
      const item = optionsList[i];
      item.addEventListener("click", function () {
        var lastSelectedEl = document.querySelector(".option_state_selected");
        if (lastSelectedEl) {
          lastSelectedEl.classList.remove("option_state_selected");
          lastSelectedEl.firstElementChild.src = getOptionsByState(
            "singleCorrect",
            "default"
          )[optionsBoxIndexes[lastSelectedEl.id]];
        }
        if (lastSelectedEl !== this) {
          this.firstElementChild.src = getOptionsByState(
            "singleCorrect",
            "selected"
          )[optionsBoxIndexes[this.id]];
          this.classList.add("option_state_selected");
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
    }
  } else if (quesType === "multipleCorrect") {
    for (var i = 0; i < optionsList.length; i++) {
      (function (index) {
        // Using an IIFE to capture the current index
        var item = optionsList[index];
        item.addEventListener("click", function () {
          if (item.getAttribute("class").includes("option_state_selected")) {
            item.firstElementChild.src = getOptionsByState(
              "multiple",
              "default"
            )[index];
          } else {
            item.firstElementChild.src = getOptionsByState(
              "multiple",
              "selected"
            )[index];
          }
          item.classList.toggle("option_state_selected");
          var optionObject = question.options.find(function (el) {
            return el.id === item.id;
          });
          Android.onOptionSelected(JSON.stringify(optionObject));
        });
      })(i); // Pass the current index to the IIFE
    }
  } else {
    var numericalInput = document.querySelector(".numerical-input");
    numericalInput.addEventListener("input", function (e) {
      Android.onInputChanged(e.target.value);
    });
  }
  vsErrorBox?.addEventListener("click", function () {
    Android.reportVS();
  });
  errorBox.addEventListener("click", function () {
    Android.showReport();
  });
  setTypeset();
}
function checkNumericalAnswer(question, input, status) {
  var newValue = null;
  if (input[input.length - 1] === ".") newValue = input + "0";
  var correctAnswer = question.correctValue;
  var solutionBox = document.getElementById("solutionBox"),
    solutionBadge = document.querySelector(".option-badge"),
    solutionBadgeText = document.querySelector(".option-badge-text"),
    numericalInputContainer = document.getElementById("main-options"),
    inputField = document.getElementById("inputAns"),
    userAnswer = newValue ? newValue : input;
  if (solutionBadgeText) {
    var answerBox = document.getElementById("answer-box");
    if (answerBox) {
      answerBox.innerHTML =
        '<div class="row"><p class="solution-header">Answer:</p></div><div class="row"><p class="answer-text">' +
        correctAnswer +
        "</p></div>";
    } else {
      var newDiv = document.createElement("div");
      newDiv.id = "answer-box";
      newDiv.innerHTML =
        '<div class="row"><p class="solution-header">Answer:</p></div><div class="row"><p class="answer-text">' +
        correctAnswer +
        "</p></div>";
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
    solutionBadgeText.textContent = "Correct Answer";
    solutionBadge.classList.add("correct-answer");
    numericalInputContainer.style.border = "1px solid #31d99c";
  }
  // If the answer is incorrect
  else {
    solutionBadgeText.textContent = "Incorrect Answer";
    solutionBadge.classList.add("incorrect-answer");
    numericalInputContainer.style.border = "1px solid #ff5858";
  }
  formSubmitHandler(question, "numerical");
}
function checkOptionsAnswer(question, selectedOptions, status, theme) {
  var optionsBox = document.querySelectorAll(".option-container");
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
      var option = document.getElementById("" + key),
        optionIcon = option.firstElementChild,
        optionBadge = option.nextElementSibling,
        optionBadgeText = optionBadge.firstElementChild;
      optionBadgeText.textContent = "Correct Answer";
      optionBadge.classList.add("correct-answer");
      option.style.border = "1px solid #31d99c";
      optionIcon.src = getOptionsByState(question.type, "correct", theme)[
        optionsBoxIndexes[key]
      ];
    }
  }
  for (var i = 0; i < selectedOptions.length; i++) {
    var opt = selectedOptions[i].id;
    var option = document.getElementById("" + opt),
      optionIcon = option.firstElementChild,
      optionBadge = option.nextElementSibling,
      optionBadgeText = optionBadge.firstElementChild;
    // Selected option is correct
    if (options[opt] && (status === 0 || status === 1 || status === 2)) {
      optionBadgeText.textContent = "You Marked | Correct Answer";
      optionBadge.classList.add("correct-answer");
      option.style.border = "1px solid #31d99c";
      optionIcon.src = getOptionsByState(question.type, "correct", theme)[
        optionsBoxIndexes[opt]
      ];
    }
    // Selected option is incorrect
    else {
      optionBadgeText.textContent = "You Marked | Incorrect Answer";
      optionBadge.classList.add("incorrect-answer");
      option.style.border = "1px solid #ff5858";
      optionIcon.src = getOptionsByState(question.type, "incorrect", theme)[
        optionsBoxIndexes[opt]
      ];
    }
  }
  formSubmitHandler(question, "single-multi");
}
function createDoc({ qType }) {
  var sectionElement = document.querySelector(".container-fluid");
  sectionElement.innerHTML =
    '<section class="row">' +
    '<p id="questionText"></p>' +
    "</section>" +
    '<section id="labelBox" class="row">' +
    '<div class="labels-left col-md-6 col-12"></div>' +
    '<div class="labels-right col-md-6 col-12 justify-content-end">' +
    '<div id="action-show-solutions" class="label-text gap-2">' +
    "Go To Solution" +
    '<img src="../../assets/svg/RoundDownArrow.svg"/>' +
    "</div>" +
    "</div>" +
    "</section>" +
    '<section id="optionsBox"></section>' +
    '<section id="solutionBox">' +
    '<div class="row px-0">' +
    '<p class="solution-header" style="font-family: \'SF Pro Display\';">' +
    '<span class="new-tag">New</span>' +
    "Video Solution:" +
    "</p>" +
    "</div>" +
    '<div class="row">' +
    '<p class="solution-text"></p>' +
    "</div>" +
    "</section>" +
    '<section id="error" class="row">' +
    '<div class="error-container">' +
    '<object class="error-icon" data="../../assets/svg/Vector.svg" width="20" height="20"></object>' +
    '<span class="error-text">' +
    "Report Error" +
    "</span>" +
    "</div>" +
    "</section>" +
    (qType === "subjective"
      ? '<div class="solution-consent"><div class="form-group form-check"><input type="checkbox" class="form-check-input" id="solutionConsent" /><label class="form-check-label" for="solutionConsent">Do not automatically show solution for subjective question</label></div></div>'
      : "");
}
function resetDoc() {
  var sectionElement = document.querySelector(".container-fluid");
  sectionElement.innerHTML = "";
}
//zoom-image
window.addEventListener("load", function () {
  "use strict";

  var CUR_ZI = "zoom-in";
  var CUR_ZO = "zoom-out";

  var imgContainers = document.querySelectorAll("[data-zoom]");

  imgContainers.forEach(function (imgContainer) {
    var img = imgContainer.querySelector("img");
    var dataset = imgContainer.dataset;

    if (img) {
      img.style.cursor = CUR_ZI;
      imgContainer.style.overflow = "hidden";

      img.addEventListener("mousemove", function (e) {
        var x = e.layerX;
        var y = e.layerY;
        var w = img.offsetWidth;
        var h = img.offsetHeight;
        var originX = (x / w) * 100;
        var originY = (y / h) * 100;

        img.style.transformOrigin = originX + "% " + originY + "%";
      });

      imgContainer.addEventListener("click", function () {
        var maxValue = parseInt(dataset.zoomMax || 1) + 1;
        var currValue = parseInt(dataset.zoomValue || 1);
        var nextValue = currValue + 1;

        if (nextValue > maxValue) {
          img.style.transform = "scale(1)";
          img.style.cursor = CUR_ZI;
          imgContainer.setAttribute("data-zoom-value", "1");
        } else {
          img.style.transform = "scale(" + nextValue + ")";
          imgContainer.setAttribute("data-zoom-value", nextValue);

          if (nextValue === maxValue) {
            img.style.cursor = CUR_ZO;
          }
        }
      });
    }
  });
});
/* dummy Questions */
// var Qs = {
//     //vs dummy data
//     vsData: {
//         "hasAccess": true,
//         "_id": "648b5a6f417cc3fb48d68008",
//         "classes": [],
//         "exams": [
//             "615d76b2c52ffa3c944600df"
//         ],
//         "subjects": [
//             "615d708dbd4a37c4058ee5a8"
//         ],
//         "chapters": [
//             "615d6feb2b295b085ab6eb8a"
//         ],
//         "topics": [],
//         "concepts": [],
//         "previousYearPapers": [],
//         "position": 0,
//         "type": "singleCorrect",
//         "level": 1,
//         "approximateTimeRequired": 90,
//         "question": {
//             "text": "If two vectors&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mover><mi>P</mi><mo>&#8594;</mo></mover><mo>=</mo><mover><mi mathvariant=\"normal\">i</mi><mo>^</mo></mover><mo>+</mo><mn>2</mn><mi>m</mi><mover><mi mathvariant=\"normal\">j</mi><mo>^</mo></mover><mo>+</mo><mi>m</mi><mover><mi mathvariant=\"normal\">k</mi><mo>^</mo></mover></math>&nbsp; and&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mover><mi>Q</mi><mo>&#8594;</mo></mover><mo>=</mo><mn>4</mn><mover><mi mathvariant=\"normal\">i</mi><mo>^</mo></mover><mo>-</mo><mn>2</mn><mover><mi mathvariant=\"normal\">j</mi><mo>^</mo></mover><mo>+</mo><mi>m</mi><mover><mi mathvariant=\"normal\">k</mi><mo>^</mo></mover></math>&nbsp; are perpendicular to each other. Then, the value of <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>m</mi></math> will be&nbsp;",
//             "image": null
//         },
//         "options": [
//             {
//                 "id": "uIAwk",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>-</mo><mn>1</mn></math>",
//                 "isCorrect": false,
//                 "image": null
//             },
//             {
//                 "id": "XHNlD",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>2</mn></math>",
//                 "isCorrect": true,
//                 "image": null
//             },
//             {
//                 "id": "LAJxz",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>3</mn></math>",
//                 "isCorrect": false,
//                 "image": null
//             },
//             {
//                 "id": "qm9s2",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>1</mn></math>",
//                 "isCorrect": false,
//                 "image": null
//             }
//         ],
//         "correctValue": null,
//         "solution": {
//             "text": "<p>For two vectors to be perpendicular, their dot&nbsp;product is equal to zero.</p><p>So,&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mover><mi>P</mi><mo>&#8594;</mo></mover><mo>&#183;</mo><mover><mi>Q</mi><mo>&#8594;</mo></mover><mo>=</mo><mn>0</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfenced><mrow><mover><mi mathvariant=\"normal\">i</mi><mo>^</mo></mover><mo>+</mo><mn>2</mn><mi>m</mi><mover><mi mathvariant=\"normal\">j</mi><mo>^</mo></mover><mo>+</mo><mi>m</mi><mover><mi mathvariant=\"normal\">k</mi><mo>^</mo></mover></mrow></mfenced><mo>&#183;</mo><mfenced><mrow><mn>4</mn><mover><mi mathvariant=\"normal\">i</mi><mo>^</mo></mover><mo>-</mo><mn>2</mn><mover><mi mathvariant=\"normal\">j</mi><mo>^</mo></mover><mo>+</mo><mi>m</mi><mover><mi mathvariant=\"normal\">k</mi><mo>^</mo></mover></mrow></mfenced><mo>=</mo><mn>0</mn><mspace linebreak=\"newline\"/><mo>&#8658;</mo><mn>4</mn><mo>-</mo><mn>4</mn><mi>m</mi><mo>+</mo><msup><mi>m</mi><mn>2</mn></msup><mo>=</mo><mn>0</mn><mspace linebreak=\"newline\"/><mo>&#8658;</mo><msup><mfenced><mrow><mi>m</mi><mo>-</mo><mn>2</mn></mrow></mfenced><mn>2</mn></msup><mo>=</mo><mn>0</mn><mspace linebreak=\"newline\"/><mo>&#8658;</mo><mi>m</mi><mo>=</mo><mn>2</mn></math></p>",
//             "image": null
//         },
//         "videoSolution": {
//             "videoId": "1492c7d32f7de2f35f7ac82c82bab453",
//             "provider": "vimeo",
//             "thumbnailLight": "https://i.ibb.co/qm1kj7g/video.png",
//             "thumbnailDark": "https://i.ibb.co/qm1kj7g/video.png",
//             "premiumModules": [
//                 {
//                     "premiumModuleId": "64c7e8e829737784b294e469",
//                     "isFree": true
//                 }
//             ]
//         },
//         "numericalUpperLimit": "",
//         "numericalLowerLimit": "",
//         "questionLabels": [
//             {
//                 title: 'NTA Abhyas Paper',
//                 value: '01',
//                 isVisible: true,
//             },
//         ],
//         "__v": 0,
//         "masterId": "MOGJMPYQ27165647",
//         "bucket": "Easy Ques (Board Level)",
//         "category": null,
//         "microConcepts": [],
//         "imageBaseUrl": null,
//         "helperText": null,
//         "isRemoved": false,
//         "cpyqbSubjects": [
//             "616057920283de43c87e3e1e",
//             "616057750283de43c87e3e1b",
//             "61964fe0a5a5260118868021",
//             "616056cd0283de43c87e3e15",
//             "615f0c729476412f48314dab",
//             "616057190283de43c87e3e18",
//             "61bb58181213731910ea0b70",
//             "61964f81a5a526011886801d",
//             "61c055eae8ce0dc8a5c62d33",
//             "61a8a2c2e8ce0dc8a5c62d2d",
//             "629105adee9e3ae00d63352b",
//             "62962075e7f8e9ac4daeafd7",
//             "629f385f263330a77be9fa7d",
//             "629f39e4ac11b26562e0625b",
//             "64d50bd73df7f4a7f3017f6f"
//         ],
//         "cpyqbChapters": [
//             "6160239e5c11c06c0fa49406",
//             "6160239f750c8acf0af5535d",
//             "61964c721898e31221afc8be",
//             "61c089a1b1e0bbdce92d07ab",
//             "61e7bd79c8ca5ec1f00e8ceb",
//             "6160239d176977e9a4bf6528",
//             "620ab20a58b33b9d42624168",
//             "61964c71a1c097e7f417f9d3",
//             "629109eee350a2a3f2ae46d2",
//             "629621236200b1bfd3f21914",
//             "629f390c223683dd760c786e",
//             "629f3a914a1915704dbd7206",
//             "641b35f576a2b9001ebc2fc9",
//             "64b93b160c5ddc56daf1bdfe",
//             "64db813c4ce2a65f7bd74f1b",
//             "64e853a91e014c40646fdcc0"
//         ],
//         "cpyqbExams": [
//             "616059af0283de43c87e3e23",
//             "615f0e999476412f48314daf"
//         ]
//     },
//     vsData2: {
//         "hasAccess": false,
//         "_id": "648b5a70417cc3fb48d682d3",
//         "classes": [],
//         "exams": [
//             "615d76b2c52ffa3c944600df"
//         ],
//         "subjects": [
//             "615d708dbd4a37c4058ee5a8"
//         ],
//         "chapters": [
//             "615d6feb2b295b085ab6eb8a"
//         ],
//         "topics": [],
//         "concepts": [],
//         "previousYearPapers": [],
//         "position": 0,
//         "type": "singleCorrect",
//         "level": 1,
//         "approximateTimeRequired": 90,
//         "question": {
//             "text": "A body is moving with constant speed, in a circle of radius <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>10</mn><mo>&#160;</mo><mi mathvariant=\"normal\">m</mi></math>. The body completes one revolution in <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>4</mn><mo>&#160;</mo><mi mathvariant=\"normal\">s</mi></math>. At the end of <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>3</mn><mi>r</mi><mi>d</mi></math> second, the displacement of body (in <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi mathvariant=\"normal\">m</mi></math>) from its starting point is:",
//             "image": null
//         },
//         "options": [
//             {
//                 "id": "Uft1U",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>30</mn></math>",
//                 "isCorrect": false,
//                 "image": null
//             },
//             {
//                 "id": "e1REB",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>15</mn><mo>&#160;</mo><mi mathvariant=\"normal\">&#960;</mi></math>",
//                 "isCorrect": false,
//                 "image": null
//             },
//             {
//                 "id": "793ny",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>5</mn><mo>&#160;</mo><mi mathvariant=\"normal\">&#960;</mi></math>",
//                 "isCorrect": false,
//                 "image": null
//             },
//             {
//                 "id": "givKA",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>10</mn><msqrt><mn>2</mn></msqrt></math>",
//                 "isCorrect": true,
//                 "image": null
//             }
//         ],
//         "correctValue": null,
//         "solution": {
//             "text": "<p><img src=\"https://cdn-question-pool.getmarks.app/pyq/jee_main/a3588fa5-957c-4fc2-a4c4-8e9f56d9cf98-9895950.png\" style=\"width: 300px; height: 266px;\" /></p><p>Give:&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>r</mi><mo>=</mo><mn>10</mn><mo>&#160;</mo><mi mathvariant=\"normal\">m</mi></math>,&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>T</mi><mo>=</mo><mn>4</mn><mo>&#160;</mo><mi mathvariant=\"normal\">s</mi></math>.</p><p>Displacement is defined to be the change in position of an object. As we can see from the above figure, displacement will be&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>d</mi><mo>=</mo><msqrt><msup><mi>r</mi><mn>2</mn></msup><mo>+</mo><msup><mi>r</mi><mn>2</mn></msup></msqrt></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mi>d</mi><mo>=</mo><mn>10</mn><msqrt><mn>2</mn></msqrt><mo>&#160;</mo><mi mathvariant=\"normal\">m</mi></math></p>",
//             "image": null
//         },
//         "videoSolution": {
//             "videoId": "",
//             "provider": "youtube",
//             "thumbnailLight": "https://i.ibb.co/qm1kj7g/video.png",
//             "thumbnailDark": "https://i.ibb.co/qm1kj7g/video.png",
//             "premiumModules": [
//                 {
//                     "premiumModuleId": "64c7e8e829737784b294e469",
//                     "isFree": false
//                 }
//             ]
//         },
//         "numericalUpperLimit": "",
//         "numericalLowerLimit": "",
//         "questionLabels": [],
//         "__v": 0,
//         "masterId": "MOGJMPYQ39382268",
//         "bucket": "Must Do Ques (JEE Main) - Any Difficulty",
//         "category": null,
//         "microConcepts": [],
//         "imageBaseUrl": null,
//         "helperText": null,
//         "isRemoved": false,
//         "cpyqbSubjects": [
//             "616057920283de43c87e3e1e",
//             "616057750283de43c87e3e1b",
//             "61964fe0a5a5260118868021",
//             "616056cd0283de43c87e3e15",
//             "615f0c729476412f48314dab",
//             "616057190283de43c87e3e18",
//             "61bb58181213731910ea0b70",
//             "61964f81a5a526011886801d",
//             "61c055eae8ce0dc8a5c62d33",
//             "61a8a2c2e8ce0dc8a5c62d2d",
//             "629105adee9e3ae00d63352b",
//             "62962075e7f8e9ac4daeafd7",
//             "629f385f263330a77be9fa7d",
//             "629f39e4ac11b26562e0625b",
//             "64d50bd73df7f4a7f3017f6f"
//         ],
//         "cpyqbChapters": [
//             "6160239e5c11c06c0fa49406",
//             "6160239f750c8acf0af5535d",
//             "61964c721898e31221afc8be",
//             "61c089a1b1e0bbdce92d07ab",
//             "61e7bd79c8ca5ec1f00e8ceb",
//             "6160239d176977e9a4bf6528",
//             "620ab20a58b33b9d42624168",
//             "61964c71a1c097e7f417f9d3",
//             "629109eee350a2a3f2ae46d2",
//             "629621236200b1bfd3f21914",
//             "629f390c223683dd760c786e",
//             "629f3a914a1915704dbd7206",
//             "641b35f576a2b9001ebc2fc9",
//             "64b93b160c5ddc56daf1bdfe",
//             "64db813c4ce2a65f7bd74f1b",
//             "64e853a91e014c40646fdcc0"
//         ],
//         "cpyqbExams": [
//             "616059af0283de43c87e3e23",
//             "615f0e999476412f48314daf"
//         ]
//     },
//     vsDataWithSyllabusData: {
//         "hasAccess": true,
//         "_id": "648b5a6c417cc3fb48d677aa",
//         "classes": [],
//         "exams": [
//             "615d76b2c52ffa3c944600df"
//         ],
//         "subjects": [
//             "615d708dbd4a37c4058ee5a8"
//         ],
//         "chapters": [
//             "615d6fed2b295b085ab6eb95"
//         ],
//         "topics": [],
//         "concepts": [],
//         "previousYearPapers": [],
//         "type": "numerical",
//         "level": 3,
//         "approximateTimeRequired": 150,
//         "question": {
//             "text": "<p>In an experiment to verify Newton&#39;s law of cooling. a graph is plotted between. the temperature difference <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mfenced><mrow><mi>&#916;</mi><mi>T</mi></mrow></mfenced></math> of the water and surroundings and time as shown in figure. The initial temperature of water is taken as <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>80</mn><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi></math>. The value of <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>t</mi><mn>2</mn></msub></math> as mentioned in the graph will be</p><p><img src=\"https://cdn-question-pool.getmarks.app/pyq/jee_main/b349b814-5332-4c78-838d-eabfb8448937-image.png\" style=\"width: 230px; height: 149px;\" /></p>",
//             "image": null
//         },
//         "options": [],
//         "correctValue": "16",
//         "solution": {
//             "text": "<p>According to the Newton&#39;s law of cooling,&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>-</mo><mfrac><mrow><mi mathvariant=\"normal\">d</mi><mi>T</mi></mrow><mrow><mi mathvariant=\"normal\">d</mi><mi>t</mi></mrow></mfrac><mo>=</mo><mi>K</mi><mfenced><mrow><mi>T</mi><mo>-</mo><msub><mi>T</mi><mn>0</mn></msub></mrow></mfenced></math>.</p><p>Applying approximation,&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>-</mo><mfrac><mrow><mo>&#8710;</mo><mi>T</mi></mrow><mrow><mo>&#8710;</mo><mi>t</mi></mrow></mfrac><mo>=</mo><mi>K</mi><mfenced><mrow><mfrac><mrow><msub><mi>T</mi><mn>1</mn></msub><mo>+</mo><msub><mi>T</mi><mn>2</mn></msub></mrow><mn>2</mn></mfrac><mo>-</mo><msub><mi>T</mi><mn>0</mn></msub></mrow></mfenced></math>&nbsp;</p><p>For first&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>6</mn><mo>&#160;</mo><mi>min</mi></math>,&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>T</mi><mn>1</mn></msub><mo>=</mo><mn>80</mn><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi><mo>,</mo><mo>&#160;</mo><msub><mi>T</mi><mn>2</mn></msub><mo>=</mo><mfenced><mrow><mn>40</mn><mo>+</mo><mn>20</mn></mrow></mfenced><mo>=</mo><mn>60</mn><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi><mo>,</mo><mo>&#160;</mo><msub><mi>T</mi><mn>0</mn></msub><mo>=</mo><mn>20</mn><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mo>-</mo><mfrac><mfenced><mrow><mn>60</mn><mo>-</mo><mn>80</mn></mrow></mfenced><mn>6</mn></mfrac><mo>=</mo><mi>K</mi><mfenced><mrow><mn>70</mn><mo>-</mo><mn>20</mn></mrow></mfenced><mo>&#8658;</mo><mi>K</mi><mo>=</mo><mo>-</mo><mfrac><mfenced><mrow><mn>60</mn><mo>-</mo><mn>80</mn></mrow></mfenced><mrow><mn>6</mn><mo>&#215;</mo><mfenced><mrow><mn>70</mn><mo>-</mo><mn>20</mn></mrow></mfenced></mrow></mfrac></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mi>K</mi><mo>=</mo><mfrac><mn>20</mn><mrow><mn>6</mn><mo>&#215;</mo><mn>50</mn></mrow></mfrac><mo>=</mo><mfrac><mn>1</mn><mn>15</mn></mfrac></math></p><p>For&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>6</mn><mtext>&#160;to&#160;</mtext><msub><mi>t</mi><mn>2</mn></msub></math>,&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>T</mi><mn>1</mn></msub><mo>=</mo><mn>60</mn><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi><mo>,</mo><mo>&#160;</mo><msub><mi>T</mi><mn>2</mn></msub><mo>=</mo><mfenced><mrow><mn>20</mn><mo>+</mo><mn>20</mn></mrow></mfenced><mo>=</mo><mn>40</mn><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi><mo>,</mo><mo>&#160;</mo><msub><mi>T</mi><mn>0</mn></msub><mo>=</mo><mn>20</mn><mo>&#176;</mo><mi mathvariant=\"normal\">C</mi></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>-</mo><mfrac><mfenced><mrow><mn>60</mn><mo>-</mo><mn>80</mn></mrow></mfenced><mfenced><mrow><msub><mi>t</mi><mn>2</mn></msub><mo>-</mo><mn>6</mn></mrow></mfenced></mfrac><mo>=</mo><mi>K</mi><mfenced><mrow><mn>50</mn><mo>-</mo><mn>20</mn></mrow></mfenced><mspace linebreak=\"newline\"></mspace><mo>&#8658;</mo><msub><mi>t</mi><mn>2</mn></msub><mo>-</mo><mn>6</mn><mo>=</mo><mn>15</mn><mo>&#215;</mo><mfrac><mn>20</mn><mn>30</mn></mfrac><mspace linebreak=\"newline\"></mspace><mo>&#8658;</mo><msub><mi>t</mi><mn>2</mn></msub><mo>=</mo><mn>16</mn><mo>&#160;</mo><mi>min</mi></math></p>",
//             "image": null
//         },
//         "videoSolution": {
//             "videoId": "a7c759a61f31454ebaa46deb84a17943",
//             "provider": "vdocipher",
//             "thumbnailLight": "https://d1z78r8i505acl.cloudfront.net/poster/GAuRm4TcJsSyR.480.jpeg",
//             "thumbnailDark": "https://d1z78r8i505acl.cloudfront.net/poster/GAuRm4TcJsSyR.480.jpeg",
//             "premiumModules": [
//                 {
//                     "premiumModuleId": "64c7e8e829737784b294e469",
//                     "isFree": false
//                 }
//             ],
//             "description": "JEE Main"
//         },
//         "questionLabels": [],
//         "numericalLowerLimit": 16,
//         "numericalUpperLimit": 16,
//         "masterId": "MOGJMPYQ29515192",
//         "source": "EM",
//         "bucket": "Tough Ques (JEE Adv)",
//         "category": null,
//         "microConcepts": [],
//         "imageBaseUrl": null,
//         "helperText": null,
//         "isRemoved": false,
//         "syllabusCategory": "outOfSyllabus",
//         "cpyqbSubjects": [
//             "616057920283de43c87e3e1e",
//             "616057750283de43c87e3e1b",
//             "61964fe0a5a5260118868021",
//             "616056cd0283de43c87e3e15",
//             "615f0c729476412f48314dab",
//             "616057190283de43c87e3e18",
//             "61bb58181213731910ea0b70",
//             "61964f81a5a526011886801d",
//             "61c055eae8ce0dc8a5c62d33",
//             "629105adee9e3ae00d63352b",
//             "62962075e7f8e9ac4daeafd7",
//             "629f385f263330a77be9fa7d",
//             "629f39e4ac11b26562e0625b",
//             "64d50bd73df7f4a7f3017f6f",
//             "61a8a2c2e8ce0dc8a5c62d2d"
//         ],
//         "cpyqbChapters": [
//             "616023e599225f756e5df101",
//             "616023e3445073e7f19122db",
//             "61bb8229fce3576e46202d7d",
//             "616023e0ffc8649daddda513",
//             "61c089b4384657354ede4c09",
//             "616023e23a74832357599443",
//             "61964c81150b027922bafad8",
//             "616023e361589c931bc035b7",
//             "61964c81e74f86f9041974e2",
//             "629109f1da1b4d5a11b7952f",
//             "629621250160e8ee846a120c",
//             "629f390e0537a44301966fe8",
//             "629f3a930c61425b93824746",
//             "64e853a31e014c40646fdc87",
//             "64eb06bf3118f713ecfef06f",
//             "61e7bd7f80092b5aa328b5a1"
//         ],
//         "cpyqbExams": [
//             "616059af0283de43c87e3e23",
//             "615f0e999476412f48314daf"
//         ],
//         "isLocked": false
//     }
// };

// /*dummy funs*/
// var currentQ = Qs.vsDataWithSyllabusData;
// var nextBtn = document.getElementById('nextQbutton');
// nextBtn.addEventListener('click', function (e) {
//     e.preventDefault();
//     currentQ = currentQ._id === Qs.vsData._id ? Qs.vsData2 : Qs.vsData;
//     setQuestion(
//         currentQ,
//         {
//             selectedOption: [
//                 {
//                     "id": "e1REB",
//                     "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>15</mn><mo>&#160;</mo><mi mathvariant=\"normal\">&#960;</mi></math>",
//                     "isCorrect": false,
//                     "image": null
//                 },
//             ],
//             numericalAnswer: undefined,
//             answerStatus: 'incorrect',
//         },
//         'videoQuestion',
//         { data: 'hidden' },
//         'dark',
//         false,
//     );
// });

/*videoQuestion*/
// setQuestion(
//     currentQ,
//     {
//         selectedOption: null,
//         numericalAnswer: 5,
//         answerStatus: 'incorrect',
//     },
//     'videoQuestion',
//     { data: true },
//     'light',
//     false,
// );