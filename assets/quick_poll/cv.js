"use strict";

// let Android = {
//   selectedOption: (id) => {
//     console.log(id);
//   },
// };
// let data = {
//   unselected: {
//     found: true,
//     message: "Fetched the active question poll.",
//     _id: "66b6fa1b6b571548bcd9933d",
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
//         selectCount: 23,
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
//     pollStartDate: "2024-08-01T00:00:00.000Z",
//     pollEndDate: "2024-12-08T00:00:00.000Z",
//     pollExpiryDate: "2024-12-08T00:00:00.000Z",
//     pollExpiryDate: "2024-09-11T07:03:09.122Z",
//   },
//   selected: {
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
//         selectCount: 23,
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
//         userSelectedOption: true,
//       },
//     ],
//     source: "Geography Quiz",
//     pollStartDate: "2024-08-01T00:00:00.000Z",
//     pollEndDate: "2024-12-08T00:00:00.000Z",
//     pollExpiryDate: "2024-12-08T00:00:00.000Z",
//     pollExpiryDate: "2024-09-11T07:03:09.122Z",
//   },
//   selectedPollEnded: {
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
//         selectCount: 23,
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
//         userSelectedOption: true,
//       },
//     ],
//     source: "Geography Quiz",
//     pollStartDate: "2024-08-01T00:00:00.000Z",
//     pollEndDate: "2024-07-08T00:00:00.000Z",
//     pollExpiryDate: "2024-07-08T00:00:00.000Z",
//     pollExpiryDate: "2024-09-11T07:03:09.122Z",
//   },
//   unselectedPollEnded: {
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
//         selectCount: 23,
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
//     pollStartDate: "2024-08-01T00:00:00.000Z",
//     pollEndDate: "2024-07-08T00:00:00.000Z",
//     pollExpiryDate: "2024-07-08T00:00:00.000Z",
//     pollExpiryDate: "2024-09-11T07:03:09.122Z",
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
function showpoll(data) {
  var theme = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "light";
  var totalVotes = data.options.reduce(function (sum, option) {
      return sum + option.selectCount;
    }, 0),
    pollEnded = hasPollEnded(data.pollEndDate),
    selected = data.options.findIndex(function (option) {
      return option.userSelectedOption === true;
    });
  var poll = {
    question: data.question,
    answers: data.options,
    pollcount: totalVotes,
    answerweight: data.options,
    selectanswer: selected,
    unselected: selected === -1
  };
  var polldom = {
    body: document.querySelector("body"),
    question: document.querySelector(".poll .question"),
    answers: document.querySelector(".poll .answers")
  };
  polldom.body.setAttribute("data-theme", theme);
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
// showpoll(data.unselectedPollEnded, "dark"); //default theme is "light"