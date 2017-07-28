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
    calibration: {},
    quiz: {},
    speechTest: {},
    toneTest: {}
  };


  // RETURNED PUBLIC FUNCTIONS
  return {

    setQuizQuestion: function(q) {
      return quizQuestions[q];
    },

    getResults: function() {
      return results;
    },

    getResponseNum: function(stage) {
      return Object.keys(results[stage]).length + 1;
    },

    setCalibSetting: function(q, setting) {
      results.calibration['setting' + q] = setting;
    },

    setQuizResponse: function(q, response) {
      results.quiz['q' + q] = response;
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
    stageCalib:     importHTML.querySelector('.stage-calib'),
    stageIntro:     importHTML.querySelector('.stage-intro'),
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

    getCalibSetting: function(event) {
      return 'not sure how getting sound setting will work!';
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

    setStage: function(el, step) {
      document.querySelector('.quiz-window').innerHTML = '';
      document.querySelector('.quiz-window').insertAdjacentElement('afterbegin', importElements[el]);

      document.querySelector('.step-' + step).className += ' ' + 'active-step';

      for (var i=1; i<=4; i++) {
        if (i !== step) {
          document.querySelector('.step-' + i).className += ' ' + 'inactive-step';
        }
      }
    },

    setStageIntro: function() {
      document.querySelector('.quiz-window').insertAdjacentElement('afterbegin', importElements.stageIntro);
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
    // clear window and add intro step elements to DOM
    UICtrl.setInnerHtml('.quiz-window', '');
    UICtrl.setStageIntro();

    // add listener to start button
    document.querySelector('.btn-submit-intro').addEventListener('click', ctrlSetStepQuiz);
  };

  var ctrlSetStepQuiz = function() {
    // set stage to quiz
    UICtrl.setStage('stageQuiz', 1);

    // add yes/no buttons and set listeners
    UICtrl.addImportBlock('btnsYN', '.quiz-body', 'beforeend');
    UICtrl.addListener('.btns-yn', 'click', ctrlQuizResponse);

    // go to questions
    ctrlQuizNextQ();
  };

  var ctrlQuizNextQ = function() {
    // check quiz question number and either set next question or finish quiz
    var q;

    q = dataCtrl.getResponseNum('quiz');

    if (q < 7) {
      // set current progress bubble and question text
      UICtrl.addClass('.prog-bubble', q-1, 'prog-current');
      document.querySelector('.quiz-question-text').textContent = dataCtrl.setQuizQuestion('q' + q);
    } else {
      document.querySelector('.btns-yn').removeEventListener('click', ctrlQuizResponse);
      ctrlSetStepCalib();
    }
  };

  var ctrlQuizResponse = function(event) {
    // get quiz question response from y/n buttons
    var q, response;

    q = dataCtrl.getResponseNum('quiz');
    response = UICtrl.getQuizResponse(event);

    dataCtrl.setQuizResponse(q, response);

    ctrlQuizNextQ();
  };

  var ctrlSetStepCalib = function() {
    // set stage to calibration
    UICtrl.setStage('stageCalib', 2);

    // add listener to set volume button
    document.querySelector('.btn-submit-calib').addEventListener('click', ctrlCalibResponse);

    // go to tone set function
    ctrlCalibNext();
  };

  var ctrlCalibNext = function() {
    var q;

    q = dataCtrl.getResponseNum('calibration');

    if (q < 5) {
      // set current progress bubble and play tone
      UICtrl.addClass('.prog-bubble', q-1, 'prog-current');
      ////////////////////////////
      // SOUNDS?! ///////////////////////////////
      //////////////////////////////////

    } else {
      ctrlSetStepToneTest();
    }
  };

  var ctrlCalibResponse = function() {
    // TESTING INPUT FOR NOW
    var q, setting;

    q = dataCtrl.getResponseNum('calibration');
    setting = UICtrl.getCalibSetting(event);

    dataCtrl.setCalibSetting(q, setting);

    ctrlCalibNext();
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
