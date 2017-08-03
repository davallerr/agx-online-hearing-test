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
      var allAudio, allAudioArray, audio;

      allAudio = document.getElementsByTagName('audio');
      allAudioArray = Array.prototype.slice.call(allAudio);

      allAudioArray.forEach(function(el) {
        el.pause();
        el.currentTime = 0;
      });

      audio = document.getElementById(id);

      audio.currentTime = 0;
      audio.play();
    },

    setCalibLabel: function(tone, side) {
      document.querySelector('.active-calib-tone').classList.remove('active-calib-tone');
      document.querySelector('.active-calib-label').classList.remove('active-calib-label');

      document.querySelector(tone).classList.add('active-calib-tone');
      document.querySelector(side).classList.add('active-calib-label');
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
      var audios, audiosArray;

      audios = document.getElementsByTagName('audio');
      audiosArray = Array.prototype.slice.call(audios);

      audiosArray.forEach(function(el) {
        if(!el.paused && el.volume >= .1) {
          el.volume -= .1;
        }
      });
    },

    volFull: function(calibTone) {
      var audio;

      audio = document.getElementById(calibTone);

      audio.volume = 1;
    },

    volUp: function() {
      var audios, audiosArray;

      audios = document.getElementsByTagName('audio');
      audiosArray = Array.prototype.slice.call(audios);

      audiosArray.forEach(function(el) {
        if(!el.paused && el.volume <= .9) {
          el.volume += .1;
        }
      });
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
    var audio, q, sideLabel, toneLabel;

    q = dataCtrl.getResponseNum('calibration');

    if (q < 6) {
      // set current progress bubble and play appropriate tone
      // account for global volume step
      UICtrl.setProgBubbles(q);

      // determine which tone/side user is on
      switch(q) {
        case 2:
          audio = 'audio-calib-l-high';
          sideLabel = '.calib-label-l';
          toneLabel = '.calib-tone-l-high';
          break;
        case 3:
          audio = 'audio-calib-l-low';
          sideLabel = '.calib-label-l';
          toneLabel = '.calib-tone-l-low';
          break;
        case 4:
          audio = 'audio-calib-r-high';
          sideLabel = '.calib-label-r';
          toneLabel = '.calib-tone-r-high';
          break;
        case 5:
          audio = 'audio-calib-r-low';
          sideLabel = '.calib-label-r';
          toneLabel = '.calib-tone-r-low';
          break;
        default:
          console.log('need a default');
          console.log('q: ' + q);
      }

      // sets tone and side label and plays appropriate tone
      UICtrl.setCalibLabel(toneLabel, sideLabel);
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
