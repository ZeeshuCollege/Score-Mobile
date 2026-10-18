'use strict';

// var Android = {
//   toggleShow: function (toggle) {
//     Android.toast('Toggled: ', toggle);
//   },
//   showToast: function (message) {
//     console.log(message);
//   },
//   logMessage: function (message) {
//     console.log(message);
//   },
//   onQuestionClick: function (e) {
//     Android.showToast('Question clicked: ' + e);
//   },
//   onOptionSelected: function (obj) {
//     Android.showToast('Option selected: ' + obj);
//   },
//   onShowSolutions: function () {
//     Android.showToast('Scrolling down to solution.');
//   },
//   showReport: function () {
//     Android.showToast('Report-question error box opens.');
//   },
// };
function getQuestionNumber(num) {
  if (Number(num) < 9) return "0".concat(Number(num) + 1);
  return Number(num) + 1;
}
function getAnswerStatus(isAttempted, evalStatus) {
  Android.logMessage("status: ".concat(evalStatus));
  Android.logMessage("isAttempted: ".concat(isAttempted));
  if (isAttempted) {
    if (evalStatus !== 'incorrect') {
      return "<img height=\"7px\" width=\"20px\" src=\"check.png\" alt=\"correct\" style=\"object-fit: contain\" />";
    } else {
      return "<img height=\"7px\" width=\"20px\" src=\"cross.png\" alt=\"wrong\" style=\"object-fit: contain\"/>";
    }
  } else {
    return '';
  }
  return '';
}
function populateQuestions(questions, theme, filterValue) {
  var questionLength = questions.length;
  var allEl = '';
  var body = document.querySelector('body');
  if (theme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');
  for (var i = 0; i < questionLength; i++) {
    var question = questions[i];
    console.log('QuestionLog: ', question);
    allEl += "\n                <div class=\"row question-row\" onclick=\"onQuestionClick(".concat(i, ")\">\n                    <div class=\"col-2 px-1\">\n                        <!-- Center below div vertically -->\n                        <div class=\"d-flex justify-content-center align-items-center\">\n                            <div class=\"\">\n                                <p id=\"questionNumber\" class=\"my-2 question-number\">").concat(getQuestionNumber(i), "</p>\n                                <span class=\"questionStatus d-flex justify-content-center\">\n                                    ").concat(getAnswerStatus(question.isAttempted, question.evalStatus), "\n                                </span>\n                            </div>\n                        </div>\n                    </div>\n                    <div class=\"col-10 px-0\">\n                        <p class=\"questionText\">").concat(question.title.text, "</p>\n                    </div>\n                </div>\n            ");
  }
  // const listContainer = document.getElementById("listContainer");
  root.innerHTML = allEl;
  setTypeset();
}
function onQuestionClick(index) {
  Android.onQuestionClick(index);
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
      preview: 'none'
    }
  });
  MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
}
// const questions = [
//   {
//     _id: '648b5a71417cc3fb48d68706',
//     exams: [],
//     subjects: [],
//     chapters: [],
//     isAttempted: false,
//     evalStatus: 'notAttempted',
//     lastPractised: '',
//     title: {
//       text: 'A <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>12</mn><mo>&#160;</mo><mi mathvariant="normal">V</mi></math> battery connected to a coil of resistance <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>6</mn><mo>&#160;</mo><mo>&#8486;</mo></math> through a switch, drives a constant current in the circuit. The switch is opened in <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi>ms</mi></math>. The emf induced across the coil is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>20</mn><mo>&#160;</mo><mi mathvariant="normal">V</mi></math>. The inductance of the coil is :',
//       image: null,
//     },
//     questionType: 'singleCorrect',
//     yearsAppeared: [
//       {
//         _id: '648b5a3a0d9d0b909f7b6497',
//         exams: [],
//         subjects: [],
//         chapters: [],
//         title: 'JEE Main 2023 (15 Apr Shift 1)',
//         heldOn: '2023-04-15T09:00:00.000Z',
//       },
//     ],
//     previousYear: '2023-04-15T09:00:00.000Z',
//     questionLabels: [
//       {
//         isVisible: false,
//         title: 'Topic',
//         value: "Magnetic Flux, Faraday's and Lenz law",
//       },
//       {
//         isVisible: false,
//         title: 'Concept',
//         value: "Lenz's Law",
//       },
//     ],
//   },
//   {
//     _id: '648b5a71417cc3fb48d6871f',
//     exams: [],
//     subjects: [],
//     chapters: [],
//     isAttempted: false,
//     evalStatus: 'notAttempted',
//     lastPractised: '',
//     title: {
//       text: '<p>A <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>20</mn><mo>&#160;</mo><mi>cm</mi></math>&nbsp;long metallic rod is rotated with <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>210</mn><mo>&#160;</mo><mi>rpm</mi></math> about an axis normal to the rod passing through its one end. The other end of the rod is in contact with a circular metallic ring. A constant and uniform magnetic field <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>2</mn><mo>&#160;</mo><mi mathvariant="normal">T</mi></math> parallel to the axis exists everywhere. The emf developed between the centre and the ring is _________<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>mV</mi></math>.</p><p>(Take&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#960;</mi><mo>=</mo><mfrac><mn>22</mn><mn>7</mn></mfrac></math>)</p>',
//       image: null,
//     },
//     questionType: 'numerical',
//     yearsAppeared: [
//       {
//         _id: '648b5a3a0d9d0b909f7b6497',
//         exams: [],
//         subjects: [],
//         chapters: [],
//         title: 'JEE Main 2023 (15 Apr Shift 1)',
//         heldOn: '2023-04-15T09:00:00.000Z',
//       },
//     ],
//     previousYear: '2023-04-15T09:00:00.000Z',
//     questionLabels: [
//       {
//         isVisible: false,
//         title: 'Topic',
//         value: 'Motional and Rotational EMF',
//       },
//       {
//         isVisible: false,
//         title: 'Concept',
//         value: 'Motional EMI due to rotational motion',
//       },
//     ],
//   },
//   {
//     _id: '648b5a71417cc3fb48d686c7',
//     exams: [],
//     subjects: [],
//     chapters: [],
//     isAttempted: false,
//     evalStatus: 'notAttempted',
//     lastPractised: '',
//     title: {
//       text: 'An insulated copper wire of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>100</mn></math>&nbsp;turns is wrapped around a wooden cylindrical core of the cross-sectional area <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>24</mn><mo>&#160;</mo><msup><mi>cm</mi><mn>2</mn></msup></math>. The two ends of the wire are connected to a resistor. The total resistance in the circuit is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>12</mn><mo>&#160;</mo><mi mathvariant="normal">&#937;</mi></math>. If an externally applied uniform magnetic field in the core along its axis changes from <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>.</mo><mn>5</mn><mo>&#160;</mo><mi mathvariant="normal">T</mi></math> in one direction to <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>.</mo><mn>5</mn><mo>&#160;</mo><mi mathvariant="normal">T</mi></math> in the opposite direction, the charge flowing through a point in the circuit during the change of magnetic field will be _____ <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>mC</mi></math>.',
//       image: null,
//     },
//     questionType: 'numerical',
//     yearsAppeared: [
//       {
//         _id: '648b5a3a0d9d0b909f7b6495',
//         exams: [],
//         subjects: [],
//         chapters: [],
//         title: 'JEE Main 2023 (13 Apr Shift 2)',
//         heldOn: '2023-04-13T14:00:00.000Z',
//       },
//     ],
//     previousYear: '2023-04-13T14:00:00.000Z',
//     questionLabels: [
//       {
//         isVisible: false,
//         title: 'Topic',
//         value: "Magnetic Flux, Faraday's and Lenz law",
//       },
//       {
//         isVisible: false,
//         title: 'Concept',
//         value: "Lenz's Law",
//       },
//     ],
//   },
//   {
//     _id: '648b5a71417cc3fb48d6865e',
//     exams: [],
//     subjects: [],
//     chapters: [],
//     isAttempted: false,
//     evalStatus: 'notAttempted',
//     lastPractised: '',
//     title: {
//       text: '<p>The source of time varying magnetic field may be</p><p>(A) a permanent magnet</p><p>(B) an electric field changing linearly with time</p><p>(C) direct current</p><p>(D) a decelerating charge particle</p><p>(E) an antenna fed with a digital signal</p><p>Choose the correct answer from the options given below.</p>',
//       image: null,
//     },
//     questionType: 'singleCorrect',
//     yearsAppeared: [
//       {
//         _id: '648b5a3a0d9d0b909f7b6494',
//         exams: [],
//         subjects: [],
//         chapters: [],
//         title: 'JEE Main 2023 (13 Apr Shift 1)',
//         heldOn: '2023-04-13T09:00:00.000Z',
//       },
//     ],
//     previousYear: '2023-04-13T09:00:00.000Z',
//     questionLabels: [
//       {
//         isVisible: false,
//         title: 'Topic',
//         value: 'Induced Electric Field',
//       },
//       {
//         isVisible: false,
//         title: 'Concept',
//         value: 'Induced Electric Field',
//       },
//     ],
//   },
//   {
//     _id: '648b5a71417cc3fb48d68666',
//     exams: [],
//     subjects: [],
//     chapters: [],
//     isAttempted: false,
//     evalStatus: 'notAttempted',
//     lastPractised: '',
//     title: {
//       text: '<p>In the given figure, an inductor&nbsp;and resistor are connected in series with a battery of&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>emf</mi></math>&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>E</mi></math>&nbsp;volt.&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><msup><mi>E</mi><mi>a</mi></msup><mrow><mn>2</mn><mi>b</mi></mrow></mfrac><mo>&#160;</mo><mi mathvariant="normal">J</mi><mo>&#160;</mo><msup><mi mathvariant="normal">s</mi><mrow><mo>-</mo><mn>1</mn></mrow></msup></math>&nbsp;represents the maximum rate at which the energy is stored in the magnetic field&nbsp;(inductor). The numerical value of&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mi>b</mi><mi>a</mi></mfrac></math>&nbsp;will be _____.</p><p style="text-align: center;"><img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/a75be6cd-840c-45db-ae10-cfea5230d182.png" style="width: 300px; height: 186px;" /></p>',
//       image: null,
//     },
//     questionType: 'numerical',
//     yearsAppeared: [
//       {
//         _id: '648b5a3a0d9d0b909f7b6494',
//         exams: [],
//         subjects: [],
//         chapters: [],
//         title: 'JEE Main 2023 (13 Apr Shift 1)',
//         heldOn: '2023-04-13T09:00:00.000Z',
//       },
//     ],
//     previousYear: '2023-04-13T09:00:00.000Z',
//     questionLabels: [
//       {
//         isVisible: false,
//         title: 'Topic',
//         value: 'Inductance',
//       },
//       {
//         isVisible: false,
//         title: 'Concept',
//         value: 'Energy stored in inductor',
//       },
//     ],
//   },
//   {
//     _id: '648b5a71417cc3fb48d6860e',
//     exams: [],
//     subjects: [],
//     chapters: [],
//     isAttempted: false,
//     evalStatus: 'notAttempted',
//     lastPractised: '',
//     title: {
//       text: '<p>A conducting circular loop is placed in a uniform magnetic field of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>4</mn><mo>&#160;</mo><mi mathvariant="normal">T</mi></math> with its plane perpendicular to the field. Somehow, the radius of the loop starts expanding at a constant rate of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi>mm</mi><mo>&#160;</mo><msup><mi mathvariant="normal">s</mi><mrow><mo>-</mo><mn>1</mn></mrow></msup></math>. The magnitude of induced emf in the loop at an instant when the radius of the loop is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mo>&#160;</mo><mi>cm</mi></math> will be _______&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#956;V</mi></math>.</p>',
//       image: null,
//     },
//     questionType: 'numerical',
//     yearsAppeared: [
//       {
//         _id: '648b5a3a0d9d0b909f7b6496',
//         exams: [],
//         subjects: [],
//         chapters: [],
//         title: 'JEE Main 2023 (12 Apr Shift 1)',
//         heldOn: '2023-04-12T09:00:00.000Z',
//       },
//     ],
//     previousYear: '2023-04-12T09:00:00.000Z',
//     questionLabels: [
//       {
//         isVisible: false,
//         title: 'Topic',
//         value: 'Motional and Rotational EMF',
//       },
//       {
//         isVisible: false,
//         title: 'Concept',
//         value: 'Motional EMI in loop by  generated  Area',
//       },
//     ],
//   },
//   {
//     _id: '648b5a71417cc3fb48d685b2',
//     exams: [],
//     subjects: [],
//     chapters: [],
//     isAttempted: false,
//     evalStatus: 'notAttempted',
//     lastPractised: '',
//     title: {
//       text: 'A metallic cube of side <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>15</mn><mo>&#160;</mo><mi>cm</mi></math> moving along <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>y</mi></math>-axis at a uniform velocity of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mo>&#160;</mo><mi mathvariant="normal">m</mi><mo>&#160;</mo><msup><mi mathvariant="normal">s</mi><mrow><mo>-</mo><mn>1</mn></mrow></msup></math>. In a region of uniform magnetic field of magnitude <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>5</mn><mo>&#160;</mo><mi mathvariant="normal">T</mi></math> directed along <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>z</mi></math>- axis. In equilibrium the potential difference between the faces of higher and lower potential developed because of the motion through the field will be <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>mV</mi></math>.<br /><img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/c6bd4656-663d-4ee0-b29f-217ce50b89d9.png" style="width: 300px; height: 301px;" />',
//       image: null,
//     },
//     questionType: 'numerical',
//     yearsAppeared: [
//       {
//         _id: '648b5a3a0d9d0b909f7b6493',
//         exams: [],
//         subjects: [],
//         chapters: [],
//         title: 'JEE Main 2023 (11 Apr Shift 2)',
//         heldOn: '2023-04-11T14:00:00.000Z',
//       },
//     ],
//     previousYear: '2023-04-11T14:00:00.000Z',
//     questionLabels: [
//       {
//         isVisible: false,
//         title: 'Topic',
//         value: 'Motional and Rotational EMF',
//       },
//       {
//         isVisible: false,
//         title: 'Concept',
//         value: 'Motional EMI in loop by  generated  Area',
//       },
//     ],
//   },
//   {
//     _id: '648b5a71417cc3fb48d685b4',
//     exams: [],
//     subjects: [],
//     chapters: [],
//     isAttempted: false,
//     evalStatus: 'notAttempted',
//     lastPractised: '',
//     title: {
//       text: 'A coil has an inductance of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mo>&#160;</mo><mi mathvariant="normal">H</mi></math> and resistance of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>4</mn><mo>&#160;</mo><mi mathvariant="normal">&#937;</mi></math>. A <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>10</mn><mo>&#160;</mo><mi mathvariant="normal">V</mi></math> is applied across the coil. The energy stored in the magnetic field after the current has built up to its equilibrium value will be _____ <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>&#215;</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>2</mn></mrow></msup><mo>&#160;</mo><mi mathvariant="normal">J</mi></math>',
//       image: null,
//     },
//     questionType: 'numerical',
//     yearsAppeared: [
//       {
//         _id: '648b5a3a0d9d0b909f7b6493',
//         exams: [],
//         subjects: [],
//         chapters: [],
//         title: 'JEE Main 2023 (11 Apr Shift 2)',
//         heldOn: '2023-04-11T14:00:00.000Z',
//       },
//     ],
//     previousYear: '2023-04-11T14:00:00.000Z',
//     questionLabels: [
//       {
//         isVisible: false,
//         title: 'Topic',
//         value: 'Inductance',
//       },
//       {
//         isVisible: false,
//         title: 'Concept',
//         value: 'Energy Density in Magnetic Field',
//       },
//     ],
//   },
//   {
//     _id: '648b5a70417cc3fb48d68558',
//     exams: [],
//     subjects: [],
//     chapters: [],
//     isAttempted: false,
//     evalStatus: 'notAttempted',
//     lastPractised: '',
//     title: {
//       text: '<p>The magnetic field B crossing normally a square metallic plate of area <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>4</mn><mo>&#160;</mo><msup><mi mathvariant="normal">m</mi><mn>2</mn></msup></math>&nbsp;is changing with time as shown in figure. The magnitude of induced emf in the plate during <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>t</mi><mo>=</mo><mn>2</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math> to <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>t</mi><mo>=</mo><mn>4</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math>, is _____&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>m</mi><mi>V</mi></math>.</p><p style="text-align: center;"><img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/5d6c8bc7-7667-4b17-8b7e-ef248b88dcf4-image.png" style="width: 300px; height: 193px;" /></p>',
//       image: null,
//     },
//     questionType: 'numerical',
//     yearsAppeared: [
//       {
//         _id: '648b5a3a0d9d0b909f7b6492',
//         exams: [],
//         subjects: [],
//         chapters: [],
//         title: 'JEE Main 2023 (11 Apr Shift 1)',
//         heldOn: '2023-04-11T09:00:00.000Z',
//       },
//     ],
//     previousYear: '2023-04-11T09:00:00.000Z',
//     questionLabels: [
//       {
//         isVisible: false,
//         title: 'Topic',
//         value: "Magnetic Flux, Faraday's and Lenz law",
//       },
//       {
//         isVisible: false,
//         title: 'Concept',
//         value: "Lenz's Law",
//       },
//     ],
//   },
//   {
//     _id: '648b5a70417cc3fb48d68500',
//     exams: [],
//     subjects: [],
//     chapters: [],
//     isAttempted: false,
//     evalStatus: 'notAttempted',
//     lastPractised: '',
//     title: {
//       text: '<p>A square loop of side <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mo>.</mo><mn>0</mn><mo>&#160;</mo><mi>cm</mi></math> is placed inside a long solenoid that has <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>50</mn></math> turns per centimetre and carries a sinusoidally varying current of amplitude <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mo>.</mo><mn>5</mn><mo>&#160;</mo><mi mathvariant="normal">A</mi></math> and angular frequency <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>700</mn><mo>&#160;</mo><mi>rad</mi><mo>&#160;</mo><msup><mi mathvariant="normal">s</mi><mrow><mo>-</mo><mn>1</mn></mrow></msup></math>. The central axes of the loop and solenoid coincide. The amplitude of the emf induced in the loop is <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi><mo>&#215;</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>4</mn></mrow></msup><mo>&#160;</mo><mi mathvariant="normal">V</mi></math>. The value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math> is ___________</p><p><math xmlns="http://www.w3.org/1998/Math/MathML"><mo>(</mo></math> Take, <math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced open=""><mrow><mi>&#960;</mi><mo>=</mo><mfrac><mn>22</mn><mn>7</mn></mfrac></mrow></mfenced></math></p>',
//       image: null,
//     },
//     questionType: 'numerical',
//     yearsAppeared: [
//       {
//         _id: '648b5a3a0d9d0b909f7b6491',
//         exams: [],
//         subjects: [],
//         chapters: [],
//         title: 'JEE Main 2023 (10 Apr Shift 2)',
//         heldOn: '2023-04-10T14:00:00.000Z',
//       },
//     ],
//     previousYear: '2023-04-10T14:00:00.000Z',
//     questionLabels: [
//       {
//         isVisible: false,
//         title: 'Topic',
//         value: 'Motional and Rotational EMF',
//       },
//       {
//         isVisible: false,
//         title: 'Concept',
//         value: 'Motional EMI due to rotational motion',
//       },
//     ],
//   },
// ];
// populateQuestions(questions, 'dark');
// populateQuestions(questions, 'light');
