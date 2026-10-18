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
//     Android.showToast('Question clicked: ', e);
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

/*Above Android object, only for testing purposes.*/

function resizeImages(images) {
  const currentScreenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imgSize = image.naturalWidth;
    if (imgSize >= currentScreenWidth) {
      console.log('Resized.');
      image.style.height = 'auto';
      image.style.width = '100%';
    }
  }
}
function questionTextResizeAllImages(question) {
  if (question.question.text.includes('<img')) {
    const allQuestionImages = document.querySelectorAll('#questionText img');
    resizeImages(allQuestionImages);
  }
}
function questionSolutionResizeAllImages(question) {
  if (
    (question.solution.text && question.solution.text.includes('<img')) ||
    (!question.solution.text && question.solution && question.solution.includes('<img'))
  ) {
    const allSolutionImages = document.querySelectorAll('.solution-text img');
    resizeImages(allSolutionImages);
  }
}
function questionOptionsResizeAllImages(question) {
  for (let i = 0; i < question.options.length; i++) {
    const opt = question.options[i];
    if (opt.text.includes('<img')) {
      const allOptionImages = document.querySelectorAll('.option-text img');
      resizeImages(allOptionImages);
    }
  }
}
function getQuestionNumber(num) {
  if (Number(num) < 9) return `0${Number(num) + 1}`;
  return Number(num) + 1;
}
function getYears(years, questionLabels, screenType, screenLabels) {
  screenType = typeof screenType !== 'undefined' ? screenType : 'question';
  screenLabels = typeof screenLabels !== 'undefined' ? screenLabels : [];
  Android.logMessage(`labels years ${JSON.stringify(years)}`);
  Android.logMessage(`labels ${JSON.stringify(questionLabels)}`);
  let labels = [];
  if (screenType === 'notebookListing') {
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
      return '';
    }
  }
  return labels.join(', ');
}
function onQuestionClick(index, questionsData) {
  Android.onQuestionClicked(`${index}`);
}
function setTypeset() {
  MathJax.Hub.Config({
    'HTML-CSS': { linebreaks: { automatic: true } },
    SVG: { linebreaks: { automatic: true } },
    messageStyle: 'none',
    tex2jax: { preview: 'none' },
    CommonHTML: {
      linebreaks: { automatic: false },
    },
  });
  MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
}
function setOpacity(answeredQs = []) {
  var answeredQs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    for (var i = 0; i <= answeredQs.length; i++) {
      var position = answeredQs[i];
      var questionClass = document.querySelector(".question-row-".concat(position));
      if (questionClass) questionClass.classList.add('opacity-75');
    }
}
function populateQuestions(questions, screenType, theme, filterValue) {
  screenType = typeof screenType !== 'undefined' ? screenType : 'question';
  const body = document.querySelector('body');
  if (theme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');

  let questionsHtml = '';
  Android.logMessage(`overall screen: ${JSON.stringify(questions.exams)}`);
  for (let i in questions.data) {
    const ques = questions.data[i];
    Android.logMessage(`overall screen: ${JSON.stringify(ques.exams)}`);
    let labels = [];
    if (screenType != 'question') {
      const exams = ques.exams;
      const subjects = ques.subjects;
      const chapters = ques.chapters;
      if (subjects?.length) labels.push(subjects[0].title);
      if (chapters?.length) labels.push(chapters[0].title);
    }
    Android.logMessage(`ques: ${JSON.stringify(ques, null, 4)}`);
    Android.logMessage(`i: ${JSON.stringify(i)}`);
    Android.logMessage(`filter: ${filterValue}`);
    let yearsLabels = getYears(ques.yearsAppeared, ques.questionLabels, screenType, labels);
    let showBullet = false;
    if (Boolean(yearsLabels)) showBullet = true;

    questionsHtml += `
          <div
              class="${filterValue === 'all' && ques.isAttempted ? 'opacity-75' : ''}
              question-row question-row-${i} mb-4"
              onclick="onQuestionClick(${i})">
               <div class="question-number">
                <p>${getQuestionNumber(i)}</p>
               </div>
               <div class="question-body">
                <div class="question-title">${ques.title.text}</div>
                  <div class="question-labels">
                    <div class="question-year">
                      ${yearsLabels}
                    </div>
                    ${
                      ques.hasVideoSolution && ques.videoSolution
                        ? `
                      <div class="vs-label">
                        ${showBullet ? `<div class="bullet"></div>` : ``}
                          <div class="question-videosol-label">
                                <img src="../assets/svg/VideoCamera.svg"/>
                                <p>Video Sol Available</p>
                          </div>
                      </div>`
                        : ''
                    }
                    ${
                      ques.syllabusCategory
                        ? ques.syllabusCategory === 'outOfSyllabus'
                          ? `<p class="out-of-syllabus">Out of Syllabus</p>`
                          : ques.syllabusCategory === 'outOfSyllabusButGoodToSolve'
                          ? `<p class="out-of-syllabus-but-good-to-solve">Out of Syllabus but Good to Solve</p>`
                          : ''
                        : ''
                    }
                  </div>
               </div>
           </div>
         `;
    Android.logMessage(`questionsHtmlDebug: ${questionsHtml}`);
  }
  root.innerHTML = questionsHtml;
  setTypeset();
}

/* dummy data below for testing */

// const questions = {
//   data: [
//     {
//       _id: '648b5a61417cc3fb48d653c0',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'Two forces are such that the sum of their magnitudes is $18 \\mathrm{~N}$ and their resultant is $12 \\mathrm{~N}$ which is perpendicular to the smaller force. Then the magnitudes of the forces are',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       syllabusCategory: 'outOfSyllabus',
//       yearsAppeared: [
//         {
//           _id: '615d92e9de3d91842a5cf7c2',
//           title: 'JEE Main 2002',
//           heldOn: '2002-04-30T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2002-04-30T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Triangle Law Of Vector Addition',
//         },
//       ],
//     },
//     {
//       _id: '648b5a61417cc3fb48d6548a',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The length of a simple pendulum executing simple harmonic motion is increased by $21 \\%$. The percentage increase in the time period of the pendulum of increased length is',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       syllabusCategory: 'outOfSyllabus',
//       yearsAppeared: [
//         {
//           _id: '615d92eade3d91842a5cf7c3',
//           title: 'JEE Main 2003',
//           heldOn: '2003-04-30T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2003-04-30T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a61417cc3fb48d65549',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'If $\\vec{A} \\times \\vec{B}=\\vec{B} \\times \\vec{A}$, then the angle between $A$ and $B$ is',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92eade3d91842a5cf7c4',
//           title: 'JEE Main 2004',
//           heldOn: '2004-04-30T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2004-04-30T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Multiplication of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Cross Product',
//         },
//       ],
//     },
//     {
//       _id: '648b5a62417cc3fb48d6562f',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A particle is moving eastwards with a velocity of $5 \\mathrm{~m} / \\mathrm{s}$ in 10 seconds the velocity changes to $5 \\mathrm{~m} / \\mathrm{s}$ northwards. The average acceleration in this time is',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       syllabusCategory: 'outOfSyllabus',
//       yearsAppeared: [
//         {
//           _id: '615d92eade3d91842a5cf7c5',
//           title: 'JEE Main 2005',
//           heldOn: '2005-04-30T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2005-04-30T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Geometrical Interpretation of Vectors when Added or Substracted',
//         },
//       ],
//     },
//     {
//       _id: '648b5a62417cc3fb48d658e9',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The respective number of significant figures for the numbers $23.023,0.0003$ and $2.1 \\times 10^{-3}$ are',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92eade3d91842a5cf7ca',
//           title: 'JEE Main 2010',
//           heldOn: '2010-04-30T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2010-04-30T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Significant Figures',
//         },
//       ],
//     },
//     {
//       _id: '648b5a62417cc3fb48d65948',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'If a wire is stretched to make it $0.1 \\%$ longer, its resistance will :',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92eade3d91842a5cf7cb',
//           title: 'JEE Main 2011',
//           heldOn: '2011-04-30T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2011-04-30T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a63417cc3fb48d65b02',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'Resistance of a given wire is obtained by measuring the current flowing in it and the voltage difference applied across it. If the percentage errors in the measurement of the current and the voltage difference are $3 \\%$ each, then error in the value of resistance of the wire is',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       syllabusCategory: 'outOfSyllabusButGoodToSolve',
//       yearsAppeared: [
//         {
//           _id: '615d92eade3d91842a5cf7cc',
//           title: 'JEE Main 2012 (Offline)',
//           heldOn: '2012-04-30T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2012-04-30T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a63417cc3fb48d65a46',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The amount of heat produced in an electric circuit depends upon the current $(I)$, resistance $(R)$ and time $(t)$. If the error made in the measurements of the above quantities are $2 \\%, 1 \\%$ and $1 \\%$ respectively then the maximum possible error in the total heat produced will be',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       syllabusCategory: 'outOfSyllabusButGoodToSolve',
//       yearsAppeared: [
//         {
//           _id: '615d92eade3d91842a5cf7cf',
//           title: 'JEE Main 2012 (19 May Online)',
//           heldOn: '2012-05-19T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2012-05-19T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a64417cc3fb48d65d11',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The current voltage relation of diode is given by I = (e<sup>1000</sup><sup> V/T</sup> - 1) mA, where the applied voltage V is in volts and the temperature T is in degree Kelvin. If a student makes an error measuring <math> <mrow> <mo>&#177;</mo> <mtext>0.01 V</mtext> </mrow> </math>&nbsp;while measuring the current of 5 mA at 300 K, what will be the error in the value of current in mA ?',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '648b5a3a0d9d0b909f7b6486',
//           title: 'JEE Main 2014 (06 Apr)',
//           heldOn: '2014-04-06T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2014-04-06T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Absolute errors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a64417cc3fb48d65d7a',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'An experiment is performed to obtain the value of acceleration due to gravity g by using a simple pendulum of length L. In this experiment time for 100 oscillations is measured&nbsp; by using a watch of 1 second least count and the value is 90.0 seconds. The length L is measured by using a meter scale of least count 1 mm and the value is 20.0 cm. The error in the determination of g would be :',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7d7',
//           title: 'JEE Main 2014 (09 Apr Online)',
//           heldOn: '2014-04-09T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2014-04-09T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Absolute errors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a64417cc3fb48d65ed6',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The period of oscillation of a simple pendulum is <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>T</mi><mo>=</mo><mn>2</mn><mi>&#960;</mi><msqrt><mfrac><mi>l</mi><mi>g</mi></mfrac></msqrt><mo>.</mo><mi mathvariant="normal">&#160;</mi></math> Measured value of <math><mi>l</mi></math> is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>20</mn><mo>.</mo><mn>0</mn><mo>&#160;</mo><mi>cm</mi></math>,&nbsp;known to <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi>mm</mi></math>&nbsp;&nbsp;accuracy and time for <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>100</mn><mo>&#160;</mo></math>oscillations of the pendulum is found to be&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>90</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math> using a wristwatch of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math> resolution. The accuracy in the determination of&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>g</mi></math>&nbsp;is&nbsp;',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '648b5a3a0d9d0b909f7b6487',
//           title: 'JEE Main 2015 (04 Apr)',
//           heldOn: '2015-04-04T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2015-04-04T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Precision and Accuracy',
//         },
//       ],
//     },
//     {
//       _id: '648b5a64417cc3fb48d65f8f',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A vector <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>A</mi><mo>&#8594;</mo></mover></math> is rotated by a small angle <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>&#8710;</mo><mi>&#952;</mi></math> radians <math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced separators="|"><mrow><mo>&#8710;</mo><mi>&#952;</mi><mo>&#8810;</mo><mn>1</mn></mrow></mfenced></math> to get a new vector <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>B</mi><mo>&#8594;</mo></mover></math> . In that case <math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced open="|" close="|" separators="|"><mrow><mover><mi>B</mi><mo>&#8594;</mo></mover><mo>-</mo><mover><mi>A</mi><mo>&#8594;</mo></mover></mrow></mfenced></math> is :',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       syllabusCategory: 'outOfSyllabusButGoodToSolve',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7dd',
//           title: 'JEE Main 2015 (11 Apr Online)',
//           heldOn: '2015-04-11T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2015-04-11T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Triangle Law Of Vector Addition',
//         },
//       ],
//     },
//     {
//       _id: '648b5a64417cc3fb48d65fe3',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A student measures the time period of 100 oscillations of a simple pendulum four times. The data set is 90 s, 91 s, 95 s and 92 s. If the minimum division in the measuring clock is 1 s, then the reported mean time should be:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '648b5a3a0d9d0b909f7b6488',
//           title: 'JEE Main 2016 (03 Apr)',
//           heldOn: '2016-04-03T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2016-04-03T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Absolute errors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a65417cc3fb48d66097',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A thin <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">m</mi></math>&nbsp;long rod has a radius of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>5</mn><mo>&#160;</mo><mi>mm</mi></math>. A force of <math xmlns="http://www.w3.org/1998/Math/MathML"><mpadded lspace="+1px"><mn>50</mn><msup><mtext>&#960;&#215;10</mtext><mn>3</mn></msup><mo>&#160;</mo><mi mathvariant="normal">N</mi></mpadded></math> is applied at one end to determine its Young&#39;s modulus. Assume that the force is exactly known. If the least count in the measurement of all lengths is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>01</mn><mo>&#160;</mo><mi>mm</mi></math>, which of the following statements is false?',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7e0',
//           title: 'JEE Main 2016 (10 Apr Online)',
//           heldOn: '2016-04-10T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2016-04-10T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Fractional errors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a65417cc3fb48d660f0',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The following observations were taken for determining surface tension <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>T</mi></math> of water by capillary method:<br /><br />diameter of capillary, <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>D</mi><mo>=</mo><mn>1.25</mn><mo>&#215;</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>2</mn></mrow></msup><mo>&#160;</mo><mi mathvariant="normal">m</mi></math><br /><br />rise of water, <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>h</mi><mo>=</mo><mn>1.45</mn><mo>&#215;</mo><msup><mn>10</mn><mrow><mo>-</mo><mn>2</mn></mrow></msup><mo>&#160;</mo><mi mathvariant="normal">m</mi></math><br /><br />Using <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>g</mi><mo>=</mo><mn>9.80</mn><mi>&#160;</mi><mi mathvariant="normal">m</mi><mo>&#160;</mo><msup><mi mathvariant="normal">s</mi><mrow><mo>-</mo><mn>2</mn></mrow></msup></math> and the simplified relation <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>T</mi><mo>=</mo><mfrac><mrow><mi>r</mi><mi>h</mi><mi>g</mi></mrow><mn>2</mn></mfrac><mo>&#215;</mo><msup><mn>10</mn><mn>3</mn></msup><mo>&#160;</mo><mi mathvariant="normal">N</mi><mo>&#160;</mo><msup><mi mathvariant="normal">m</mi><mrow><mo>-</mo><mn>1</mn></mrow></msup></math> the possible error in surface tension is closest to:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '648b5a3a0d9d0b909f7b6489',
//           title: 'JEE Main 2017 (02 Apr)',
//           heldOn: '2017-04-02T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2017-04-02T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a65417cc3fb48d661bd',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: '<p>A physical quantity <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>P</mi></math> is described by the relation <math><mi>P</mi><mo>=</mo><msup><mrow><mi>a</mi></mrow><mrow><mfrac><mrow><mn>1</mn></mrow><mrow><mn>2</mn></mrow></mfrac></mrow></msup><mi>&#160;</mi><msup><mrow><mi>b</mi></mrow><mrow><mn>2</mn></mrow></msup><mi>&#160;</mi><msup><mrow><mi>c</mi></mrow><mrow><mn>3</mn></mrow></msup><msup><mrow><mi>d</mi></mrow><mrow><mo>-</mo><mn>4</mn></mrow></msup></math>. If the relative errors in the measurement of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>b</mi></math>,&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>c</mi></math> and&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>d</mi></math> respectively, are <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mo>%</mo></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>%</mo></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn><mo>%</mo></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>5</mn><mo>%</mo></math>. Then the&nbsp;relative error in&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>P</mi></math>&nbsp;will be:</p>',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7e3',
//           title: 'JEE Main 2017 (09 Apr Online)',
//           heldOn: '2017-04-09T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2017-04-09T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a65417cc3fb48d6620c',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The density of a material, in the shape of a cube, is determined by measuring three sides of the cube and its mass. If the relative errors in measuring the mass and length are&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>.</mo><mn>5</mn><mo>%</mo></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>%</mo></math>, respectively,&nbsp;the maximum error in determining the density is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       syllabusCategory: 'outOfSyllabus',
//       yearsAppeared: [
//         {
//           _id: '648b5a3a0d9d0b909f7b648b',
//           title: 'JEE Main 2018 (08 Apr)',
//           heldOn: '2018-04-08T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2018-04-08T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a65417cc3fb48d66257',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The relative error in the determination of the surface area of a sphere is $\\alpha$. Then the relative error in the determination of its volume is',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7e5',
//           title: 'JEE Main 2018 (15 Apr Shift 1 Online)',
//           heldOn: '2018-04-15T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2018-04-15T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Fractional errors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a65417cc3fb48d66323',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The relative error in the determination of the surface area of a sphere is <math> <mi>α</mi> </math>. The relative error in the determination of its volume is',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '648b5a3a0d9d0b909f7b648a',
//           title: 'JEE Main 2018 (15 Apr)',
//           heldOn: '2018-04-15T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2018-04-15T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Fractional errors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a65417cc3fb48d6637b',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'Let <math><mover accent="true"><mrow><mi>A</mi></mrow><mo>&#8594;</mo></mover><mo>=</mo><mfenced separators="|"><mrow><mover accent="true"><mrow><mi>i</mi></mrow><mo>^</mo></mover><mi>&#160;</mi><mo>+</mo><mi>&#160;</mi><mover accent="true"><mrow><mi>j</mi></mrow><mo>^</mo></mover></mrow></mfenced><mi>&#160;</mi><mi mathvariant="normal">a</mi><mi mathvariant="normal">n</mi><mi mathvariant="normal">d</mi><mi>&#160;</mi><mover accent="true"><mrow><mi>B</mi></mrow><mo>&#8594;</mo></mover><mo>=</mo><mo>(</mo><mn>2</mn><mover accent="true"><mrow><mi>i</mi></mrow><mo>^</mo></mover><mo>-</mo><mi>&#160;</mi><mover accent="true"><mrow><mi>j</mi></mrow><mo>^</mo></mover><mo>)</mo></math> . The magnitude of a coplanar vector <math><mover accent="true"><mrow><mi>C</mi></mrow><mo>&#8594;</mo></mover></math> such that&nbsp;<math><mover accent="true"><mrow><mi>A</mi></mrow><mo>&#8594;</mo></mover><mi>&#160;</mi><mo>.</mo><mi>&#160;</mi><mover accent="true"><mrow><mi>C</mi></mrow><mo>&#8594;</mo></mover><mo>=</mo><mover accent="true"><mrow><mi>B</mi></mrow><mo>&#8594;</mo></mover><mo>.</mo><mi>&#160;</mi><mover accent="true"><mrow><mi>C</mi></mrow><mo>&#8594;</mo></mover><mo>=</mo><mi>&#160;</mi><mover accent="true"><mrow><mi>A</mi></mrow><mo>&#8594;</mo></mover><mi>&#160;</mi><mo>.</mo><mi>&#160;</mi><mover accent="true"><mrow><mi>B</mi></mrow><mo>&#8594;</mo></mover></math> is given by:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7e7',
//           title: 'JEE Main 2018 (16 Apr Online)',
//           heldOn: '2018-04-16T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2018-04-16T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Multiplication of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Dot Product',
//         },
//       ],
//     },
//     {
//       _id: '648b5a65417cc3fb48d66380',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The percentage errors in quantities <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>P</mi></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>Q</mi></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>R</mi></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>S</mi></math> are <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>5</mn><mo>%</mo></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>%</mo></math>, <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn><mo>%</mo></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>.</mo><mn>5</mn><mo>%</mo></math> respectively in the measurement of a physical quantity <math><mi>A=</mi> <mrow> <mfrac> <mrow> <msup> <mi>P</mi> <mn>3</mn> </msup> <msup> <mi>Q</mi> <mn>2</mn> </msup> </mrow> <mrow> <msqrt> <mi>R</mi> </msqrt> <mtext> </mtext><mi>S</mi> </mrow> </mfrac> </mrow> </math>. The maximum percentage error in the value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>A</mi></math> will be:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7e7',
//           title: 'JEE Main 2018 (16 Apr Online)',
//           heldOn: '2018-04-16T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2018-04-16T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a66417cc3fb48d66527',
//       isAttempted: true,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A particle is moving with a velocity <math><mover accent="true"><mrow><mi>v</mi></mrow><mo>&#8594;</mo></mover><mo>=</mo><mi>K</mi><mfenced separators="|"><mrow><mi>y</mi><mover accent="true"><mrow><mi>i</mi></mrow><mo>^</mo></mover><mo>+</mo><mi>x</mi><mover accent="true"><mrow><mi>j</mi></mrow><mo>^</mo></mover></mrow></mfenced><mo>,</mo></math> where <math><mi>K</mi></math> is a constant.<br /><br />The general equation for its path is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7e8',
//           title: 'JEE Main 2019 (09 Jan Shift 1)',
//           heldOn: '2019-01-09T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-01-09T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Fundamentals of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Types of Vectors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a66417cc3fb48d6653f',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A copper wire is stretched to make it <math><mn>0.5</mn><mi>%</mi></math> longer. The percentage change in its electrical resistance if its volume remains unchanged is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7e8',
//           title: 'JEE Main 2019 (09 Jan Shift 1)',
//           heldOn: '2019-01-09T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-01-09T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a66417cc3fb48d6658f',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The position co-ordinates of a particle moving in a <math><mn>3</mn><mi>D</mi></math> coordinate system is given by<br /><br /><math><mi>x</mi><mo>=</mo><mi>a</mi><mrow><mrow><mi mathvariant="normal">cos</mi></mrow><mo>&#8289;</mo><mrow><mi mathvariant="normal">&#969;</mi><mi mathvariant="normal">t</mi></mrow></mrow></math><br /><br /><math><mi>y</mi><mo>=</mo><mi>a</mi><mrow><mrow><mi mathvariant="normal">sin</mi></mrow><mo>&#8289;</mo><mrow><mi>&#969;</mi><mi>t</mi></mrow></mrow></math><br /><br />and <math><mi>z</mi><mo>=</mo><mi>a</mi><mi>&#969;</mi><mi>t</mi></math><br /><br />The speed of the particle is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7e9',
//           title: 'JEE Main 2019 (09 Jan Shift 2)',
//           heldOn: '2019-01-09T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-01-09T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Formula for Finding Resultant of Two Vectors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a66417cc3fb48d666a3',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'In the cube of side &#39;a&#39; shown in the figure, the vector from the central point of the face <math><mi>A</mi><mi>B</mi><mi>O</mi><mi>D</mi></math> to the central point of the face <math><mi>B</mi><mi>E</mi><mi>F</mi><mi>O</mi></math> will be:<br /><br /><img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/dfipwtyfqphmgqfmxreyumzdpvpggtkgoliwasbawcukbzmeqq.png" />',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7ea',
//           title: 'JEE Main 2019 (10 Jan Shift 1)',
//           heldOn: '2019-01-10T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-01-10T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Formula for Finding Resultant of Two Vectors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a67417cc3fb48d66704',
//       isAttempted: true,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The diameter and height of a cylinder are measured by a meter scale to be <math><mn>12.6</mn><mo>&#177;</mo><mn>0.1</mn><mtext>&#8201;</mtext><mi>c</mi><mi>m</mi></math> and <math><mn>34.2</mn><mo>&#177;</mo><mn>0.1</mn><mtext>&#8201;</mtext><mi>c</mi><mi>m</mi></math> , respectively. What will be the value of its volume in appropriate significant figures?',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7eb',
//           title: 'JEE Main 2019 (10 Jan Shift 2)',
//           heldOn: '2019-01-10T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-01-10T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Precision and Accuracy',
//         },
//       ],
//     },
//     {
//       _id: '648b5a67417cc3fb48d66705',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'Two vectors <math><mover accent="true"><mrow><mi>A</mi></mrow><mo>&#8594;</mo></mover></math> and <math><mover accent="true"><mrow><mi>B</mi></mrow><mo>&#8594;</mo></mover></math> have equal magnitudes. The magnitude of <math><mfenced separators="|"><mrow><mover accent="true"><mrow><mi>A</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover accent="true"><mrow><mi>B</mi></mrow><mo>&#8594;</mo></mover></mrow></mfenced></math> is &#39; <math><mi>n</mi></math> &#39; times the magnitude of <math><mfenced separators="|"><mrow><mover accent="true"><mrow><mi>A</mi></mrow><mo>&#8594;</mo></mover><mo>-</mo><mover accent="true"><mrow><mi>B</mi></mrow><mo>&#8594;</mo></mover></mrow></mfenced></math> . The angle between <math><mover accent="true"><mrow><mi>A</mi></mrow><mo>&#8594;</mo></mover></math> and <math><mover accent="true"><mrow><mi>B</mi></mrow><mo>&#8594;</mo></mover></math> is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7eb',
//           title: 'JEE Main 2019 (10 Jan Shift 2)',
//           heldOn: '2019-01-10T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-01-10T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Multiplication of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Dot Product',
//         },
//       ],
//     },
//     {
//       _id: '648b5a67417cc3fb48d66706',
//       isAttempted: true,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'Two forces <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>P</mi></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>Q</mi></math>, of magnitude <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mi>F</mi></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>3</mn><mi>F</mi></math>, respectively, are at an angle <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#952;</mi></math> with each other. If the force <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>Q</mi></math> is doubled, then their resultant also gets doubled. Then, the angle <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#952;</mi></math> is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7eb',
//           title: 'JEE Main 2019 (10 Jan Shift 2)',
//           heldOn: '2019-01-10T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-01-10T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Formula for Finding Resultant of Two Vectors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a67417cc3fb48d667b6',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A particle moves from the point $(2.0 \\hat{i}+4.0 \\hat{j}) \\mathrm{m},$ at $\\mathrm{t}=0$,\r\n\r\nwith an initial velocity $(5.0 \\hat{i}+4.0 \\hat{j}) \\mathrm{ms}^{-1} .$ It is acted upon by a constant force which produces a constant acceleration\r\n\r\n$(4.0 \\hat{i}+4.0 \\hat{j}) \\mathrm{ms}^{-2} .$ What is the distance of the particle\r\n\r\nfrom the origin at time $2 \\mathrm{~s} ?$',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7ed',
//           title: 'JEE Main 2019 (11 Jan Shift 2)',
//           heldOn: '2019-01-11T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-01-11T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Formula for Finding Resultant of Two Vectors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a67417cc3fb48d668b3',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A person standing on an open ground hears the sound of a jet aeroplane, coming from north at an angle <math><msup><mrow><mn>60</mn></mrow><mrow><mi>o</mi></mrow></msup></math> with ground level, but he finds the aeroplane right vertically above his position. If <math><mi>v</mi></math> is the speed of sound, speed of the plane is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ebde3d91842a5cf7ee',
//           title: 'JEE Main 2019 (12 Jan Shift 1)',
//           heldOn: '2019-01-12T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-01-12T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Angle Between the Vectors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a66417cc3fb48d663d6',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'Ship <math xmlns="http://www.w3.org/1998/Math/MathML"><mi mathvariant="normal">A</mi></math> is sailing towards north-east with velocity) <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>v</mi><mo>&#8594;</mo></mover><mo>=</mo><mn>30</mn><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover><mo>+</mo><mn>50</mn><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>&#160;</mo><mi>km</mi><mo>&#160;</mo><msup><mi mathvariant="normal">h</mi><mrow><mo>-</mo><mn>1</mn></mrow></msup><mi mathvariant="normal">&#160;</mi></math> where <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover></math> points east and <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>,</mo></math> north. The ship <math xmlns="http://www.w3.org/1998/Math/MathML"><mi mathvariant="normal">B</mi></math>&nbsp;is at a distance of <math><mn>80</mn><mi>&#160;</mi><mi mathvariant="normal">k</mi><mi mathvariant="normal">m</mi></math> east and <math><mn>150</mn><mi>&#160;</mi><mi mathvariant="normal">k</mi><mi mathvariant="normal">m</mi></math> north of Ship <math xmlns="http://www.w3.org/1998/Math/MathML"><mi mathvariant="normal">A</mi></math> and is sailing towards the west at <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>10</mn><mo>&#160;</mo><mi mathvariant="normal">k</mi><mi mathvariant="normal">m</mi><mo>&#160;</mo><msup><mi mathvariant="normal">h</mi><mrow><mo>-</mo><mn>1</mn></mrow></msup><mo>.</mo></math> <math xmlns="http://www.w3.org/1998/Math/MathML"><mi mathvariant="normal">A</mi></math> will be at the minimum distance from <math><mi mathvariant="normal">B</mi></math> in:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ecde3d91842a5cf7f0',
//           title: 'JEE Main 2019 (08 Apr Shift 1)',
//           heldOn: '2019-04-08T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-04-08T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Geometrical Interpretation of Vectors when Added or Substracted',
//         },
//       ],
//     },
//     {
//       _id: '648b5a66417cc3fb48d66420',
//       isAttempted: true,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'Let <math><mfenced close="|" open="|" separators="|"><mrow><mover accent="true"><mrow><msub><mrow><mi mathvariant="normal">A</mi></mrow><mrow><mn>1</mn></mrow></msub></mrow><mo>&#8594;</mo></mover></mrow></mfenced><mo>=</mo><mn>3</mn><mo>,</mo><mi mathvariant="normal">&#160;</mi><mfenced close="|" open="|" separators="|"><mrow><mover accent="true"><mrow><msub><mrow><mi mathvariant="normal">A</mi></mrow><mrow><mn>2</mn></mrow></msub></mrow><mo>&#8594;</mo></mover></mrow></mfenced><mo>=</mo><mn>5</mn><mi mathvariant="normal">&#160;</mi></math> and <math><mfenced close="|" open="|" separators="|"><mrow><mover accent="true"><mrow><msub><mrow><mi mathvariant="normal">A</mi></mrow><mrow><mn>1</mn></mrow></msub></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover accent="true"><mrow><msub><mrow><mi mathvariant="normal">A</mi></mrow><mrow><mn>2</mn></mrow></msub></mrow><mo>&#8594;</mo></mover></mrow></mfenced><mo>=</mo><mn>5</mn><mo>.</mo></math> The value of <math><mfenced separators="|"><mrow><mn>2</mn><mover accent="true"><mrow><msub><mrow><mi mathvariant="normal">A</mi></mrow><mrow><mn>1</mn></mrow></msub></mrow><mo>&#8594;</mo></mover><mo>+</mo><mn>3</mn><mover accent="true"><mrow><msub><mrow><mi mathvariant="normal">A</mi></mrow><mrow><mn>2</mn></mrow></msub></mrow><mo>&#8594;</mo></mover></mrow></mfenced><mo>&#8729;</mo><mfenced separators="|"><mrow><mn>3</mn><mover accent="true"><mrow><msub><mrow><mi mathvariant="normal">A</mi></mrow><mrow><mn>1</mn></mrow></msub></mrow><mo>&#8594;</mo></mover><mo>-</mo><mn>2</mn><mover accent="true"><mrow><msub><mrow><mi mathvariant="normal">A</mi></mrow><mrow><mn>2</mn></mrow></msub></mrow><mo>&#8594;</mo></mover></mrow></mfenced></math> is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ecde3d91842a5cf7f1',
//           title: 'JEE Main 2019 (08 Apr Shift 2)',
//           heldOn: '2019-04-08T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-04-08T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Multiplication of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Dot Product',
//         },
//       ],
//     },
//     {
//       _id: '648b5a66417cc3fb48d66432',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'In a simple pendulum experiment for determination of acceleration due to gravity <math><mo>(</mo><mi mathvariant="normal">g</mi><mo>)</mo></math>, time taken for <math><mn>20</mn></math> oscillations is measures by using a watch of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn></math> second least count. The mean value of time taken comes out to be <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>30</mn><mi mathvariant="normal">&nbsp;</mi><mi mathvariant="normal">s</mi></math>. The length of the pendulum is measured by using a meter scale of least count <math><mn>1</mn><mi>&nbsp;</mi><mi mathvariant="normal">m</mi><mi mathvariant="normal">m</mi></math> and the value obtained is <math><mn>55.0</mn><mi>&nbsp;</mi><mi mathvariant="normal">c</mi><mi mathvariant="normal">m</mi></math>. The percentage error in the determination of <math><mi mathvariant="normal">g</mi></math> is close to',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ecde3d91842a5cf7f1',
//           title: 'JEE Main 2019 (08 Apr Shift 2)',
//           heldOn: '2019-04-08T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-04-08T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a66417cc3fb48d6648e',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'In the density measurement of a cube, the mass and edge length are measured as <math><mfenced separators="|"><mrow><mn>10.00</mn><mo>±</mo><mn>0.10</mn></mrow></mfenced><mi>&nbsp;</mi><mi mathvariant="normal">k</mi><mi mathvariant="normal">g</mi></math> and <math><mfenced separators="|"><mrow><mn>0.10</mn><mo>±</mo><mn>0.01</mn></mrow></mfenced><mi mathvariant="normal">&nbsp;</mi><mi mathvariant="normal">m</mi><mo>,</mo></math> respectively. The error in the measurement of density is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ecde3d91842a5cf7f2',
//           title: 'JEE Main 2019 (09 Apr Shift 1)',
//           heldOn: '2019-04-09T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-04-09T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Fractional errors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a66417cc3fb48d664de',
//       isAttempted: true,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The area of a square is <math><mn>5.29</mn><mi>&#160;</mi><mi mathvariant="normal">c</mi><msup><mrow><mi mathvariant="normal">m</mi></mrow><mrow><mn>2</mn></mrow></msup><mo>.</mo></math> The area of <math><mn>7</mn></math> such squares taking into account the significant figures is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ecde3d91842a5cf7f3',
//           title: 'JEE Main 2019 (09 Apr Shift 2)',
//           heldOn: '2019-04-09T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2019-04-09T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Precision and Accuracy',
//         },
//       ],
//     },
//     {
//       _id: '648b5a68417cc3fb48d66cac',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The sum of two forces <math><mover accent="true"><mrow><mi mathvariant="normal">P</mi></mrow><mo>&#8594;</mo></mover></math> and <math><mover accent="true"><mrow><mi mathvariant="normal">Q</mi></mrow><mo>&#8594;</mo></mover></math> is <math><mover accent="true"><mrow><mi mathvariant="normal">R</mi></mrow><mo>&#8594;</mo></mover></math> such that <math><mfenced close="|" open="|" separators="|"><mrow><mover accent="true"><mrow><mi mathvariant="normal">R</mi></mrow><mo>&#8594;</mo></mover></mrow></mfenced><mo>=</mo><mfenced close="|" open="|" separators="|"><mrow><mover accent="true"><mrow><mi mathvariant="normal">P</mi></mrow><mo>&#8594;</mo></mover></mrow></mfenced></math>. Find the angle between resultant of <math><mn>2</mn><mover accent="true"><mrow><mi mathvariant="normal">P</mi></mrow><mo>&#8594;</mo></mover></math> and <math><mover accent="true"><mrow><mi mathvariant="normal">Q</mi></mrow><mo>&#8594;</mo></mover></math>&nbsp;and&nbsp;<math><mover accent="true"><mrow><mi mathvariant="normal">Q</mi></mrow><mo>&#8594;</mo></mover></math> , ________',
//         image: null,
//       },
//       questionType: 'numerical',
//       yearsAppeared: [
//         {
//           _id: '615d92ecde3d91842a5cf7f9',
//           title: 'JEE Main 2020 (07 Jan Shift 2)',
//           heldOn: '2020-01-07T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2020-01-07T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Angle Between the Vectors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a69417cc3fb48d66d3a',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A simple pendulum is being used to determine the value of gravitational acceleration <math><mi>g</mi></math> at a certain place. The length of the pendulum is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>25.0</mn><mo>&#160;</mo><mi mathvariant="normal">c</mi><mi mathvariant="normal">m</mi></math> and a stopwatch with <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math> resolution measures the time taken for <math><mn>40</mn></math> oscillations to be <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>50</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math>. The accuracy in&nbsp;<math><mi mathvariant="normal">g</mi></math> is:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ecde3d91842a5cf7fb',
//           title: 'JEE Main 2020 (08 Jan Shift 2)',
//           heldOn: '2020-01-08T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2020-01-08T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a69417cc3fb48d66dd0',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'For the four sets of three measured physical quantities as given below. Which of the following options is correct?<br /><math><mfenced separators="|"><mrow><mi>i</mi></mrow></mfenced></math> <math><msub><mrow><mi>A</mi></mrow><mrow><mn>1</mn></mrow></msub><mo>=</mo><mn>24.36</mn><mo>,</mo><msub><mrow><mi>B</mi></mrow><mrow><mn>1</mn></mrow></msub><mo>=</mo><mn>0.0724</mn><mo>,</mo><msub><mrow><mi>C</mi></mrow><mrow><mn>1</mn></mrow></msub><mo>=</mo><mn>256.2</mn></math><br /><math><mfenced separators="|"><mrow><mi>i</mi><mi>i</mi></mrow></mfenced></math> <math><msub><mrow><mi>A</mi></mrow><mrow><mn>2</mn></mrow></msub><mo>=</mo><mn>24.44</mn><mo>,</mo><msub><mrow><mi>B</mi></mrow><mrow><mn>2</mn></mrow></msub><mo>=</mo><mn>16.082</mn><mo>,</mo><msub><mrow><mi>C</mi></mrow><mrow><mn>2</mn></mrow></msub><mo>=</mo><mn>240.2</mn></math><br /><math><mfenced separators="|"><mrow><mi>i</mi><mi>i</mi><mi>i</mi></mrow></mfenced></math> <math><msub><mrow><mi>A</mi></mrow><mrow><mn>3</mn></mrow></msub><mo>=</mo><mn>25.2</mn><mo>,</mo><msub><mrow><mi>B</mi></mrow><mrow><mn>3</mn></mrow></msub><mo>=</mo><mn>19.2812</mn><mo>,</mo><msub><mrow><mi>C</mi></mrow><mrow><mn>3</mn></mrow></msub><mo>=</mo><mn>236.183</mn></math><br /><math><mfenced separators="|"><mrow><mi>i</mi><mi>v</mi></mrow></mfenced></math> <math><msub><mrow><mi>A</mi></mrow><mrow><mn>4</mn></mrow></msub><mo>=</mo><mn>25</mn><mo>,</mo><msub><mrow><mi>B</mi></mrow><mrow><mn>4</mn></mrow></msub><mo>=</mo><mn>236.191</mn><mo>,</mo><msub><mrow><mi>C</mi></mrow><mrow><mn>4</mn></mrow></msub><mo>=</mo><mn>19.5</mn></math>',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ecde3d91842a5cf7fd',
//           title: 'JEE Main 2020 (09 Jan Shift 2)',
//           heldOn: '2020-01-09T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2020-01-09T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Different Methods used to find Error (By taking log)',
//         },
//       ],
//     },
//     {
//       _id: '648b5a68417cc3fb48d66b30',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A physical quantity <em>z</em> depends on four observables <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><mo>,</mo><mo>&#160;</mo><mi>b</mi><mo>,</mo><mo>&#160;</mo><mi>c</mi></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>d</mi></math>, as &nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>z</mi><mo>=</mo><mfrac><mrow><msup><mi>a</mi><mn>2</mn></msup><msup><mi>b</mi><mrow><mn>2</mn><mo>/</mo><mn>3</mn></mrow></msup></mrow><mrow><msqrt><mi>c</mi></msqrt><msup><mi>d</mi><mn>3</mn></msup></mrow></mfrac><mo>.</mo></math> The percentage of error in the measurement of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><mo>,</mo><mo>&#160;</mo><mi>b</mi><mo>,</mo><mo>&#160;</mo><mi>c</mi></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>d</mi></math>&nbsp;are <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mo>%</mo><mo>,</mo><mn>1</mn><mo>.</mo><mn>5</mn><mo>%</mo><mo>,</mo><mn>4</mn><mo>%</mo></math>&nbsp;&nbsp;and <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>2</mn><mo>.</mo><mn>5</mn><mo>%</mo></math> respectively. The percentage of error in <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>z</mi></math> is :',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92ecde3d91842a5cf804',
//           title: 'JEE Main 2020 (05 Sep Shift 1)',
//           heldOn: '2020-09-05T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2020-09-05T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a68417cc3fb48d66bcb',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The density of a solid metal sphere is diameter. The maximum error in the density of the sphere is&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mfenced><mfrac><mi>x</mi><mn>100</mn></mfrac></mfenced><mo>%</mo><mo>.</mo></math> If the relative errors in measuring the mass and the diameter are <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>6</mn><mo>.</mo><mn>0</mn><mo>%</mo></math>&nbsp;and&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>.</mo><mn>5</mn><mo>%</mo></math>&nbsp;respectively, the value of&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math> is <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>-</mo></math>',
//         image: null,
//       },
//       questionType: 'numerical',
//       yearsAppeared: [
//         {
//           _id: '615d92ecde3d91842a5cf806',
//           title: 'JEE Main 2020 (06 Sep Shift 1)',
//           heldOn: '2020-09-06T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2020-09-06T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Precision and Accuracy',
//         },
//       ],
//     },
//     {
//       _id: '648b5a6a417cc3fb48d671ed',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The period of oscillation of a simple pendulum is <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>T</mi><mo>=</mo><mn>2</mn><mi>&#960;</mi><msqrt><mfrac><mi>L</mi><mi>g</mi></mfrac></msqrt><mo>.</mo></math>&nbsp;Measured value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>L</mi></math> is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>.</mo><mn>0</mn><mo>&#160;</mo><mi mathvariant="normal">m</mi></math> from meter scale having a minimum division of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi>mm</mi></math> and time of one complete oscillation is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>.</mo><mn>95</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math> measured from stopwatch of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>01</mn><mo>&#160;</mo><mi mathvariant="normal">s</mi></math> resolution. The percentage error in the determination of <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>&#39;</mo><mi>g</mi><mo>&#39;</mo></math> will be:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92edde3d91842a5cf809',
//           title: 'JEE Main 2021 (24 Feb Shift 2)',
//           heldOn: '2021-02-24T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2021-02-24T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a6a417cc3fb48d6724d',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: '<p>In an octagon <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>A</mi><mi>B</mi><mi>C</mi><mi>D</mi><mi>E</mi><mi>F</mi><mi>G</mi><mi>H</mi></math>&nbsp;of equal side, what is the sum of&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mrow><mi>A</mi><mi>B</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>A</mi><mi>C</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>A</mi><mi>D</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>A</mi><mi>E</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>A</mi><mi>F</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>A</mi><mi>G</mi></mrow><mo>&#8594;</mo></mover><mo>+</mo><mover><mrow><mi>A</mi><mi>H</mi></mrow><mo>&#8594;</mo></mover><mo>,</mo></math>&nbsp;if, <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>AO</mi><mo>&#8594;</mo></mover><mo>=</mo><mn>2</mn><mover><mi mathvariant="normal">i</mi><mo>^</mo></mover><mo>+</mo><mn>3</mn><mover><mi mathvariant="normal">j</mi><mo>^</mo></mover><mo>-</mo><mn>4</mn><mover><mi mathvariant="normal">k</mi><mo>^</mo></mover></math></p><p><img src="https://cdn-question-pool.getmarks.app/pyq/jee_main/6d57eb30-500d-4e69-80b2-34a8f26821c1-image.png" style="width: 200px; height: 189px;" /></p>',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92edde3d91842a5cf80a',
//           title: 'JEE Main 2021 (25 Feb Shift 1)',
//           heldOn: '2021-02-25T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2021-02-25T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Triangle Law Of Vector Addition',
//         },
//       ],
//     },
//     {
//       _id: '648b5a6a417cc3fb48d672be',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'If <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>P</mi><mo>&#8594;</mo></mover><mo>&#215;</mo><mover><mi>Q</mi><mo>&#8594;</mo></mover><mo>=</mo><mover><mi>Q</mi><mo>&#8594;</mo></mover><mo>&#215;</mo><mover><mi>P</mi><mo>&#8594;</mo></mover></math>,&nbsp;the angle between <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>P</mi><mo>&#8594;</mo></mover></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>Q</mi><mo>&#8594;</mo></mover></math> is <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#952;</mi><mfenced><mrow><mn>0</mn><mo>&#176;</mo><mo>&#60;</mo><mi>&#952;</mi><mo>&#60;</mo><mn>360</mn><mo>&#176;</mo></mrow></mfenced></math>. The value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#952;</mi></math> will be ___<math xmlns="http://www.w3.org/1998/Math/MathML"><mo>&#176;</mo></math>.',
//         image: null,
//       },
//       questionType: 'numerical',
//       yearsAppeared: [
//         {
//           _id: '615d92edde3d91842a5cf80b',
//           title: 'JEE Main 2021 (25 Feb Shift 2)',
//           heldOn: '2021-02-25T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2021-02-25T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Angle Between the Vectors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a6b417cc3fb48d674cd',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'A wire of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">&#937;</mi></math> has a length of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">m</mi></math>. It is stretched till its length increases by <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>25</mn><mo>%</mo></math>. The percentage change in resistance to the nearest integer is :',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92edde3d91842a5cf80d',
//           title: 'JEE Main 2021 (26 Feb Shift 2)',
//           heldOn: '2021-02-26T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2021-02-26T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a69417cc3fb48d66e84',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The resistance <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>R</mi><mo>=</mo><mfrac><mi>V</mi><mi>I</mi></mfrac></math>, where <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>V</mi><mo>=</mo><mfenced><mrow><mn>50</mn><mo>&#177;</mo><mn>2</mn></mrow></mfenced><mo>&#160;</mo><mi mathvariant="normal">V</mi></math>&nbsp;and <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>I</mi><mo>=</mo><mfenced><mrow><mn>20</mn><mo>&#177;</mo><mn>0</mn><mo>.</mo><mn>2</mn></mrow></mfenced><mo>&#160;</mo><mi mathvariant="normal">A</mi></math>. The percentage error in <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>R</mi></math> is <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mo>%</mo></math>. The value of&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math> to the nearest integer is ________.',
//         image: null,
//       },
//       questionType: 'numerical',
//       yearsAppeared: [
//         {
//           _id: '615d92edde3d91842a5cf80e',
//           title: 'JEE Main 2021 (16 Mar Shift 1)',
//           heldOn: '2021-03-16T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2021-03-16T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a69417cc3fb48d66ece',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'In order to determine the Young&#39;s Modulus of a wire of radius <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>2</mn><mo>&#160;</mo><mi>cm</mi></math> (measured using a scale of least count <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>=</mo><mn>0</mn><mo>.</mo><mn>001</mn><mo>&#160;</mo><mi>cm</mi></math>) and length <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">m</mi></math>&nbsp;&nbsp;(measured using a scale of least count <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>=</mo><mn>1</mn><mo>&#160;</mo><mi>mm</mi></math>), a weight of mass <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi>kg</mi></math> (measured using a scale of least count <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>=</mo><mn>1</mn><mo>&#160;</mo><mi mathvariant="normal">g</mi></math> ) was hanged to get the elongation of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>5</mn><mo>&#160;</mo><mi>cm</mi></math> (measured using a scale of least count&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>0</mn><mo>.</mo><mn>001</mn><mo>&#160;</mo><mi>cm</mi></math>). What will be the fractional error in the value of Young&#39;s Modulus determined by this experiment?',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92edde3d91842a5cf80f',
//           title: 'JEE Main 2021 (16 Mar Shift 2)',
//           heldOn: '2021-03-16T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2021-03-16T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Fractional errors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a69417cc3fb48d66fd7',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The time period of a simple pendulum is given by <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>T</mi><mo>=</mo><mn>2</mn><mi>&#960;</mi><msqrt><mfrac><mi>l</mi><mi>g</mi></mfrac></msqrt><mo>.</mo></math>&nbsp;The measured value of the length of the pendulum is <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>10</mn><mo>&#160;</mo><mi>cm</mi></math> known to a <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>&#160;</mo><mi>mm</mi></math> accuracy. The time for <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>200</mn></math> oscillations of the pendulum is found to be <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>100</mn></math> second using a clock of <math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mi mathvariant="normal">s</mi></math> resolution. The percentage accuracy in the determination of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>g</mi></math> using this pendulum is <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi><mo>.</mo></math> The value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math> to the nearest integer is:-',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92edde3d91842a5cf812',
//           title: 'JEE Main 2021 (18 Mar Shift 1)',
//           heldOn: '2021-03-18T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2021-03-18T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Precision and Accuracy',
//         },
//       ],
//     },
//     {
//       _id: '648b5a69417cc3fb48d67044',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'The radius of a sphere is measured to be <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>(</mo><mn>7</mn><mo>.</mo><mn>50</mn><mo>&#177;</mo><mn>0</mn><mo>.</mo><mn>85</mn><mo>)</mo><mo>&#160;</mo><mi>cm</mi></math>. Suppose the percentage error in its volume is <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>. The value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>, to the nearest&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi></math>,&nbsp;is ___ .',
//         image: null,
//       },
//       questionType: 'numerical',
//       yearsAppeared: [
//         {
//           _id: '615d92edde3d91842a5cf813',
//           title: 'JEE Main 2021 (18 Mar Shift 2)',
//           heldOn: '2021-03-18T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2021-03-18T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Errors of Measurement',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Percentage error',
//         },
//       ],
//     },
//     {
//       _id: '648b5a6a417cc3fb48d6708d',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'If <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>A</mi><mo>&#8594;</mo></mover></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>B</mi><mo>&#8594;</mo></mover></math> are two vectors satisfying the relation&nbsp;<math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>A</mi><mo>&#8594;</mo></mover><mo>&#183;</mo><mover><mi>B</mi><mo>&#8594;</mo></mover><mo>=</mo><mo>|</mo><mover><mi>A</mi><mo>&#8594;</mo></mover><mo>&#215;</mo><mover><mi>B</mi><mo>&#8594;</mo></mover><mo>|</mo></math>. Then the value of <math xmlns="http://www.w3.org/1998/Math/MathML"><mo>|</mo><mover><mi>A</mi><mo>&#8594;</mo></mover><mo>-</mo><mover><mi>B</mi><mo>&#8594;</mo></mover><mo>|</mo></math> will be:',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92edde3d91842a5cf814',
//           title: 'JEE Main 2021 (20 Jul Shift 1)',
//           heldOn: '2021-07-20T09:00:00.000Z',
//         },
//       ],
//       previousYear: '2021-07-20T09:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Formula for Finding Resultant of Two Vectors',
//         },
//       ],
//     },
//     {
//       _id: '648b5a6a417cc3fb48d670f0',
//       isAttempted: false,
//       evalStatus: 'notAttempted',
//       lastPractised: '',
//       title: {
//         text: 'Two vectors <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>P</mi><mo>&#8594;</mo></mover></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>Q</mi><mo>&#8594;</mo></mover></math> have equal magnitudes. If the magnitude of <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>P</mi><mo>&#8594;</mo></mover><mo>+</mo><mover><mi>Q</mi><mo>&#8594;</mo></mover></math> is <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>n</mi></math> times the magnitude of <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>P</mi><mo>&#8594;</mo></mover><mo>-</mo><mover><mi>Q</mi><mo>&#8594;</mo></mover><mo>,</mo></math>&nbsp;then angle between <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>P</mi><mo>&#8594;</mo></mover></math> and <math xmlns="http://www.w3.org/1998/Math/MathML"><mover><mi>Q</mi><mo>&#8594;</mo></mover></math> is',
//         image: null,
//       },
//       questionType: 'singleCorrect',
//       yearsAppeared: [
//         {
//           _id: '615d92edde3d91842a5cf815',
//           title: 'JEE Main 2021 (20 Jul Shift 2)',
//           heldOn: '2021-07-20T14:00:00.000Z',
//         },
//       ],
//       previousYear: '2021-07-20T14:00:00.000Z',
//       questionLabels: [
//         {
//           isVisible: false,
//           title: 'Topic',
//           value: 'Addition and Subtraction of Vectors',
//         },
//         {
//           isVisible: false,
//           title: 'Concept',
//           value: 'Angle Between the Vectors',
//         },
//       ],
//     },
//   ],
// };

// populateQuestions(questions, undefined, 'dark');
// populateQuestions(questions, undefined, 'light');
// populateQuestions(questions, 'notebookListing', 'dark');
// populateQuestions(questions, 'notebookListing', 'light');