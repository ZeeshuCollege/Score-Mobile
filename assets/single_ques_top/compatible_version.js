"use strict";

// Use const/let instead of var
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var globalTheme = "light";

// Modern object methods with arrow functions
var qLabelTypes = {
  topic: function topic(value) {
    return "Topic: ".concat(value);
  },
  Topic: function Topic(value) {
    return "Topic: ".concat(value);
  },
  concept: function concept(value) {
    return "Concept: ".concat(value);
  },
  Concept: function Concept(value) {
    return "Concept: ".concat(value);
  },
  pageTextToDisplay: function pageTextToDisplay(value) {
    return value;
  },
  paragraphNumber: function paragraphNumber(value) {
    return "Paragraph: ".concat(value);
  }
};
function debounce(fn) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
  var t;
  return function () {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(t);
    t = setTimeout(function () {
      return fn.apply(_this, args);
    }, wait);
  };
}
function showSkeleton() {
  var appContent = document.getElementById("appContent");
  if (appContent) {
    //      appContent.style.opacity = 0;
    //      appContent.style.pointerEvents = 'none';
    appContent.classList.remove("visible");
    // also reset transform in case reanimated
    //      appContent.style.transform = 'translateY(-20px)';
  }
}
function hideSkeleton() {
  var appContent = document.getElementById("appContent");
  if (appContent) {
    //  void appContent.offsetWidth;
    appContent.classList.add("visible");
  }
}
function setPageBackgroundColor(color) {
  document.documentElement.style.setProperty("background-color", color, "important");
  document.body.style.setProperty("background-color", color, "important");
}

// Call this when the real data has rendered/math rendered.
function revealContentAfterMathRender(_x, _x2) {
  return _revealContentAfterMathRender.apply(this, arguments);
} // Arrow functions and enhanced syntax
function _revealContentAfterMathRender() {
  _revealContentAfterMathRender = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(target, cb) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.n = 1;
          return renderMathEverywhere(target);
        case 1:
          // wait for full math rendering
          hideSkeleton(); // or your fade-in logic
          if (typeof cb === "function") cb();
        case 2:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _revealContentAfterMathRender.apply(this, arguments);
}
function sortBy(array, order, propertyRetrieverFn) {
  if (order.length) {
    return array.sort(function (a, b) {
      return order.indexOf(propertyRetrieverFn(a)) - order.indexOf(propertyRetrieverFn(b));
    });
  }
  return array.sort(function (a, b) {
    if (propertyRetrieverFn(a) < propertyRetrieverFn(b)) return -1;else if (propertyRetrieverFn(a) > propertyRetrieverFn(b)) return 1;else return 0;
  });
}
function getFormattedQuestionLabels(questionLabels, order, retrieverFn) {
  var qLabels = [];
  questionLabels.forEach(function (label) {
    if (label && label.title && qLabelTypes.hasOwnProperty(label.title)) {
      qLabels.push(label);
    }
  });
  if (qLabels && qLabels.length > 1) {
    // Use the sortBy function directly instead of as a method
    var sortedLabels = sortBy(qLabels, order, retrieverFn);

    // Map through labels and add displayText property
    return sortedLabels.map(function (el) {
      var obj = _objectSpread({}, el); // Use object spread instead of Object.assign
      if (el.title) {
        obj.displayText = qLabelTypes[el.title](el.value);
      }
      return obj;
    });
  }
  return qLabels;
}
function getQuestionLabels(questionLabels) {
  var qLabels = getFormattedQuestionLabels(questionLabels, ["topic", "concept", "pageTextToDisplay", "paragraphNumber"], function (obj) {
    return obj.title;
  });
  var qLabelString = "";
  qLabels.forEach(function (label, index) {
    qLabelString += label.displayText + (index !== qLabels.length - 1 ? ", " : "");
  });
  return qLabelString;
}
function populateOptions(optionsBox, options, type, theme) {
  var optionsHTML = "";
  if (type === "numerical") {
    optionsHTML += "\n      <div class=\"option-container row\">\n        <div id=\"main-options\" class=\"option\">\n          <input id=\"inputAns\" type=\"text\" class=\"numerical-input form-control\"\n                 placeholder=\"Enter your answer\" aria-label=\"numerical\"\n                 onkeypress=\"return isNumberKey(this, event);\">\n        </div>\n        <div class=\"option-badge\">\n          <p class=\"option-badge-text\"></p><span></span>\n        </div>\n        <div class=\"bottom-badge\">\n          <p class=\"bottom-badge-text\"></p>\n        </div>\n      </div>\n      <section class=\"bottom-label\"></section>\n    ";
  } else {
    var getOptionsArray = getOptionsByState(type, "default", theme);
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var optionSrc = getOptionsArray[i];
      // Template literals for cleaner HTML construction
      var newOption = "\n        <div class=\"option-container row\">\n          <div id=\"".concat(opt.id, "\" idx=\"").concat(i, "\" class=\"option\">\n            <img src=\"").concat(optionSrc, "\" class=\"option-icon\">\n            <div class=\"option-text\">").concat(opt.text, "</div>\n          </div>\n          <div class=\"option-badge\">\n            <p class=\"option-badge-text\"></p><span></span>\n          </div>\n        </div>\n      ");
      optionsHTML += newOption;
    }
  }
  optionsBox.innerHTML = optionsHTML;
}
function formSubmitHandler(question, type, screenType) {
  var solutionBox = document.getElementById("solutionBox");
  var solutionTextPara = solutionBox ? solutionBox.querySelector(".solution-text") : null;
  var errorBox = document.getElementById("error");
  if (solutionTextPara && question.solution) {
    solutionTextPara.innerHTML = _typeof(question.solution) === "object" ? question.solution.text : question.solution;
  }
  if (solutionBox) solutionBox.style.display = "none";
  if (errorBox) errorBox.style.display = "none";
  if (type != "numerical") {
    var optionsList = document.querySelectorAll(".option");
    for (var i = 0; i < optionsList.length; i++) {
      optionsList[i].style.pointerEvents = "none";
    }
  }
  if (solutionBox) renderMathEverywhere(solutionBox);
}
function getOptionsByState(questionType, state, theme) {
  var type = questionType === "singleCorrect" ? "single" : "multiple";
  var basePath = "../assets/svg/options";
  switch (state) {
    case "selected":
      if (theme === "dark") {
        return ["".concat(basePath, "/").concat(type, "/A/type_").concat(type, "_option_A_state_selected_dark.svg"), "".concat(basePath, "/").concat(type, "/B/type_").concat(type, "_option_B_state_selected_dark.svg"), "".concat(basePath, "/").concat(type, "/C/type_").concat(type, "_option_C_state_selected_dark.svg"), "".concat(basePath, "/").concat(type, "/D/type_").concat(type, "_option_D_state_selected_dark.svg")];
      } else {
        return ["".concat(basePath, "/").concat(type, "/A/type_").concat(type, "_option_A_state_selected.svg"), "".concat(basePath, "/").concat(type, "/B/type_").concat(type, "_option_B_state_selected.svg"), "".concat(basePath, "/").concat(type, "/C/type_").concat(type, "_option_C_state_selected.svg"), "".concat(basePath, "/").concat(type, "/D/type_").concat(type, "_option_D_state_selected.svg")];
      }
    case "correct":
      return ["".concat(basePath, "/").concat(type, "/A/type_").concat(type, "_option_A_state_correct.svg"), "".concat(basePath, "/").concat(type, "/B/type_").concat(type, "_option_B_state_correct.svg"), "".concat(basePath, "/").concat(type, "/C/type_").concat(type, "_option_C_state_correct.svg"), "".concat(basePath, "/").concat(type, "/D/type_").concat(type, "_option_D_state_correct.svg")];
    case "incorrect":
      return ["".concat(basePath, "/").concat(type, "/A/type_").concat(type, "_option_A_state_incorrect.svg"), "".concat(basePath, "/").concat(type, "/B/type_").concat(type, "_option_B_state_incorrect.svg"), "".concat(basePath, "/").concat(type, "/C/type_").concat(type, "_option_C_state_incorrect.svg"), "".concat(basePath, "/").concat(type, "/D/type_").concat(type, "_option_D_state_incorrect.svg")];
    default:
      if (theme === "dark") {
        return ["".concat(basePath, "/").concat(type, "/A/type_").concat(type, "_option_A_state_default.webp"), "".concat(basePath, "/").concat(type, "/B/type_").concat(type, "_option_B_state_default.webp"), "".concat(basePath, "/").concat(type, "/C/type_").concat(type, "_option_C_state_default.webp"), "".concat(basePath, "/").concat(type, "/D/type_").concat(type, "_option_D_state_default.webp")];
      } else {
        return ["".concat(basePath, "/").concat(type, "/A/type_").concat(type, "_option_A_state_default.webp"), "".concat(basePath, "/").concat(type, "/B/type_").concat(type, "_option_B_state_default.webp"), "".concat(basePath, "/").concat(type, "/C/type_").concat(type, "_option_C_state_default.webp"), "".concat(basePath, "/").concat(type, "/D/type_").concat(type, "_option_D_state_default.webp")];
      }
  }
}
function isNumberKey(txt, evt) {
  var charCode = evt.which ? evt.which : evt.keyCode;
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
  var solutionBox = document.getElementById("solutionBox");
  var solutionText = document.querySelector(".solution-text");
  var questionText = document.getElementById("questionText");
  var answerBox = document.getElementById("answer-box");
  var errorBox = document.getElementById("error");
  var numericalInputContainer = document.getElementById("main-options");
  var inputField = document.getElementById("inputAns");

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
  var elem = document.getElementById(element);
  var x = 0;
  var y = 0;
  while (elem != null) {
    x += elem.offsetLeft;
    y += elem.offsetTop;
    elem = elem.offsetParent;
  }
  window.scrollTo(x, y);
}
function questionReplaceNewLine(question) {
  var searchFor = /\n/g;
  var replaceWith = "<br>";
  if (question.question && question.question.text) {
    question.question.text = question.question.text.replace(searchFor, replaceWith);
  }
  if (question.solution) {
    if (question.solution.text) {
      question.solution.text = question.solution.text.replace(searchFor, replaceWith);
    } else if (typeof question.solution === "string") {
      question.solution = question.solution.replace(searchFor, replaceWith);
    }
  }
  if (question.options) {
    question.options.forEach(function (option) {
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
var debouncedResizeImages = debounce(function (images) {
  var currentScreenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  images.forEach(function (image) {
    var imgSize = image.naturalWidth;
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
  if (question.question && question.question.text && question.question.text.includes("<img")) {
    var allQuestionImages = document.querySelectorAll("#questionText img");
    resizeImages(allQuestionImages);
    var htmlToImages = Array.from(document.images);
    var promises = [];
    htmlToImages.forEach(function (image) {
      if (!image.complete) {
        promises.push(new Promise(function (resolve) {
          image.onload = image.onerror = resolve;
        }));
      }
    });
    Promise.all(promises).then(function () {
      resizeImages(allQuestionImages);
    });
  }
}
function questionSolutionResizeAllImages(question) {
  var hasSolutionImages = question.solution && question.solution.text && question.solution.text.includes("<img") || typeof question.solution === "string" && question.solution.includes("<img");
  if (hasSolutionImages) {
    var htmlToImages = Array.from(document.images);
    var promises = [];
    htmlToImages.forEach(function (image) {
      if (!image.complete) {
        promises.push(new Promise(function (resolve) {
          image.onload = image.onerror = resolve;
        }));
      }
    });
    Promise.all(promises).then(function () {
      var allSolutionImages = document.querySelectorAll(".solution-text img");
      resizeImages(allSolutionImages);
    });
  }
}
function questionOptionsResizeAllImages(question) {
  if (question.options) {
    question.options.forEach(function (quesOpt) {
      if (quesOpt.text && quesOpt.text.includes("<img")) {
        var htmlToImages = Array.from(document.images);
        var promises = [];
        htmlToImages.forEach(function (image) {
          if (!image.complete) {
            promises.push(new Promise(function (resolve) {
              image.onload = image.onerror = resolve;
            }));
          }
        });
        Promise.all(promises).then(function () {
          var allOptionImages = document.querySelectorAll(".option-text img");
          resizeImages(allOptionImages);
        });
      }
    });
  }
}
function renderMathEverywhere() {
  return _renderMathEverywhere.apply(this, arguments);
}
function _renderMathEverywhere() {
  _renderMathEverywhere = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var _window$MathJax, _window$MathJax2;
    var root,
      _args2 = arguments;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          root = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : document;
          if (root) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2);
        case 1:
          /* 1. KaTeX (sync) */
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

          /* 2. MathJax v3 */
          if (!((_window$MathJax = window.MathJax) !== null && _window$MathJax !== void 0 && _window$MathJax.typesetPromise)) {
            _context2.n = 3;
            break;
          }
          _context2.n = 2;
          return window.MathJax.typesetPromise([root]);
        case 2:
          return _context2.a(2, true);
        case 3:
          if (!((_window$MathJax2 = window.MathJax) !== null && _window$MathJax2 !== void 0 && (_window$MathJax2 = _window$MathJax2.Hub) !== null && _window$MathJax2 !== void 0 && _window$MathJax2.Queue)) {
            _context2.n = 5;
            break;
          }
          _context2.n = 4;
          return new Promise(function (resolve) {
            return window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, root, resolve]);
          });
        case 4:
          return _context2.a(2, true);
        case 5:
          return _context2.a(2, true);
      }
    }, _callee2);
  }));
  return _renderMathEverywhere.apply(this, arguments);
}
function preprocessMathStrings(str) {
  if (!str) return str;
  // Replace \mathrm{~kJ} with \;\mathrm{kJ} and similar unit hacks
  return str.replace(/\\mathrm\{~\s*([^\}]+)\}/g, "\\;\\mathrm{$1}");
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
  // First collapse newlines within LaTeX block math for KaTeX
  var processedStr = collapseBlockMath(str);
  // Then apply other LaTeX-specific preprocessing for KaTeX
  processedStr = preprocessMathStrings(processedStr);
  return processedStr;
}
function setSolutionConsent(question, isConsent) {
  var solutionConsent = document.getElementById("solutionConsent");
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
  solutionConsent.addEventListener("change", function () {
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
  var solutionBox = document.getElementById("solutionBox");
  if (!solutionBox) {
    console.error("showSolution: solutionBox not found");
    return;
  }
  var errorBox = document.getElementById("error");
  if (errorBox) errorBox.style.display = "none";

  // Get solution text from question object
  var solText = _typeof(question.solution) === "object" ? question.solution.text : question.solution;
  if (!solText) {
    console.warn("showSolution: No solution text found");
    return;
  }

  // Use template literals for cleaner HTML
  solutionBox.innerHTML = "\n    <div class=\"row\">\n      <p class=\"solution-header mb-1\" style=\"font-family: 'SF Pro Display';\">Solution:</p>\n    </div>\n    <div class=\"row\">\n      <span class=\"solution-text\">".concat(solText, "</span>\n    </div>\n  ");
  solutionBox.style.setProperty("display", "block", "important");

  // Debug: Check all visibility-related properties
  var computed = window.getComputedStyle(solutionBox);
  console.log("showSolution: Solution displayed");
  console.log("  - display:", computed.display);
  console.log("  - visibility:", computed.visibility);
  console.log("  - opacity:", computed.opacity);
  console.log("  - height:", computed.height);
  console.log("  - width:", computed.width);
  console.log("  - innerHTML length:", solutionBox.innerHTML.length);
  console.log("  - offsetHeight:", solutionBox.offsetHeight);
  console.log("  - offsetWidth:", solutionBox.offsetWidth);
  console.log("  - parent display:", window.getComputedStyle(solutionBox.parentElement).display);
  renderMathEverywhere(solutionBox);
}
function hideSolution() {
  var solutionBox = document.getElementById("solutionBox");
  if (solutionBox) {
    solutionBox.style.setProperty("display", "none", "important");
    console.log("hideSolution: Solution hidden");
  } else {
    console.error("hideSolution: solutionBox not found");
  }
  var errorBox = document.getElementById("error");
  if (errorBox) errorBox.style.display = "none";
}
function renderQuestionLabels(question) {
  var screenType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "boardsQuestion";
  if (screenType !== "boardsQuestion") return;
  var labelsContainer = document.getElementById("questionLabelsContainer");
  if (!labelsContainer || !question.questionLabels) return;

  // Filter visible labels
  var visibleLabels = question.questionLabels.filter(function (label) {
    return label && label.isVisible !== false;
  });
  if (visibleLabels.length === 0) {
    labelsContainer.innerHTML = "";
    return;
  }

  // Create tags HTML
  var tagsHTML = "";
  visibleLabels.forEach(function (label) {
    var labelText = label.title || "";
    if (labelText) {
      tagsHTML += "<span class=\"question-label-tag\">".concat(labelText, "</span>");
    }
  });
  labelsContainer.innerHTML = tagsHTML;
}
function setSubjectiveQuestion(question) {
  var showSolutionByDefault = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var screenType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
  var errorBox = document.getElementById("error");
  if (errorBox) {
    errorBox.style.display = "none";
    errorBox.addEventListener("click", function () {
      if (window.Android && Android.showReport) Android.showReport();
    });
  }
  var questionTextPara = document.getElementById("questionText");
  if (questionTextPara && question.question) {
    questionTextPara.innerHTML = prepareMathRender(question.question.text);
    renderMathEverywhere(questionTextPara);
  }

  // Render question labels
  renderQuestionLabels(question, screenType);
}
function setQuestion(percentage, finalAttempt, question, status, screenType, additionalData, theme, showSolutionByDefault) {
  try {
  //showSkeleton();
  var quesType = question ? question.type : undefined;
  resetDoc();
  createDoc({
    qType: quesType
  });
  resetFields();
  screenType = typeof screenType !== "undefined" ? screenType : "question";
  var body = document.querySelector("body");

  // Set theme
  if (theme === "dark") {
    if (!body.classList.contains("dark_mode")) body.classList.add("dark_mode");
  } else {
    body.classList.remove("dark_mode");
  }
  setPageBackgroundColor(theme === "dark" ? "#222830" : "#FFFFFF");
  globalTheme = theme;

  // Handle subjective questions differently
  if (quesType === "subjective") {
    try {
      console.log("Setting subjective question");
      setSubjectiveQuestion(question, showSolutionByDefault, screenType);
      // Reveal content after rendering (same as other question types)
      // Use setTimeout to ensure math rendering has started
      setTimeout(function () {
        revealContentAfterMathRender(document.getElementById("appContent"));
      }, 100);
    } catch (e) {
      console.error("Error - Subjective Question:", e);
    }
    return null;
  }

  // Preprocess math in question and options
  if (question && question.question) {
    var text = preserveContentFormatting(question.question.text);
    question.question.text = prepareMathRender(text);
  }
  if (question && Array.isArray(question.options)) {
    question.options.forEach(function (opt) {
      if (opt && typeof opt.text === "string") {
        opt.text = prepareMathRender(opt.text);
      }
    });
  }

  // Preprocess math in solution
  if (question && question.solution) {
    if (_typeof(question.solution) === "object" && question.solution.text) {
      question.solution.text = prepareMathRender(question.solution.text);
    } else if (typeof question.solution === "string") {
      question.solution = prepareMathRender(question.solution);
    }
  }

  // Get UI elements
  var questionTextPara = document.getElementById("questionText");
  var labelBox = document.getElementById("labelBox");
  var labelsLeft = document.querySelector(".labels-left");
  var optionsBox = document.getElementById("optionsBox");
  var solutionBox = document.getElementById("solutionBox");
  var errorBox = document.getElementById("error");
  var vsErrorBox = document.getElementById("vs-error");

  // Set question type label
  if (labelsLeft && question.type) {
    labelsLeft.textContent = question.type === "multipleCorrect" ? "Multiple correct" : question.type === "numerical" ? "Numerical Type" : "";
  }

  // Set question text
  if (questionTextPara && question.question) {
    if (screenType === "dbqQuestion") {
      var qText = question.question.text.split("</br>").slice(1).join("</br>");
      questionTextPara.innerHTML = qText;
    } else {
      questionTextPara.innerHTML = question.question.text;
    }
  }

  // Render question labels
  renderQuestionLabels(question, screenType);

  // Populate options
  if (optionsBox && question.options && quesType) {
    populateOptions(optionsBox, question.options, quesType, theme);
  }

  // Set solution text if available
  var solutionTextPara = solutionBox ? solutionBox.querySelector(".solution-text") : null;
  if (solutionTextPara && question.solution) {
    solutionTextPara.innerHTML = _typeof(question.solution) === "object" ? question.solution.text : question.solution;
  }

  // Render math in all elements
  if (questionTextPara) renderMathEverywhere(questionTextPara);
  if (optionsBox) renderMathEverywhere(optionsBox);
  if (solutionBox) renderMathEverywhere(solutionBox);

  // Handle additional data for specific screen types
  if (screenType !== "question" && screenType !== "top500question" && screenType !== "lblqQuestion" && screenType !== "dbqQuestion") {
    if (additionalData) {
      var exams = additionalData.exams,
        subjects = additionalData.subjects,
        chapters = additionalData.chapters;
      var labels = []; // Define 'labels' array that was missing

      if (subjects && subjects.length) labels.push(subjects[0].title);
      if (chapters && chapters.length) labels.push(chapters[0].title);
    }
  }

  // Handle previous answer status
  if (_typeof(status) === "object" && status !== null) {
    var prevSelectedOptions = status.selectedOption,
      prevNumericalAnswer = status.numericalAnswer,
      prevAnswerStatus = status.answerStatus;
    if (prevSelectedOptions) {
      checkOptionsAnswer(percentage, finalAttempt, question, prevSelectedOptions, prevAnswerStatus, theme, screenType);
    } else if (prevNumericalAnswer || prevNumericalAnswer === "") {
      checkNumericalAnswer(percentage, finalAttempt, question, prevNumericalAnswer, prevAnswerStatus, screenType);
    }
  } else {
    hideCheckBtnAndChangeBgColor();
  }

  // Add event listeners to options
  var optionsList = document.querySelectorAll(".option");

  // Different handling based on question type
  if (quesType === "singleCorrect" || quesType === "multipleCorrect") {
    // Get option container references
    var optionContainers = document.querySelectorAll(".option-container");
    var optionsBoxIndexes = {};

    // Map option IDs to their indices
    for (var x = 0; x < optionContainers.length; x++) {
      var optionBoxEl = optionContainers[x];
      if (optionBoxEl.firstElementChild) {
        optionsBoxIndexes[optionBoxEl.firstElementChild.id] = x;
      }
    }

    // Set up click handlers for each option
    Array.from(optionsList).forEach(function (item) {
      item.addEventListener("click", function () {
        var _this2 = this;
        if (quesType === "singleCorrect") {
          var thisId = this.id;
          var thisIndex = question.options.findIndex(function (opt) {
            return opt.id === thisId;
          });
          if (this.classList.contains("option_state_selected")) {
            // Already selected: deselect
            this.classList.remove("option_state_selected");
            if (this.firstElementChild && thisIndex >= 0) {
              this.firstElementChild.src = getOptionsByState(quesType, "default", theme)[thisIndex];
            }
          } else {
            // Deselect previous selection
            var prevSelected = document.querySelector(".option_state_selected");
            if (prevSelected && prevSelected !== this) {
              prevSelected.classList.remove("option_state_selected");
              var prevId = prevSelected.id;
              var prevIndex = question.options.findIndex(function (opt) {
                return opt.id === prevId;
              });
              if (prevSelected.firstElementChild && prevIndex >= 0) {
                prevSelected.firstElementChild.src = getOptionsByState(quesType, "default", theme)[prevIndex];
              }
            }
            // Select this one
            this.classList.add("option_state_selected");
            if (this.firstElementChild && thisIndex >= 0) {
              this.firstElementChild.src = getOptionsByState(quesType, "selected", theme)[thisIndex];
            }
          }
        } else if (quesType === "multipleCorrect") {
          // Multiple correct: toggle selected state for this option only
          var _thisId = this.id;
          var _thisIndex = question.options.findIndex(function (opt) {
            return opt.id === _thisId;
          });
          if (this.classList.contains("option_state_selected")) {
            // Currently selected; unselect it
            this.classList.remove("option_state_selected");
            if (this.firstElementChild && _thisIndex >= 0) {
              this.firstElementChild.src = getOptionsByState(quesType, "default", theme)[_thisIndex];
            }
          } else {
            // Not selected; select it
            this.classList.add("option_state_selected");
            if (this.firstElementChild && _thisIndex >= 0) {
              this.firstElementChild.src = getOptionsByState(quesType, "selected", theme)[_thisIndex];
            }
          }
        }
        // Notify Android of selection
        var optionObject = question.options.find(function (opt) {
          return opt.id === _this2.id;
        });
        if (optionObject && window.Android && Android.onOptionSelected) {
          Android.onOptionSelected(JSON.stringify(optionObject));
        }
      });
    });
  } else if (quesType === "numerical") {
    // Handle numerical input
    var numericalInput = document.querySelector(".numerical-input");
    if (numericalInput) {
      numericalInput.addEventListener("input", function (e) {
        if (window.Android && Android.onInputChanged) {
          Android.onInputChanged(e.target.value);
        }
      });
    }
  }

  // Set up error reporting
  if (vsErrorBox) {
    vsErrorBox.addEventListener("click", function () {
      if (window.Android && Android.reportVS) Android.reportVS();
    });
  }
  if (errorBox) {
    errorBox.addEventListener("click", function () {
      if (window.Android && Android.showReport) Android.showReport();
    });
  }

  //  setTimeout(() => {
  revealContentAfterMathRender(document.getElementById("appContent"));
  //    }, 20);
  } catch (e) {
    console.error("setQuestion error:", e);
  }
}
function showCheckBtnAndChangeBgColor(question, finalAttempt) {
  var sectionElement = document.querySelector(".container-fluid");
  var body = document.querySelector("body");
  if (sectionElement) sectionElement.classList.add("answered");
  if (body) {
    setPageBackgroundColor(body.classList.contains("dark_mode") ? "#222830" : "#fff");
  }
  if (finalAttempt === false) {
    var labelBox = document.getElementById("labelBox");
    var labelsLeft = document.querySelector(".labels-left");
    if (labelBox) {
      var showCorrectAnswerBtn = document.createElement("div");
      showCorrectAnswerBtn.id = "showCorrectAnswerBtn";
      showCorrectAnswerBtn.innerHTML = "Show correct answer";
      if (question.type === "numerical" || question.type === "multipleCorrect") {
        if (labelsLeft) labelsLeft.style.setProperty("max-width", "fit-content", "important");
        showCorrectAnswerBtn.style.setProperty("max-width", "fit-content", "important");
      }
      showCorrectAnswerBtn.addEventListener("click", function () {
        // Create a closure over finalAttempt
        var updatedFinalAttempt = true;
        if (window.Android && Android.showCorrectAnswer) {
          Android.showCorrectAnswer(JSON.stringify(question));
        }
        showCorrectAnswerBtn.style.display = "none";
      });
      labelBox.insertBefore(showCorrectAnswerBtn, labelBox.firstChild.nextSibling);
    }
  } else {
    var _showCorrectAnswerBtn = document.getElementById("showCorrectAnswerBtn");
    if (_showCorrectAnswerBtn) {
      _showCorrectAnswerBtn.style.display = "none";
    }
  }
}
function hideCheckBtnAndChangeBgColor() {
  var sectionElement = document.querySelector(".container-fluid");
  var body = document.querySelector("body");
  if (sectionElement && sectionElement.classList.contains("answered")) {
    sectionElement.classList.remove("answered");
  }
  if (body) {
    setPageBackgroundColor(body.classList.contains("dark_mode") ? "#222830" : "#FFFFFF");
  }
  var showCorrectAnswerBtn = document.getElementById("showCorrectAnswerBtn");
  if (showCorrectAnswerBtn) {
    showCorrectAnswerBtn.style.display = "none";
  }
}
function customRound(number) {
  if (number % 1 === 0.5) {
    var integerPart = Math.floor(number);
    return integerPart % 2 === 0 ? integerPart : integerPart + 1;
  }
  return Math.round(number);
}
function getPercentage(optionId, dataArray) {
  var foundOption = dataArray.find(function (option) {
    return option.optionId === optionId;
  });
  return foundOption ? "".concat(customRound(foundOption.percentage), "%") : "0%";
}
function checkNumericalAnswer(percentage, finalAttempt, question, input, status, screenType) {
  if (_typeof(question) === "object") {
    showCheckBtnAndChangeBgColor(question, finalAttempt);
  }

  // Handle trailing decimal point
  var newValue = input && input[input.length - 1] === "." ? input + "0" : null;
  var correctAnswer = question.correctValue;

  // Get required DOM elements
  var solutionBox = document.getElementById("solutionBox");
  var solutionBadge = document.querySelector(".option-badge");
  var solutionBadgeText = document.querySelector(".option-badge-text");
  var numericalInputContainer = document.getElementById("main-options");
  var inputField = document.getElementById("inputAns");
  var userAnswer = newValue || input;

  // Show answer box
  if (solutionBadgeText) {
    var answerBox = document.getElementById("answer-box");
    if (answerBox) {
      answerBox.innerHTML = "\n        <div class=\"row\"><p class=\"solution-header\">Answer:</p></div>\n        <div class=\"row\"><p class=\"answer-text\">".concat(correctAnswer, "</p></div>\n      ");
    } else if (solutionBox) {
      var newDiv = document.createElement("div");
      newDiv.id = "answer-box";
      newDiv.innerHTML = "\n        <div class=\"row\"><p class=\"solution-header\">Answer:</p></div>\n        <div class=\"row\"><p class=\"answer-text\">".concat(correctAnswer, "</p></div>\n      ");
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
      var buttonBadge = document.querySelector(".bottom-badge");
      var buttonBadgeText = document.querySelector(".bottom-badge-text");
      if (buttonBadge && buttonBadgeText) {
        buttonBadgeText.innerHTML = "<strong>".concat(percentage, "</strong>% Got it correct");
        buttonBadge.classList.add("display-bottom-badge-text");
      }
    }
    if (!status) {
      var bottomLabel = document.querySelector(".bottom-label");
      if (bottomLabel) {
        bottomLabel.innerHTML = "\n          <div id=\"correct-label-text\">Correct Answer:&nbsp;</div>\n          <div id=\"label-answer\">".concat(correctAnswer, "</div>\n        ");
      }
    }
  }

  // Submit the form
  formSubmitHandler(question, "numerical", screenType);
}
function checkOptionsAnswer(percentage, finalAttempt, question, selectedOptions, status, theme, screenType) {
  if (_typeof(question) === "object") {
    showCheckBtnAndChangeBgColor(question, finalAttempt);
  }

  // Get option container references
  var optionsBox = document.querySelectorAll(".option-container");
  var optionsBoxIndexes = {};

  // Map option containers to their indices
  for (var x = 0; x < optionsBox.length; x++) {
    var optionBoxEl = optionsBox[x];
    if (optionBoxEl.firstElementChild) {
      optionsBoxIndexes[optionBoxEl.firstElementChild.id] = x;
    }
  }

  // Build a map of correct options
  var options = {};
  if (question.options) {
    question.options.forEach(function (opt) {
      options[opt.id] = !!opt.isCorrect;
    });
  }

  // Mark correct answers for final attempt
  if (finalAttempt === true) {
    for (var key in options) {
      if (options[key] === true) {
        var option = document.getElementById(key);
        if (option) {
          var optionIcon = option.firstElementChild;
          var optionBadge = option.nextElementSibling;
          if (optionBadge) {
            var optionBadgeText = optionBadge.firstElementChild;
            if (optionBadgeText) {
              optionBadgeText.style.paddingRight = "15px";
              optionBadge.classList.add("correct-answer");
              option.style.border = "1px solid #31d99c";
              if (Array.isArray(percentage) && optionIcon) {
                var newElement = document.createElement("div");
                newElement.innerHTML = question.type === "singleCorrect" ? "<div id=\"singleCorrectIcon\">".concat(getPercentage(key, percentage), "</div>") : "<div id=\"multipleCorrectIcon\">".concat(getPercentage(key, percentage), "</div>");
                optionIcon.replaceWith(newElement);
              } else if (optionIcon) {
                optionIcon.src = getOptionsByState(question.type, "correct", theme)[optionsBoxIndexes[key] || 0];
              }
            }
          }
        }
      } else {
        var _option = document.getElementById(key);
        if (_option) {
          var _optionIcon = _option.firstElementChild;
          if (_optionIcon) {
            if (Array.isArray(percentage)) {
              var _newElement = document.createElement("div");
              _newElement.innerHTML = question.type === "singleCorrect" ? "<div id=\"singleDefaultIcon\">".concat(getPercentage(key, percentage), "</div>") : "<div id=\"multipleDefaultIcon\">".concat(getPercentage(key, percentage), "</div>");
              _optionIcon.replaceWith(_newElement);
            } else {
              _optionIcon.src = getOptionsByState(question.type, "default", theme)[optionsBoxIndexes[key] || 0];
            }
          }
        }
      }
    }
  }

  // Mark selected options
  if (selectedOptions && Array.isArray(selectedOptions)) {
    selectedOptions.forEach(function (selectedOpt) {
      var opt = selectedOpt.id;
      var option = document.getElementById(opt);
      if (option) {
        var _optionIcon2 = option.firstElementChild;
        var _optionBadge = option.nextElementSibling;
        if (_optionBadge) {
          var _optionBadgeText = _optionBadge.firstElementChild;
          if (_optionBadgeText) {
            _optionBadgeText.textContent = "Your answer";
            _optionBadgeText.style.paddingRight = "20px";

            // Determine if the answer is correct
            if (options[opt] && (status === 0 || status === 1 || status === 2)) {
              _optionBadge.classList.add("correct-answer");
              option.style.border = "1px solid #31d99c";
              if (Array.isArray(percentage) && _optionIcon2) {
                var _newElement2 = document.createElement("div");
                _newElement2.innerHTML = question.type === "singleCorrect" ? "<div id=\"singleCorrectIcon\">".concat(getPercentage(opt, percentage), "</div>") : "<div id=\"multipleCorrectIcon\">".concat(getPercentage(opt, percentage), "</div>");
                _optionIcon2.replaceWith(_newElement2);
              } else if (_optionIcon2) {
                _optionIcon2.src = getOptionsByState(question.type, "correct", theme)[optionsBoxIndexes[opt] || 0];
              }
            } else {
              _optionBadge.classList.add("incorrect-answer");
              option.style.border = "1px solid #ff5858";
              if (Array.isArray(percentage) && _optionIcon2) {
                var _newElement3 = document.createElement("div");
                _newElement3.innerHTML = question.type === "singleCorrect" ? "<div id=\"singleIncorrectIcon\">".concat(getPercentage(opt, percentage), "</div>") : "<div id=\"multipleIncorrectIcon\">".concat(getPercentage(opt, percentage), "</div>");
                _optionIcon2.replaceWith(_newElement3);
              } else if (_optionIcon2) {
                _optionIcon2.src = getOptionsByState(question.type, "incorrect", theme)[optionsBoxIndexes[opt] || 0];
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
function createDoc(_ref) {
  var qType = _ref.qType;
  var sectionElement = document.querySelector(".container-fluid");
  if (!sectionElement) return;

  // Use template literals for cleaner HTML
  sectionElement.innerHTML = "\n      <section id=\"questionSectionContainer\" class=\"row skeleton-loading\">\n        <p id=\"questionText\" class=\"loading-placeholder\"></p>\n        <section id=\"questionLabelsContainer\" class=\"\"></section>\n      </section>\n      <section id=\"labelBox\" class=\"row skeleton-loading\">\n        <div class=\"labels-left loading-placeholder-small\"></div>\n      </section>\n      <section id=\"optionsBox\" class=\"skeleton-loading\">\n        <div class=\"loading-placeholder-option\"></div>\n        <div class=\"loading-placeholder-option\"></div>\n        <div class=\"loading-placeholder-option\"></div>\n        <div class=\"loading-placeholder-option\"></div>\n      </section>\n    ".concat(qType !== "subjective" ? "\n    <section id=\"solutionBox\" style=\"display:none;\">\n      <div class=\"row px-0\">\n        <p class=\"solution-header\" style=\"font-family: 'SF Pro Display';\">Solution:</p>\n      </div>\n      <div class=\"row\">\n        <p class=\"solution-text\"></p>\n      </div>\n    </section>\n    " : "", "\n    <section id=\"error\" class=\"row\" style=\"display:none;\">\n      <div class=\"error-container\">\n        <object class=\"error-icon\" data=\"../../../../assets/svg/Vector.svg\" width=\"20\" height=\"20\"></object>\n        <span class=\"error-text\">Report Error</span>\n      </div>\n    </section>\n  ");
}
function resetDoc() {
  var sectionElement = document.querySelector(".container-fluid");
  if (sectionElement) sectionElement.innerHTML = "";
}
function clearSelectedOptions() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  if (type === "numerical") {
    var inputAns = document.getElementById("inputAns");
    if (inputAns) inputAns.value = "";
  } else if (type === "singleCorrect" || type === "multipleCorrect") {
    var selectedOptions = document.querySelectorAll(".option.option_state_selected");
    selectedOptions.forEach(function (option) {
      var index = option.getAttribute("idx");
      option.classList.remove("option_state_selected");
      if (option.firstElementChild && index !== null) {
        option.firstElementChild.src = getOptionsByState(type, "default", globalTheme)[index];
      }
    });
  }
}
function preserveContentFormatting(content) {
  if (!content || typeof content !== "string") return content;

  // Replace newlines with <br> tags, but only where they're not already in HTML
  return content
  // First preserve existing <br> tags
  .replace(/<br\s*\/?>/gi, "##BR_PLACEHOLDER##")
  // Replace actual newlines with <br>
  .replace(/\n/g, "<br>")
  // Restore original <br> tags
  .replace(/##BR_PLACEHOLDER##/g, "<br>")
  // Preserve consecutive spaces (which HTML collapses)
  .replace(/  +/g, function (match) {
    return "&nbsp;".repeat(match.length);
  });
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
