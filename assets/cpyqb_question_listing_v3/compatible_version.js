"use strict";

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
  }
}
function questionSolutionResizeAllImages(question) {
  if (question.solution.text && question.solution.text.includes("<img") || !question.solution.text && question.solution && question.solution.includes("<img")) {
    var allSolutionImages = document.querySelectorAll(".solution-text img");
    resizeImages(allSolutionImages);
  }
}
function questionOptionsResizeAllImages(question) {
  for (var i = 0; i < question.options.length; i++) {
    var opt = question.options[i];
    if (opt.text.includes("<img")) {
      var allOptionImages = document.querySelectorAll(".option-text img");
      resizeImages(allOptionImages);
    }
  }
}
function getQuestionNumber(num) {
  if (Number(num) < 9) return "0".concat(Number(num) + 1);
  return Number(num) + 1;
}
function getYears(years, questionLabels, screenType, screenLabels) {
  screenType = typeof screenType !== "undefined" ? screenType : "question";
  screenLabels = typeof screenLabels !== "undefined" ? screenLabels : [];
  Android.logMessage("labels years ".concat(JSON.stringify(years)));
  Android.logMessage("labels ".concat(JSON.stringify(questionLabels)));
  var labels = [];
  if (screenType === "notebookListing") {
    labels = screenLabels;
  }
  if (years.length > 0) {
    if (years.length <= 1) {
      labels.push(years[0].title);
    } else {
      for (var i = 0; i < years.length; i++) {
        labels.push(years[i].title);
      }
    }
  } else if (questionLabels && questionLabels.length > 0) {
    var filteredLabels = [];
    for (var _i2 = 0; _i2 < questionLabels.length; _i2++) {
      var label = questionLabels[_i2];
      if (label.isVisible) {
        filteredLabels.push(label);
      }
    }
    if (filteredLabels && filteredLabels.length > 0) {
      labels.push("".concat(filteredLabels[0].title, " ").concat(filteredLabels[0].value));
    } else {
      return "";
    }
  }
  return labels.join(", ");
}
function onQuestionClick(index, questionsData) {
  Android.onQuestionClicked("".concat(index));
}

// --- KaTeX + MathJax Multi-math Rendering ---
function preprocessMathStrings(str) {
  if (!str) return str;
  // Replace \mathrm{~kJ} etc with proper LaTeX spaces
  return str.replace(/\\mathrm\{~\s*([^}]+)}/g, '\\;\\mathrm{$1}');
}
function collapseBlockMath(str) {
  if (!str) return str;
  // Collapse linebreaks inside block math for KaTeX compatibility
  return str.replace(/\$\$([^$]*)\$\$/g, function(match, p1) {
    return "$$" + p1.replace(/[\r\n]+/g, ' ') + "$$";
  });
}
function prepareMathRender(str) {
  if (typeof str !== 'string') return str;
  var processedStr = collapseBlockMath(str);
  processedStr = preprocessMathStrings(processedStr);
  return processedStr;
}
function renderMathEverywhere(root) {
  if (!root) root = document;
  try {
    if (window.renderMathInElement) {
      window.renderMathInElement(root, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false
      });
    }
  } catch(_) {}
  if (window.mathjaxVersion === 3 && window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([root]);
  } else if (window.mathjaxVersion === 2 && window.MathJax && window.MathJax.Hub) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, root]);
  }
}

// Updated typeset: works with KaTeX or MathJax v3 and falls back to v2
function setTypeset() {
  renderMathEverywhere(document.body);
}

function setOpacity() {
  var answeredQs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  for (var i = 0; i <= answeredQs.length; i++) {
    var position = answeredQs[i];
    var questionClass = document.querySelector(".question-row-".concat(position));
    if (questionClass) questionClass.classList.add("opacity-75");
  }
}
function populateQuestions(questions, screenType, theme, filterValue) {
  screenType = typeof screenType !== "undefined" ? screenType : "question";
  var body = document.querySelector("body");
  if (theme === "dark") {
    if (!body.classList.contains("dark_mode")) body.classList.add("dark_mode");
  } else body.classList.remove("dark_mode");
  var questionsHtml = "";
  Android.logMessage("overall screen: ".concat(JSON.stringify(questions.exams)));
  for (var i in questions.data) {
    var ques = questions.data[i];
    Android.logMessage("overall screen: ".concat(JSON.stringify(ques.exams)));
    var labels = [];
    if (screenType != "question") {
      var exams = ques.exams;
      var subjects = ques.subjects;
      var chapters = ques.chapters;
      if (subjects !== null && subjects !== void 0 && subjects.length) labels.push(subjects[0].title);
      if (chapters !== null && chapters !== void 0 && chapters.length) labels.push(chapters[0].title);
    }
    Android.logMessage("ques: ".concat(JSON.stringify(ques, null, 4)));
    Android.logMessage("i: ".concat(JSON.stringify(i)));
    Android.logMessage("filter: ".concat(filterValue));
    var yearsLabels = getYears(ques.yearsAppeared, ques.questionLabels, screenType, labels);
    var showBullet = false;
    if (Boolean(yearsLabels)) showBullet = true;
    var quesLastAttemptStatus = void 0;
    if (screenType === "cpyq_q_listing") quesLastAttemptStatus = (ques === null || ques === void 0 ? void 0 : ques.evalStatus) || "notAttempted";else if (screenType === "cpyqb_bucket_q_listing") quesLastAttemptStatus = (ques === null || ques === void 0 ? void 0 : ques.evalStatus) || "notAttempted";
    console.log({
      quesLastAttemptStatus: quesLastAttemptStatus,
      staus: ques.evalStatus,
      theme: theme
    });
    questionsHtml += "\n          <div\n              class=\"".concat(filterValue === "all" && ques.isAttempted ? "opacity-75" : "", "\n              question-row question-row-").concat(i, " mb-4\"\n              onclick=\"onQuestionClick(").concat(i, ")\">\n               <div class=\"question-number\">\n                <p>").concat(getQuestionNumber(i), "</p>\n                ").concat(quesLastAttemptStatus === "correct" ? "<img src=\"../assets/svg/cpyqb_q_listing/".concat(theme, "/cpyqb_green_16_16.svg\" />") : quesLastAttemptStatus === "incorrect" ? "<img src=\"../assets/svg/cpyqb_q_listing/".concat(theme, "/cpyqb_red_cross_16_16.svg\" />") : quesLastAttemptStatus === "partiallyCorrect" ? "<img src=\"../assets/svg/cpyqb_q_listing/".concat(theme, "/cpyqb_yellow_tick_16_16.svg\" />") : "", "\n               </div>\n               <div class=\"question-body\">\n                <div class=\"question-title\">").concat(ques.title.text, "</div>\n                  <div class=\"question-labels\">\n                    <div class=\"question-year\">\n                      ").concat(yearsLabels, "\n                    </div>\n                    ").concat(ques.hasVideoSolution && ques.videoSolution ? "\n                      <div class=\"vs-label\">\n                        ".concat(showBullet ? "<div class=\"bullet\"></div>" : "", "\n                          <div class=\"question-videosol-label\">\n                                <img src=\"../assets/svg/VideoCamera.svg\"/> \n                                <p>Video Sol Available</p>\n                          </div>\n                      </div>") : "", "\n                    ").concat(ques.syllabusCategory ? ques.syllabusCategory === "outOfSyllabus" ? "<p class=\"out-of-syllabus\">Out of Syllabus</p>" : ques.syllabusCategory === "outOfSyllabusButGoodToSolve" ? "<p class=\"out-of-syllabus-but-good-to-solve\">Out of Syllabus but Good to Solve</p>" : "" : "", "\n                  </div>\n               </div>\n           </div>\n         ");
    Android.logMessage("questionsHtmlDebug: ".concat(questionsHtml));
  }
  root.innerHTML = questionsHtml;
  setTypeset();
}
