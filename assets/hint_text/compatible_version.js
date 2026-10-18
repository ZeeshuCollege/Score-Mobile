"use strict";

// Android bridge for compatibility
// var Android = {
//   hintClicked: function (message) {
//     console.log(message);
//   },
// };

// Function to set MathJax typesetting
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
      preview: "none",
      processEscapes: true,
      inlineMath: [["$", "$"], ["\\(", "\\)"], ["{tex}", "{/tex}"]]
    },
    CommonHTML: {
      linebreaks: {
        automatic: false
      }
    }
  });
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

// Main function to set hint text
function setHint(hintText) {
  // Get hint container
  var hintContainer = document.getElementById("hintText");

  // Set hint text
  hintContainer.innerHTML = hintText;

  // Set MathJax typesetting
  setTypeset();
}

// Example usage with the provided hint text
// var hintText = `Think about how to find the magnitude of the sum and difference of two vectors. Remember that $|\\vec{A} + \\vec{B}|^2 = (\\vec{A} + \\vec{B}) \\cdot (\\vec{A} + \\vec{B})$

// Use the trigonometric identities $1 + cos(\\theta) = 2cos^2(\\frac{\\theta}{2})$ and $1 - cos(\\theta) = 2sin^2(\\frac{\\theta}{2})$ to simplify your expressions.`;

// Initialize with the hint text
// setHint(hintText);