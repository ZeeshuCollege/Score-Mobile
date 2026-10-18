"use strict";

// Global variables
var globalTheme = "light";
var questionData = null;
var selectedOptions = new Set();
var numericalAnswer = "";

// KaTeX configuration
const katexConfig = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false },
    { left: '\\[', right: '\\]', display: true },
    { left: '{tex}', right: '{/tex}', display: false }
  ],
  throwOnError: false,
  strict: false,
  trust: true,
  macros: {
    "\\mathrm": "\\text"
  }
};

// Helper Functions
function parseHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.firstChild;
}

// Improved typesetting with KaTeX instead of MathJax
function setTypeset() {
  // Use the global renderMath function defined in the HTML
  if (window.renderMath) {
    window.renderMath();
  } else if (typeof renderMathInElement === 'function') {
    // Fallback if global function isn't available
    renderMathInElement(document.body, katexConfig);
  }
  
  // Handle any MathML in the page by converting it to LaTeX when possible
  handleMathML();
}

// Function to handle MathML elements and convert them to LaTeX when possible
function handleMathML() {
  // Basic handling of common MathML elements
  const mathmlElements = document.querySelectorAll('math');
  mathmlElements.forEach(function(element) {
    try {
      // Create a container for KaTeX to render into
      const container = document.createElement('span');
      container.className = 'katex-mathml-converted';
      
      // Get LaTeX equivalent - simplified conversion
      const latex = simpleMathMLToLaTeX(element.outerHTML);
      
      // Replace the MathML with KaTeX rendered LaTeX
      if (latex && typeof katex !== 'undefined') {
        katex.render(latex, container, { throwOnError: false });
        element.parentNode.replaceChild(container, element);
      }
    } catch(e) {
      // If conversion fails, leave original MathML
      console.warn('MathML conversion failed', e);
    }
  });
}

// Very basic MathML to LaTeX conversion for common elements
function simpleMathMLToLaTeX(mathml) {
  // This is a simplified converter and won't handle all MathML cases
  // For a production app, a more comprehensive converter would be needed
  let latex = '';
  
  // Common replacements for basic math operations
  mathml = mathml.replace(/<mo>=<\/mo>/g, '=');
  mathml = mathml.replace(/<mo>\+<\/mo>/g, '+');
  mathml = mathml.replace(/<mo>-<\/mo>/g, '-');
  mathml = mathml.replace(/<mo>\*<\/mo>/g, '\\cdot ');
  mathml = mathml.replace(/<mo>×<\/mo>/g, '\\times ');
  mathml = mathml.replace(/<mo>÷<\/mo>/g, '\\div ');
  
  // Handle fractions
  mathml = mathml.replace(/<mfrac>(.*?)<\/mfrac>/g, function(match, content) {
    const parts = content.split('</mn><mn>');
    if (parts.length === 2) {
      const num = parts[0].replace(/<mn>/g, '');
      const den = parts[1].replace(/<\/mn>/g, '');
      return `\\frac{${num}}{${den}}`;
    }
    return match;
  });
  
  // Handle numbers and variables
  mathml = mathml.replace(/<mn>(.*?)<\/mn>/g, '$1');
  mathml = mathml.replace(/<mi>(.*?)<\/mi>/g, '$1');
  
  // Extract the basic content
  const contentMatch = mathml.match(/>([^<>]+)</g);
  if (contentMatch) {
    latex = contentMatch.map(m => m.substring(1, m.length - 1)).join(' ');
  }
  
  return latex || undefined;
}

function renderMath() {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.body, katexConfig);
  }
}

function renderQuestionWithKaTeX(element, text) {
  if (!text) return;
  
  // First replace newlines with <br>
  text = text.replace(/\n/g, '<br>');
  
  // Handle any MathML that might be in the text and replace with LaTeX
  text = convertMathMLToLaTeX(text);
  
  // Set the HTML content
  element.innerHTML = text;
  
  // Render math with KaTeX
  renderMath();
}

function convertMathMLToLaTeX(text) {
  // Very basic conversion from MathML to LaTeX for most common cases
  // In a real implementation, this would be more comprehensive
  if (text.includes('<math')) {
    // Simple regex to replace basic MathML with LaTeX
    text = text.replace(/<math[^>]*>(.*?)<\/math>/g, function(match) {
      // Extract content between <math> tags
      let content = match.replace(/<math[^>]*>/, '').replace(/<\/math>/, '');
      
      // Perform basic MathML to LaTeX conversions
      content = content
        .replace(/<mfrac>/g, '\\frac{')
        .replace(/<\/mfrac>/g, '}')
        .replace(/<mn>(\d+)<\/mn>/g, '$1')
        .replace(/<mi>(\w+)<\/mi>/g, '$1')
        .replace(/<msup>/g, '^{')
        .replace(/<\/msup>/g, '}')
        .replace(/<mo>(\+|\-|\*|\/|=)<\/mo>/g, '$1');
      
      return '$' + content + '$';
    });
  }
  return text;
}

function loadQuestion(question) {
  questionData = question;
  
  // Reset fields
  document.getElementById('questionText').innerHTML = '';
  document.getElementById('optionsBox').innerHTML = '';
  document.getElementById('solutionBox').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.querySelector('.solution-text').innerHTML = '';
  document.getElementById('action-show-solutions').style.display = 'none';
  selectedOptions.clear();
  numericalAnswer = '';
  
  // Set question text
  renderQuestionWithKaTeX(document.getElementById('questionText'), question.question.text);
  
  // Defer image handling to prevent UI blocking
  setTimeout(function() {
    questionTextResizeAllImages(question);
  }, 0);
  
  // Handle options
  populateOptions(question.options, question.type);
  
  // Display error report button
  document.getElementById('error').addEventListener('click', function() {
    Android.showReport();
  });
}

function populateOptions(options, type) {
  const optionsBox = document.getElementById('optionsBox');
  
  if (type === 'numerical') {
    const optionContainer = document.createElement('div');
    optionContainer.className = 'option-container row';
    optionContainer.innerHTML = `
      <div id="main-options" class="option">
        <input id="inputAns" type="text" class="numerical-input form-control" 
               placeholder="Enter your answer" aria-label="numerical">
      </div>
      <div class="option-badge"><p class="option-badge-text"></p></div>
    `;
    optionsBox.appendChild(optionContainer);
    
    // Set up numerical input handler
    const inputField = document.getElementById('inputAns');
    inputField.addEventListener('input', function(e) {
      numericalAnswer = e.target.value;
      Android.onInputChanged(numericalAnswer);
    });
  } else {
    options.forEach((opt, index) => {
      const optionContainer = document.createElement('div');
      optionContainer.className = 'option-container row';
      
      const option = document.createElement('div');
      option.id = opt.id;
      option.className = 'option';
      
      // Create option content
      const optionIcon = document.createElement('img');
      optionIcon.className = 'option-icon';
      optionIcon.src = getOptionIcon(type, index);
      
      const optionText = document.createElement('div');
      optionText.className = 'option-text';
      renderQuestionWithKaTeX(optionText, opt.text);
      
      option.appendChild(optionIcon);
      option.appendChild(optionText);
      
      // Create option badge
      const optionBadge = document.createElement('div');
      optionBadge.className = 'option-badge';
      optionBadge.innerHTML = '<p class="option-badge-text"></p>';
      
      optionContainer.appendChild(option);
      optionContainer.appendChild(optionBadge);
      optionsBox.appendChild(optionContainer);
      
      // Add click handler
      option.addEventListener('click', function() {
        handleOptionClick(option, opt, type, index);
      });
    });
  }
}

function getOptionIcon(type, index) {
  const prefix = "../assets/svg/options/";
  const optionChars = ['A', 'B', 'C', 'D'];
  const typePrefix = type === 'singleCorrect' ? 'single' : 'multiple';
  
  return `${prefix}${typePrefix}/${optionChars[index]}/type_${typePrefix}_option_${optionChars[index]}_state_default.webp`;
}

function handleOptionClick(optionElement, option, type, index) {
  if (type === 'singleCorrect') {
    // Remove selection from all other options
    document.querySelectorAll('.option_state_selected').forEach(el => {
      el.classList.remove('option_state_selected');
      el.firstElementChild.src = getOptionIcon(type, Array.from(el.parentNode.parentNode.children).indexOf(el.parentNode));
    });
    
    // Select this option
    optionElement.classList.add('option_state_selected');
    optionElement.firstElementChild.src = getOptionSelectedIcon(type, index);
    selectedOptions.clear();
    selectedOptions.add(option);
  } else {
    // Toggle selection for this option
    if (optionElement.classList.contains('option_state_selected')) {
      optionElement.classList.remove('option_state_selected');
      optionElement.firstElementChild.src = getOptionIcon(type, index);
      selectedOptions.delete(option);
    } else {
      optionElement.classList.add('option_state_selected');
      optionElement.firstElementChild.src = getOptionSelectedIcon(type, index);
      selectedOptions.add(option);
    }
  }
  
  Android.onOptionSelected(JSON.stringify(option));
}

function getOptionSelectedIcon(type, index) {
  const prefix = "../assets/svg/options/";
  const optionChars = ['A', 'B', 'C', 'D'];
  const typePrefix = type === 'singleCorrect' ? 'single' : 'multiple';
  const themeSuffix = globalTheme === 'dark' ? '_dark' : '';
  
  return `${prefix}${typePrefix}/${optionChars[index]}/type_${typePrefix}_option_${optionChars[index]}_state_selected${themeSuffix}.svg`;
}

function showSolution() {
  const solutionBox = document.getElementById('solutionBox');
  const solutionText = document.querySelector('.solution-text');
  
  if (questionData && questionData.solution) {
    const solText = typeof questionData.solution === 'object' ? 
      questionData.solution.text : questionData.solution;
    
    renderQuestionWithKaTeX(solutionText, solText);
    solutionBox.style.display = 'block';
    document.getElementById('error').style.display = 'block';
    
    // Disable options
    const optionsList = document.querySelectorAll('.option');
    optionsList.forEach(option => {
      option.style.pointerEvents = 'none';
    });
  }
}

function renderSolution(question) {
  const solutionTextPara = document.querySelector(".solution-text");
  if (solutionTextPara) {
    solutionTextPara.innerHTML = 
      typeof question.solution === "object" ? question.solution.text : question.solution;
  }
  
  // Apply KaTeX rendering
  setTypeset();
  
  // Handle images after math is rendered
  setTimeout(function() {
    questionSolutionResizeAllImages(question);
  }, 10);
}

// Main function to be called from Android
function setQuestion(question, status, screenType, additionalData, theme) {
  questionData = question;
  globalTheme = theme || 'light';
  
  // Apply theme
  if (theme === 'dark') {
    document.body.classList.add('dark_mode');
  } else {
    document.body.classList.remove('dark_mode');
  }
  
  // Load question with KaTeX
  loadQuestion(question);
  
  // Show solutions button
  const showSolutionsBtn = document.getElementById('action-show-solutions');
  showSolutionsBtn.style.display = 'flex';
  showSolutionsBtn.addEventListener('click', function() {
    showSolution();
    Android.onShowSolutions('solutionBox');
  });
  
  // Handle previously answered state
  if (status) {
    if (status.selectedOption) {
      showSelectedAnswers(status.selectedOption, status.answerStatus);
    } else if (status.numericalAnswer) {
      showNumericalAnswer(status.numericalAnswer, status.answerStatus);
    }
  }
}

function showSelectedAnswers(selectedOpts, status) {
  // Mark correct answers
  questionData.options.forEach((opt, i) => {
    if (opt.isCorrect) {
      const optElement = document.getElementById(opt.id);
      if (optElement) {
        const badge = optElement.nextElementSibling;
        const badgeText = badge.firstElementChild;
        badgeText.textContent = "Correct Answer";
        badge.classList.add("correct-answer");
        badge.style.display = 'flex';
        optElement.style.border = "1px solid #31d99c";
      }
    }
  });
  
  // Mark user's selections
  selectedOpts.forEach(opt => {
    const optElement = document.getElementById(opt.id);
    if (optElement) {
      const badge = optElement.nextElementSibling;
      const badgeText = badge.firstElementChild;
      
      if (opt.isCorrect) {
        badgeText.textContent = "You Marked | Correct Answer";
        badge.classList.add("correct-answer");
        badge.style.display = 'flex';
        optElement.style.border = "1px solid #31d99c";
      } else {
        badgeText.textContent = "You Marked | Incorrect Answer";
        badge.classList.add("incorrect-answer");
        badge.style.display = 'flex';
        optElement.style.border = "1px solid #ff5858";
      }
    }
  });
  
  // Show solution
  showSolution();
}

function showNumericalAnswer(userAnswer, status) {
  const inputField = document.getElementById('inputAns');
  const numericalContainer = document.getElementById('main-options');
  const badge = numericalContainer.nextElementSibling;
  const badgeText = badge.firstElementChild;
  
  // Set user's answer in input field
  inputField.value = userAnswer;
  inputField.disabled = true;
  
  // Show correct/incorrect badge
  if (status) {
    badgeText.textContent = "Correct Answer";
    badge.classList.add("correct-answer");
    badge.style.display = 'flex';
    numericalContainer.style.border = "1px solid #31d99c";
  } else {
    badgeText.textContent = "Incorrect Answer";
    badge.classList.add("incorrect-answer");
    badge.style.display = 'flex';
    numericalContainer.style.border = "1px solid #ff5858";
  }
  
  // Show solution
  showSolution();
}

// Initialize when window loads
window.addEventListener('DOMContentLoaded', function() {
  // Preload KaTeX fonts to avoid flickering
  const fontPreloader = document.createElement('div');
  fontPreloader.style.visibility = 'hidden';
  fontPreloader.style.position = 'absolute';
  fontPreloader.style.top = '-9999px';
  fontPreloader.innerHTML = '$x^2$';
  document.body.appendChild(fontPreloader);
  
  // Auto-render KaTeX as soon as it's loaded
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(fontPreloader, katexConfig);
  }
});
