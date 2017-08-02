///////////////////////////////////////////////////////////////////////////////
// NOTES
/*


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
      results.quiz['q' + (q - 1)] = response;
    },

    setVolumeResponse: function(set) {
      results.calibration['localVolume'] = set;
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
    stageCalib:   importHTML.querySelector('.stage-calib'),
    stageIntro:   importHTML.querySelector('.stage-intro'),
    stageQuiz:    importHTML.querySelector('.stage-quiz'),
    stageToneTest:  importHTML.querySelector('.stage-test'),
    stageVolume:  importHTML.querySelector('.stage-volume')
  };


  // RETURNED PUBLIC FUNCTIONS
  return {

    addClass: function(el, nodeNum, newClass) {
      document.querySelectorAll(el)[nodeNum].classList.add(newClass);
    },

    getCalibSetting: function(event) {
      return 'not sure how getting sound setting will work!';
    },

    getQuizResponse: function(event) {
      if (event.target.className === 'btn-yn-yes') {
        return true;
      } else if (event.target.className === 'btn-yn-no') {
        return false;
      }
    },

    playTone: function(id) {
      var audio;

      audio = document.getElementById(id);

      audio.currentTime = 0;
      audio.play();
    },

    setProgBubbles: function(current) {
      document.querySelectorAll('.prog-bubble')[current - 1].classList.add('prog-current');
    },

    setInnerHtml(destinationString, newText)  {
      document.querySelector(destinationString).innerHTML = '';
      document.querySelector(destinationString).innerHTML = newText;
    },

    setStage: function(el, step) {
      document.querySelector('.quiz-window').innerHTML = '';
      document.querySelector('.quiz-window').insertAdjacentElement('afterbegin', importElements[el]);

      document.querySelector('.step-' + step).classList.add('active-step');

      for (var i=1; i<=4; i++) {
        if (i !== step) {
          document.querySelector('.step-' + i).classList.add('inactive-step');
        }
      }
    },

    setStageIntro: function() {
      document.querySelector('.quiz-window').insertAdjacentElement('afterbegin', importElements.stageIntro);
    },

    volDown: function() {
      var audio, current;

      current = document.querySelector('.active-calib-tone');
      console.log(current);

      current.textContent === 'High' ? audio = document.getElementById('audio-calib-high') : audio = document.getElementById('audio-calib-low');

      console.log(audio.volume);

      if(audio.volume >= 0.1) {
        audio.volume -= 0.1;
      }

      console.log(audio);
    },

    volFull: function(calibTone) {
      var audio;

      audio = document.getElementById(calibTone);

      audio.volume = 1.0;
    },

    volUp: function() {
      var audio, current;

      current = document.querySelector('.active-calib-tone');
      console.log(current);

      current.textContent === 'High' ? audio = document.getElementById('audio-calib-high') : audio = document.getElementById('audio-calib-low');

      console.log(audio.volume);

      if(audio.volume <= 0.9) {
        audio.volume += 0.1;
      }

      console.log(audio);
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

    // set listeners
    document.querySelector('.btns-yn').addEventListener('click', ctrlQuizResponse);

    // go to questions
    ctrlQuizNextQ();
  };

  var ctrlQuizNextQ = function() {
    // check quiz question number and either set next question or finish quiz
    var q;

    q = dataCtrl.getResponseNum('quiz');

    if (q < 7) {
      // set current progress bubble and question text
      UICtrl.setProgBubbles(q);
      document.querySelector('.quiz-question-text').textContent = dataCtrl.setQuizQuestion('q' + q);
    } else {
      document.querySelector('.btns-yn').removeEventListener('click', ctrlQuizResponse);
      ctrlSetStepVolume();
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

  var ctrlSetStepVolume = function() {
    UICtrl.setStage('stageVolume', 2);
    UICtrl.setProgBubbles(1);
    UICtrl.playTone('noise');
    document.querySelector('.btn-submit-volume').addEventListener('click', ctrlVolumeResponse);
  };

  var ctrlVolumeResponse = function() {
    dataCtrl.setVolumeResponse('set');
    ctrlSetStepCalib();
  };

  var ctrlSetStepCalib = function() {
    // set stage to calibration
    UICtrl.setStage('stageCalib', 2);
    UICtrl.setProgBubbles(1);

    // add listeners to +/- buttons
    document.querySelector('.vol-plus').addEventListener('click', UICtrl.volUp);
    document.querySelector('.vol-minus').addEventListener('click', UICtrl.volDown);

    // add listener to set volume button
    document.querySelector('.btn-submit-calib').addEventListener('click', ctrlCalibResponse);

    // go to tone set function
    ctrlCalibNext();
  };

  var ctrlCalibNext = function() {
    var audio, q;

    q = dataCtrl.getResponseNum('calibration');

    if (q < 6) {
      // set current progress bubble and play appropriate tone
      // account for global volume step
      UICtrl.setProgBubbles(q);

      // update current side and tone
      ///////////////////////////////////////////////////////////////////////////
      // SEPARATE AUDIO FILES OF SAME TONE, ONE FOR LEFT CHANNEL ONE FOR RIGHT //
      ///////////////////////////////////////////////////////////////////////////

      (q % 2) === 0 ? audio = 'audio-calib-high' : audio = 'audio-calib-low';

      console.log(audio);
      UICtrl.playTone(audio);
      UICtrl.volFull(audio);

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

  var ctrlSetStepToneTest = function() {
    UICtrl.setStage('stageToneTest', 3);
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
