"use strict";

// var Android = {
//   showToast: function (message) {
//     console.log(message);
//   },
//   showImage: function (src) {
//     console.log(src);
//   },
//   accordionClicked: function (status, title) {
//     console.log(status, title);
//   },
// };
// Helper Functions
var globalTheme = "light";
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
// Main Functions [to be called by Android]

function displayConceptNote(note, theme, openNoteID) {
  var notes = note === null || note === void 0 ? void 0 : note.data;
  var sectionElement = document.querySelector(".concept-container");
    sectionElement.innerHTML = ''; // Clear previous data

  if (!notes) return;
  var body = document.querySelector("body");
  if (theme === "dark") {
    if (!body.classList.contains("dark_mode")) body.classList.add("dark_mode");
  } else body.classList.remove("dark_mode");
  globalTheme = theme;

  // Populate accordion with data
  notes.concepts.forEach(function (note, index) {
    var isOpen = openNoteID === note.qcConcept; // Set first item to be open by default
    var accordionItem = createAccordionItem(note.title, note.conceptBody, index + 1, isOpen);
    sectionElement.appendChild(accordionItem);
  });
  // Function to create accordion items
  function createAccordionItem(title, note, position, isOpen) {
    var accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion");
    var header = document.createElement("div");
    header.classList.add("accordion-header");
    header.innerHTML = "\n        <div class=\"accordion-index\">\n        ".concat(position > 9 ? position : "0" + position, "\n        </div>\n        <div class=\"accordion-header-title\">").concat(title, "</div>\n        <svg class=\"accordion-arrow\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" fill=\"none\">\n        <path stroke=\"currentColor\" stroke-miterlimit=\"10\" stroke-width=\"1.5\" d=\"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z\"/>\n        <path stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" \n        stroke-width=\"1.5\" d=\"M15.375 10.875 12 14.625l-3.375-3.75\"/>\n        </svg>\n        ");
    accordionItem.appendChild(header);
    var content = document.createElement("div");
    content.classList.add("accordion-content");
    content.innerHTML = note;
    accordionItem.appendChild(content);

    // Toggle accordion content on click (set default action)
    if (isOpen) {
      accordionItem.classList.add("open");
      content.classList.add("m-16");
      Android.accordionClicked("opened", title);
    }

    // Toggle accordion content on click
    header.addEventListener("click", function () {
      var oo = accordionItem.classList.contains("open");
      Android.accordionClicked(oo ? "closed" : "opened", title);
      accordionItem.classList.toggle("open");
      content.classList.toggle("m-16");
      // Scroll the header to the top
      header.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
    return accordionItem;
  }

  //modify image tags
  var imgElements = document.querySelectorAll(".accordion-content img");
  var imgArray = Array.from(imgElements);
  imgArray.forEach(function (img) {
    try {
      var tapHandler = function tapHandler() {
        Android.showImage(img.src);
      };
      var parentNode = img.parentNode;
      img.removeAttribute("style");
      var div = document.createElement("div");
      div.setAttribute("class", "img_container");
      div.appendChild(img.cloneNode(true));
      div.addEventListener("click", tapHandler);
      var pDiv = document.createElement("div");
      pDiv.setAttribute("class", "img_view_box");
      pDiv.appendChild(div);

      // Create a new span element
      var span = document.createElement("span");
      span.textContent = "Tap on image to view or zoom.";
      span.setAttribute("style", "font-size:12px;color:#94A3B8");
      pDiv.appendChild(span);

      // Replace the image with the new structure
      if (parentNode) {
        // The parent node has a parent (grandparent), insert the child images before the parent inside the grandparent (making it a sibling)
        if (parentNode.parentNode) {
          parentNode.parentNode.insertBefore(pDiv, parentNode);
        } else {
          console.log("GrandParent node not found for image:", img.src);
        }
        // If all the images are inserted before parent (are siblings) and now this is the last one, remove the parent.
        if (img === parentNode.lastElementChild) {
          parentNode.parentNode.removeChild(parentNode);
        }
      } else {
        console.error("Parent node not found for image:", img.src);
      }
    } catch (error) {
      console.error("Error processing image:", img.src, error);
    }
  });
  setTypeset();
}

/* dummy Questions */
/*

 */

/*dummy funs*/
// var note = { data: Notes.response1 };

// 'concept note' data + 'light'/'dark' theme

// add conceptNoteID to open specific note by default
// displayConceptNote(note, "dark", "669a34561a4fb01d2277dc84");

// all notes will be closed by default
// displayConceptNote(note, "light");