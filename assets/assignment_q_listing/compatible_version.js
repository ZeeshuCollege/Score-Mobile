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
function getQuestionNumber(num) {
  if (Number(num) < 9) return "0".concat(Number(num) + 1);
  return Number(num) + 1;
}
function populateQuestions(questions, theme, filterValue) {
  var body = document.querySelector("body");
  if (theme === "dark") {
    if (!body.classList.contains("dark_mode")) body.classList.add("dark_mode");
  } else body.classList.remove("dark_mode");
  var questionsHtml = "";
  var _loop = function _loop() {
    var ques = questions.data[i];

    // Generate options HTML if they exist
    var optionsHtml = "";
    if (ques.options && ques.options.length > 0) {
      optionsHtml = '<div class="question-options">';
      ques.options.forEach(function (option, index) {
        var optionLetter = String.fromCharCode(65 + index);
        optionsHtml += "\n          <div class=\"option-row\">\n            <div class=\"option-letter\">".concat(optionLetter, "</div>\n            <span class=\"css-dot\"></span>\n            <div class=\"option-text\">").concat(option.text, "</div>\n          </div>\n        ");
      });
      optionsHtml += "</div>";
    }
    questionsHtml += "\n      <div class=\"question-row\" onclick=\"onQuestionClick(".concat(i, ")\">\n        <div class=\"question-number\">\n          <p>").concat(getQuestionNumber(i), ".</p>\n        </div>\n        <div class=\"question-body\">\n          <p class=\"question-title full-question\">").concat(ques.questionText, "</p>\n          ").concat(optionsHtml, "\n        </div>\n      </div>\n    ");
  };
  for (var i in questions.data) {
    _loop();
  }
  root.innerHTML = questionsHtml;
  setTypeset();
}
function getYears(years) {
  var labels = [];
  if (years.length > 0) {
    if (years.length <= 1) {
      labels.push(years[0].title);
    } else {
      for (var i = 0; i < years.title; i++) {
        labels.push(years[i].title);
      }
    }
  }
  return labels.join(", ");
}
function onQuestionClick(index) {
  Android.onQuestionClicked("".concat(index));
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
// const questions = {
//   data: [
//     {
//       _id: "6120f3853b667c28b313cee5",
//       questionText:
//         'Match List I with List II.\n<img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/LqPAMr4uBkEY9akwTiu09yqnNDwXAAFZNaJqc1A_H8s.original.fullsize.png">',
//       type: "singleCorrect",
//       options: [
//         {
//           id: "dtfF2",
//           text: "$(a) \\rightarrow(i v),(b) \\rightarrow(i),(c) \\rightarrow(i i i),(d) \\rightarrow$ (ii)",
//           image: null,
//         },
//         {
//           id: "GN1Vs",
//           text: "(a) $\\rightarrow$ (iv), (b) $\\rightarrow$ (iii) , (c) $\\rightarrow$ (i), (d) $\\rightarrow$ (ii)",
//           image: null,
//         },
//         {
//           id: "cPaAt",
//           text: "(a) $\\rightarrow$ (iii), (b) $\\rightarrow$ (ii), (c) $\\rightarrow$ (iv), (d) $\\rightarrow$ (i)",
//           image: null,
//         },
//         {
//           id: "NSSkd",
//           text: "(a) $\\rightarrow$ (i), (b) $\\rightarrow$ (iv), (c) $\\rightarrow$ (ii), (d) $\\rightarrow$ (iii)",
//           image: null,
//         },
//       ],
//       previousYearPapers: [
//         {
//           _id: "615d92edde3d91842a5cf817",
//           title: "JEE Main 2021 (25 Jul Shift 1)",
//           shortName: "2021 (25 Jul Shift 1)",
//           isVisible: true,
//           heldOn: "2021-07-25T09:00:00.000Z",
//         },
//       ],
//       questionLabels: [],
//     },
//     {
//       _id: "6120f385927d25e97150ce3c",
//       questionText:
//         "Three students $\\mathrm{S}_{1}, \\mathrm{~S}_{2}$ and $\\mathrm{S}_{3}$ perform an experiment for determining the acceleration due to gravity $(\\mathrm{g})$ using a simple pendulum. They use different lengths of pendulum and record time for different number of oscillations. The observations are as shown in the table.\n\\begin{array}{|c|c|c|c|c|}\n\\hline Student No. & Length of pendulum (\\mathrm{cm}) & No. of oscillations (\\mathrm{n}) & Total time for n oscillations & Time period (\\mathrm{s}) \\\\\n\\hline 1 . & 64.0 & 8 & 128.0 & 16.0 \\\\\n\\hline 2 . & 64.0 & 4 & 64.0 & 16.0 \\\\\n\\hline 3 . & 20.0 & 4 & 36.0 & 9.0 \\\\\n\\hline\n\\end{array} \n(Least count of length $=0.1 \\mathrm{~m}$ least count for time $=0.1 \\mathrm{~s}$ ) If $E_{1}, E_{2}$ and $E_{3}$ are the percentage errors in 'g' for students 1,2 and 3 respectively, then the minimum percentage error is obtained by student no. ____.",
//       type: "numerical",
//       options: [],
//       previousYearPapers: [
//         {
//           _id: "615d92edde3d91842a5cf816",
//           title: "JEE Main 2021 (22 Jul Shift 1)",
//           shortName: "2021 (22 Jul Shift 1)",
//           isVisible: true,
//           heldOn: "2021-07-22T09:00:00.000Z",
//         },
//       ],
//       questionLabels: [],
//     },
//     {
//       _id: "6120f385a302916b855f4e5b",
//       questionText:
//         "Two vectors $\\vec{X}$ and $\\vec{Y}$ have equal magnitude. The magnitude of $(\\overrightarrow{\\mathrm{X}}-\\overrightarrow{\\mathrm{Y}})$ is $\\mathrm{n}$ times the magnitude of\n$(\\vec{X}+\\bar{Y})$. The angle between $\\vec{X}$ and $\\vec{Y}$ is :",
//       type: "singleCorrect",
//       options: [
//         {
//           id: "A32JV",
//           text: "$\\cos ^{-1}\\left(\\frac{-n^{2}-1}{n^{2}-1}\\right)$",
//           image: null,
//         },
//         {
//           id: "1f3ZP",
//           text: "$\\cos ^{-1}\\left(\\frac{\\mathrm{n}^{2}-1}{-\\mathrm{n}^{2}-1}\\right)$",
//           image: null,
//         },
//         {
//           id: "fRLkF",
//           text: "$\\cos ^{-1}\\left(\\frac{\\mathrm{n}^{2}+1}{-\\mathrm{n}^{2}-1}\\right) \\quad$",
//           image: null,
//         },
//         {
//           id: "k5V7F",
//           text: "$\\cos ^{-1}\\left(\\frac{\\mathrm{n}^{2}+1}{\\mathrm{n}^{2}-1}\\right)$",
//           image: null,
//         },
//       ],
//       previousYearPapers: [
//         {
//           _id: "615d92edde3d91842a5cf818",
//           title: "JEE Main 2021 (25 Jul Shift 2)",
//           shortName: "2021 (25 Jul Shift 2)",
//           isVisible: true,
//           heldOn: "2021-07-25T14:00:00.000Z",
//         },
//       ],
//       questionLabels: [],
//     },
//     {
//       _id: "6120f385bc3d6b8cfe7b10fb",
//       questionText:
//         "A physical quantity 'y' is represented by the formula $\\mathrm{y}=\\mathrm{m}^{2} \\mathrm{r}^{-4} \\mathrm{~g}^{\\mathrm{x}} l^{-\\frac{3}{2}}$\nIf the percentage errors found in $\\mathrm{y}, \\mathrm{m}, \\mathrm{r}, l$ and $\\mathrm{g}$ are $18,1,0.5,4$ and p respectively, then find the value of $\\mathrm{x}$ and $\\mathrm{p}$.",
//       type: "singleCorrect",
//       options: [
//         {
//           id: "oTJpv",
//           text: "5 and $\\pm 2$",
//           image: null,
//         },
//         {
//           id: "PXaAm",
//           text: "4 and $\\pm 3$",
//           image: null,
//         },
//         {
//           id: "OlIZB",
//           text: "$\\frac{16}{3}$ and $\\pm \\frac{3}{2}$",
//           image: null,
//         },
//         {
//           id: "nrS9A",
//           text: "8 and $\\pm 2$",
//           image: null,
//         },
//       ],
//       previousYearPapers: [
//         {
//           _id: "615d92edde3d91842a5cf81a",
//           title: "JEE Main 2021 (27 Jul Shift 2)",
//           shortName: "2021 (27 Jul Shift 2)",
//           isVisible: true,
//           heldOn: "2021-07-27T14:00:00.000Z",
//         },
//       ],
//       questionLabels: [],
//     },
//     {
//       _id: "6120f385d5fb240b8b2f5768",
//       questionText:
//         "Three particles $\\mathrm{P}, \\mathrm{Q}$ and $\\mathrm{R}$ are moving along the vectors $\\quad \\overrightarrow{\\mathrm{A}}=\\hat{\\mathrm{i}}+\\hat{\\mathrm{j}}, \\overrightarrow{\\mathrm{B}}=\\hat{\\mathrm{j}}+\\hat{\\mathrm{k}} \\quad$ and $\\quad \\overrightarrow{\\mathrm{C}}=-\\hat{\\mathrm{i}}+\\hat{\\mathrm{j}}$ respectively. They strike on a point and start to\nmove in different directions. Now particle $\\mathrm{P}$ is moving normal to the plane which contains vector $\\overrightarrow{\\mathrm{A}}$ and $\\overrightarrow{\\mathrm{B}}$. Similarly particle $\\mathrm{Q}$ is moving normal to the plane which contains vector $\\overrightarrow{\\mathrm{A}}$ and $\\overrightarrow{\\mathrm{C}}$. The angle between the direction of motion of $\\mathrm{P}$ and $\\mathrm{Q}$ is $\\cos ^{-1}\\left(\\frac{1}{\\sqrt{x}}\\right) .$ Then the value of $x$ is _____.",
//       type: "numerical",
//       options: [],
//       previousYearPapers: [
//         {
//           _id: "615d92edde3d91842a5cf816",
//           title: "JEE Main 2021 (22 Jul Shift 1)",
//           shortName: "2021 (22 Jul Shift 1)",
//           isVisible: true,
//           heldOn: "2021-07-22T09:00:00.000Z",
//         },
//       ],
//       questionLabels: [],
//     },
//     {
//       _id: "6120f385fed4ddcf935c5091",
//       questionText:
//         "What will be the projection of vector $\\overrightarrow{\\mathrm{A}}=\\hat{\\mathrm{i}}+\\hat{\\mathrm{j}}+\\hat{\\mathrm{k}}$\non vector $\\overrightarrow{\\mathrm{B}}=\\hat{\\mathrm{i}}+\\hat{\\mathrm{j}}$ ?",
//       type: "singleCorrect",
//       options: [
//         {
//           id: "LXGhW",
//           text: "$\\sqrt{2}(\\hat{\\mathrm{i}}+\\hat{\\mathrm{j}}+\\hat{\\mathrm{k}})$",
//           image: null,
//         },
//         {
//           id: "8poBF",
//           text: "$2(\\hat{\\mathrm{i}}+\\hat{\\mathrm{j}}+\\hat{\\mathrm{k}})$",
//           image: null,
//         },
//         {
//           id: "l2CoO",
//           text: "$\\sqrt{2}(\\hat{\\mathrm{i}}+\\hat{\\mathrm{j}})$",
//           image: null,
//         },
//         {
//           id: "lEhSb",
//           text: "$(\\hat{\\mathrm{i}}+\\hat{\\mathrm{j}})$",
//           image: null,
//         },
//       ],
//       previousYearPapers: [
//         {
//           _id: "615d92edde3d91842a5cf816",
//           title: "JEE Main 2021 (22 Jul Shift 1)",
//           shortName: "2021 (22 Jul Shift 1)",
//           isVisible: true,
//           heldOn: "2021-07-22T09:00:00.000Z",
//         },
//       ],
//       questionLabels: [],
//     },
//     {
//       _id: "612e26aa51edd60d8afc6041",
//       questionText:
//         'The time period of a simple pendulum is given by <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>T</mi><mo>=</mo><mn>2</mn><mi>&#960;</mi><msqrt><mfrac><mi>&#8467;</mi><mi>g</mi></mfrac></msqrt><mo>.</mo></math>&nbsp;The measured value of the length of pendulum is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>10</mn><mo>&#160;</mo><mi>cm</mi></math> known to a <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi>mm</mi></math> accuracy. The time for <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>200</mn></math> oscillations of the pendulum is found to be <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>100</mn></math> second using a clock of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mi mathvariant="normal">s</mi></math> resolution. The percentage accuracy in the determination of <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>\'</mo><mi>g</mi><mo>\'</mo></math> using this pendulum is <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>\'</mo><mi>x</mi><mo>\'</mo><mo>.</mo></math> The value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>\'</mo><mi>x</mi><mo>\'</mo></math> to the nearest integer is:-',
//       type: "singleCorrect",
//       options: [
//         {
//           id: "l7mnX",
//           text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mo>%</mo></math>',
//           image: null,
//         },
//         {
//           id: "5miUx",
//           text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn><mo>%</mo></math>',
//           image: null,
//         },
//         {
//           id: "W9g4o",
//           text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>5</mn><mo>%</mo></math>',
//           image: null,
//         },
//         {
//           id: "OCUNN",
//           text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>4</mn><mo>%</mo></math>',
//           image: null,
//         },
//       ],
//       previousYearPapers: [
//         {
//           _id: "615d92edde3d91842a5cf812",
//           title: "JEE Main 2021 (18 Mar Shift 1)",
//           shortName: "2021 (18 Mar Shift 1)",
//           isVisible: true,
//           heldOn: "2021-03-18T09:00:00.000Z",
//         },
//       ],
//       questionLabels: [],
//     },
//     {
//       _id: "612e26aab0c3dace230c423b",
//       questionText:
//         'In order to determine the Young&#39;s Modulus of a wire of radius <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>2</mn><mo>&#160;</mo><mi>cm</mi></math> (measured using a scale of least count <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>=</mo><mn>0</mn><mo>.</mo><mn>001</mn><mo>&#160;</mo><mi>cm</mi></math>) and length <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">m</mi></math>&nbsp;&nbsp;(measured using a scale of least count <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>=</mo><mn>1</mn><mo>&#160;</mo><mi>mm</mi></math>), a weight of mass <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi>kg</mi></math> (measured using a scale of least count <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>=</mo><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">g</mi></math> ) was hanged to get the elongation of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>5</mn><mo>&#160;</mo><mi>cm</mi></math> (measured using a scale of least count<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>001</mn><mo>&#160;</mo><mi>cm</mi></math>). What will be the fractional error in the value of Young&#39;s Modulus determined by this experiment?',
//       type: "singleCorrect",
//       options: [
//         {
//           id: "WO1VX",
//           text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>14</mn><mo>%</mo></math>',
//           image: null,
//         },
//         {
//           id: "Ces89",
//           text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>9</mn><mo>%</mo></math>',
//           image: null,
//         },
//         {
//           id: "OBowK",
//           text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>9</mn><mo>%</mo></math>',
//           image: null,
//         },
//         {
//           id: "q563i",
//           text: '<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>.</mo><mn>4</mn><mo>%</mo></math>',
//           image: null,
//         },
//       ],
//       previousYearPapers: [
//         {
//           _id: "615d92edde3d91842a5cf80f",
//           title: "JEE Main 2021 (16 Mar Shift 2)",
//           shortName: "2021 (16 Mar Shift 2)",
//           isVisible: true,
//           heldOn: "2021-03-16T14:00:00.000Z",
//         },
//       ],
//       questionLabels: [],
//     },
//     {
//       _id: "614997311e43526e8c8852de",
//       questionText:
//         'The angle between vector $(\\overrightarrow{\\mathrm{A}})$ and $(\\overrightarrow{\\mathrm{A}}-\\overrightarrow{\\mathrm{B}})$ is :<br><img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/5ow5R-mq0Zo4Y5g1Nwtmie2uB1Lk4hVtiKNqtOWSj-g.original.fullsize.png">',
//       type: "singleCorrect",
//       options: [
//         {
//           id: "cWG8x",
//           text: "$\\tan ^{-1}\\left(\\frac{-\\frac{B}{2}}{A-B \\frac{\\sqrt{3}}{2}}\\right)$",
//           image: null,
//         },
//         {
//           id: "4Avm9",
//           text: "$\\tan ^{-1}\\left(\\frac{\\mathrm{A}}{0.7 \\mathrm{~B}}\\right)$",
//           image: null,
//         },
//         {
//           id: "eGD0p",
//           text: "$\\tan ^{-1}\\left(\\frac{\\sqrt{3} \\mathrm{~B}}{2 \\mathrm{~A}-\\mathrm{B}}\\right)$",
//           image: null,
//         },
//         {
//           id: "uEurk",
//           text: "$\\tan ^{-1}\\left(\\frac{\\mathrm{B} \\cos \\theta}{\\mathrm{A}-\\mathrm{B} \\sin \\theta}\\right)$",
//           image: null,
//         },
//       ],
//       previousYearPapers: [
//         {
//           _id: "615d92edde3d91842a5cf81c",
//           title: "JEE Main 2021 (26 Aug Shift 2)",
//           shortName: "2021 (26 Aug Shift 2)",
//           isVisible: true,
//           heldOn: "2021-08-26T14:00:00.000Z",
//         },
//       ],
//       questionLabels: [],
//     },
//     {
//       _id: "6149973190771d95720a2d18",
//       questionText:
//         "If the length of the pendulum in pendulum clock increases by $0.1 \\%$, then the error in time per day is",
//       type: "singleCorrect",
//       options: [
//         {
//           id: "JpWiW",
//           text: "$86.4 \\mathrm{~s}$",
//           image: null,
//         },
//         {
//           id: "sfatF",
//           text: "$4.32 \\mathrm{~s}$",
//           image: null,
//         },
//         {
//           id: "bVeZc",
//           text: "$43.2 \\mathrm{~s}$",
//           image: null,
//         },
//         {
//           id: "yI6VX",
//           text: "$8.64 \\mathrm{~s}$",
//           image: null,
//         },
//       ],
//       previousYearPapers: [
//         {
//           _id: "615d92edde3d91842a5cf81c",
//           title: "JEE Main 2021 (26 Aug Shift 2)",
//           shortName: "2021 (26 Aug Shift 2)",
//           isVisible: true,
//           heldOn: "2021-08-26T14:00:00.000Z",
//         },
//       ],
//       questionLabels: [],
//     },
//   ],
// };
// populateQuestions(questions, "dark");
// populateQuestions(questions, "light");