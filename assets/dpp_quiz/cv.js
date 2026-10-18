"use strict";

// var Android = {
//   toggleShow: function (toggle) {
//     Android.toast("Toggled: ", toggle);
//   },
//   showToast: function (message) {
//     console.log(message);
//   },
//   onQuestionClick: function (e) {
//     Android.showToast("Question clicked: ", e);
//   },
//   onOptionSelected: function (obj) {
//     Android.showToast("Option selected: " + obj);
//   },
//   onShowSolutions: function () {
//     Android.showToast("Scrolling down to solution.");
//   },
//   showReport: function () {
//     Android.showToast("Report-question error box opens.");
//   },
// };
// Helper Functions
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function resizeImages(images) {
  var currentScreenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    var imgSize = image.naturalWidth;
    if (imgSize >= currentScreenWidth) {
      console.log("Resized.");
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
  if (question.solution.text && question.solution.text.includes("<img") || !question.solution.text && question.solution && question.solution.includes("<img")) {
    var finalImages = [],
      htmlToImages = Array.prototype.slice.call(document.images);
    for (var i = 0; i < htmlToImages.length; i++) {
      var image = htmlToImages[i];
      if (!image.complete) finalImages.push(new Promise(function (resolve) {
        image.onload = image.onerror = resolve;
      }));
    }
    Promise.all(finalImages).then(function () {
      var allSolutionImages = document.querySelectorAll(".solution-text img");
      resizeImages(allSolutionImages);
    });
  }
}
function questionOptionsResizeAllImages(question) {
  for (var j = 0; i < question.options.length; j++) {
    var opt = question.options[j];
    if (opt.text.includes("<img")) {
      var finalImages = [],
        htmlToImages = Array.prototype.slice.call(document.images);
      for (var i = 0; i < htmlToImages.length; i++) {
        var image = htmlToImages[i];
        if (!image.complete) finalImages.push(new Promise(function (resolve) {
          image.onload = image.onerror = resolve;
        }));
      }
      Promise.all(finalImages).then(function () {
        var allOptionImages = document.querySelectorAll(".option-text img");
        resizeImages(allOptionImages);
      });
    }
  }
}
function populateLabels(labelsLeft, questionLabels) {
  var newLabels = document.createElement("div");
  newLabels.style.cssText = labelsLeft.classList;
  for (var i = 0; i < questionLabels.length; i++) {
    var label = questionLabels[i];
    var outerDiv = document.createElement("div"),
      innerDiv = document.createElement("div");
    outerDiv.className = "label-container";
    innerDiv.className = "label-text";
    innerDiv.innerHTML = label.title;
    outerDiv.appendChild(innerDiv);
    outerDiv.style.display = label.isVisible ? "flex" : "none";
    newLabels.appendChild(outerDiv);
    labelsLeft.appendChild(newLabels);
  }
}
function populateOptions(optionsBox, options, type, selectedOptions, numericalAnswer, theme) {
  var optionsHTML = "";
  if (type === "numerical") {
    optionsHTML += "\n            <div class=\"option-container row\">\n                <div id=\"main-options\" class=\"option\">\n                    <input id=\"inputAns\" value=\"".concat(numericalAnswer ? numericalAnswer : "", "\" type=\"number\" class=\"numerical-input form-control\" placeholder=\"Enter your answer\" aria-label=\"numerical\">\n                </div>\n                <div class=\"option-badge\">\n                    <p class=\"option-badge-text\"></p>\n                </div>\n            </div>\n        ");
  } else {
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var state = "default";
      var isSelected = " ";
      if (selectedOptions) {
        var contains = false;
        for (var _i2 = 0; _i2 < selectedOptions.length; _i2++) {
          if (selectedOptions[_i2] == opt.id) {
            state = "selected";
            isSelected = " option_state_selected";
            break;
          }
        }
      }
      var getOptionsArray = getOptionsByState(type, state, theme);
      var optionSrc = getOptionsArray[i];
      var newOption = "\n                <div class=\"option-container row\">\n                    <div id=\"".concat(opt.id, "\" idx=").concat(i, " class=\"option ").concat(isSelected, "\">\n                        <img src=\"").concat(optionSrc, "\" class=\"option-icon\"></img>\n                        <div class=\"option-text\">").concat(opt.text, "</div>\n                    </div>\n                    <div class=\"option-badge\">\n                        <p class=\"option-badge-text\"></p>\n                    </div>\n                </div>\n            ");
      optionsHTML += newOption;
    }
  }
  Android.showToast("OPTIONSHTML: ".concat(optionsHTML));
  optionsBox.innerHTML = optionsHTML;
}
function formSubmitHandler(question, type) {
  var solutionBox = document.getElementById("solutionBox"),
    solutionTextPara = document.querySelector(".solution-text"),
    answerBox = document.getElementById("answer-box"),
    errorBox = document.getElementById("error");
  // Display showSolutions button
  // displayShowSolutions();
  // Populating the solution-text paragraph
  solutionTextPara.innerHTML = _typeof(question.solution) === "object" ? question.solution.text : question.solution;
  solutionBox.style.display = "block";
  if (answerBox) answerBox.style.display = "block";
  errorBox.style.display = "block";
  if (type != "numerical") {
    var optionsList = document.querySelectorAll(".option");
    for (var i = 0; i < optionsList.length; i++) {
      var el = optionsList[i];
      el.style.pointerEvents = "none";
    }
  }
  setTypeset();
  questionSolutionResizeAllImages(question);
}
function getOptionsByState(questionType, state, theme) {
  var type = questionType === "singleCorrect" ? "single" : "multiple";
  theme = "light";
  switch (state) {
    case "selected":
      if (theme === "dark") {
        return ["../assets/svg/options/" + type + "/A/type_" + type + "_option_A_state_selected_dark.svg", "../assets/svg/options/" + type + "/B/type_" + type + "_option_B_state_selected_dark.svg", "../assets/svg/options/" + type + "/C/type_" + type + "_option_C_state_selected_dark.svg", "../assets/svg/options/" + type + "/D/type_" + type + "_option_D_state_selected_dark.svg"];
      } else {
        return ["../assets/svg/options/" + type + "/A/type_" + type + "_option_A_state_selected.svg", "../assets/svg/options/" + type + "/B/type_" + type + "_option_B_state_selected.svg", "../assets/svg/options/" + type + "/C/type_" + type + "_option_C_state_selected.svg", "../assets/svg/options/" + type + "/D/type_" + type + "_option_D_state_selected.svg"];
      }
    case "correct":
      return ["../assets/svg/options/" + type + "/A/type_" + type + "_option_A_state_correct.svg", "../assets/svg/options/" + type + "/B/type_" + type + "_option_B_state_correct.svg", "../assets/svg/options/" + type + "/C/type_" + type + "_option_C_state_correct.svg", "../assets/svg/options/" + type + "/D/type_" + type + "_option_D_state_correct.svg"];
    case "incorrect":
      return ["../assets/svg/options/" + type + "/A/type_" + type + "_option_A_state_incorrect.svg", "../assets/svg/options/" + type + "/B/type_" + type + "_option_B_state_incorrect.svg", "../assets/svg/options/" + type + "/C/type_" + type + "_option_C_state_incorrect.svg", "../assets/svg/options/" + type + "/D/type_" + type + "_option_D_state_incorrect.svg"];
    default:
      if (theme === "dark") {
        return ["../assets/svg/options/" + type + "/A/type_" + type + "_option_A_state_default.webp", "../assets/svg/options/" + type + "/B/type_" + type + "_option_B_state_default.webp", "../assets/svg/options/" + type + "/C/type_" + type + "_option_C_state_default.webp", "../assets/svg/options/" + type + "/D/type_" + type + "_option_D_state_default.webp"];
      } else {
        return ["../assets/svg/options/" + type + "/A/type_" + type + "_option_A_state_default.webp", "../assets/svg/options/" + type + "/B/type_" + type + "_option_B_state_default.webp", "../assets/svg/options/" + type + "/C/type_" + type + "_option_C_state_default.webp", "../assets/svg/options/" + type + "/D/type_" + type + "_option_D_state_default.webp"];
      }
  }
}
function resetFields() {
  var solutionBox = document.getElementById("solutionBox"),
    solutionText = document.querySelector(".solution-text"),
    answerBox = document.getElementById("answer-box"),
    errorBox = document.getElementById("error"),
    showSolutionsBtn = document.getElementById("action-show-solutions"),
    numericalInputContainer = document.getElementById("main-options"),
    inputField = document.getElementById("inputAns");
  solutionBox.style.display = "none";
  solutionText.textContent = "";
  errorBox.style.display = "none";
  showSolutionsBtn.style.display = "none";
  if (answerBox) {
    answerBox.style.display = "none";
    var answerText = document.querySelector(".answer-text");
    answerText.textContent = "";
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
function setTypeset() {
  MathJax.Hub.Config({
    "HTML-CSS": {
      linebreaks: {
        automatic: true
      }
    },
    SVG: {
      linebreaks: {
        automatic: true
      }
    },
    messageStyle: "none",
    tex2jax: {
      preview: "none"
    }
  });
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
// Main Functions [to be called by Android]
function setQuestion(question, status, theme) {
  Android.showToast("question: ".concat(JSON.stringify(status)));
  var body = document.querySelector("body");
  if (theme === "dark") {
    if (!body.classList.contains("dark_mode")) body.classList.add("dark_mode");
  } else body.classList.remove("dark_mode");
  resetFields();
  var questionTextPara = document.getElementById("questionText"),
    labelsLeft = document.querySelector(".labels-left"),
    optionsBox = document.getElementById("optionsBox"),
    solutionBox = document.getElementById("solutionBox"),
    errorBox = document.getElementById("error");

  // Populating the labels
  labelsLeft.textContent = question.type === "multipleCorrect" ? "Multiple correct" : question.type === "numerical" ? "Numerical Type" : null;

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
  var optionsList = document.querySelectorAll(".option");
  if (question.type === "singleCorrect") {
    var optionContainers = document.querySelectorAll(".option-container");
    var optionsBoxIndexes = {};
    for (var i = 0; i < optionContainers.length; i++) {
      var el = optionContainers[i];
      optionsBoxIndexes[el.firstElementChild.id] = i;
    }
    var _loop = function _loop() {
      var item = optionsList[_i3];
      item.addEventListener("click", function () {
        //Android.onOptionSelected(JSON.stringify({ msg: "option clicked" }));
        var lastSelectedEl = document.querySelector(".option_state_selected");
        if (lastSelectedEl) {
          lastSelectedEl.classList.remove("option_state_selected");
          lastSelectedEl.firstElementChild.src = getOptionsByState("singleCorrect", "default", theme)[optionsBoxIndexes[lastSelectedEl.id]];
        }
        this.firstElementChild.src = getOptionsByState("singleCorrect", "selected", theme)[optionsBoxIndexes[this.id]];
        this.classList.add("option_state_selected");
        var optionObject;
        for (var j = 0; j < question.options.length; j++) {
          var _el = question.options[j];
          if (_el.id === item.id) {
            optionObject = _el;
            break;
          }
        }
        if (lastSelectedEl && this.id === lastSelectedEl.id) {
          this.classList.remove("option_state_selected");
          this.firstElementChild.src = getOptionsByState("singleCorrect", "default", theme)[optionsBoxIndexes[this.id]];
          optionObject = null;
        }
        Android.onOptionSelected(JSON.stringify(optionObject));
      });
    };
    for (var _i3 = 0; _i3 < optionsList.length; _i3++) {
      _loop();
    }
  } else if (question.type === "multipleCorrect") {
    var _loop2 = function _loop2(_i4) {
      var item = optionsList[_i4];
      item.addEventListener("click", function () {
        var selected = false;
        if (this.getAttribute("class").includes("option_state_selected")) {
          this.firstElementChild.src = getOptionsByState("multipleCorrect", "default", theme)[_i4];
          selected = false;
        } else {
          this.firstElementChild.src = getOptionsByState("multipleCorrect", "selected", theme)[_i4];
          selected = true;
        }
        this.classList.toggle("option_state_selected");
        var optionObject = question.options.find(function (el) {
          return el.id === item.id;
        });
        //optionObject['isAlreadySelected'] = status?.selectedOptions?.includes(optionObject.id)
        optionObject["select"] = selected;
        Android.showToast("question: ".concat(JSON.stringify(optionObject)));
        Android.onOptionSelected(JSON.stringify(optionObject));
      });
    };
    for (var _i4 = 0; _i4 < optionsList.length; _i4++) {
      _loop2(_i4);
    }
  } else {
    var numericalInput = document.querySelector(".numerical-input");
    numericalInput.addEventListener("input", function (e) {
      Android.onInputChanged(e.target.value);
    });
  }
  errorBox.addEventListener("click", function () {
    Android.showReport();
  });
  setTypeset();
}
function checkNumericalAnswer(question, input, status) {
  var correctAnswer = question.correctValue;
  var userAnswer = input;
  var solutionBox = document.getElementById("solutionBox"),
    solutionBadge = document.querySelector(".option-badge"),
    solutionBadgeText = document.querySelector(".option-badge-text"),
    numericalInputContainer = document.getElementById("main-options"),
    inputField = document.getElementById("inputAns");
  if (solutionBadgeText) {
    var newDiv = document.createElement("div");
    newDiv.id = "answer-box";
    newDiv.innerHTML = '<div class="row"><p class="solution-header">Answer:</p></div><div class="row"><p class="answer-text">' + correctAnswer + "</p></div>";
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
  for (var i = 0; i < optionsBox.length; i++) {
    var el = optionsBox[i];
    optionsBoxIndexes[el.firstElementChild.id] = i;
  }
  var options = {};
  for (var _i6 = 0; _i6 < question.options.length; _i6++) {
    var opt = question.options[_i6];
    console.log("in option");
    console.log(opt);
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
      optionIcon.src = getOptionsByState(question.type, "correct", theme)[optionsBoxIndexes[key]];
    }
  }
  for (var _i8 = 0; _i8 < selectedOptions.length; _i8++) {
    var _opt = selectedOptions[_i8].id;
    if (_opt) {
      var _option = document.getElementById("" + _opt),
        _optionIcon = _option.firstElementChild,
        _optionBadge = _option.nextElementSibling,
        _optionBadgeText = _optionBadge.firstElementChild;
      // Selected option is correct
      console.log("In Options");
      console.log(options);
      console.log(options[_opt]);
      console.log(status);
      if (options[_opt]) {
        _optionBadgeText.textContent = "You Marked | Correct Answer";
        _optionBadge.classList.add("correct-answer");
        _option.style.border = "1px solid #31d99c";
        _optionIcon.src = getOptionsByState(question.type, "correct", theme)[optionsBoxIndexes[_opt]];
      }
      // Selected option is incorrect
      else {
        _optionBadgeText.textContent = "You Marked | Incorrect Answer";
        _optionBadge.classList.add("incorrect-answer");
        _option.style.border = "1px solid #ff5858";
        _optionIcon.src = getOptionsByState(question.type, "incorrect", theme)[optionsBoxIndexes[_opt]];
        Android.showToast("option src: ".concat(_optionIcon));
      }
    }
  }
  formSubmitHandler(question, "single-multi");
}

/**
 * Removes the selected state from all options in the current question.
 * @param {('singleCorrect' | 'multipleCorrect'| 'numerical')} [type=""] - The type of the question, which can be "numerical", "singleCorrect", "multipleCorrect".
 */
function clearSelectedOptions() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  if (type === "numerical") {
    document.getElementById("inputAns").value = ""; // or "default value"
    return;
  } else if (type === "singleCorrect" || type === "multipleCorrect") {
    var selectedOptions = document.querySelectorAll(".option_state_selected");
    selectedOptions.forEach(function (option) {
      var index = option.getAttribute("idx");
      option.classList.remove("option_state_selected");
      option.firstElementChild.src = getOptionsByState(type, "default")[index];
    });
    return;
  }
  console.log("wrong question type");
}

// var dppSingle = {
//   _id: "61bb206999d64f18825abfee",
//   questionId: "61bb206999d64f18825abfee",
//   question: {
//     text: "The longest wavelength that can be analysed by a sodium chloride crystal of spacing $\\mathrm{d}=2.82$ $\\mathrm{A}^{\\mathrm{o}}$ in the second order is",
//     image: null,
//   },
//   level: null,
//   type: "singleCorrect",
//   previousYearPapers: [
//     {
//       _id: "61bb5e900fe02a1871ab599d",
//       title: "VITEEE 2006",
//       shortName: "2006",
//       isVisible: true,
//       heldOn: "2006-04-30T09:00:00.000Z",
//     },
//   ],
//   questionLabels: [],
//   options: [
//     {
//       _id: "66df373fdd42cf59f489aa69",
//       id: "l8Uv3",
//       text: "$2.82 \\mathrm{~A}^{\\circ}$",
//       image: null,
//     },
//     {
//       _id: "66df373fdd42cf59f489aa6a",
//       id: "WtyKA",
//       text: "$8.46 \\mathrm{~A}^{\\circ}$",
//       image: null,
//     },
//     {
//       _id: "66df373fdd42cf59f489aa6b",
//       id: "60RBG",
//       text: "$5.64 \\mathrm{~A}^{\\circ}$",
//       image: null,
//     },
//     {
//       _id: "66df373fdd42cf59f489aa6c",
//       id: "qyauL",
//       text: "$11.28 \\mathrm{~A}^{\\circ}$",
//       image: null,
//     },
//   ],
// };
// var dppNumerical = {
//   _id: "648b5a67417cc3fb48d66977",
//   questionId: "648b5a67417cc3fb48d66977",
//   question: {
//     text: 'When radiation of wavelength&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi mathvariant="normal">A</mi></math>&nbsp;is used to illuminate a metallic surface, the stopping potential is&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi mathvariant="normal">V</mi></math>. When the same surface is illuminated with radiation of wavelength&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn><mi mathvariant="normal">A</mi></math>, the stopping potential is&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mi mathvariant="normal">V</mi><mn>4</mn></mfrac></math>. If the threshold wavelength for the metallic surface is&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>n&#955;</mi></math>&nbsp;then value of&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi mathvariant="normal">n</mi></math>&nbsp;will be :',
//     image: null,
//   },
//   level: 3,
//   type: "numerical",
//   previousYearPapers: [
//     {
//       _id: "615d92ecde3d91842a5cf7fe",
//       title: "JEE Main 2020 (02 Sep Shift 1)",
//       shortName: "2020 (02 Sep Shift 1)",
//       isVisible: true,
//       heldOn: "2020-09-02T09:00:00.000Z",
//     },
//   ],
//   questionLabels: [],
//   options: [],
// };
// let currentQ = dppNumerical;

// clearBtn.addEventListener("click", function (e) {
//   e.preventDefault();
//   clearSelectedOptions(currentQ.type);
// });
// setQuestion(
//   currentQ,
//   {
//     selectedOptions: ["60RBG"],
//     numericalAnswer: false,
//   },
//   "dark"
// );