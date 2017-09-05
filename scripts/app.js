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

  var quiz = {
    questions: {
      q0: 'Do you have difficulty understanding people with higher speaking voices?',
      q1: 'Do you have a hard time understanding people over the phone?',
      q2: 'Do you have trouble keeping up with conversations in busy restaurants?',
      q3: 'Are you often told that you set the television volume very loud?'
    },
    score: 0,
    topics: ['highVoices', 'phone', 'restaurants', 'television']
  };

  var results = {
    quiz: {},
    quizScore: 0,
    quizTopics: [],
    speechTest: {},
    toneTest: {}
  };


  // RETURNED PUBLIC FUNCTIONS
  return {

    getQuizTopics: function() {
      return quiz.topics;
    },

    getResults: function() {
      return results;
    },

    getResponseNum: function(stage) {
      return Object.keys(results[stage]).length;
    },

    setQuizQuestion: function(q) {
      return quiz.questions[q];
    },

    setQuizResponse: function(q, response) {
      var topic = quiz.topics[q];

      results.quiz[topic] = response;

      if(response) {
        results.quizScore++;
        results.quizTopics.push(topic);
      }
    },

    setToneResponse: function(freq, response) {
      results.toneTest[freq] = response;
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
      document.querySelectorAll('.prog-bubble')[current].classList.add('prog-current');
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

    showResultsQuiz: function(score, topics) {
      // receives score and topics then displays info
      var scoreDisplay, topicHtml;

      scoreDisplay = score + '/4';
      
      document.querySelector('.quiz-total').textContent = document.querySelector('.quiz-total').textContent.replace('%quizTotal%', scoreDisplay);

      topicHtmlTemplate = importHTML.querySelector('.environment').outerHTML;

      for(var i=0; i<topics.length; i++) {
        topicHtml = topicHtmlTemplate.replace('%environment%', topics[i]);
        document.querySelector('.quiz-environments').insertAdjacentHTML('beforeend', topicHtml);
      }
    },

    showResultsSpeechTest: function(data) {
      document.querySelector('.speech-total').textContent = document.querySelector('.speech-total').textContent.replace('%speechTotal%', 'SOMETHING');
      console.log(data);
    },

    showResultsToneTest: function(data) {
      document.querySelector('.tone-total').textContent = document.querySelector('.tone-total').textContent.replace('%toneTotal%', 'Another thing');
      console.log(data);
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
    var q, topics;

    q = dataCtrl.getResponseNum('quiz');
    topics = dataCtrl.getQuizTopics();

    if(q < topics.length) {
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
    UICtrl.setProgBubbles(0);

    UICtrl.playTone('noise');

    document.querySelector('.btn-submit-volume').addEventListener('click', ctrlSetStepToneTest);
  };

  var ctrlSetStepToneTest = function() {
    UICtrl.setStage('stageToneTest', 2);
    UICtrl.setProgBubbles(0);

    document.querySelector('.btns-yn').addEventListener('click', ctrlToneResponse);

    ctrlToneNext();
  };

  var ctrlToneNext = function() {
    var freqs, q;

    freqs = ['14000hz', '14500hz', '14800hz', '15000hz', '16000hz'];
    q = dataCtrl.getResponseNum('toneTest');

    if(q < 5) {
      UICtrl.setProgBubbles(q + 1);
      UICtrl.setFreqLabel(q);
      UICtrl.playTone(freqs[q]);
      UICtrl.volFull(freqs[q]);
    } else {
      ctrlSetStepResults();
    }
  };

  var ctrlToneResponse = function(event) {
    var freqs, q, response;

    freqs = ['14000hz', '14500hz', '14800hz', '15000hz', '16000hz'];
    q = dataCtrl.getResponseNum('toneTest');
    response = UICtrl.getYesNoResponse(event);

    dataCtrl.setToneResponse(freqs[q], response);

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
    UICtrl.showResultsQuiz(data.quizScore, data.quizTopics);

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
