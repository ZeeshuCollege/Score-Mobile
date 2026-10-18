"use strict";

// Use const/let instead of var
let globalTheme = "light";

// Modern object methods with arrow functions
const qLabelTypes = {
  topic: (value) => `Topic: ${value}`,
  Topic: (value) => `Topic: ${value}`,
  concept: (value) => `Concept: ${value}`,
  Concept: (value) => `Concept: ${value}`,
  pageTextToDisplay: (value) => value,
  paragraphNumber: (value) => `Paragraph: ${value}`,
};

function debounce(fn, wait = 15) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function showSkeleton() {
  const appContent = document.getElementById("appContent");
  if (appContent) {
    //      appContent.style.opacity = 0;
    //      appContent.style.pointerEvents = 'none';
    appContent.classList.remove("visible");
    // also reset transform in case reanimated
    //      appContent.style.transform = 'translateY(-20px)';
  }
}

function hideSkeleton() {
  const appContent = document.getElementById("appContent");
  if (appContent) {
    //  void appContent.offsetWidth;
    appContent.classList.add("visible");
  }
}

// Call this when the real data has rendered/math rendered.
function revealContentAfterMathRender(target, cb) {
  // Wait for next event loop, then fade-in content
  requestAnimationFrame(() => {
    hideSkeleton();
    if (typeof cb === "function") cb();
  });
}

// Arrow functions and enhanced syntax
function sortBy(array, order, propertyRetrieverFn) {
  if (order.length) {
    return array.sort(
      (a, b) =>
        order.indexOf(propertyRetrieverFn(a)) -
        order.indexOf(propertyRetrieverFn(b))
    );
  }

  return array.sort((a, b) => {
    if (propertyRetrieverFn(a) < propertyRetrieverFn(b)) return -1;
    else if (propertyRetrieverFn(a) > propertyRetrieverFn(b)) return 1;
    else return 0;
  });
}

function getFormattedQuestionLabels(questionLabels, order, retrieverFn) {
  const qLabels = [];

  questionLabels.forEach((label) => {
    if (label && label.title && qLabelTypes.hasOwnProperty(label.title)) {
      qLabels.push(label);
    }
  });

  if (qLabels && qLabels.length > 1) {
    // Use the sortBy function directly instead of as a method
    const sortedLabels = sortBy(qLabels, order, retrieverFn);

    // Map through labels and add displayText property
    return sortedLabels.map((el) => {
      const obj = { ...el }; // Use object spread instead of Object.assign
      if (el.title) {
        obj.displayText = qLabelTypes[el.title](el.value);
      }
      return obj;
    });
  }

  return qLabels;
}

function getQuestionLabels(questionLabels) {
  const qLabels = getFormattedQuestionLabels(
    questionLabels,
    ["topic", "concept", "pageTextToDisplay", "paragraphNumber"],
    (obj) => obj.title
  );

  let qLabelString = "";
  qLabels.forEach((label, index) => {
    qLabelString +=
      label.displayText + (index !== qLabels.length - 1 ? ", " : "");
  });

  return qLabelString;
}

function populateOptions(optionsBox, options, type, theme) {
  let optionsHTML = "";

  if (type === "numerical") {
    optionsHTML += `
      <div class="option-container row">
        <div id="main-options" class="option">
          <input id="inputAns" type="text" class="numerical-input form-control"
                 placeholder="You did not answer this question" aria-label="numerical"
                 onkeypress="return isNumberKey(this, event);">
        </div>
        <div class="option-badge">
          <p class="option-badge-text"></p><span></span>
        </div>
        <div class="bottom-badge">
          <p class="bottom-badge-text"></p>
        </div>
      </div>
      <section class="bottom-label"></section>
    `;
  } else {
    const getOptionsArray = getOptionsByState(type, "default", theme);

    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const optionSrc = getOptionsArray[i];
      // Template literals for cleaner HTML construction
      const newOption = `
        <div class="option-container row">
          <div id="${opt.id}" idx="${i}" class="option">
            <img src="${optionSrc}" class="option-icon">
            <div class="option-text">${opt.text}</div>
          </div>
          <div class="option-badge">
            <p class="option-badge-text"></p><span></span>
          </div>
        </div>
      `;
      optionsHTML += newOption;
    }
  }

  optionsBox.innerHTML = optionsHTML;
}

function formSubmitHandler(question, type, screenType) {
  const solutionBox = document.getElementById("solutionBox");
  const solutionTextPara = solutionBox
    ? solutionBox.querySelector(".solution-text")
    : null;
  const errorBox = document.getElementById("error");

  if (solutionTextPara && question.solution) {
    solutionTextPara.innerHTML =
      typeof question.solution === "object"
        ? question.solution.text
        : question.solution;
  }

  if (solutionBox) solutionBox.style.display = "none";
  if (errorBox) errorBox.style.display = "none";

  if (type != "numerical") {
    const optionsList = document.querySelectorAll(".option");
    for (let i = 0; i < optionsList.length; i++) {
      optionsList[i].style.pointerEvents = "none";
    }
  }

  if (solutionBox) renderMathEverywhere(solutionBox);
}

function getOptionsByState(questionType, state, theme) {
  const type = questionType === "singleCorrect" ? "single" : "multiple";
  const basePath = "../assets/svg/options";

  switch (state) {
    case "selected":
      if (theme === "dark") {
        return [
          `${basePath}/${type}/A/type_${type}_option_A_state_selected_dark.svg`,
          `${basePath}/${type}/B/type_${type}_option_B_state_selected_dark.svg`,
          `${basePath}/${type}/C/type_${type}_option_C_state_selected_dark.svg`,
          `${basePath}/${type}/D/type_${type}_option_D_state_selected_dark.svg`,
        ];
      } else {
        return [
          `${basePath}/${type}/A/type_${type}_option_A_state_selected.svg`,
          `${basePath}/${type}/B/type_${type}_option_B_state_selected.svg`,
          `${basePath}/${type}/C/type_${type}_option_C_state_selected.svg`,
          `${basePath}/${type}/D/type_${type}_option_D_state_selected.svg`,
        ];
      }

    case "correct":
      return [
        `${basePath}/${type}/A/type_${type}_option_A_state_correct.svg`,
        `${basePath}/${type}/B/type_${type}_option_B_state_correct.svg`,
        `${basePath}/${type}/C/type_${type}_option_C_state_correct.svg`,
        `${basePath}/${type}/D/type_${type}_option_D_state_correct.svg`,
      ];

    case "incorrect":
      return [
        `${basePath}/${type}/A/type_${type}_option_A_state_incorrect.svg`,
        `${basePath}/${type}/B/type_${type}_option_B_state_incorrect.svg`,
        `${basePath}/${type}/C/type_${type}_option_C_state_incorrect.svg`,
        `${basePath}/${type}/D/type_${type}_option_D_state_incorrect.svg`,
      ];

    default:
      if (theme === "dark") {
        return [
          `${basePath}/${type}/A/type_${type}_option_A_state_default.webp`,
          `${basePath}/${type}/B/type_${type}_option_B_state_default.webp`,
          `${basePath}/${type}/C/type_${type}_option_C_state_default.webp`,
          `${basePath}/${type}/D/type_${type}_option_D_state_default.webp`,
        ];
      } else {
        return [
          `${basePath}/${type}/A/type_${type}_option_A_state_default.webp`,
          `${basePath}/${type}/B/type_${type}_option_B_state_default.webp`,
          `${basePath}/${type}/C/type_${type}_option_C_state_default.webp`,
          `${basePath}/${type}/D/type_${type}_option_D_state_default.webp`,
        ];
      }
  }
}

function isNumberKey(txt, evt) {
  const charCode = evt.which ? evt.which : evt.keyCode;

  if (charCode === 46) {
    // '.'
    return txt.value.indexOf(".") === -1; // Allow one decimal point
  } else if (charCode === 45) {
    // '-'
    return true; // Allow minus sign
  } else {
    // Allow only numbers
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}

function resetFields() {
  const solutionBox = document.getElementById("solutionBox");
  const solutionText = document.querySelector(".solution-text");
  const questionText = document.getElementById("questionText");
  const answerBox = document.getElementById("answer-box");
  const errorBox = document.getElementById("error");
  const numericalInputContainer = document.getElementById("main-options");
  const inputField = document.getElementById("inputAns");

  // Safely handle elements that might not exist
  if (solutionBox) solutionBox.style.display = "none";
  if (solutionText) solutionText.textContent = "";
  if (questionText) questionText.innerHTML = "";
  if (errorBox) errorBox.style.display = "none";

  if (answerBox) answerBox.remove();

  if (numericalInputContainer && inputField) {
    numericalInputContainer.style.border = "1px solid #dcdde2";
    inputField.value = "";
  }
}

function elementScrollTo(element) {
  let elem = document.getElementById(element);
  let x = 0;
  let y = 0;

  while (elem != null) {
    x += elem.offsetLeft;
    y += elem.offsetTop;
    elem = elem.offsetParent;
  }

  window.scrollTo(x, y);
}

function questionReplaceNewLine(question) {
  const searchFor = /\n/g;
  const replaceWith = "<br>";

  if (question.question && question.question.text) {
    question.question.text = question.question.text.replace(
      searchFor,
      replaceWith
    );
  }

  if (question.solution) {
    if (question.solution.text) {
      question.solution.text = question.solution.text.replace(
        searchFor,
        replaceWith
      );
    } else if (typeof question.solution === "string") {
      question.solution = question.solution.replace(searchFor, replaceWith);
    }
  }

  if (question.options) {
    question.options.forEach((option) => {
      if (option.text) {
        option.text = option.text.replace(searchFor, replaceWith);
      }
    });
  }
}

//function resizeImages(images) {
//  const currentScreenWidth = window.innerWidth ||
//                           document.documentElement.clientWidth ||
//                           document.body.clientWidth;
//
//  images.forEach(image => {
//    const imgSize = image.naturalWidth;
//    if (imgSize >= currentScreenWidth) {
//      image.style.height = "auto";
//      image.style.width = "100%";
//    }
//  });
//}
const debouncedResizeImages = debounce((images) => {
  const currentScreenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  images.forEach((image) => {
    const imgSize = image.naturalWidth;
    if (imgSize >= currentScreenWidth) {
      image.style.height = "auto";
      image.style.width = "100%";
    }
  });
}, 30);

function resizeImages(images) {
  debouncedResizeImages(Array.from(images));
}

function questionTextResizeAllImages(question) {
  if (
    question.question &&
    question.question.text &&
    question.question.text.includes("<img")
  ) {
    const allQuestionImages = document.querySelectorAll("#questionText img");
    resizeImages(allQuestionImages);

    const htmlToImages = Array.from(document.images);
    const promises = [];
    htmlToImages.forEach((image) => {
      if (!image.complete) {
        promises.push(
          new Promise((resolve) => {
            image.onload = image.onerror = resolve;
          })
        );
      }
    });
    Promise.all(promises).then(() => {
      resizeImages(allQuestionImages);
    });
  }
}

function questionSolutionResizeAllImages(question) {
  const hasSolutionImages =
    (question.solution &&
      question.solution.text &&
      question.solution.text.includes("<img")) ||
    (typeof question.solution === "string" &&
      question.solution.includes("<img"));

  if (hasSolutionImages) {
    const htmlToImages = Array.from(document.images);
    const promises = [];
    htmlToImages.forEach((image) => {
      if (!image.complete) {
        promises.push(
          new Promise((resolve) => {
            image.onload = image.onerror = resolve;
          })
        );
      }
    });
    Promise.all(promises).then(() => {
      const allSolutionImages = document.querySelectorAll(".solution-text img");
      resizeImages(allSolutionImages);
    });
  }
}

function questionOptionsResizeAllImages(question) {
  if (question.options) {
    question.options.forEach((quesOpt) => {
      if (quesOpt.text && quesOpt.text.includes("<img")) {
        const htmlToImages = Array.from(document.images);
        const promises = [];
        htmlToImages.forEach((image) => {
          if (!image.complete) {
            promises.push(
              new Promise((resolve) => {
                image.onload = image.onerror = resolve;
              })
            );
          }
        });
        Promise.all(promises).then(() => {
          const allOptionImages = document.querySelectorAll(".option-text img");
          resizeImages(allOptionImages);
        });
      }
    });
  }
}

function renderMathEverywhere(root = document) {
  try {
    // Try KaTeX (primary)
    if (window.renderMathInElement) {
      window.renderMathInElement(root, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
        throwOnError: false,
      });
    }
  } catch (_) {}

  // MathJax fallback (either v3 or v2)
  const mathjaxEl = document.getElementById("mathjax");
  if (mathjaxEl && mathjaxEl.style.display === "none") {
    mathjaxEl.style.display = "";
  }

  // --- MathJax v3 detection --->
  // v3 API: window.MathJax.typesetPromise, version string starts with '3.'
  if (
    window.MathJax &&
    window.MathJax.version &&
    window.MathJax.version.startsWith("3")
  ) {
    // v3 async typeset on given DOM
    if (window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([root]).catch(function (err) {
        /* silent */
      });
    }
  } else if (window.MathJax && window.MathJax.Hub && window.MathJax.Hub.Queue) {
    // --- MathJax v2 fallback -->
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, root]);
  }
}

function preprocessMathStrings(str) {
  if (!str) return str;
  // Replace \mathrm{~kJ} with \;\mathrm{kJ} and similar unit hacks
  return str.replace(/\\mathrm\{~\s*([^\}]+)\}/g, "\\;\\mathrm{$1}");
}

function collapseBlockMath(str) {
  if (!str) return str;
  // Collapse linebreaks inside block math for KaTeX compatibility
  return str.replace(
    /\$\$([^$]*)\$\$/gs,
    (match, p1) => "$$" + p1.replace(/[\r\n]+/g, " ") + "$$"
  );
}

function prepareMathRender(str) {
  if (typeof str !== "string") return str;
  // First collapse newlines within LaTeX block math for KaTeX
  let processedStr = collapseBlockMath(str);
  // Then apply other LaTeX-specific preprocessing for KaTeX
  processedStr = preprocessMathStrings(processedStr);
  return processedStr;
}

function setSolutionConsent(question, isConsent) {
  const solutionConsent = document.getElementById("solutionConsent");
  if (!solutionConsent) {
    console.error("setSolutionConsent: solutionConsent checkbox not found");
    return;
  }

  console.log("setSolutionConsent: isConsent =", isConsent);
  if (!isConsent) {
    solutionConsent.checked = false;
    console.log("setSolutionConsent: Showing solution (checkbox unchecked)");
    showSolution(question);
  } else {
    solutionConsent.checked = true;
    console.log("setSolutionConsent: Hiding solution (checkbox checked)");
    hideSolution();
  }

  solutionConsent.addEventListener("change", () => {
    console.log("Checkbox changed, checked =", solutionConsent.checked);
    if (solutionConsent.checked) {
      // Checkbox checked = "Do NOT show solution" = hide solution
      console.log("Hiding solution (checkbox checked)");
      if (window.Android && Android.hideSolutions) Android.hideSolutions();
      hideSolution();
    } else {
      // Checkbox unchecked = "Show solution" = show solution
      console.log("Showing solution (checkbox unchecked)");
      if (window.Android && Android.showSolutions) Android.showSolutions();
      showSolution(question);
    }
  });
}

function showSolution(question) {
  const solutionBox = document.getElementById("solutionBox");
  if (!solutionBox) {
    console.error("showSolution: solutionBox not found");
    return;
  }

  const errorBox = document.getElementById("error");
  if (errorBox) errorBox.style.display = "none";

  // Get solution text from question object
  const solText =
    typeof question.solution === "object"
      ? question.solution.text
      : question.solution;

  if (!solText) {
    console.warn("showSolution: No solution text found");
    return;
  }

  // Use template literals for cleaner HTML
  solutionBox.innerHTML = `
    <div class="row">
      <p class="solution-header mb-1" style="font-family: 'SF Pro Display';">Solution:</p>
    </div>
    <div class="row">
      <span class="solution-text">${solText}</span>
    </div>
  `;

  solutionBox.style.setProperty("display", "block", "important");

  // Debug: Check all visibility-related properties
  const computed = window.getComputedStyle(solutionBox);
  console.log("showSolution: Solution displayed");
  console.log("  - display:", computed.display);
  console.log("  - visibility:", computed.visibility);
  console.log("  - opacity:", computed.opacity);
  console.log("  - height:", computed.height);
  console.log("  - width:", computed.width);
  console.log("  - innerHTML length:", solutionBox.innerHTML.length);
  console.log("  - offsetHeight:", solutionBox.offsetHeight);
  console.log("  - offsetWidth:", solutionBox.offsetWidth);
  console.log(
    "  - parent display:",
    window.getComputedStyle(solutionBox.parentElement).display
  );

  renderMathEverywhere(solutionBox);
}

function hideSolution() {
  const solutionBox = document.getElementById("solutionBox");
  if (solutionBox) {
    solutionBox.style.setProperty("display", "none", "important");
    console.log("hideSolution: Solution hidden");
  } else {
    console.error("hideSolution: solutionBox not found");
  }

  const errorBox = document.getElementById("error");
  if (errorBox) errorBox.style.display = "none";
}

function renderQuestionLabels(question, screenType = "boardsQuestion") {
  if (screenType !== "boardsQuestion") return;
  const labelsContainer = document.getElementById("questionLabelsContainer");
  if (!labelsContainer || !question.questionLabels) return;

  // Filter visible labels
  const visibleLabels = question.questionLabels.filter(
    (label) => label && label.isVisible !== false
  );

  if (visibleLabels.length === 0) {
    labelsContainer.innerHTML = "";
    return;
  }

  // Create tags HTML
  let tagsHTML = "";
  visibleLabels.forEach((label) => {
    const labelText = label.title || "";
    if (labelText) {
      tagsHTML += `<span class="question-label-tag">${labelText}</span>`;
    }
  });

  labelsContainer.innerHTML = tagsHTML;
}

function setSubjectiveQuestion(
  question,
  showSolutionByDefault = false,
  screenType = ""
) {
  const errorBox = document.getElementById("error");
  if (errorBox) {
    errorBox.style.display = "none";
    errorBox.addEventListener("click", () => {
      if (window.Android && Android.showReport) Android.showReport();
    });
  }

  const questionTextPara = document.getElementById("questionText");
  if (questionTextPara && question.question) {
    questionTextPara.innerHTML = prepareMathRender(question.question.text);
    renderMathEverywhere(questionTextPara);
  }

  // Render question labels
  renderQuestionLabels(question, screenType);
}

function setQuestion(
  percentage,
  finalAttempt,
  question,
  status,
  screenType,
  additionalData,
  theme,
  showSolutionByDefault
) {
  //showSkeleton();
  const quesType = question ? question.type : undefined;
  resetDoc();
  createDoc({ qType: quesType });
  resetFields();

  screenType = typeof screenType !== "undefined" ? screenType : "question";
  const body = document.querySelector("body");

  // Debug logging if Android binding available
  if (window.Android && Android.showToast) {
    Android.showToast(JSON.stringify(question._id));
    Android.showToast(JSON.stringify(percentage));
    Android.showToast(theme);
  }

  // Set theme
  if (theme === "dark") {
    if (!body.classList.contains("dark_mode")) body.classList.add("dark_mode");
  } else {
    body.classList.remove("dark_mode");
  }
  globalTheme = theme;

  // Handle subjective questions differently
  if (quesType === "subjective") {
    try {
      console.log("Setting subjective question");
      setSubjectiveQuestion(question, showSolutionByDefault, screenType);
      // Reveal content after rendering (same as other question types)
      // Use setTimeout to ensure math rendering has started
      setTimeout(() => {
        revealContentAfterMathRender(document.getElementById("appContent"));
      }, 100);
    } catch (e) {
      if (window.Android && Android.showToast) {
        Android.showToast("Error - Subjective Question: " + JSON.stringify(e));
      }
    }
    return null;
  }

  // Preprocess math in question and options
  if (question && question.question) {
    let text = preserveContentFormatting(question.question.text);
    question.question.text = prepareMathRender(text);
  }

  if (question && Array.isArray(question.options)) {
    question.options.forEach((opt) => {
      if (opt && typeof opt.text === "string") {
        opt.text = prepareMathRender(opt.text);
      }
    });
  }

  // Preprocess math in solution
  if (question && question.solution) {
    if (typeof question.solution === "object" && question.solution.text) {
      question.solution.text = prepareMathRender(question.solution.text);
    } else if (typeof question.solution === "string") {
      question.solution = prepareMathRender(question.solution);
    }
  }

  // Get UI elements
  const questionTextPara = document.getElementById("questionText");
  const labelBox = document.getElementById("labelBox");
  const labelsLeft = document.querySelector(".labels-left");
  const optionsBox = document.getElementById("optionsBox");
  const solutionBox = document.getElementById("solutionBox");
  const errorBox = document.getElementById("error");
  const vsErrorBox = document.getElementById("vs-error");

  // Set question type label
  if (labelsLeft && question.type) {
    labelsLeft.textContent =
      question.type === "multipleCorrect"
        ? "Multiple correct"
        : question.type === "numerical"
        ? "Numerical Type"
        : "";
  }

  // Set question text
  if (questionTextPara && question.question) {
    if (screenType === "dbqQuestion") {
      const qText = question.question.text
        .split("</br>")
        .slice(1)
        .join("</br>");
      questionTextPara.innerHTML = qText;
    } else {
      questionTextPara.innerHTML = question.question.text;
    }
  }

  // Render question labels
  // renderQuestionLabels(question);

  // Populate options
  if (optionsBox && question.options && quesType) {
    populateOptions(optionsBox, question.options, quesType, theme);
  }

  // Set solution text if available
  const solutionTextPara = solutionBox
    ? solutionBox.querySelector(".solution-text")
    : null;
  if (solutionTextPara && question.solution) {
    solutionTextPara.innerHTML =
      typeof question.solution === "object"
        ? question.solution.text
        : question.solution;
  }

  // Show solution by default if requested
  if (showSolutionByDefault === true && question.solution && solutionBox) {
    if (quesType === "singleCorrect" || quesType === "multipleCorrect") {
      // Convert selected option IDs to format expected by checkOptionsAnswer
      const selectedOptions =
        question.selected && question.selected.length > 0
          ? question.selected.map((id) => ({ id }))
          : [];

      // Determine status: check if selected options are correct
      let status = null;
      if (selectedOptions.length > 0 && question.correct) {
        // Check if all selected options are in the correct array
        const allCorrect = selectedOptions.every((opt) =>
          question.correct.includes(opt.id)
        );
        // Check if correct count matches selected count (for multiple correct)
        const correctCount = question.correct.length;
        const selectedCount = selectedOptions.length;

        if (allCorrect && correctCount === selectedCount) {
          status = 1; // All correct
        } else {
          status = 0; // Incorrect or partially correct
        }
      }

      // Use checkOptionsAnswer with finalAttempt=true to mark all correct options
      // (formSubmitHandler will hide solution, so we'll show it after)
      checkOptionsAnswer(
        null,
        true,
        question,
        selectedOptions,
        status,
        theme,
        screenType
      );
      // Show solution after marking options
      showSolution(question);
    } else if (quesType === "numerical") {
      // For numerical, check if there's a selected input value
      const inputValue =
        question.inputValue !== null && question.inputValue !== undefined
          ? question.inputValue
          : "";
      // Determine status: check if input matches correct value
      const status =
        parseFloat(inputValue) === parseFloat(question.correctValue) ? 1 : 0;

      // For numerical, show solution first to set up structure
      showSolution(question);
      // Then checkNumericalAnswer will insert answer box and call formSubmitHandler (which hides solution)
      checkNumericalAnswer(
        null,
        true,
        question,
        inputValue,
        status,
        screenType
      );
      // Show solution box again (preserving answer box that checkNumericalAnswer created)
      if (solutionBox) {
        solutionBox.style.setProperty("display", "block", "important");
      }
    }
  }

  // Render math in all elements
  if (questionTextPara) renderMathEverywhere(questionTextPara);
  if (optionsBox) renderMathEverywhere(optionsBox);
  if (solutionBox) renderMathEverywhere(solutionBox);

  // Handle additional data for specific screen types
  if (
    screenType !== "question" &&
    screenType !== "top500question" &&
    screenType !== "lblqQuestion" &&
    screenType !== "dbqQuestion"
  ) {
    if (window.Android && Android.showToast) {
      Android.showToast("additionalData : " + JSON.stringify(additionalData));
    }

    if (additionalData) {
      const { exams, subjects, chapters } = additionalData;
      const labels = []; // Define 'labels' array that was missing

      if (subjects && subjects.length) labels.push(subjects[0].title);
      if (chapters && chapters.length) labels.push(chapters[0].title);
    }
  }

  // Handle previous answer status
  if (typeof status === "object" && status !== null) {
    const {
      selectedOption: prevSelectedOptions,
      numericalAnswer: prevNumericalAnswer,
      answerStatus: prevAnswerStatus,
    } = status;

    if (prevSelectedOptions) {
      checkOptionsAnswer(
        percentage,
        finalAttempt,
        question,
        prevSelectedOptions,
        prevAnswerStatus,
        theme,
        screenType
      );
    } else if (prevNumericalAnswer || prevNumericalAnswer === "") {
      checkNumericalAnswer(
        percentage,
        finalAttempt,
        question,
        prevNumericalAnswer,
        prevAnswerStatus,
        screenType
      );
    }
  } else {
    hideCheckBtnAndChangeBgColor();
  }

  // Add event listeners to options
  const optionsList = document.querySelectorAll(".option");

  // Different handling based on question type
  if (quesType === "singleCorrect" || quesType === "multipleCorrect") {
    // Get option container references
    const optionContainers = document.querySelectorAll(".option-container");
    const optionsBoxIndexes = {};

    // Map option IDs to their indices
    for (let x = 0; x < optionContainers.length; x++) {
      const optionBoxEl = optionContainers[x];
      if (optionBoxEl.firstElementChild) {
        optionsBoxIndexes[optionBoxEl.firstElementChild.id] = x;
      }
    }

    // Set up click handlers for each option
    Array.from(optionsList).forEach((item) => {
      item.addEventListener("click", function () {
        if (quesType === "singleCorrect") {
          const thisId = this.id;
          const thisIndex = question.options.findIndex(
            (opt) => opt.id === thisId
          );
          if (this.classList.contains("option_state_selected")) {
            // Already selected: deselect
            this.classList.remove("option_state_selected");
            if (this.firstElementChild && thisIndex >= 0) {
              this.firstElementChild.src = getOptionsByState(
                quesType,
                "default",
                theme
              )[thisIndex];
            }
          } else {
            // Deselect previous selection
            const prevSelected = document.querySelector(
              ".option_state_selected"
            );
            if (prevSelected && prevSelected !== this) {
              prevSelected.classList.remove("option_state_selected");
              const prevId = prevSelected.id;
              const prevIndex = question.options.findIndex(
                (opt) => opt.id === prevId
              );
              if (prevSelected.firstElementChild && prevIndex >= 0) {
                prevSelected.firstElementChild.src = getOptionsByState(
                  quesType,
                  "default",
                  theme
                )[prevIndex];
              }
            }
            // Select this one
            this.classList.add("option_state_selected");
            if (this.firstElementChild && thisIndex >= 0) {
              this.firstElementChild.src = getOptionsByState(
                quesType,
                "selected",
                theme
              )[thisIndex];
            }
          }
        } else if (quesType === "multipleCorrect") {
          // Multiple correct: toggle selected state for this option only
          const thisId = this.id;
          const thisIndex = question.options.findIndex(
            (opt) => opt.id === thisId
          );
          if (this.classList.contains("option_state_selected")) {
            // Currently selected; unselect it
            this.classList.remove("option_state_selected");
            if (this.firstElementChild && thisIndex >= 0) {
              this.firstElementChild.src = getOptionsByState(
                quesType,
                "default",
                theme
              )[thisIndex];
            }
          } else {
            // Not selected; select it
            this.classList.add("option_state_selected");
            if (this.firstElementChild && thisIndex >= 0) {
              this.firstElementChild.src = getOptionsByState(
                quesType,
                "selected",
                theme
              )[thisIndex];
            }
          }
        }
        // Notify Android of selection
        const optionObject = question.options.find((opt) => opt.id === this.id);
        if (optionObject && window.Android && Android.onOptionSelected) {
          Android.onOptionSelected(JSON.stringify(optionObject));
        }
      });
    });
  } else if (quesType === "numerical") {
    // Handle numerical input
    const numericalInput = document.querySelector(".numerical-input");
    if (numericalInput) {
      numericalInput.addEventListener("input", (e) => {
        if (window.Android && Android.onInputChanged) {
          Android.onInputChanged(e.target.value);
        }
      });
    }
  }

  // Set up error reporting
  if (vsErrorBox) {
    vsErrorBox.addEventListener("click", () => {
      if (window.Android && Android.reportVS) Android.reportVS();
    });
  }

  if (errorBox) {
    errorBox.addEventListener("click", () => {
      if (window.Android && Android.showReport) Android.showReport();
    });
  }

  //  setTimeout(() => {
  revealContentAfterMathRender(document.getElementById("appContent"));
  //    }, 20);
}

function showCheckBtnAndChangeBgColor(question, finalAttempt) {
  const sectionElement = document.querySelector(".container-fluid");
  const body = document.querySelector("body");

  if (sectionElement) sectionElement.classList.add("answered");

  if (body) {
    body.style.setProperty(
      "background-color",
      body.classList.contains("dark_mode") ? "#222830" : "#fff",
      "important"
    );
  }

  if (finalAttempt === false) {
    const labelBox = document.getElementById("labelBox");
    const labelsLeft = document.querySelector(".labels-left");

    if (labelBox) {
      const showCorrectAnswerBtn = document.createElement("div");
      showCorrectAnswerBtn.id = "showCorrectAnswerBtn";
      showCorrectAnswerBtn.innerHTML = "Show correct answer";

      if (
        question.type === "numerical" ||
        question.type === "multipleCorrect"
      ) {
        if (labelsLeft)
          labelsLeft.style.setProperty("max-width", "fit-content", "important");
        showCorrectAnswerBtn.style.setProperty(
          "max-width",
          "fit-content",
          "important"
        );
      }

      showCorrectAnswerBtn.addEventListener("click", () => {
        // Create a closure over finalAttempt
        let updatedFinalAttempt = true;
        if (window.Android && Android.showCorrectAnswer) {
          Android.showCorrectAnswer(JSON.stringify(question));
        }
        showCorrectAnswerBtn.style.display = "none";
      });

      labelBox.insertBefore(
        showCorrectAnswerBtn,
        labelBox.firstChild.nextSibling
      );
    }
  } else {
    const showCorrectAnswerBtn = document.getElementById(
      "showCorrectAnswerBtn"
    );
    if (showCorrectAnswerBtn) {
      showCorrectAnswerBtn.style.display = "none";
    }
  }
}

function hideCheckBtnAndChangeBgColor() {
  const sectionElement = document.querySelector(".container-fluid");
  const body = document.querySelector("body");

  if (sectionElement && sectionElement.classList.contains("answered")) {
    sectionElement.classList.remove("answered");
  }

  if (body) {
    body.style.setProperty(
      "background-color",
      body.classList.contains("dark_mode") ? "#1B2027" : "#FFFFFF", //15191E //e3e9f3
      "important"
    );
  }

  const showCorrectAnswerBtn = document.getElementById("showCorrectAnswerBtn");
  if (showCorrectAnswerBtn) {
    showCorrectAnswerBtn.style.display = "none";
  }
}

function customRound(number) {
  if (number % 1 === 0.5) {
    const integerPart = Math.floor(number);
    return integerPart % 2 === 0 ? integerPart : integerPart + 1;
  }
  return Math.round(number);
}

function getPercentage(optionId, dataArray) {
  const foundOption = dataArray.find((option) => option.optionId === optionId);
  return foundOption ? `${customRound(foundOption.percentage)}%` : "0%";
}

function checkNumericalAnswer(
  percentage,
  finalAttempt,
  question,
  input,
  status,
  screenType
) {
  if (typeof question === "object") {
    showCheckBtnAndChangeBgColor(question, finalAttempt);
  }

  // Handle trailing decimal point
  const newValue =
    input && input[input.length - 1] === "." ? input + "0" : null;
  const correctAnswer = question.correctValue;

  // Get required DOM elements
  const solutionBox = document.getElementById("solutionBox");
  const solutionBadge = document.querySelector(".option-badge");
  const solutionBadgeText = document.querySelector(".option-badge-text");
  const numericalInputContainer = document.getElementById("main-options");
  const inputField = document.getElementById("inputAns");
  const userAnswer = newValue || input;

  // Show answer box
  if (solutionBadgeText) {
    const answerBox = document.getElementById("answer-box");

    if (answerBox) {
      answerBox.innerHTML = `
        <div class="row"><p class="solution-header">Answer:</p></div>
        <div class="row"><p class="answer-text">${correctAnswer}</p></div>
      `;
    } else if (solutionBox) {
      const newDiv = document.createElement("div");
      newDiv.id = "answer-box";
      newDiv.innerHTML = `
        <div class="row"><p class="solution-header">Answer:</p></div>
        <div class="row"><p class="answer-text">${correctAnswer}</p></div>
      `;
      solutionBox.insertBefore(newDiv, solutionBox.firstChild);
    }
  }

  // Set input field value
  if (inputField) {
    if (!input && status) {
      inputField.value = correctAnswer;
    } else {
      inputField.value = userAnswer;
    }
    inputField.disabled = true;
  }

  // Style based on answer status
  if (solutionBadgeText && solutionBadge) {
    if (status) {
      solutionBadgeText.textContent = "Correct answer";
      solutionBadgeText.style.paddingRight = "25px";
      solutionBadge.classList.add("correct-answer");
      if (numericalInputContainer) {
        numericalInputContainer.style.border = "1px solid #31d99c";
      }
    } else if (input !== "") {
      solutionBadgeText.textContent = "Wrong answer";
      solutionBadgeText.style.paddingRight = "25px";
      solutionBadge.classList.add("incorrect-answer");
      if (numericalInputContainer) {
        numericalInputContainer.style.border = "1px solid #ff5858";
      }
    }
  }

  // Final attempt UI updates
  if (finalAttempt === true) {
    if (typeof percentage === "number") {
      const buttonBadge = document.querySelector(".bottom-badge");
      const buttonBadgeText = document.querySelector(".bottom-badge-text");

      if (buttonBadge && buttonBadgeText) {
        buttonBadgeText.innerHTML = `<strong>${percentage}</strong>% Got it correct`;
        buttonBadge.classList.add("display-bottom-badge-text");
      }
    }

    if (!status) {
      const bottomLabel = document.querySelector(".bottom-label");
      if (bottomLabel) {
        bottomLabel.innerHTML = `
          <div id="correct-label-text">Correct Answer:&nbsp;</div>
          <div id="label-answer">${correctAnswer}</div>
        `;
      }
    }
  }

  // Submit the form
  formSubmitHandler(question, "numerical", screenType);
}

function checkOptionsAnswer(
  percentage,
  finalAttempt,
  question,
  selectedOptions,
  status,
  theme,
  screenType
) {
  if (typeof question === "object") {
    showCheckBtnAndChangeBgColor(question, finalAttempt);
  }

  // Get option container references
  const optionsBox = document.querySelectorAll(".option-container");
  const optionsBoxIndexes = {};

  // Map option containers to their indices
  for (let x = 0; x < optionsBox.length; x++) {
    const optionBoxEl = optionsBox[x];
    if (optionBoxEl.firstElementChild) {
      optionsBoxIndexes[optionBoxEl.firstElementChild.id] = x;
    }
  }

  // Build a map of correct options
  const options = {};
  if (question.options) {
    question.options.forEach((opt) => {
      options[opt.id] = !!opt.isCorrect;
    });
  }

  // Mark correct answers for final attempt
  if (finalAttempt === true) {
    for (const key in options) {
      if (options[key] === true) {
        const option = document.getElementById(key);
        if (option) {
          const optionIcon = option.firstElementChild;
          const optionBadge = option.nextElementSibling;

          if (optionBadge) {
            const optionBadgeText = optionBadge.firstElementChild;

            if (optionBadgeText) {
              optionBadgeText.style.paddingRight = "15px";
              optionBadge.classList.add("correct-answer");
              option.style.border = "1px solid #31d99c";

              if (Array.isArray(percentage) && optionIcon) {
                const newElement = document.createElement("div");
                newElement.innerHTML =
                  question.type === "singleCorrect"
                    ? `<div id="singleCorrectIcon">${getPercentage(
                        key,
                        percentage
                      )}</div>`
                    : `<div id="multipleCorrectIcon">${getPercentage(
                        key,
                        percentage
                      )}</div>`;
                optionIcon.replaceWith(newElement);
              } else if (optionIcon) {
                optionIcon.src = getOptionsByState(
                  question.type,
                  "correct",
                  theme
                )[optionsBoxIndexes[key] || 0];
              }
            }
          }
        }
      } else {
        const option = document.getElementById(key);
        if (option) {
          const optionIcon = option.firstElementChild;

          if (optionIcon) {
            if (Array.isArray(percentage)) {
              const newElement = document.createElement("div");
              newElement.innerHTML =
                question.type === "singleCorrect"
                  ? `<div id="singleDefaultIcon">${getPercentage(
                      key,
                      percentage
                    )}</div>`
                  : `<div id="multipleDefaultIcon">${getPercentage(
                      key,
                      percentage
                    )}</div>`;
              optionIcon.replaceWith(newElement);
            } else {
              optionIcon.src = getOptionsByState(
                question.type,
                "default",
                theme
              )[optionsBoxIndexes[key] || 0];
            }
          }
        }
      }
    }
  }

  // Mark selected options
  if (selectedOptions && Array.isArray(selectedOptions)) {
    selectedOptions.forEach((selectedOpt) => {
      const opt = selectedOpt.id;
      const option = document.getElementById(opt);

      if (option) {
        const optionIcon = option.firstElementChild;
        const optionBadge = option.nextElementSibling;

        if (optionBadge) {
          const optionBadgeText = optionBadge.firstElementChild;

          if (optionBadgeText) {
            optionBadgeText.textContent = "Your answer";
            optionBadgeText.style.paddingRight = "20px";

            // Determine if the answer is correct
            if (
              options[opt] &&
              (status === 0 || status === 1 || status === 2)
            ) {
              optionBadge.classList.add("correct-answer");
              option.style.border = "1px solid #31d99c";

              if (Array.isArray(percentage) && optionIcon) {
                const newElement = document.createElement("div");
                newElement.innerHTML =
                  question.type === "singleCorrect"
                    ? `<div id="singleCorrectIcon">${getPercentage(
                        opt,
                        percentage
                      )}</div>`
                    : `<div id="multipleCorrectIcon">${getPercentage(
                        opt,
                        percentage
                      )}</div>`;
                optionIcon.replaceWith(newElement);
              } else if (optionIcon) {
                optionIcon.src = getOptionsByState(
                  question.type,
                  "correct",
                  theme
                )[optionsBoxIndexes[opt] || 0];
              }
            } else {
              optionBadge.classList.add("incorrect-answer");
              option.style.border = "1px solid #ff5858";

              if (Array.isArray(percentage) && optionIcon) {
                const newElement = document.createElement("div");
                newElement.innerHTML =
                  question.type === "singleCorrect"
                    ? `<div id="singleIncorrectIcon">${getPercentage(
                        opt,
                        percentage
                      )}</div>`
                    : `<div id="multipleIncorrectIcon">${getPercentage(
                        opt,
                        percentage
                      )}</div>`;
                optionIcon.replaceWith(newElement);
              } else if (optionIcon) {
                optionIcon.src = getOptionsByState(
                  question.type,
                  "incorrect",
                  theme
                )[optionsBoxIndexes[opt] || 0];
              }
            }
          }
        }
      }
    });
  }

  // Submit the form
  formSubmitHandler(question, "single-multi", screenType);
}

function createDoc({ qType }) {
  const sectionElement = document.querySelector(".container-fluid");
  if (!sectionElement) return;

  // Use template literals for cleaner HTML
  sectionElement.innerHTML = `
      <section id="questionSectionContainer" class="row skeleton-loading">
        <p id="questionText" class="loading-placeholder"></p>
        <section id="questionLabelsContainer" class=""></section>
      </section>
      <section id="labelBox" class="row skeleton-loading">
        <div class="labels-left loading-placeholder-small"></div>
      </section>
      <section id="optionsBox" class="skeleton-loading">
        <div class="loading-placeholder-option"></div>
        <div class="loading-placeholder-option"></div>
        <div class="loading-placeholder-option"></div>
        <div class="loading-placeholder-option"></div>
      </section>
    ${
      qType !== "subjective"
        ? `
    <section id="solutionBox" style="display:none;">
      <div class="row px-0">
        <p class="solution-header" style="font-family: 'SF Pro Display';">Solution:</p>
      </div>
      <div class="row">
        <p class="solution-text"></p>
      </div>
    </section>
    `
        : ""
    }
    <section id="error" class="row" style="display:none;">
      <div class="error-container">
        <object class="error-icon" data="../../../../assets/svg/Vector.svg" width="20" height="20"></object>
        <span class="error-text">Report Error</span>
      </div>
    </section>
  `;
}

function resetDoc() {
  const sectionElement = document.querySelector(".container-fluid");
  if (sectionElement) sectionElement.innerHTML = "";
}

function clearSelectedOptions(type = "") {
  if (type === "numerical") {
    const inputAns = document.getElementById("inputAns");
    if (inputAns) inputAns.value = "";
  } else if (type === "singleCorrect" || type === "multipleCorrect") {
    const selectedOptions = document.querySelectorAll(
      ".option.option_state_selected"
    );

    selectedOptions.forEach((option) => {
      const index = option.getAttribute("idx");
      option.classList.remove("option_state_selected");

      if (option.firstElementChild && index !== null) {
        option.firstElementChild.src = getOptionsByState(
          type,
          "default",
          globalTheme
        )[index];
      }
    });
  }
}

function preserveContentFormatting(content) {
  if (!content || typeof content !== "string") return content;

  // Replace newlines with <br> tags, but only where they're not already in HTML
  return (
    content
      // First preserve existing <br> tags
      .replace(/<br\s*\/?>/gi, "##BR_PLACEHOLDER##")
      // Replace actual newlines with <br>
      .replace(/\n/g, "<br>")
      // Restore original <br> tags
      .replace(/##BR_PLACEHOLDER##/g, "<br>")
      // Preserve consecutive spaces (which HTML collapses)
      .replace(/  +/g, (match) => "&nbsp;".repeat(match.length))
  );
}

// Export all needed functions to window for Android/WebView access
window.setQuestion = setQuestion;
window.setSubjectiveQuestion = setSubjectiveQuestion;
window.showSolution = showSolution;
window.hideSolution = hideSolution;
window.resetFields = resetFields;
window.isNumberKey = isNumberKey;
window.elementScrollTo = elementScrollTo;
window.clearSelectedOptions = clearSelectedOptions;
window.checkOptionsAnswer = checkOptionsAnswer;
window.checkNumericalAnswer = checkNumericalAnswer;
window.renderMathEverywhere = renderMathEverywhere;
window.createDoc = createDoc;
window.resetDoc = resetDoc;

// const dummySingleCorrectQuestion = {
//   questionId: "6151e863089ea06dbce235e3",
//   level: null,
//   type: "singleCorrect",
//   previousYearPapers: [
//     {
//       _id: "6904b6feef55966cf1d71f2a",
//       title: "NTA Abhyas (JEE Main) 2020",
//       shortName: "2020",
//       heldOn: "2020-05-25T09:00:00.000Z",
//     },
//   ],
//   questionLabels: [
//     {
//       title: "NTA Abhyas Paper",
//       value: "01",
//     },
//   ],
//   evalStatus: "correct",
//   timeTaken: 1,
//   inputValue: null,
//   options: [
//     {
//       id: "K9avH",
//       text: "<math> <mrow> <mfrac> <mrow> <mi>ln</mi><mfenced> <mrow> <mn>2</mn></mrow>&nbsp;</mfenced></mrow><mrow><mn>60</mn></mrow> </mfrac> </mrow> </math> per minute",
//       image: null,
//       isCorrect: false,
//     },
//     {
//       id: "3jT1W",
//       text: '<math><mfrac><mrow><mrow><mrow><mi mathvariant="normal">ln</mi></mrow><mo>⁡</mo><mrow><mfenced separators="|"><mrow><mn>2</mn></mrow></mfenced></mrow></mrow></mrow><mrow><mn>20</mn></mrow></mfrac></math> per minute',
//       image: null,
//       isCorrect: true,
//     },
//     {
//       id: "cPNQP",
//       text: "<math> <mrow> <mn>20</mn><mtext> </mtext><mi>ln</mi><mfenced> <mn>2</mn> </mfenced></mrow> </math> per minute",
//       image: null,
//       isCorrect: false,
//     },
//     {
//       id: "vbYA2",
//       text: "<math> <mrow> <mn>60</mn><mtext> </mtext><mi>ln</mi><mfenced> <mn>2</mn> </mfenced></mrow> </math> per minute",
//       image: null,
//       isCorrect: false,
//     },
//   ],
//   correctValue: "",
//   correct: ["3jT1W"],
//   selected: ["vbYA2"],
//   question: {
//     text: "Four thousand active nuclei of a radioactive material are present at <math> <mrow> <mtext>t</mtext><mo>=</mo><mn>0.</mn></mrow> </math> After <math> <mrow> <mn>60</mn></mrow> </math> minutes <math> <mrow> <mn>500</mn></mrow> </math> active nuclei are left in the sample. The decay constant of the sample is",
//     image: null,
//   },
//   solution: {
//     text: '60 minutes = 3 half lives<br /><br /><math><mo>∴</mo><msub><mrow><mi mathvariant="normal">T</mi></mrow><mrow><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mrow></msub><mo>=</mo><mn>20</mn><mi mathvariant="normal">&nbsp;</mi><mi mathvariant="normal">m</mi><mi mathvariant="normal">i</mi><mi mathvariant="normal">n</mi></math><br /><br /><math><mo>∴</mo><mi mathvariant="normal">λ</mi><mo>=</mo> <mrow>  <mfrac>   <mrow>    <mi>ln</mi><mn>2</mn>   </mrow>   <mrow>    <msub>     <mi>t</mi>     <mrow>      <mn>1</mn><mo>/</mo><mn>2</mn>     </mrow>    </msub>       </mrow>  </mfrac>   </mrow><mo>=</mo><mfrac><mrow><mrow><mrow><mi mathvariant="normal">ln</mi></mrow><mo>⁡</mo><mrow><mn>2</mn></mrow></mrow></mrow><mrow><mn>20</mn></mrow></mfrac><mi mathvariant="normal">p</mi><mi mathvariant="normal">e</mi><mi mathvariant="normal">r</mi><mi mathvariant="normal">&nbsp;</mi><mi mathvariant="normal">m</mi><mi mathvariant="normal">i</mi><mi mathvariant="normal">n</mi></math>',
//     image: null,
//   },
// };

// const dummyMultipleCorrectQuestion = {
//   questionId: "64a813f9e0ff5a5425a85749",
//   level: 1,
//   type: "multipleCorrect",
//   previousYearPapers: [
//     {
//       _id: "620ab45eb6f6595b8a4ceec2",
//       examId: "615d7762c52ffa3c944600e7",
//       heldOn: "2013-04-30T09:00:00.000Z",
//       shortName: "2013",
//       title: "WBJEE 2013",
//     },
//   ],
//   questionLabels: [],
//   evalStatus: "incorrect",
//   timeTaken: 1,
//   inputValue: null,
//   options: [
//     {
//       id: "PH5XX",
//       text: "rate $=-\\frac{1}{2}\\left[\\frac{d p\\left(\\mathrm{NO}_{2}\\right)}{d t}\\right]$",
//       isCorrect: true,
//       image: null,
//     },
//     {
//       id: "08zBS",
//       text: "rate $=\\frac{1}{2}\\left[\\frac{d p\\left(\\mathrm{NO}_{2}\\right)}{d t}\\right]$",
//       isCorrect: false,
//       image: null,
//     },
//     {
//       id: "HBJDJ",
//       text: "rate $=-\\frac{1}{2}\\left[\\frac{d p\\left(\\mathrm{NO}_{2} F\\right)}{d t}\\right]$",
//       isCorrect: false,
//       image: null,
//     },
//     {
//       id: "aZXxL",
//       text: "rate $=\\frac{1}{2}\\left[\\frac{d p\\left(\\mathrm{NO}_{2} \\mathrm{F}\\right)}{\\mathrm{dt}}\\right]$",
//       isCorrect: true,
//       image: null,
//     },
//   ],
//   correctValue: "",
//   correct: ["PH5XX", "aZXxL"],
//   selected: ["HBJDJ"],
//   question: {
//     text: "Consider the following reaction for $2 \\mathrm{NO}_{2}(g)+\\mathrm{F}_{2}(g) \\longrightarrow 2 \\mathrm{NO}_{2} \\mathrm{F}(g) . \\quad$ The expression for the rate of reaction in terms of the rate of change of partial pressure of reactant and product is/are",
//     image: null,
//   },
//   solution: {
//     text: "$2 \\mathrm{NO}_{2}(g)+\\mathrm{F}_{2}(g) \\longrightarrow 2 \\mathrm{NO}_{2} \\mathrm{F}(g)$\r\n$$\r\n\\begin{aligned}\r\n\\text { Rate of reaction } &=-\\frac{1}{2}\\left[\\frac{d p\\left(\\mathrm{NO}_{2}\\right)}{d t}\\right] \\\\\r\n&=-\\left[\\frac{d p\\left(F_{2}\\right)}{d t}\\right] \\\\\r\n&=+\\frac{1}{2}\\left[\\frac{d p\\left(\\mathrm{NO}_{2} F\\right)}{d t}\\right]\r\n\\end{aligned}\r\n$$",
//     image: null,
//   },
// };

// const dummyNumericalQuestion = {
//   questionId: "6151e86343b6045e341c1840",
//   level: null,
//   type: "numerical",
//   previousYearPapers: [
//     {
//       _id: "6904b6feef55966cf1d71f2a",
//       title: "NTA Abhyas (JEE Main) 2020",
//       shortName: "2020",
//       heldOn: "2020-05-25T09:00:00.000Z",
//     },
//   ],
//   questionLabels: [
//     {
//       title: "NTA Abhyas Paper",
//       value: "26",
//     },
//   ],
//   evalStatus: "incorrect",
//   timeTaken: 4,
//   inputValue: "75",
//   options: [],
//   correctValue: "75",
//   correct: [],
//   selected: [],
//   question: {
//     text: 'The gas phase decomposition of dimethylether follows first order kinetics<br />\r<math><mi mathvariant="normal">C</mi><msub><mrow><mi mathvariant="normal">H</mi></mrow><mrow><mn>3</mn></mrow></msub><mo>-</mo><mi mathvariant="normal">O</mi><mo>-</mo><mi mathvariant="normal">C</mi><msub><mrow><mi mathvariant="normal">H</mi></mrow><mrow><mn>3</mn></mrow></msub><mfenced separators="|"><mrow><mi mathvariant="normal">g</mi></mrow></mfenced><mo>→</mo><mi mathvariant="normal">C</mi><msub><mrow><mi mathvariant="normal">H</mi></mrow><mrow><mn>4</mn></mrow></msub><mfenced separators="|"><mrow><mi mathvariant="normal">g</mi></mrow></mfenced><mo>+</mo><msub><mrow><mi mathvariant="normal">H</mi></mrow><mrow><mn>2</mn></mrow></msub><mfenced separators="|"><mrow><mi mathvariant="normal">g</mi></mrow></mfenced><mo>+</mo><mi mathvariant="normal">C</mi><msub><mrow><mi mathvariant="normal">O</mi></mrow><mrow><mfenced separators="|"><mrow><mi mathvariant="normal">g</mi></mrow></mfenced></mrow></msub></math><br />\rThe reaction is carried out in constant volume container at <math><msup><mrow><mn>500</mn></mrow><mrow><mi mathvariant="normal">o</mi></mrow></msup><mi mathvariant="normal">C</mi></math> and has a half-life of <math> <mrow> <mtext>14</mtext><mtext>.5</mtext><mtext> </mtext><mtext>min</mtext></mrow> </math>. Initially only dimethylether is present at a pressure of <math> <mrow> <mtext>0</mtext><mtext>.40</mtext><mtext> </mtext><mtext>atm</mtext></mrow> </math>. The total pressure of the system after <math> <mrow> <mtext>12</mtext><mtext> </mtext><mtext>min</mtext></mrow> </math> is <math> <mrow> <mfrac> <mtext>x</mtext> <mrow> <mtext>100</mtext></mrow> </mfrac> <mtext> </mtext><mtext>atm</mtext></mrow> </math>. The value of <math><mi mathvariant="normal">x</mi></math> is<br />\r[Given <math> <mrow> <msup> <mrow> <mtext>10</mtext></mrow> <mrow> <mtext>0</mtext><mtext>.25</mtext></mrow> </msup> <mtext> </mtext><mtext>=</mtext><mtext> </mtext><mtext>1</mtext><mtext>.778</mtext></mrow> </math>]',
//     image: null,
//   },
//   solution: {
//     text: '<img alt="" src="https://cdn-question-pool.getmarks.app/nta_abhyas/jee_main/images/633830_sol_gdghg.png" style="width: 360px; height: 75px;" /><br /><br />Now: <math><mn>12</mn><mo>=</mo><mfrac><mrow><mn>2.303</mn></mrow><mrow><mn>0.693</mn></mrow></mfrac><mo>×</mo><mn>14.5</mn><mrow><mrow><mi mathvariant="normal">log</mi></mrow><mo>⁡</mo><mrow><mfenced separators="|"><mrow><mfrac><mrow><mn>0.4</mn></mrow><mrow><mn>0.4</mn><mo>-</mo><mi mathvariant="normal">x</mi></mrow></mfrac></mrow></mfenced></mrow></mrow></math><br /><br /><math><mn>0.25</mn><mo>=</mo><mrow><mrow><mi mathvariant="normal">log</mi></mrow><mo>⁡</mo><mrow><mfenced separators="|"><mrow><mfrac><mrow><mn>0.4</mn></mrow><mrow><mn>0.4</mn><mo>-</mo><mi mathvariant="normal">x</mi></mrow></mfrac></mrow></mfenced></mrow></mrow></math><br /><br /><math><mn>1</mn><msup><mrow><mn>0</mn></mrow><mrow><mn>0.25</mn></mrow></msup><mo>=</mo><mfenced separators="|"><mrow><mfrac><mrow><mn>0.4</mn></mrow><mrow><mn>0.4</mn><mo>-</mo><mi mathvariant="normal">x</mi></mrow></mfrac></mrow></mfenced></math><br /><br /><math><mfenced separators="|"><mrow><mfrac><mrow><mn>0.4</mn></mrow><mrow><mn>0.4</mn><mo>-</mo><mi mathvariant="normal">x</mi></mrow></mfrac></mrow></mfenced><mo>=</mo><mn>1.778</mn></math><br /><br /><math><mo>⇒</mo><mi mathvariant="normal">x</mi><mo>=</mo><mn>0.175</mn></math><br /><br />Total pressure <math><mo>=</mo><mfenced separators="|"><mrow><mn>0.4</mn><mo>-</mo><mn>0.75</mn></mrow></mfenced><mo>+</mo><mn>0.175</mn><mo>+</mo><mn>0.175</mn><mo>+</mo><mn>0.175</mn><mo>=</mo><mn>0.75</mn><mi mathvariant="normal">&nbsp;</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">t</mi><mi mathvariant="normal">m</mi></math><br /><br />now: <math><mfrac><mrow><mi mathvariant="normal">x</mi></mrow><mrow><mn>100</mn></mrow></mfrac><mo>=</mo><mn>0.75</mn></math><br /><br /><math><mi mathvariant="normal">x</mi><mo>=</mo><mn>75</mn></math>',
//     image: null,
//   },
// };

// setQuestion(
//   null,
//   false,
//   dummyNumericalQuestion,
//   null,
//   "question",
//   null,
//   "dark",
//   true
// );
