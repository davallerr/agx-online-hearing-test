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
    q1: 'Do you have trouble keeping up with conversations in busy restaurants?',
    q2: 'Are you often told that you set the television volume too loud?',
    q3: 'Do you have a hard time hearing people over the phone?',
    q4: 'Are you sometimes like, "these women and children need to SPEAK UP" and stuff?',
    q5: 'Are you accused of being intentionally thick by your significant other when you ask them to repeat themselves, say 5 or 6 times?',
    q6: 'Can you think of anymore hearing questions?'
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

    setCalibSetting: function(q, vol) {
      var settings;

      settings = ['leftHigh', 'leftLow', 'rightHigh', 'rightLow'];

      results.calibration[settings[q-2]] = vol;
    },

    setQuizResponse: function(q, response) {
      results.quiz['q' + q] = response;
    },

    setToneResponse: function(freq, response) {
      results.toneTest[freq + 'Hz'] = response;
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
    stageToneTest:  importHTML.querySelector('.stage-tone-test'),
    stageVolume:  importHTML.querySelector('.stage-volume')
  };


  // RETURNED PUBLIC FUNCTIONS
  return {

    addClass: function(el, nodeNum, newClass) {
      document.querySelectorAll(el)[nodeNum].classList.add(newClass);
    },

    getCalibSetting: function(q) {
      var audio, vol;

      // current step determines what audio to target
      audio = document.getElementsByTagName('audio')[q-2];
      console.log(audio.volume);
      // identify current volume of audio
      return audio.volume;
      // return volume
    },

    getYesNoResponse: function(event) {
      if(event.target.className === 'btn-yn-yes') {
        return true;
      } else if(event.target.className === 'btn-yn-no') {
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

    setFreqLabel: function(q) {
      var freqs;

      freqs = ['14000hz', '14500hz', '14800hz', '15000hz', '16000hz'];

      document.querySelector('.active-freq').classList.remove('active-freq');
      document.querySelector('.freq-' + freqs[q]).classList.add('active-freq');
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
        if(i !== step) {
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
        if(!el.paused && el.volume >= .05) {
          el.volume = Math.round((el.volume - .05) * 100) / 100;
          console.log(el.volume);
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
        if(!el.paused && el.volume <= .95) {
          el.volume = Math.round((el.volume + .05) * 100) / 100;
          console.log(el.volume);
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

    if(q < 7) {
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
    response = UICtrl.getYesNoResponse(event);

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

    if(q < 6) {
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
    var q, vol, volRound;

    q = dataCtrl.getResponseNum('calibration');
    vol = UICtrl.getCalibSetting(q);
    volRound = vol.toFixed(1);

    dataCtrl.setCalibSetting(q, volRound);

    ctrlCalibNext();
  };

  var ctrlSetStepToneTest = function() {
    UICtrl.setStage('stageToneTest', 3);
    UICtrl.setProgBubbles(1);

    document.querySelector('.btns-yn').addEventListener('click', ctrlToneResponse);

    ctrlToneNext();
  };

  var ctrlToneNext = function() {
    var q;

    q = dataCtrl.getResponseNum('toneTest');

    if(q < 5) {
      var freqs;

      freqs = ['14000hz', '14500hz', '14800hz', '15000hz', '16000hz'];

      UICtrl.setProgBubbles(q);
      UICtrl.setFreqLabel(q - 1);
      UICtrl.playTone(freqs[q - 1]);
      UICtrl.volFull(freqs[q - 1]);

    } else {
      ctrlSetStepSpeechTest();
    }
  };

  var ctrlToneResponse = function(event) {
    // get quiz question response from y/n buttons
    var freqs, q, response;

    freqs = ['14000hz', '14500hz', '14800hz', '15000hz', '16000hz'];
    q = dataCtrl.getResponseNum('toneTest');
    response = UICtrl.getYesNoResponse(event);

    dataCtrl.setToneResponse(freqs[q - 1], response);

    ctrlToneNext();
  };

  var ctrlSetStepSpeechTest = function() {
    console.log('things');
  }



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
