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
    if (
        (question.solution.text && question.solution.text.includes('<img')) ||
        (!question.solution.text && question.solution && question.solution.includes('<img'))
    ) {
        var finalImages = [],
            htmlToImages = Array.prototype.slice.call(document.images);

        for (var i = 0; i < htmlToImages.length; i++) {
            var image = htmlToImages[i];
            if (!image.complete)
                finalImages.push(
                    new Promise(function (resolve) {
                        image.onload = image.onerror = resolve;
                    }),
                );
        }

        Promise.all(finalImages).then(function () {
            var allSolutionImages = document.querySelectorAll('.solution-text img');
            resizeImages(allSolutionImages);
        });
    }
}

function setTypeset() {
    if (window.mathjaxVersionLoaded === 3 && window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise();
    } else if ((window.mathjaxVersionLoaded === 2 || typeof MathJax.Hub !== 'undefined') && window.MathJax && MathJax.Hub && MathJax.Hub.Queue) {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    } else {
        console.warn('MathJax was not loaded!');
    }
}

// Main Functions [to be called by Android]

function showVSSolution(question, theme, show) {
    var quesType = question ? question.type : undefined;
    createDoc({ qType: quesType });
    var body = document.querySelector('body'),
        solutionTextPara = document.querySelector('.solution-text'),
        solLabel = document.getElementById('solution-label');
    Android.showToast(JSON.stringify(question._id));
    Android.showToast(theme);
    if (theme === 'dark') {
        if (!body.classList.contains('dark_mode')) body.classList.add('dark_mode');
    } else body.classList.remove('dark_mode');
    globalTheme = theme;
    if (show === true) {
        solutionTextPara.innerHTML = typeof question.solution === 'object' ? question.solution.text : question.solution;
        solLabel.style.display = 'block'
        // questionSolutionResizeAllImages(question);
        setTypeset();
    }
}

function createDoc({ qType }) {
    var sectionElement = document.querySelector('.container-fluid');
    sectionElement.innerHTML =
        '<div class="row">' +
        '<p id="solution-label" class="solution-header" style="font-family: \'SF Pro Display\';">Solution:</p>' +
        '<p class="solution-text"></p>' +
        '</div>' +
        (qType === 'subjective'
            ? '<div class="solution-consent"><div class="form-group form-check"><input type="checkbox" class="form-check-input" id="solutionConsent" /><label class="form-check-label" for="solutionConsent">Do not automatically show solution for subjective question</label></div></div>'
            : '');
}
