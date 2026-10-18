'use strict';

// var Android = {
//     showToast: function (message) {
//         console.log(message);
//     },
//     showReport: function () {
//         Android.showToast('Report-question error box opens.');
//     }
// };
// Helper Functions
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var globalTheme = 'light';
function resizeImages(images) {
  var currentScreenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    var imgSize = image.naturalWidth;
    if (imgSize >= currentScreenWidth) {
      image.style.height = 'auto';
      image.style.width = '100%';
    }
  }
}
function questionSolutionResizeAllImages(question) {
  if (question.solution.text && question.solution.text.includes('<img') || !question.solution.text && question.solution && question.solution.includes('<img')) {
    var finalImages = [],
      htmlToImages = Array.prototype.slice.call(document.images);
    for (var i = 0; i < htmlToImages.length; i++) {
      var image = htmlToImages[i];
      if (!image.complete) finalImages.push(new Promise(function (resolve) {
        image.onload = image.onerror = resolve;
      }));
    }
    Promise.all(finalImages).then(function () {
      var allSolutionImages = document.querySelectorAll('.solution-text img');
      resizeImages(allSolutionImages);
    });
  }
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
      preview: 'none',
      processEscapes: true,
      inlineMath: [['$', '$'], ['\\(', '\\)'], ['{tex}', '{/tex}']]
    },
    CommonHTML: {
      linebreaks: {
        automatic: false
      }
    }
  });
  MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
}

// Main Functions [to be called by Android]

function showSolution(question, theme, show) {
  var quesType = question ? question.type : undefined;
  createDoc({
    qType: quesType
  });
  var body = document.querySelector('body'),
    solutionTextPara = document.querySelector('.solution-text'),
    errorBox = document.getElementById('error'),
    solLabel = document.getElementById('solution-label');
  Android.showToast(JSON.stringify(question._id));
  Android.showToast(theme);
  if (theme === 'dark') {
    if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
  } else body.classList.remove('dark_mode');
  globalTheme = theme;
  if (show === true) {
    solutionTextPara.innerHTML = _typeof(question.solution) === 'object' ? question.solution.text : question.solution;
    solLabel.style.display = 'block';
    errorBox.style.display = 'block';
    // questionSolutionResizeAllImages(question);
    setTypeset();
  }
  errorBox.addEventListener('click', function () {
    Android.showReport();
  });
}
function createDoc(_ref) {
  var qType = _ref.qType;
  var sectionElement = document.querySelector('.container-fluid');
  sectionElement.innerHTML = '<div class="row">' + '<p id="solution-label" class="solution-header" style="font-family: \'SF Pro Display\';">Solution:</p>' + '<p class="solution-text"></p>' + '</div>' + '<section id="error" class="row">' + '<div class="error-container">' + '<object class="error-icon" data="../../assets/svg/Vector.svg" width="20" height="20"></object>' + '<span class="error-text">' + 'Report Error' + '</span>' + '</div>' + '</section>' + (qType === 'subjective' ? '<div class="solution-consent"><div class="form-group form-check"><input type="checkbox" class="form-check-input" id="solutionConsent" /><label class="form-check-label" for="solutionConsent">Do not automatically show solution for subjective question</label></div></div>' : '');
}

/* dummy Questions */
// var Qs = {
//     //vs dummy data
//     vsSolWithImg: {
//         "hasAccess": false,
//         "_id": "648b5a70417cc3fb48d68583",
//         "type": "singleCorrect",
//         "level": 3,
//         "category": null,
//         "approximateTimeRequired": 180,
//         "imageBaseUrl": null,
//         "helperText": null,
//         "source": "1",
//         "classes": [],
//         "exams": [
//             "615d76b2c52ffa3c944600df"
//         ],
//         "subjects": [
//             "615d70e621450b3f267390c8"
//         ],
//         "chapters": [
//             "615d6fef2b295b085ab6ebcb"
//         ],
//         "topics": [],
//         "concepts": [],
//         "microConcepts": [],
//         "questionLabels": [],
//         "previousYearPapers": [],
//         "question": {
//             "text": "The number of integral solution <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi></math>&nbsp;of <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>log</mi><mfenced><mrow><mi>x</mi><mo>+</mo><mfrac><mn>7</mn><mn>2</mn></mfrac></mrow></mfenced></msub><msup><mfenced><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac></mfenced><mn>2</mn></msup><mo>&#8805;</mo><mn>0</mn></math>&nbsp;is",
//             "image": null
//         },
//         "options": [
//             {
//                 "id": "pDSev",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>7</mn></math>",
//                 "image": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": "uVsrS",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>8</mn></math>",
//                 "image": null,
//                 "isCorrect": false
//             },
//             {
//                 "id": "RD2Cd",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>6</mn></math>",
//                 "image": null,
//                 "isCorrect": true
//             },
//             {
//                 "id": "cFhe4",
//                 "text": "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>5</mn></math>",
//                 "image": null,
//                 "isCorrect": false
//             }
//         ],
//         "correctValue": null,
//         "solution": {
//             "text": "<blockquote><p>We have been given that<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>log</mi><mfenced><mrow><mi>x</mi><mo>+</mo><mfrac><mn>7</mn><mn>2</mn></mfrac></mrow></mfenced></msub><msup><mfenced><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac></mfenced><mn>2</mn></msup><mo>&#8805;</mo><mn>0</mn></math></p><p>We need to find the domain.</p><p>For&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><msub><mi>log</mi><mrow><mi>g</mi><mfenced><mi>x</mi></mfenced></mrow></msub><mfenced><mrow><mi>f</mi><mfenced><mi>x</mi></mfenced></mrow></mfenced></math>&nbsp;is&nbsp;defined when&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>f</mi><mfenced><mi>x</mi></mfenced><mo>&#62;</mo><mn>0</mn></math>&nbsp;and&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>g</mi><mfenced><mi>x</mi></mfenced><mo>&#62;</mo><mn>0</mn><mo>,</mo><mo>&#160;</mo><mi>g</mi><mfenced><mi>x</mi></mfenced><mo>&#8800;</mo><mn>1</mn></math>.</p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mi>x</mi><mo>+</mo><mfrac><mn>7</mn><mn>2</mn></mfrac><mo>&#62;</mo><mn>0</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mi>x</mi><mo>&#62;</mo><mfrac><mrow><mo>-</mo><mn>7</mn></mrow><mn>2</mn></mfrac></math></p><p>Also,&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi><mo>+</mo><mfrac><mn>7</mn><mn>2</mn></mfrac><mo>&#8800;</mo><mn>1</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mi>x</mi><mo>&#8800;</mo><mfrac><mrow><mo>-</mo><mn>5</mn></mrow><mn>2</mn></mfrac></math></p><p>And&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8800;</mo><mn>0</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mi>x</mi><mo>&#8800;</mo><mn>7</mn></math>&nbsp;and&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi><mo>&#8800;</mo><mfrac><mn>3</mn><mn>2</mn></mfrac></math></p><p>Domain : <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mfenced><mrow><mo>-</mo><mfrac><mn>7</mn><mn>2</mn></mfrac><mo>,</mo><mo>&#8734;</mo></mrow></mfenced><mo>-</mo><mfenced close=\"}\" open=\"{\"><mrow><mfrac><mrow><mo>-</mo><mn>5</mn></mrow><mn>2</mn></mfrac><mo>,</mo><mn>0</mn><mo>,</mo><mfrac><mn>3</mn><mn>2</mn></mfrac></mrow></mfenced></math></p><p>Now let us take different cases.</p><p>Case I: <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mn>0</mn><mo>&#60;</mo><mi>x</mi><mo>+</mo><mfrac><mn>7</mn><mn>2</mn></mfrac><mo>&#60;</mo><mn>1</mn></math><br /><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mo>-</mo><mfrac><mn>7</mn><mn>2</mn></mfrac><mo>&#60;</mo><mi>x</mi><mo>&#60;</mo><mo>-</mo><mfrac><mn>5</mn><mn>2</mn></mfrac><mo>.</mo><mo>.</mo><mo>.</mo><mo>.</mo><mo>.</mo><mo>(</mo><mn>1</mn><mo>)</mo></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><msup><mfenced><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac></mfenced><mn>2</mn></msup><mo>&#8804;</mo><mn>1</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mo>-</mo><mn>1</mn><mo>&#8804;</mo><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8804;</mo><mn>1</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>+</mo><mn>1</mn><mo>&#8805;</mo><mn>0</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn><mo>+</mo><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8805;</mo><mn>0</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfrac><mrow><mn>3</mn><mi>x</mi><mo>-</mo><mn>10</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8805;</mo><mn>0</mn><mo>.</mo><mo>.</mo><mo>.</mo><mo>(</mo><mn>2</mn><mo>)</mo></math></p><p><img src=\"https://cdn-question-pool.getmarks.app/pyq/jee_main/f30cb77d-6d61-4df2-9dae-21d79ad0e070-image.png\" style=\"width: 200px; height: 108px;\" /></p><p>And&nbsp;<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>-</mo><mn>1</mn><mo>&#8804;</mo><mn>0</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn><mo>-</mo><mn>2</mn><mi>x</mi><mo>+</mo><mn>3</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8804;</mo><mn>0</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfrac><mrow><mo>-</mo><mi>x</mi><mo>-</mo><mn>4</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8804;</mo><mn>0</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfrac><mrow><mi>x</mi><mo>+</mo><mn>4</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8805;</mo><mn>0</mn><mo>.</mo><mo>.</mo><mo>.</mo><mo>.</mo><mo>(</mo><mn>3</mn><mo>)</mo></math></p><p><img src=\"https://cdn-question-pool.getmarks.app/pyq/jee_main/13daeaf2-89a8-49a3-8a01-d61a28251a39-image.png\" style=\"width: 200px; height: 95px;\" /></p><p>From <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mfenced><mn>1</mn></mfenced><mo>,</mo><mfenced><mn>2</mn></mfenced><mo>,</mo><mfenced><mn>3</mn></mfenced></math>&nbsp;we can tell that there is no intersection, no solution</p><p>Case II:</p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mi>x</mi><mo>+</mo><mfrac><mn>7</mn><mn>2</mn></mfrac><mo>&#62;</mo><mn>1</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mi>x</mi><mo>&#62;</mo><mo>-</mo><mfrac><mn>5</mn><mn>2</mn></mfrac></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><msup><mfenced><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac></mfenced><mn>2</mn></msup><mo>&#8805;</mo><mn>1</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfenced close=\"|\" open=\"|\"><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac></mfenced><mo>&#8805;</mo><mn>1</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8804;</mo><mo>-</mo><mn>1</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mi>x</mi><mo>&#8712;</mo><mfenced close=\"]\"><mrow><mfrac><mn>3</mn><mn>2</mn></mfrac><mo>,</mo><mfrac><mn>10</mn><mn>3</mn></mfrac></mrow></mfenced></math></p><p>Or,<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8805;</mo><mn>1</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfrac><mrow><mi>x</mi><mo>-</mo><mn>7</mn><mo>-</mo><mn>2</mn><mi>x</mi><mo>+</mo><mn>3</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8805;</mo><mn>0</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mfrac><mrow><mi>x</mi><mo>+</mo><mn>4</mn></mrow><mrow><mn>2</mn><mi>x</mi><mo>-</mo><mn>3</mn></mrow></mfrac><mo>&#8804;</mo><mn>0</mn></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mo>&#8658;</mo><mi>x</mi><mo>&#8712;</mo><mfenced open=\"[\"><mrow><mo>-</mo><mn>4</mn><mo>,</mo><mfrac><mn>3</mn><mn>2</mn></mfrac></mrow></mfenced></math></p><p><math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mi>x</mi><mo>&#8712;</mo><mfenced><mrow><mo>-</mo><mfrac><mn>5</mn><mn>2</mn></mfrac><mo>,</mo><mfrac><mn>3</mn><mn>2</mn></mfrac></mrow></mfenced><mo>&#8746;</mo><mfenced close=\"]\"><mrow><mfrac><mn>3</mn><mn>2</mn></mfrac><mo>,</mo><mfrac><mn>10</mn><mn>3</mn></mfrac></mrow></mfenced></math></p><p>Hence there are total 6 integers <math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mfenced open=\"{\" close=\"}\"><mrow><mo>-</mo><mn>2</mn><mo>,</mo><mo>-</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn></mrow></mfenced></math>.</p><p>Hence this is the required option.</p></blockquote>",
//             "image": null
//         },
//         "videoSolution": {
//             "videoId": "",
//             "provider": "vimeo",
//             "thumbnailLight": "https://i.ibb.co/qm1kj7g/video.png",
//             "thumbnailDark": "https://i.ibb.co/qm1kj7g/video.png",
//             "premiumModules": [
//                 {
//                     "premiumModuleId": "64c7e8e829737784b294e469",
//                     "isFree": false
//                 }
//             ]
//         },
//         "masterId": "MOGJMPYQ82303149",
//         "numericalLowerLimit": "",
//         "numericalUpperLimit": "",
//         "bucket": "Must Do Ques (JEE Main) - Any Difficulty",
//         "isRemoved": false,
//         "cpyqbSubjects": [
//             "61bb58351213731910ea0b72",
//             "6160570c0283de43c87e3e17",
//             "62962075e7f8e9ac4daeafd9",
//             "616057860283de43c87e3e1d",
//             "61964fcda5a5260118868020",
//             "615f0d109476412f48314dad",
//             "629105adee9e3ae00d63352d",
//             "629f39e4ac11b26562e0625d",
//             "61964fa4a5a526011886801f",
//             "61c05603e8ce0dc8a5c62d35",
//             "61965002a5a5260118868023",
//             "629f385f263330a77be9fa7f",
//             "61a8a2d5e8ce0dc8a5c62d2f"
//         ],
//         "cpyqbChapters": [
//             "61bb822ece8263fe50547254",
//             "61964cc0b41133d6b95803e8",
//             "61c089bff16721489e89c8cc",
//             "616025235af5c6f5cc45ff28",
//             "6160252431ea3cbf3c3b426e",
//             "61964cc1aef23a3be4fe182d",
//             "61964cc3bb4fafbb887306ea",
//             "629f390392a730783f86346f",
//             "629109e2b63efe2138b9379f",
//             "6296211b8b29c4729a42f569",
//             "61e7bd81ce5dab43c54c1c10"
//         ],
//         "cpyqbExams": [
//             "615f0e999476412f48314daf",
//             "616059af0283de43c87e3e23"
//         ]
//     },
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
//         "questionLabels": [],
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
//     }
// };

/*dummy funs*/
// var currentQ = Qs.vsSolWithImg;

/*questionSolution: question(object),theme:'dark'/'light'(string),showSolutionStatus:true/false( boolean ) */
// showSolution(currentQ, 'dark', true);
