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

function toggleAllNotesVisibility(isShow) {
  if (typeof Android !== "undefined" && Android.logMessage) {
    Android.logMessage(`Toggle all notes: ${isShow}`);
  }

  const allNotes = document.querySelectorAll(".question-note");
  allNotes.forEach((note) => {
    if (isShow) {
      note.classList.remove("notes-hidden");
    } else {
      note.classList.add("notes-hidden");
    }
  });
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
  }
}
function questionSolutionResizeAllImages(question) {
  if (
    (question.solution.text && question.solution.text.includes("<img")) ||
    (!question.solution.text &&
      question.solution &&
      question.solution.includes("<img"))
  ) {
    const allSolutionImages = document.querySelectorAll(".solution-text img");
    resizeImages(allSolutionImages);
  }
}
function questionOptionsResizeAllImages(question) {
  for (let i = 0; i < question.options.length; i++) {
    const opt = question.options[i];
    if (opt.text.includes("<img")) {
      const allOptionImages = document.querySelectorAll(".option-text img");
      resizeImages(allOptionImages);
    }
  }
}
function getQuestionNumber(num) {
  if (Number(num) < 9) return `0${Number(num) + 1}`;
  return Number(num) + 1;
}
function getYears(years, questionLabels, screenType, screenLabels) {
  screenType = typeof screenType !== "undefined" ? screenType : "question";
  screenLabels = typeof screenLabels !== "undefined" ? screenLabels : [];
  Android.logMessage(`labels years ${JSON.stringify(years)}`);
  Android.logMessage(`labels ${JSON.stringify(questionLabels)}`);
  let labels = [];
  if (screenType === "notebookListing") {
    labels = screenLabels;
  }
  if (years.length > 0) {
    if (years.length <= 1) {
      labels.push(years[0].title);
    } else {
      for (let i = 0; i < years.length; i++) {
        labels.push(years[i].title);
      }
    }
  } else if (questionLabels && questionLabels.length > 0) {
    let filteredLabels = [];
    for (let i = 0; i < questionLabels.length; i++) {
      const label = questionLabels[i];
      if (label.isVisible) {
        filteredLabels.push(label);
      }
    }
    if (filteredLabels && filteredLabels.length > 0) {
      labels.push(`${filteredLabels[0].title} ${filteredLabels[0].value}`);
    } else {
      return "";
    }
  }
  return labels.join(", ");
}
function onQuestionClick(index) {
  Android.onQuestionClick(`${index}`);
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
  return str.replace(
    /\$\$([^$]*)\$\$/gs,
    (match, p1) => "$$" + p1.replace(/[\r\n]+/g, " ") + "$$",
  );
}
function prepareMathRender(str) {
  if (typeof str !== "string") return str;
  let processedStr = collapseBlockMath(str);
  processedStr = preprocessMathStrings(processedStr);
  return processedStr;
}
function renderMathEverywhere(root = document) {
  try {
    // Try KaTeX first
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
  // MathJax fallback (v3 or v2)
  if (
    window.mathjaxVersion === 3 &&
    window.MathJax &&
    window.MathJax.typesetPromise
  ) {
    window.MathJax.typesetPromise([root]);
  } else if (
    window.mathjaxVersion === 2 &&
    window.MathJax &&
    window.MathJax.Hub
  ) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, root]);
  }
}

// Replace setTypeset calls:
function setTypeset() {
  renderMathEverywhere(document.body);
}

function setOpacity() {
  var answeredQs =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  for (var i = 0; i <= answeredQs.length; i++) {
    var position = answeredQs[i];
    var questionClass = document.querySelector(
      ".question-row-".concat(position),
    );
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
  Android.logMessage(
    "overall screen: ".concat(JSON.stringify(questions.data?.filters)),
  );
  for (var i in questions.data.questions) {
    var ques = questions.data.questions[i];
    Android.logMessage("overall screen: ".concat(JSON.stringify(ques.exams)));
    var labels = [];
    if (screenType != "question") {
      var exams = ques.qp?.exams || [];
      var subjects = ques.subjects || [];
      var chapters = ques.chapters || [];
      if (subjects !== null && subjects !== void 0 && subjects.length)
        labels.push(subjects[0].title);
      if (chapters !== null && chapters !== void 0 && chapters.length)
        labels.push(chapters[0].title);
    }
    Android.logMessage("ques: ".concat(JSON.stringify(ques, null, 4)));
    Android.logMessage("i: ".concat(JSON.stringify(i)));
    Android.logMessage("filter: ".concat(filterValue));
    var yearsLabels = getYears(
      ques.qp.previousYearPapers,
      ques.qp.questionLabels,
      screenType,
      labels,
    );
    var showBullet = false;
    if (Boolean(yearsLabels)) showBullet = true;

    questionsHtml +=
      '\n          <div\n              class="question-row question-row-'
        .concat(i, ' mb-4"\n              onclick="onQuestionClick(')
        .concat(
          i,
          ')">\n               <div class="question-number">\n                <p>',
        )
        .concat(
          getQuestionNumber(i),
          '</p>\n              </div>\n               <div class="question-body">\n                <div class="question-title">',
        )
        .concat(
          ques.qp.question.text,
          '</div>\n                  <div class="question-labels">\n                    <div class="question-year">\n                      ',
        )
        .concat(
          yearsLabels,
          "\n                    </div>\n" +
            (ques.hasNote || (ques.tags && ques.tags.length > 0)
              ? '                    <div class="question-tags">\n' +
                (ques.hasNote
                  ? '                      <span class="tag-badge notes-pill">NOTE</span>\n'
                  : "") +
                (ques.tags && ques.tags.length > 0
                  ? ques.tags
                      .map(
                        (tag) =>
                          '                      <span class="tag-badge">' +
                          tag.title +
                          "</span>",
                      )
                      .join("\n")
                  : "") +
                "\n                    </div>\n"
              : "") +
            "                  </div>\n" +
            '                  <div class="question-note" data-note-id="' +
            ques.nqdId +
            '">\n' +
            (ques.hasNote && ques.myNote
              ? '                    <div class="note-content">\n' +
                "                      <strong>Note:</strong>\n" +
                '                      <span class="note-text">' +
                ques.myNote.substring(0, 200) +
                (ques.myNote.length > 200 ? "..." : "") +
                "</span>\n" +
                "                    </div>\n"
              : "") +
            "                  </div>\n" +
            "                </div>\n              </div>\n",
        );
  }
  document.getElementById("root").innerHTML = questionsHtml;
  setTypeset();
}


function appendQuestions(newQuestionsObj, startIndex = 0) {
  const newQuestions = newQuestionsObj.data?.questions || [];
  const root = document.getElementById("root");

  for (var i = 0; i < newQuestions.length; i++) {
    var ques = newQuestions[i];

    if (!ques || !ques.qp || !ques.qp.question) continue;

    var globalIndex = i + startIndex;

    var div = document.createElement("div");
    div.className = `question-row mb-4`;
    div.setAttribute("onclick", `onQuestionClick(${globalIndex})`);

    div.innerHTML = `
      <div class="question-number">
        <p>${getQuestionNumber(globalIndex)}</p>
      </div>
      <div class="question-body">
        <div class="question-title">${ques.qp.question.text}</div>
      </div>
    `;

    root.appendChild(div);
  }

  setTypeset();
}
//function appendQuestions(newQuestionsObj) {
//  const newQuestions = newQuestionsObj.data || [];
//  const root = document.getElementById("root");
//
//  for (var i in newQuestions) {
//    var ques = newQuestions[i];
//    var div = document.createElement("div");
//    div.className = `question-row question-row-${i} mb-4`;
//    div.setAttribute("onclick", `onQuestionClick(${i})`);
//
//    const questionNumber = getQuestionNumber(i);
//    const questionText = ques.qp.question.text || "";
//
//    div.innerHTML = `
//      <div class="question-number">
//        <p>${questionNumber}</p>
//      </div>
//      <div class="question-body">
//        <div class="question-title">${questionText}</div>
//      </div>
//    `;
//
//    root.appendChild(div);
//  }
//
//  setTypeset(); // rendering math again
//}

window.addEventListener("scroll", function () {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const fullHeight = document.documentElement.scrollHeight;
  const distanceFromBottom = fullHeight - (scrollTop + windowHeight);

  // Enhanced debugging
  if (typeof Android !== "undefined" && Android.logMessage) {
    Android.logMessage(
      `Scroll Debug - scrollTop: ${scrollTop}, windowHeight: ${windowHeight}, fullHeight: ${fullHeight}, distanceFromBottom: ${distanceFromBottom}`,
    );
  }

  if (scrollTop + windowHeight >= fullHeight - 100) {
    if (typeof Android !== "undefined" && Android.logMessage) {
      Android.logMessage("Scroll end reached! Calling onScrollEndReached()");
    }

    if (typeof Android !== "undefined" && Android.onScrollEndReached) {
      Android.onScrollEndReached();
    } else {
      console.log(
        "Android interface not available or onScrollEndReached method missing",
      );
    }
  }
});

// // DUMMY RESPONSE WITH NOTES
// const comprehensiveDummyResponse = {
//   success: true,
//   message: "Details of requested notebook fetched.",
//   filters: {
//     offset: 0,
//     limit: 25,
//     sortBy: "-dateAdded",
//     tags: "all",
//   },
//   data: {
//     title: "Hard Questions",
//     showing: 8,
//     total: 8,
//     questions: [
//       // Question 1: With note, multiple tags, has labels
//       {
//         dateAdded: "2026-04-22T05:02:07.382Z",
//         qp: {
//           type: "singleCorrect",
//           previousYearPapers: [],
//           question: {
//             text: "The term 'systematics' refers to:",
//             image: null,
//           },
//           questionId: "68cd4926f867cabb6ddf324d",
//           questionLabels: [
//             {
//               title: "Concept",
//               value: "systematics",
//               isVisible: true,
//             },
//             {
//               title: "Chapter",
//               value: "Chapter 1",
//               isVisible: true,
//             },
//           ],
//         },
//         tags: [
//           { _id: "61613dab9a93b515ccc8cb29", title: "Hard" },
//           { _id: "61613da59a93b515ccc8cb28", title: "Easy" },
//           { _id: "61613daa9a93b515ccc8cb30", title: "Must Do" },
//         ],
//         myNote:
//           "Try RD Sharma method to solve the question, NCERT method is very tough and length for this question so stick to that metho",
//         hasNote: true,
//         nqdId: "69e8564f8f05193c726d29b4",
//       },

//       // Question 2: With note, single tag
//       {
//         dateAdded: "2026-04-22T05:01:58.510Z",
//         qp: {
//           type: "singleCorrect",
//           previousYearPapers: [],
//           question: {
//             text: "As we go from species to kingdom in a taxonomic hierarchy, the number of common characteristics",
//             image: null,
//           },
//           questionId: "68cd4926f867cabb6ddf324c",
//           questionLabels: [
//             {
//               title: "Concept",
//               value: "kingdom",
//               isVisible: true,
//             },
//           ],
//         },
//         tags: [{ _id: "61613dab9a93b515ccc8cb29", title: "Hard" }],
//         myNote:
//           "This question requires understanding of taxonomic hierarchy and classification system",
//         hasNote: true,
//         nqdId: "69e856468f05193c726d2983",
//       },

//       // Question 3: No note, no labels, has tags
//       {
//         dateAdded: "2026-04-22T05:01:49.429Z",
//         qp: {
//           type: "singleCorrect",
//           previousYearPapers: [],
//           question: {
//             text: "Select the incorrect statement out of the following",
//             image: null,
//           },
//           questionId: "68cd4b0e7d9a817653a285cd",
//           questionLabels: [],
//         },
//         tags: [
//           { _id: "61613da59a93b515ccc8cb28", title: "Easy" },
//           { _id: "61613dac9a93b515ccc8cb31", title: "Revision" },
//         ],
//         myNote: null,
//         hasNote: false,
//         nqdId: "69e8563d8f05193c726d2957",
//       },

//       // Question 4: No note, no labels, single tag
//       {
//         dateAdded: "2026-04-22T05:01:40.147Z",
//         qp: {
//           type: "singleCorrect",
//           previousYearPapers: [],
//           question: {
//             text: "What does the following figure represent?",
//             image: null,
//           },
//           questionId: "68cd4b0e7d9a817653a285cc",
//           questionLabels: [],
//         },
//         tags: [{ _id: "61613da59a93b515ccc8cb28", title: "Easy" }],
//         myNote: null,
//         hasNote: false,
//         nqdId: "69e856348f05193c726d2926",
//       },

//       // Question 5: With long note, multiple tags and labels
//       {
//         dateAdded: "2026-04-22T04:53:24.286Z",
//         qp: {
//           type: "singleCorrect",
//           previousYearPapers: [],
//           question: {
//             text: "What is tissue in multicellular animals?",
//             image: null,
//           },
//           questionId: "68cd49a82cca42d8c2062327",
//           questionLabels: [
//             {
//               title: "Concept",
//               value: "animal tissues",
//               isVisible: true,
//             },
//             {
//               title: "Chapter",
//               value: "Chapter 7",
//               isVisible: true,
//             },
//             {
//               title: "Page",
//               value: "79",
//               isVisible: true,
//             },
//           ],
//         },
//         tags: [
//           { _id: "61613da59a93b515ccc8cb28", title: "Easy" },
//           { _id: "61613dab9a93b515ccc8cb29", title: "Hard" },
//           { _id: "61613dac9a93b515ccc8cb31", title: "Important" },
//         ],
//         myNote:
//           "Tissue is a group of similar cells that work together to perform a specific function. There are four main types: epithelial, connective, muscle, and nervous tissues.",
//         hasNote: true,
//         nqdId: "69e854448f05193c726d1f8b",
//       },

//       // Question 6: No note, multiple tags
//       {
//         dateAdded: "2026-04-22T04:52:24.035Z",
//         qp: {
//           type: "singleCorrect",
//           previousYearPapers: [],
//           question: {
//             text: "In unicellular organisms, which cell functions are performed by a single cell?",
//             image: null,
//           },
//           questionId: "68cd49a82cca42d8c2062326",
//           questionLabels: [],
//         },
//         tags: [
//           { _id: "61613da59a93b515ccc8cb28", title: "Easy" },
//           { _id: "61613dab9a93b515ccc8cb29", title: "Hard" },
//         ],
//         myNote: null,
//         hasNote: false,
//         nqdId: "69e854088f05193c726d1df7",
//       },

//       // Question 7: With note - no tags but has labels
//       {
//         dateAdded: "2026-04-20T20:42:58.665Z",
//         qp: {
//           type: "numerical",
//           previousYearPapers: [],
//           question: {
//             text: "If two vectors make an angle with each other, find the value of n",
//             image: null,
//           },
//           questionId: "66446752970e6e9ab542d23b",
//           questionLabels: [
//             {
//               title: "Type",
//               value: "Numerical",
//               isVisible: true,
//             },
//           ],
//         },
//         tags: [],
//         myNote:
//           "Use vector algebra and dot product formula to solve this problem",
//         hasNote: true,
//         nqdId: "69e68fd23dfd2d8fd28a1c40",
//       },

//       // Question 8: Long custom note to test truncation
//       {
//         dateAdded: "2026-04-20T05:05:44.043Z",
//         qp: {
//           type: "singleCorrect",
//           previousYearPapers: [],
//           question: {
//             text: "In the given circuit diagram, find the heat generated on closing the switch S",
//             image: null,
//           },
//           questionId: "67c995f5cc180496584ee22c",
//           questionLabels: [],
//         },
//         tags: [
//           { _id: "61613dab9a93b515ccc8cb29", title: "Hard" },
//           { _id: "61613dac9a93b515ccc8cb31", title: "Critical" },
//         ],
//         myNote:
//           "This is a very long note that should be truncated to one line. Remember to use energy conservation principle and calculate the energy stored in capacitor before and after closing the switch.",
//         hasNote: true,
//         nqdId: "69e5b42842acfeb147e68b24",
//       },
//     ],
//   },
// };

// // Call with comprehensive data
// populateQuestions(
//   comprehensiveDummyResponse,
//   "notebookListing",
//   "light",
//   "all",
// );
