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

    setQuizResponse: function(q, response) {
      results.quiz['q' + q] = response;
    },

    setToneResponse: function(freq, response) {
      results.toneTest[freq + 'Hz'] = response;
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
    stageCalib:       importHTML.querySelector('.stage-calib'),
    stageIntro:       importHTML.querySelector('.stage-intro'),
    stageQuiz:        importHTML.querySelector('.stage-quiz'),
    stageResults:     importHTML.querySelector('.stage-results'),
    stageSpeechTest:  importHTML.querySelector('.stage-speech-test'),
    stageToneTest:    importHTML.querySelector('.stage-tone-test'),
    stageVolume:      importHTML.querySelector('.stage-volume')
  };


  // RETURNED PUBLIC FUNCTIONS
  return {

    addClass: function(el, nodeNum, newClass) {
      document.querySelectorAll(el)[nodeNum].classList.add(newClass);
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

      // create array of all present audio tags
      allAudio = document.getElementsByTagName('audio');
      allAudioArray = Array.prototype.slice.call(allAudio);

      // stop and reset all other audio
      allAudioArray.forEach(function(el) {
        el.pause();
        el.currentTime = 0;
      });

      // locate and start playing new audio at full volume
      audio = document.getElementById(id);
      audio.currentTime = 0;
      audio.play();
    },

    setFreqLabel: function(q) {
      var freqs;

      // array of frequency classes
      freqs = ['14000hz', '14500hz', '14800hz', '15000hz', '16000hz'];

      // remove existing active label and set new one
      document.querySelector('.active-freq').classList.remove('active-freq');
      document.querySelector('.freq-' + freqs[q]).classList.add('active-freq');
    },

    setProgBubbles: function(current) {
      document.querySelectorAll('.prog-bubble')[current - 1].classList.add('prog-current');
    },

    setStage: function(el, step) {
      document.querySelector('.quiz-window').innerHTML = '';
      document.querySelector('.quiz-window').insertAdjacentElement('afterbegin', importElements[el]);

      if(document.querySelector('.step-1')) {
        document.querySelector('.step-' + step).classList.add('active-step');
        
        for (var i=1; i<=4; i++) {
          if(i !== step) {
            document.querySelector('.step-' + i).classList.add('inactive-step');
          }
        }
      }
    },

    setStageIntro: function() {
      document.querySelector('.quiz-window').insertAdjacentElement('afterbegin', importElements.stageIntro);
    },

    showResultsQuiz: function(data) {
      // receives quiz answers object and displays info
      console.log('trying quiz');
      document.querySelector('.quiz-total').textContent = document.querySelector('.quiz-total').textContent.replace('%quizTotal%', '3/6');
    },

    showResultsSpeechTest: function(data) {
      console.log('trying speech');
      document.querySelector('.speech-total').textContent = document.querySelector('.speech-total').textContent.replace('%speechTotal%', 'SOMETHING');
    },

    showResultsToneTest: function(data) {
      console.log('trying tone');
      document.querySelector('.tone-total').textContent = document.querySelector('.tone-total').textContent.replace('%toneTotal%', 'Another thing');
    },

    volFull: function(audio) {
      var audio;

      audio = document.getElementById(audio);

      audio.volume = 1;

      if(document.querySelector('.stage-calib')) {
        speakerWaves(1);
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
    // clear window and add intro step elements to DOM
    document.querySelector('.quiz-window').innerHTML = '';
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

    document.querySelector('.btn-submit-volume').addEventListener('click', ctrlSetStepToneTest);
  };

  var ctrlSetStepToneTest = function() {
    UICtrl.setStage('stageToneTest', 2);
    UICtrl.setProgBubbles(1);

    document.querySelector('.btns-yn').addEventListener('click', ctrlToneResponse);

    ctrlToneNext();
  };

  var ctrlToneNext = function() {
    var freqs, q;

    freqs = ['14000hz', '14500hz', '14800hz', '15000hz', '16000hz'];
    q = dataCtrl.getResponseNum('toneTest');

    if(q < 6) {
      UICtrl.setProgBubbles(q + 1);
      UICtrl.setFreqLabel(q - 1);
      UICtrl.playTone(freqs[q - 1]);
      UICtrl.volFull(freqs[q - 1]);
    } else {
      ctrlSetStepResults();
    }
  };

  var ctrlToneResponse = function(event) {
    var freqs, q, response;

    freqs = ['14000hz', '14500hz', '14800hz', '15000hz', '16000hz'];
    q = dataCtrl.getResponseNum('toneTest');
    response = UICtrl.getYesNoResponse(event);

    dataCtrl.setToneResponse(freqs[q - 1], response);

    ctrlToneNext();
  };

  var ctrlSetStepSpeechTest = function() {
    UICtrl.setStage('stageSpeechTest', 3);
    UICtrl.setProgBubbles(1);
  };

  var ctrlSetStepResults = function() {
    var data;

    UICtrl.setStage('stageResults', 1);
    data = dataCtrl.getResults();

    // show quiz results
    UICtrl.showResultsQuiz(data.quiz);

    // show tone results
    UICtrl.showResultsToneTest(data.toneTest);

    // show speech results
    UICtrl.showResultsSpeechTest(data.speechTest);

    // show cta
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
