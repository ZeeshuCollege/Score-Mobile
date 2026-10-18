"use strict";

// let Android = {
//   selectedOption: (id) => {
//     console.log(id);
//   },
// };
// let data = {
//   attempted: {
//     visibility: {
//       platforms: ["web", "mobile"],
//       examCategory: ["615d3e0cc52ffa3c944600db"],
//       classes: [
//         "615d7815c52ffa3c944600ea",
//         "615d7802c52ffa3c944600e8",
//         "615d7821c52ffa3c944600eb",
//         "615d780ec52ffa3c944600e9",
//       ],
//       targetYear: [
//         "668bb120fbd769d68ae99718",
//         "646ca386f0794c7714105dc3",
//         "646ca368f0794c7714105dc2",
//         "615d3db7c52ffa3c944600da",
//       ],
//       isVisible: true,
//       isVisibleOnDashboard: true,
//     },
//     _id: "66b6fa1b6b571548bcd9933d",
//     componentTitle: "QuestionPoll",
//     componentPosition: 7,
//     question: "What is the capital of France?",
//     options: [
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b0e",
//         option: "Paris",
//         selectCount: 12,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b0f",
//         option: "London",
//         selectCount: 25,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b10",
//         option: "Berlin",
//         selectCount: 2,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b11",
//         option: "Madrid",
//         selectCount: 1,
//       },
//     ],
//     source: "Geography Quiz",
//     correctOption: null,
//     totalResponses: 40,
//     pollStartDate: "2024-08-01T00:00:00.000Z",
//     pollEndDate: "2024-12-08T00:00:00.000Z",
//     pollExpiryDate: "2024-12-10T00:00:00.000Z",
//     type: "poll",
//     answered: true,
//     selectedOption: "64c8b8f9f1e5a4317c8c6b11",
//   },
//   unattempted: {
//     visibility: {
//       platforms: ["web", "mobile"],
//       examCategory: ["615d3e0cc52ffa3c944600db"],
//       classes: [
//         "615d7815c52ffa3c944600ea",
//         "615d7802c52ffa3c944600e8",
//         "615d7821c52ffa3c944600eb",
//         "615d780ec52ffa3c944600e9",
//       ],
//       targetYear: [
//         "668bb120fbd769d68ae99718",
//         "646ca386f0794c7714105dc3",
//         "646ca368f0794c7714105dc2",
//         "615d3db7c52ffa3c944600da",
//       ],
//       isVisible: true,
//       isVisibleOnDashboard: true,
//     },
//     _id: "66b6fa1b6b571548bcd9933d",
//     componentTitle: "QuestionPoll",
//     componentPosition: 7,
//     question: "What is the capital of France?",
//     options: [
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b0e",
//         option: "Paris",
//         selectCount: 12,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b0f",
//         option: "London",
//         selectCount: 25,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b10",
//         option: "Berlin",
//         selectCount: 2,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b11",
//         option: "Madrid",
//         selectCount: 1,
//       },
//     ],
//     source: "Geography Quiz",
//     correctOption: null,
//     totalResponses: 40,
//     pollStartDate: "2024-08-01T00:00:00.000Z",
//     pollEndDate: "2024-12-08T00:00:00.000Z",
//     pollExpiryDate: "2024-12-10T00:00:00.000Z",
//     type: "poll",
//     answered: false,
//   },
//   attemptedEndpoll: {
//     visibility: {
//       platforms: ["web", "mobile"],
//       examCategory: ["615d3e0cc52ffa3c944600db"],
//       classes: [
//         "615d7815c52ffa3c944600ea",
//         "615d7802c52ffa3c944600e8",
//         "615d7821c52ffa3c944600eb",
//         "615d780ec52ffa3c944600e9",
//       ],
//       targetYear: [
//         "668bb120fbd769d68ae99718",
//         "646ca386f0794c7714105dc3",
//         "646ca368f0794c7714105dc2",
//         "615d3db7c52ffa3c944600da",
//       ],
//       isVisible: true,
//       isVisibleOnDashboard: true,
//     },
//     _id: "66b6fa1b6b571548bcd9933d",
//     componentTitle: "QuestionPoll",
//     componentPosition: 7,
//     question: "What is the capital of France?",
//     options: [
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b0e",
//         option: "Paris",
//         selectCount: 12,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b0f",
//         option: "London",
//         selectCount: 25,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b10",
//         option: "Berlin",
//         selectCount: 2,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b11",
//         option: "Madrid",
//         selectCount: 1,
//       },
//     ],
//     source: "Geography Quiz",
//     correctOption: null,
//     totalResponses: 40,
//     pollStartDate: "2024-08-01T00:00:00.000Z",
//     pollEndDate: "2024-07-08T00:00:00.000Z",
//     pollExpiryDate: "2024-12-10T00:00:00.000Z",
//     type: "poll",
//     answered: true,
//     selectedOption: "64c8b8f9f1e5a4317c8c6b11",
//   },
//   unattemptedEndpoll: {
//     visibility: {
//       platforms: ["web", "mobile"],
//       examCategory: ["615d3e0cc52ffa3c944600db"],
//       classes: [
//         "615d7815c52ffa3c944600ea",
//         "615d7802c52ffa3c944600e8",
//         "615d7821c52ffa3c944600eb",
//         "615d780ec52ffa3c944600e9",
//       ],
//       targetYear: [
//         "668bb120fbd769d68ae99718",
//         "646ca386f0794c7714105dc3",
//         "646ca368f0794c7714105dc2",
//         "615d3db7c52ffa3c944600da",
//       ],
//       isVisible: true,
//       isVisibleOnDashboard: true,
//     },
//     _id: "66b6fa1b6b571548bcd9933d",
//     componentTitle: "QuestionPoll",
//     componentPosition: 7,
//     question: "What is the capital of France?",
//     options: [
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b0e",
//         option: "Paris",
//         selectCount: 12,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b0f",
//         option: "London",
//         selectCount: 25,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b10",
//         option: "Berlin",
//         selectCount: 2,
//       },
//       {
//         _id: "64c8b8f9f1e5a4317c8c6b11",
//         option: "Madrid",
//         selectCount: 1,
//       },
//     ],
//     source: "Geography Quiz",
//     correctOption: null,
//     totalResponses: 40,
//     pollStartDate: "2024-08-01T00:00:00.000Z",
//     pollEndDate: "2024-07-08T00:00:00.000Z",
//     pollExpiryDate: "2024-12-10T00:00:00.000Z",
//     type: "poll",
//     answered: false,
//   },
// };

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
function customRound(number) {
  // Check if the number mod 1 is exactly 0.5
  if (number % 1 === 0.5) {
    // If the number is exactly X.5, decide based on whether X is even or odd
    var integerPart = Math.floor(number);
    if (integerPart % 2 === 0) {
      return integerPart; // Round down if the integer part is even
    } else {
      return integerPart + 1; // Round up if the integer part is odd
    }
  } else {
    // If the number is not exactly X.5, use standard rounding
    return Math.round(number);
  }
}
function hasPollEnded(pollEndDate) {
  var currentTime = new Date();
  var endTime = new Date(pollEndDate);
  return currentTime >= endTime;
}
function showMSpoll(data) {
  var totalVotes = data.options.reduce(function (sum, option) {
      return sum + option.selectCount;
    }, 0),
    pollEnded = hasPollEnded(data.pollEndDate),
    selected = data.options.findIndex(function (option) {
      return option._id === data.selectedOption;
    });
    let pollEndDate = new Date(data.pollEndDate);
      let options = {
        timeZone: "Asia/Kolkata", // IST timezone
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      let formattedEndDate = pollEndDate.toLocaleString("en-US", options);
  var poll = {
  ends: `Poll ends on ${formattedEndDate}`,
    question: data.question,
    answers: data.options,
    pollcount: totalVotes,
    answerweight: data.options,
    selectanswer: selected,
    unselected: selected === -1
  };
  var polldom = {
    body: document.querySelector("body"),
    ends: document.querySelector(".poll .poll-end"),
    question: document.querySelector(".poll .question"),
    answers: document.querySelector(".poll .answers")
  };
  polldom.ends.innerText = poll.ends;
  polldom.question.innerText = poll.question;
  polldom.answers.innerHTML = poll.answers.map(function (option, i) {
    return "\n        <div class=\"answer\" data-index=\"".concat(i, "\" data-id=\"").concat(option._id, "\">\n        <div></div>\n        <span>").concat(option.option, "</span>\n        <span class=\"percentage_bar\"></span>\n        <span class=\"percentage_value\"></span>\n        </div>\n        ");
  }).join("");
  if (poll.selectanswer === -1 && !pollEnded) {
    document.querySelectorAll(".poll .answers .answer").forEach(function (element) {
      element.addEventListener("click", function () {
        if (poll.selectanswer === -1) {
          markanswer(element.getAttribute("data-index"));
          Android.selectedOption(element.getAttribute("data-id"));
        }
      });
    });
  } else {
    markanswer(poll.selectanswer);
  }
  function markanswer(i) {
    if (!pollEnded && poll.selectanswer === -1) poll.selectanswer = +i;

    // Remove the selected class from any previously selected option
    var previouslySelected = document.querySelector(".poll .answers .answer.selected");
    if (previouslySelected) {
      previouslySelected.classList.remove("selected");
    }
    var allAnswers = document.querySelectorAll(".poll .answers .answer");

    // Add the "selected" class to the chosen answer and "unselected" to the others
    allAnswers.forEach(function (answer, index) {
      if (index === +i) {
        answer.classList.add("selected");
        answer.classList.remove("unselected");
      } else {
        answer.classList.add("unselected");
      }
    });
    showresults();
  }
  function showresults() {
    var answers = document.querySelectorAll(".poll .answers .answer");
    var totalPercentage = 0;
    var lastIndex = answers.length - 1;
    for (var i = 0; i < answers.length; i++) {
      var percentage = 0;
      if (pollEnded || !poll.unselected) {
        percentage = customRound(poll.answerweight[i].selectCount / poll.pollcount * 100);
      } else if (i == poll.selectanswer) {
        percentage = customRound((poll.answerweight[i].selectCount + 1) / (poll.pollcount + 1) * 100);
      } else {
        percentage = customRound(poll.answerweight[i].selectCount / (poll.pollcount + 1) * 100);
      }

      // Add up percentages, but for the last option, set it to the remaining percentage to ensure total is 100%
      if (i === lastIndex) {
        percentage = 100 - totalPercentage;
      } else {
        totalPercentage += percentage;
      }
      answers[i].querySelector(".percentage_bar").style.width = percentage + "%";
      answers[i].querySelector(".percentage_value").innerText = percentage + "%";
    }
    setTypeset();
  }
  setTypeset();
}
// showMSpoll(data.unattemptedEndpoll);