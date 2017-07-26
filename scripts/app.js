///////////////////////////////////////////////////////////////////////////////
// NOTES
/*

import for specific element can only be executed once - deduping

display changes need to know if it only has to update existing DOM elements
  OR remove/add new ones

random thought, because of those things I don't think any kind of 'back' functionality would be wise


*/
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// DATA CONTROLLER
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var dataController = (function() {

  var quizQuestions = {
    q1: 'Question 1 content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rhoncus tincidunt iaculis. Vivamus pellentesque at lorem ut ultrices.',
    q2: 'Question 2 content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rhoncus tincidunt iaculis. Vivamus pellentesque at lorem ut ultrices.',
    q3: 'Question 3 content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rhoncus tincidunt iaculis. Vivamus pellentesque at lorem ut ultrices.',
    q4: 'Question 4 content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rhoncus tincidunt iaculis. Vivamus pellentesque at lorem ut ultrices.',
    q5: 'Question 5 content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rhoncus tincidunt iaculis. Vivamus pellentesque at lorem ut ultrices.',
    q6: 'Question 6 content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam rhoncus tincidunt iaculis. Vivamus pellentesque at lorem ut ultrices.'
  };

  var results = {
    questions: {},
    soundSettings: {},
    toneTest: {},
    speechTest: {}
  };


  // RETURNED PUBLIC FUNCTIONS
  return {

    setQuizQuestion: function(q) {
      return quizQuestions[q];
    },

    getResults: function() {
      return results;
    },

    getQuizNum: function() {
      return Object.keys(results.questions).length + 1;
    },

    setQuizResponse: function(q, ans) {
      results.questions['q' + q] = ans;
    },

    testing: function() {
      console.log(results);
    }

  };

})();


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// UI CONTROLLER
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var UIController = (function() {

  var importHTML = document.querySelector('link[id="html-templates"]').import;

  var importElements = {
    agxHearingLogo: importHTML.querySelector('.agx-hearing-logo'),
    btnsYN:         importHTML.querySelector('.btns-yn'),
    btnSubmit:      importHTML.querySelector('.btn-submit'),
    leadText:       importHTML.querySelector('.lead-text'),
    headerText:     importHTML.querySelector('.header-text'),
    progBar2:       importHTML.querySelector('.prog-bar-2'),
    progBar3:       importHTML.querySelector('.prog-bar-3'),
    progBar4:       importHTML.querySelector('.prog-bar-4'),
    progBar5:       importHTML.querySelector('.prog-bar-5'),
    progBar6:       importHTML.querySelector('.prog-bar-6'),
    progBubble:     importHTML.querySelector('.prog-bubble'),
    stageQuiz:      importHTML.querySelector('.stage-quiz'),
    steps:          importHTML.querySelector('.steps')
  }

  var DOMStrings = {
    agxHearingLogo: '.agx-hearing-logo',
    btnSubmit:      '.btn-submit',
    leadText:       '.lead-text',
    header:         '.header',
    headerText:     '.header-text',
    quizBody:       '.quiz-body'
  };


  // RETURNED PUBLIC FUNCTIONS
  return {

    addClass: function(el, nodeNum, newClass) {
      document.querySelectorAll(el)[nodeNum].className += ' ' + newClass;
    },

    addImportBlock: function(importEl, destinationString, insertCondition) {
      var el = importElements[importEl];
      document.querySelector(destinationString).insertAdjacentElement(insertCondition, el);
    },

    addListener: function(el, event, call) {
      document.querySelector(el).addEventListener(event, call);
    },

    getDOMStrings: function() {
      return DOMStrings;
    },

    getQuizResponse: function(event) {
      if (event.target.className === 'btn-yn-yes') {
        return true;
      } else if (event.target.className === 'btn-yn-no') {
        return false;
      }
    },

    setInnerHtml(destinationString, newText)  {
      document.querySelector(destinationString).innerHTML = '';
      document.querySelector(destinationString).innerHTML = newText;
    },

    setStepQuiz: function() {
      document.querySelector('.quiz-window').insertAdjacentElement('afterbegin', importElements.stageQuiz);
    },

    setSteps(step) {
      document.querySelector('.step-' + step).className += ' ' + 'active-step';

      for (var i=1; i<=4; i++) {
        if (i !== step) {
          document.querySelector('.step-' + i).className += ' ' + 'inactive-step';
        }
      }
    }

  };

})();


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// APP CONTROLLER
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var controller = (function(dataCtrl, UICtrl) {

  var ctrlSetStepIntro = function() {
    // add AGX Hearing logo
    UICtrl.addImportBlock('agxHearingLogo', '.header', 'afterbegin');
    UICtrl.addClass('.agx-hearing-logo', 0, 'logo-intro');

    // add header text
    UICtrl.addImportBlock('headerText', '.header', 'beforeend');
    UICtrl.setInnerHtml('.header-text', 'AGX<sup>&reg;</sup> Online Hearing Test');

    // add lead text
    UICtrl.addImportBlock('leadText', '.quiz-body', 'afterbegin');
    UICtrl.setInnerHtml('.lead-text', 'Some intro text for the quizzy quiz');

    // add start test button
    UICtrl.addImportBlock('btnSubmit', '.quiz-body', 'beforeend');
    UICtrl.setInnerHtml('.btn-submit', 'Take the Test');
    UICtrl.addListener('.btn-submit', 'click', ctrlSetStepQuiz);
  };

  var ctrlSetStepQuiz = function() {
    // clear window
    UICtrl.setInnerHtml('.quiz-window', '');

    // add quiz step elements to DOM
    UICtrl.setStepQuiz();

    // set to Step 1 - Quiz
    UICtrl.setSteps(1);

    // add yes/no buttons and set listeners
    UICtrl.addImportBlock('btnsYN', '.quiz-body', 'beforeend');
    UICtrl.addListener('.btns-yn', 'click', UICtrl.getQuizResponse);

    // go to questions
    ctrlQuizNextQ();
  };

  var ctrlQuizNextQ = function() {
    var q;

    // set quiz question number
    q = dataCtrl.getQuizNum();

    if (q <= 6) {
      // set current progress bubble
      UICtrl.addClass('.prog-bubble', q-1, 'prog-current');

      // add question text
      document.querySelector('.quiz-question-text').textContent = dataCtrl.setQuizQuestion('q' + q);
    } else {
      //ctrlSetStepSound();
    }
  };

  var ctrlSetStepSound = function() {

  };


  // RETURNED PUBLIC FUNCTIONS
  return {

    init: function() {
      console.log('init');
      ctrlSetStepIntro();
    }

  };

})(dataController, UIController);


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// MAKE IT GO
controller.init();
