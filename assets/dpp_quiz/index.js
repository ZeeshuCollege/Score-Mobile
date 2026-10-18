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
function resizeImages(images) {
  const currentScreenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imgSize = image.naturalWidth;
    if (imgSize >= currentScreenWidth) {
      console.log("Resized.");
      image.style.height = "auto";
      image.style.width = "100%";
    }
  }
}
function questionTextResizeAllImages(question) {
  if (question.question.text.includes("<img")) {
    const allQuestionImages = document.querySelectorAll("#questionText img");
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
      const allSolutionImages = document.querySelectorAll(".solution-text img");
      resizeImages(allSolutionImages);
    });
  }
}
function questionOptionsResizeAllImages(question) {
  for (let j = 0; i < question.options.length; j++) {
    const opt = question.options[j];
    if (opt.text.includes("<img")) {
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
        const allOptionImages = document.querySelectorAll(".option-text img");
        resizeImages(allOptionImages);
      });
    }
  }
}
function populateLabels(labelsLeft, questionLabels) {
  const newLabels = document.createElement("div");
  newLabels.style.cssText = labelsLeft.classList;
  for (let i = 0; i < questionLabels.length; i++) {
    const label = questionLabels[i];
    const outerDiv = document.createElement("div"),
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
function populateOptions(
  optionsBox,
  options,
  type,
  selectedOptions,
  numericalAnswer,
  theme
) {
  let optionsHTML = "";
  if (type === "numerical") {
    optionsHTML += `
            <div class="option-container row">
                <div id="main-options" class="option">
                    <input id="inputAns" value="${
                      numericalAnswer ? numericalAnswer : ""
                    }" type="number" class="numerical-input form-control" placeholder="Enter your answer" aria-label="numerical">
                </div>
                <div class="option-badge">
                    <p class="option-badge-text"></p>
                </div>
            </div>
        `;
  } else {
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];

      var state = "default";
      var isSelected = " ";
      if (selectedOptions) {
        var contains = false;
        for (let i = 0; i < selectedOptions.length; i++) {
          if (selectedOptions[i] == opt.id) {
            state = "selected";
            isSelected = " option_state_selected";
            break;
          }
        }
      }
      const getOptionsArray = getOptionsByState(type, state, theme);

      const optionSrc = getOptionsArray[i];
      const newOption = `
                <div class="option-container row">
                    <div id="${opt.id}" idx=${i} class="option ${isSelected}">
                        <img src="${optionSrc}" class="option-icon"></img>
                        <div class="option-text">${opt.text}</div>
                    </div>
                    <div class="option-badge">
                        <p class="option-badge-text"></p>
                    </div>
                </div>
            `;
      optionsHTML += newOption;
    }
  }
  Android.showToast(`OPTIONSHTML: ${optionsHTML}`);
  optionsBox.innerHTML = optionsHTML;
}
function formSubmitHandler(question, type) {
  const solutionBox = document.getElementById("solutionBox"),
    solutionTextPara = document.querySelector(".solution-text"),
    answerBox = document.getElementById("answer-box"),
    errorBox = document.getElementById("error");
  // Display showSolutions button
  // displayShowSolutions();
  // Populating the solution-text paragraph
  solutionTextPara.innerHTML =
    typeof question.solution === "object"
      ? question.solution.text
      : question.solution;
  solutionBox.style.display = "block";
  if (answerBox) answerBox.style.display = "block";
  errorBox.style.display = "block";
  if (type != "numerical") {
    const optionsList = document.querySelectorAll(".option");
    for (let i = 0; i < optionsList.length; i++) {
      const el = optionsList[i];
      el.style.pointerEvents = "none";
    }
  }
  setTypeset();
  questionSolutionResizeAllImages(question);
}
function getOptionsByState(questionType, state, theme) {
  const type = questionType === "singleCorrect" ? "single" : "multiple";
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
  const solutionBox = document.getElementById("solutionBox"),
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
    const answerText = document.querySelector(".answer-text");
    answerText.textContent = "";
  }
  if (numericalInputContainer && inputField) {
    numericalInputContainer.style.border = "1px solid #dcdde2";
    inputField.value = "";
  }
}
function displayShowSolutions() {
  const showSolutionsBtn = document.getElementById("action-show-solutions");
  showSolutionsBtn.style.display = "flex";
  showSolutionsBtn.addEventListener("click", function () {
    Android.onShowSolutions("solutionBox");
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
function setTypeset() {
  MathJax.Hub.Config({
    "HTML-CSS": { linebreaks: { automatic: true } },
    SVG: { linebreaks: { automatic: true } },
    messageStyle: "none",
    tex2jax: { preview: "none" },
  });
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
// Main Functions [to be called by Android]
function setQuestion(question, status, theme) {
  Android.showToast(`question: ${JSON.stringify(status)}`);
  const body = document.querySelector("body");
  if (theme === "dark") {
    if (!body.classList.contains("dark_mode")) body.classList.add("dark_mode");
  } else body.classList.remove("dark_mode");
  resetFields();
  const questionTextPara = document.getElementById("questionText"),
    labelsLeft = document.querySelector(".labels-left"),
    optionsBox = document.getElementById("optionsBox"),
    solutionBox = document.getElementById("solutionBox"),
    errorBox = document.getElementById("error");

  // Populating the labels
  labelsLeft.textContent =
    question.type === "multipleCorrect"
      ? "Multiple correct"
      : question.type === "numerical"
      ? "Numerical Type"
      : null;

  // Populating the question-text paragraph
  questionTextPara.innerHTML = question.question.text;
  // Resizing Images in Question Title
  questionTextResizeAllImages(question);
  // Populating the options
  if (status != undefined) {
    Android.showToast(`question: Inside status`);
    populateOptions(
      optionsBox,
      question.options,
      question.type,
      status.selectedOptions,
      status.numericalAnswer,
      theme
    );
  } else {
    Android.showToast(`question: Not Inside status`);
    populateOptions(
      optionsBox,
      question.options,
      question.type,
      [],
      false,
      theme
    );
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
  const optionsList = document.querySelectorAll(".option");
  if (question.type === "singleCorrect") {
    const optionContainers = document.querySelectorAll(".option-container");
    const optionsBoxIndexes = {};
    for (let i = 0; i < optionContainers.length; i++) {
      const el = optionContainers[i];
      optionsBoxIndexes[el.firstElementChild.id] = i;
    }
    for (let i = 0; i < optionsList.length; i++) {
      const item = optionsList[i];
      item.addEventListener("click", function () {
        //Android.onOptionSelected(JSON.stringify({ msg: "option clicked" }));
        let lastSelectedEl = document.querySelector(".option_state_selected");
        if (lastSelectedEl) {
          lastSelectedEl.classList.remove("option_state_selected");
          lastSelectedEl.firstElementChild.src = getOptionsByState(
            "singleCorrect",
            "default",
            theme
          )[optionsBoxIndexes[lastSelectedEl.id]];
        }
        this.firstElementChild.src = getOptionsByState(
          "singleCorrect",
          "selected",
          theme
        )[optionsBoxIndexes[this.id]];
        this.classList.add("option_state_selected");

        let optionObject;
        for (let j = 0; j < question.options.length; j++) {
          const el = question.options[j];
          if (el.id === item.id) {
            optionObject = el;
            break;
          }
        }
        if (lastSelectedEl && this.id === lastSelectedEl.id) {
          this.classList.remove("option_state_selected");
          this.firstElementChild.src = getOptionsByState(
            "singleCorrect",
            "default",
            theme
          )[optionsBoxIndexes[this.id]];
          optionObject = null;
        }
        Android.onOptionSelected(JSON.stringify(optionObject));
      });
    }
  } else if (question.type === "multipleCorrect") {
    for (let i = 0; i < optionsList.length; i++) {
      const item = optionsList[i];
      item.addEventListener("click", function () {
        let selected = false;
        if (this.getAttribute("class").includes("option_state_selected")) {
          this.firstElementChild.src = getOptionsByState(
            "multipleCorrect",
            "default",
            theme
          )[i];
          selected = false;
        } else {
          this.firstElementChild.src = getOptionsByState(
            "multipleCorrect",
            "selected",
            theme
          )[i];
          selected = true;
        }
        this.classList.toggle("option_state_selected");
        const optionObject = question.options.find(function (el) {
          return el.id === item.id;
        });
        //optionObject['isAlreadySelected'] = status?.selectedOptions?.includes(optionObject.id)
        optionObject["select"] = selected;
        Android.showToast(`question: ${JSON.stringify(optionObject)}`);
        Android.onOptionSelected(JSON.stringify(optionObject));
      });
    }
  } else {
    const numericalInput = document.querySelector(".numerical-input");
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
  const correctAnswer = question.correctValue;
  const userAnswer = input;
  const solutionBox = document.getElementById("solutionBox"),
    solutionBadge = document.querySelector(".option-badge"),
    solutionBadgeText = document.querySelector(".option-badge-text"),
    numericalInputContainer = document.getElementById("main-options"),
    inputField = document.getElementById("inputAns");
  if (solutionBadgeText) {
    const newDiv = document.createElement("div");
    newDiv.id = "answer-box";
    newDiv.innerHTML =
      '<div class="row"><p class="solution-header">Answer:</p></div><div class="row"><p class="answer-text">' +
      correctAnswer +
      "</p></div>";
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
  const optionsBox = document.querySelectorAll(".option-container");
  const optionsBoxIndexes = {};
  for (let i = 0; i < optionsBox.length; i++) {
    const el = optionsBox[i];
    optionsBoxIndexes[el.firstElementChild.id] = i;
  }
  const options = {};
  for (let i = 0; i < question.options.length; i++) {
    const opt = question.options[i];
    console.log("in option");
    console.log(opt);
    if (opt.isCorrect === true) {
      options[opt.id] = true;
    } else {
      options[opt.id] = false;
    }
  }
  for (let key in options) {
    if (options[key] === true) {
      const option = document.getElementById("" + key),
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
  for (let i = 0; i < selectedOptions.length; i++) {
    const opt = selectedOptions[i].id;
    if (opt) {
      const option = document.getElementById("" + opt),
        optionIcon = option.firstElementChild,
        optionBadge = option.nextElementSibling,
        optionBadgeText = optionBadge.firstElementChild;
      // Selected option is correct
      console.log("In Options");
      console.log(options);
      console.log(options[opt]);
      console.log(status);
      if (options[opt]) {
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
        Android.showToast(`option src: ${optionIcon}`);
      }
    }
  }
  formSubmitHandler(question, "single-multi");
}

/**
 * Removes the selected state from all options in the current question.
 * @param {('singleCorrect' | 'multipleCorrect'| 'numerical')} [type=""] - The type of the question, which can be "numerical", "singleCorrect", "multipleCorrect".
 */
function clearSelectedOptions(type = "") {
  if (type === "numerical") {
    document.getElementById("inputAns").value = ""; // or "default value"
    return;
  } else if (type === "singleCorrect" || type === "multipleCorrect") {
    const selectedOptions = document.querySelectorAll(".option_state_selected");
    selectedOptions.forEach((option) => {
      const index = option.getAttribute("idx");
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