"use strict";

// var Android = {
//   toggleShow: function (toggle) {
//     Android.toast("Toggled: ", toggle);
//   },
//   showToast: function (message) {
//     console.log(message);
//   },
//   logMessage: function (message) {
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

/*Above Android object, only for testing purposes.*/
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
function renderQuestionLabelsHTML(questionLabels) {
  if (!questionLabels || questionLabels.length === 0) return "";

  // Filter visible labels
  var visibleLabels = questionLabels.filter(function (label) {
    return label && label.isVisible !== false;
  });
  if (visibleLabels.length === 0) return "";

  // Create tags HTML
  var tagsHTML = "";
  visibleLabels.forEach(function (label) {
    var labelText = label.title || "";
    if (labelText) {
      tagsHTML += "<span class=\"question-label-tag\">".concat(labelText, "</span>");
    }
  });
  return tagsHTML;
}

// --- KaTeX + MathJax Multi-math Rendering ---
function preprocessMathStrings(str) {
  if (!str) return str;
  // Replace \mathrm{~kJ} etc with proper LaTeX spaces
  return str.replace(/\\mathrm\{~\s*([^}]+)}/g, "\\;\\mathrm{$1}");
}
function collapseBlockMath(str) {
  if (!str) return str;
  // Collapse linebreaks inside block math for KaTeX compatibility
  return str.replace(/\$\$([^$]*)\$\$/g, function (match, p1) {
    return "$$" + p1.replace(/[\r\n]+/g, " ") + "$$";
  });
}
function prepareMathRender(str) {
  if (typeof str !== "string") return str;
  var processedStr = collapseBlockMath(str);
  processedStr = preprocessMathStrings(processedStr);
  return processedStr;
}
function renderMathEverywhere() {
  var _window$MathJax, _window$MathJax2;
  var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  if (!root) return;

  /* 1. KaTeX first (fast) */
  try {
    if (window.renderMathInElement) {
      window.renderMathInElement(root, {
        delimiters: [{
          left: "$$",
          right: "$$",
          display: true
        }, {
          left: "$",
          right: "$",
          display: false
        }, {
          left: "\\(",
          right: "\\)",
          display: false
        }, {
          left: "\\[",
          right: "\\]",
          display: true
        }],
        throwOnError: false
      });
    }
  } catch (_) {}

  /* 2. MathJax v3 fallback */
  if ((_window$MathJax = window.MathJax) !== null && _window$MathJax !== void 0 && _window$MathJax.typesetPromise) {
    return window.MathJax.typesetPromise([root]);
  }

  /* 3. MathJax v2 fallback (if needed anywhere else) */
  if ((_window$MathJax2 = window.MathJax) !== null && _window$MathJax2 !== void 0 && (_window$MathJax2 = _window$MathJax2.Hub) !== null && _window$MathJax2 !== void 0 && _window$MathJax2.Queue) {
    return MathJax.Hub.Queue(["Typeset", MathJax.Hub, root]);
  }
}

// Replace setTypeset calls:
function setTypeset() {
  renderMathEverywhere(document.getElementById("root"));
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
  var loader = document.getElementById("skeleton-loader");
  var root = document.getElementById("root");
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
    var yearsLabels = getYears(ques.previousYearPapers, ques.questionLabels, screenType, labels);
    var showBullet = false;
    if (Boolean(yearsLabels)) showBullet = true;
    var quesLastAttemptStatus = void 0;
    if (screenType === "cpyq_q_listing") quesLastAttemptStatus = (ques === null || ques === void 0 ? void 0 : ques.evalStatus) || "notAttempted";else if (screenType === "cpyqb_bucket_q_listing") quesLastAttemptStatus = (ques === null || ques === void 0 ? void 0 : ques.evalStatus) || "notAttempted";
    questionsHtml += '\n          <div\n              class="'.concat(filterValue === "all" && "", "\n              question-row question-row-").concat(i, ' mb-4"\n              onclick="onQuestionClick(').concat(i, ')">\n               <div class="question-number">\n                <p>').concat(getQuestionNumber(i), "</p>\n                ").concat(quesLastAttemptStatus === "correct" ? '<img src="../../assets/svg/cpyqb_q_listing/'.concat(theme, '/cpyqb_green_16_16.svg" />') : quesLastAttemptStatus === "incorrect" ? '<img src="../../assets/svg/cpyqb_q_listing/'.concat(theme, '/cpyqb_red_cross_16_16.svg" />') : quesLastAttemptStatus === "partiallyCorrect" ? '<img src="../../assets/svg/cpyqb_q_listing/'.concat(theme, '/cpyqb_yellow_tick_16_16.svg" />') : "", '\n               </div>\n               <div class="question-body">\n                <div class="question-title">').concat(ques.question.text, '</div>\n                  <div class="question-labels">\n                    ').concat(yearsLabels && yearsLabels !== "" || renderQuestionLabelsHTML(ques.questionLabels) !== "" ? '<div class="question-year-labels-container">\n                      ' : "").concat(yearsLabels && yearsLabels !== "" ? '<div class="question-year">\n                        '.concat(yearsLabels, "\n                      </div>") : "", "\n                      ").concat(yearsLabels && yearsLabels !== "" && renderQuestionLabelsHTML(ques.questionLabels) !== "" ? '<div class="bullet"></div>' : "", "\n                      ").concat(renderQuestionLabelsHTML(ques.questionLabels), "\n                    ").concat(yearsLabels && yearsLabels !== "" || renderQuestionLabelsHTML(ques.questionLabels) !== "" ? "</div>" : "", "\n                    ").concat(ques.videoSolution ? '\n                      <div class="vs-label">\n                        '.concat(false ? '<div class="bullet"></div>' : "", '\n                          <div class="question-videosol-label">\n                                <img src="../assets/svg/VideoCamera/'.concat(theme, '.svg"/> \n                                \n                          </div>\n                      </div>')) : "", "\n                    ").concat(ques.syllabusCategory ? ques.syllabusCategory === "outOfSyllabus" ? '<p class="out-of-syllabus">Out of Syllabus</p>' : ques.syllabusCategory === "outOfSyllabusButGoodToSolve" ? '<p class="out-of-syllabus-but-good-to-solve">Out of Syllabus but Good to Solve</p>' : "" : "", "\n                  </div>\n               </div>\n           </div>\n         ");
  }
  loader.style.display = "none";
  root.style.display = "block";
  root.innerHTML = questionsHtml;
  setTypeset();
}
function appendQuestions(newQuestionsObj) {
  var newQuestions = newQuestionsObj.data || [];
  var root = document.getElementById("root");
  for (var i in newQuestions) {
    var ques = newQuestions[i];
    var div = document.createElement("div");
    div.className = "question-row question-row-".concat(i, " mb-4");
    div.setAttribute("onclick", "onQuestionClick(".concat(i, ")"));
    var questionNumber = getQuestionNumber(i);
    var questionText = ques.question.text || "";
    div.innerHTML = "\n      <div class=\"question-number\">\n        <p>".concat(questionNumber, "</p>\n      </div>\n      <div class=\"question-body\">\n        <div class=\"question-title\">").concat(questionText, "</div>\n      </div>\n    ");
    root.appendChild(div);
  }
  setTypeset(); // rendering math again
}
window.addEventListener("scroll", function () {
  var scrollTop = window.scrollY || document.documentElement.scrollTop;
  var windowHeight = window.innerHeight || document.documentElement.clientHeight;
  var fullHeight = document.documentElement.scrollHeight;
  var distanceFromBottom = fullHeight - (scrollTop + windowHeight);

  // Enhanced debugging
  if (typeof Android !== "undefined" && Android.logMessage) {
    Android.logMessage("Scroll Debug - scrollTop: ".concat(scrollTop, ", windowHeight: ").concat(windowHeight, ", fullHeight: ").concat(fullHeight, ", distanceFromBottom: ").concat(distanceFromBottom));
  }
  if (scrollTop + windowHeight >= fullHeight - 100) {
    if (typeof Android !== "undefined" && Android.logMessage) {
      Android.logMessage("Scroll end reached! Calling onScrollEndReached()");
    }
    if (typeof Android !== "undefined" && Android.onScrollEndReached) {
      Android.onScrollEndReached();
    } else {
      console.log("Android interface not available or onScrollEndReached method missing");
    }
  }
});

// const dummyQuestions = {
//   data: [
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "If the magnetic field of a plane electromagnetic wave is given by (The speed of light $\\left.=3 \\times 10^{8} \\mathrm{~m} / \\mathrm{s}\\right)$ $\\mathrm{B}=100 \\times 10^{-6} \\sin \\left[2 \\pi \\times 2 \\times 10^{15}\\left(\\mathrm{t}-\\frac{x}{\\mathrm{c}}\\right)\\right]$\nthen the maximum electric field associated with it is:",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea14129a2c5a460bfcc",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: '<p>A body of mass <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mo>&#160;</mo><mi>kg</mi></math> moves under a force of&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced><mrow><mn>2</mn><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover><mo>+</mo><mn>3</mn><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>+</mo><mn>5</mn><mover><mi mathvariant="normal">k</mi><mo>^</mo></mover></mrow></mfenced><mi mathvariant="normal">N</mi></math> It starts from rest and was at the origin initially. After <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>4</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math>, its new coordinates are <math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced><mrow><mn>8</mn><mo>,</mo><mi>b</mi><mo>,</mo><mn>20</mn></mrow></mfenced></math>. The value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>b</mi></math> is ______.</p><p>(Round off to the Nearest Integer)</p>',
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1538f63489177ea6e",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "The equation of a tangent to the hyperbola $4 x^{2}-5 y^{2}=20$ parallel to the line $x-y=2$ is:",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea15a8f7f83f2123554",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "A heat source at $\\mathrm{T}=10^{3} \\mathrm{~K}$ is connected to another heat reservoir at $\\mathrm{T}=10^{2} \\mathrm{~K}$ by a copper slab which is $1 \\mathrm{~m}$ thick. Given that the thermal conductivity of copper is $0.1 \\mathrm{WK}^{-1} \\mathrm{~m}^{-1},$ the energy flux through it in the steady state is:",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1626607d138e55424",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "A proton, an electron, and a Helium nucleus, have the same energy. They are in circular orbits in a plane due to magnetic field perpendicular to the plane. Let $r_{p}, r_{e}$ and $r_{\\text {He }}$ be their respective radii, then,",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea16f1c718dd2aec70d",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: 'The major product of the following reaction is:\n<img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/LVCPhTT2_rqOXdIa8FkrcWEayzJQ_M6l9cTN7V0Gmjs.original.fullsize.png"><br>',
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea174b7a79f072fb811",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "Let $f(x)=\\left\\{\\begin{array}{cc}\\max \\left\\{|x|, x^{2}\\right\\} & |x| \\leq 2 \\\\ 8-2|x|, & 2  < |x| \\leq 4\\end{array}\\right.$\nLet $\\mathrm{S}$ be the set of points in the interval (-4,4) at which $f$ is not differentiable. Then S:",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea187db9a94e04c52b4",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "If the third term in the binomial expansion of $\\left(1+x^{\\log _{2} x}\\right)^{5}$\nequals 2560 , then a possible value of $x$ is:",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea189dea1150b0cb58b",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "A uniform metallic wire has a resistance of $18 \\Omega$ and is bent into an equilateral triangle. Then, the resistance between any two vertices of the triangle is:",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1943d1bf719a27a8b",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "If $\\lim _{x \\rightarrow 1} \\frac{x^{4}-1}{x-1}=\\lim _{x \\rightarrow k} \\frac{x^{3}-k^{3}}{x^{2}-k^{2}},$ then $\\mathrm{k}$ is:",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1a0c089f3f8b5f253",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "If $\\Delta_{1}=\\left|\\begin{array}{ccc}x & \\sin \\theta & \\cos \\theta \\\\ -\\sin \\theta & -x & 1 \\\\ \\cos \\theta & 1 & x\\end{array}\\right|$ and\n$\\Delta_{2}=\\left|\\begin{array}{ccc}x & \\sin 2 \\theta & \\cos 2 \\theta \\\\ -\\sin 2 \\theta & -x & 1 \\\\ \\cos 2 \\theta & 1 & x\\end{array}\\right|, x \\neq 0$\nthen for all $\\theta \\in\\left(0, \\frac{\\pi}{2}\\right)$",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1a7205d74c36b8b8f",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "The electric field of a plane electromagnetic wave is given by $\\overrightarrow{\\mathrm{E}}=\\mathrm{E}_{0} \\hat{\\mathrm{i}} \\cos (\\mathrm{kz}) \\cos (\\omega \\mathrm{t})$\nThe corresponding magnetic field is then given by:",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1b01add07b9e6c516",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "A $2 \\mathrm{~W}$ carbon resistor is color coded with green, black, red and brown respectively. The maximum current which can be passed through this resistor is:",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1c2577f132e6ccdde",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "The species that can have a trans-isomer is :\n$(\\mathrm{en}=$ ethane -1,2 -diamine, $\\mathrm{Ox}=$ oxalate $)$",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1ce25526cf6552c27",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: 'The increasing order of the reactivity of the following compounds towards electrophilic aromatic substitution reactions is :\n(I)<img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/5v7D7h-l9P_trT6ibnxEvOpOF00TWAOrTm1FoTjuYiU.original.fullsize.png"><br>\n(II)<img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/q-uzXuAj6gwj5tDLAmSmHfNFBpWDGzVmtyEynuhqNco.original.fullsize.png"><br>\n(III)<img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/bF6fVgXObrfivJNx9FBnsIk3ZRDjEDAaHBxCMVHlC5I.original.fullsize.png"><br>>',
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1d87badfe667019e2",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: 'A potentiometer wire AB having length $L$ and resistance $12 \\mathrm{r}$ is joined to a cell $\\mathrm{D}$ of $\\mathrm{emf} \\varepsilon$ and internal resistance\nr. A cell C having emf $\\varepsilon / 2$ and internal resistance $3 r$ is connected. The length AJ at which the galvanometer as shown in fig. shows no deflection is:\n<img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/HC3vG-Hpd2WB1QMYxPcygcowH5c4PvzZV4ZfOK8iDzU.original.fullsize.png">',
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1e1d76f04a9f5d3d6",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "In a Young's double slit experiment with slit separation\n$0.1 \\mathrm{~mm},$ one observes a bright fringe at angle $\\frac{1}{40}$ rad by using light of wavelength $\\lambda_{1}$ When the light of wavelength $\\lambda_{2}$ is used a bright fringe is seen at the same angle in the same set up. Given that $\\lambda_{1}$ and $\\lambda_{2}$ are in visible range $(380 \\mathrm{nm}$ to $740 \\mathrm{nm}$ ), their values are-",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1fc754a0d14385b72",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       question: {
//         text: "<p>The perpendicular distance of the plane `bar r. (3 hat i + 4 hat j + 12 hat k) = 78` from the origin is ______.</p>",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "693807cceab8689850f34143",
//       previousYear: "2019-01-10T09:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7ea",
//           heldOn: "2019-01-10T09:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 1)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//     {
//       type: "singleCorrect",
//       questionLabels: [],
//       previousYearPapers: [
//         {
//           _id: "615d92ebde3d91842a5cf7eb",
//           heldOn: "2019-01-10T14:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 2)",
//         },
//       ],
//       question: {
//         text: "A cylindrical plastic bottle of negligible mass is filled with $310 \\mathrm{ml}$ of water and left floating in a pond with still water. If pressed downward slightly and released, it starts performing simple harmonic motion at angular frequency $\\omega .$ If the radius of the bottle is $2.5 \\mathrm{~cm}$ then $\\omega$ is close to: (density of water $\\left.=10^{3} \\mathrm{~kg} / \\mathrm{m}^{3}\\right)$",
//         image: null,
//       },
//       videoSolution: null,
//       questionId: "6120dea1802ae7515c4c888d",
//       previousYear: "2019-01-10T14:00:00.000Z",
//       yearsAppeared: [
//         {
//           _id: "615d92ebde3d91842a5cf7eb",
//           heldOn: "2019-01-10T14:00:00.000Z",
//           title: "JEE Main 2019 (10 Jan Shift 2)",
//         },
//       ],
//       hasVideoSolution: false,
//       questionType: "singleCorrect",
//     },
//   ],
// };

// populateQuestions(dummyQuestions, "question", "dark", "all");
