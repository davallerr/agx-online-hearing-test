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


// START... //// SPEECH TEST //////////////// M.M.

//// VARIABLES ////
    var testResults, counters, speechQuiz;
    
// Answer results object    
testResults = {
    speech: {
        totalRight: -1,
        totalWrong: -1,
        percentRight: -1,
        percentWrong: -1
    }
};

// Various Counter Obj    
counters = {
    curRound: 0,
    totalAnswerCount: 0,
    answerCounter: 0,
    volumeCounter: 0
};
    
speechQuiz = {
    quizType: {
        speech: ['Bells', 'Cat', 'King', 'Hand', 'Cars', 'Tree', 'Dog', 'Book', 'Chair']
    },
    questions: [],
    questionsOrder: [],
    answers: [],
    results: {
        totalRight: undefined,
        totalWrong: undefined,
        percentRight: undefined,
        percentWrong: undefined
    }
};
    
//// FUNCTIONS ////

// Answer Object Constructor
function Answer(question, id, parentId, volume) {
    this.question = question;
    this.id = id;
    this.parentId = parentId;
    this.volume = volume;
    this.isCorrect = (question === id || question === parentId);
};    

function loadRandomOrder() {
    
    // Calculate 9 groups of 3 numbers
    for (i = 0; i < 9; i++){
        var num1, num2, num3, answer1, answer2, answer3;
        
        // 1. Calculate numbers in groups of 3
        num1 = Math.round(Math.random()*8);
        num2 = Math.round(Math.random()*8);
        num3 = Math.round(Math.random()*8);
        
        // 2. Prevent duplicates in groups
        while (num1 === num2 || num2 === num3 || num1 === num3){
            num2 = Math.round(Math.random()*8);
            num3 = Math.round(Math.random()*8);
        };
        
        // 3. Save answers which correlate to the numbers generated
        answer1 = speechQuiz.questions[num1].toLowerCase();
        answer2 = speechQuiz.questions[num2].toLowerCase();
        answer3 = speechQuiz.questions[num3].toLowerCase();
        
        // 4. Add three new answer strings to end of order array
        speechQuiz.questionsOrder.push(answer1);
        speechQuiz.questionsOrder.push(answer2);
        speechQuiz.questionsOrder.push(answer3);
        
    };
    
    console.log(speechQuiz.questions);
};
    
// Calculate results of questions, add to results object
function howWell(){
    var right, wrong, percentageRight, percentageWrong, num;
    
    right = 0;
    wrong = 0;
        
    // 1. update right and wrong totals for each answer
    speechQuiz.answers.forEach(function(cur){
        
        if (cur.isCorrect) {
            right++;
        } else if (!cur.isCorrect){
            wrong++;
        } else {
            console.log('answers for each did not work here ' + cur);
        }
    });
    
    // 2. Establish the total number of answers
    num = speechQuiz.answers.length;
    
    // 3. Calculate percent right and wrong
    percentageRight = Math.round((right / num) * 100);
    percentageWrong = Math.round((wrong / num) * 100);

    // 4. Add results to result obj
    testResults.speech.totalRight = right;
    testResults.speech.totalWrong = wrong;
    testResults.speech.percentRight = percentageRight;
    testResults.speech.percentWrong = percentageWrong;
    
    // 5. Console log results
    console.log('Total right: ' + right);
    console.log('Total wrong: ' + wrong);
    console.log('Percent right: ' + percentageRight);
    console.log('Percent wrong: ' + percentageWrong);
    
};

// Create and add new answer object to the end of answers array    
function addNewAnswer(ansNum){
    
    console.log(counters.totalAnswerCount);
    // 1. Create and push new answer obj
    speechQuiz.answers.push(new Answer(speechQuiz.questionsOrder[counters.totalAnswerCount], event.target.id, event.target.parentNode.id, Math.random()));
    counters.totalAnswerCount++;
}; 

// Load 9 new answers for speech test
function updateAnswerOptions(newArray){
    
    // 1. Clear out any remaining answers
    speechQuiz.questions = [];
    
    // 2. Load new array into questions array
    newArray.forEach(function(cur){
        speechQuiz.questions.push(cur);
    });
};
    
//// Adjusting Counters Functions ////
    
// curRound    
function increaseCurRound(){
    counters.curRound++
    console.log('round updated');
};

// volumeCounter
function increaseVolumeCounter(num){
    counters.volumeCounter += num;
};
    
// answerCounter    
function updateAnswerCounter(num){
    counters.answerCounter = num;
};    

// ...END //// SPEECH TEST //////////////// M.M.

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
    },
      
// START... //// SPEECH TEST Data Returns //////////////// M.M.
      
      counters: counters,
      speechQuiz: speechQuiz,
      increaseCurRound: increaseCurRound,
      updateAnswerOptions: updateAnswerOptions,
      increaseVolumeCounter: increaseVolumeCounter,
      updateAnswerCounter: updateAnswerCounter,
      loadRandomOrder: loadRandomOrder,
      addNewAnswer: addNewAnswer,
      howWell: howWell,
      addNewAnswer: addNewAnswer,
      testResults: testResults
      
// ...END //// SPEECH TEST Data Returns //////////////// M.M.
      
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
    stageSpeechTest:  importHTML.querySelector('.stage-speech-test'),
    stageToneTest:    importHTML.querySelector('.stage-tone-test'),
    stageVolume:      importHTML.querySelector('.stage-volume')
  };

// START... //// SPEECH TEST //////////////// M.M.
    
//// VARIABLES ////

// Speech noise in background    
var backgroundAud = new Audio('../sounds/BackgroundNoise.mp3');

    
//// FUNCTIONS ////
    
// Update html to match answers provided as arguments
function updateAnsHTML(ansArray){
     console.log(document.querySelectorAll('#ans').id);
    for (i = 0; i < 9; i++){
        
        // 1. Load string into cur variable
        cur = ansArray[i].toLowerCase();
        
        // 2. Temp number for non-zero based elements
        tempNum = i + 1;
        
        // 3. Update HTML ids for answer divs
        document.querySelector('#ans' + tempNum).id = cur;
       
        
        // 4. Add answer text inside answer divs
        document.querySelector('#' + cur).innerHTML = '<p>' + ansArray[i] + '</p>';
    };
};
    
// Update Progress Bubbles
function updateRoundProg(ansCounter){        
    
    if (ansCounter < 4){
        
        // Add filled class to next bubble
        document.querySelector('#box' + (ansCounter)).classList.add('prog-bubble');
    };
};
    
// Create next round's audio file name string
function audioString(someNum, someArray){
    var tempNum, curAudio1, curAudio2, curAudio3;
    
    // Multiply current round by 3 to target correct answers
    tempNum = someNum * 3;
    
    // Create 3 Audio strings
    curAudio1 = '../sounds/Speech_' + someArray[tempNum] + '.mp3';
    tempNum++;
    
    curAudio2 = '../sounds/Speech_' + someArray[tempNum] + '.mp3';
    tempNum++;
  
    curAudio3 = '../sounds/Speech_' + someArray[tempNum] + '.mp3';
    
    // return audio strings as object
    return {
        curAudio1: curAudio1,
        curAudio2: curAudio2,
        curAudio3: curAudio3
    };
};
    
    
// ...END //// SPEECH TEST //////////////// M.M.
    
  
    // RETURNED PUBLIC FUNCTIONS
  return {

    addClass: function(el, nodeNum, newClass) {
      document.querySelectorAll(el)[nodeNum].classList.add(newClass);
    },

    getCalibSetting: function(q) {
      var audio, vol;

      // current step determines what audio to target
      audio = document.getElementsByTagName('audio')[q-2];
      // identify and return current volume of audio
      return audio.volume;
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

    setCalibLabel: function(tone, side) {
      // remove current active labels
      document.querySelector('.active-calib-tone').classList.remove('active-calib-tone');
      document.querySelector('.active-calib-label').classList.remove('active-calib-label');

      // set new active labels
      document.querySelector(tone).classList.add('active-calib-tone');
      document.querySelector(side).classList.add('active-calib-label');
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
      
    resetProgBubbles: function() {
        
        [].forEach.call(
  document.querySelectorAll('.prog-bubble'), 
  function(el){
    el.classList.remove('prog-current');
  });
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
    },
      
      
// START... //// SPEECH TEST UI Returns //////////////// M.M.
      
      audioString: audioString,
      updateAnsHTML: updateAnsHTML,
      backgroundAud: backgroundAud,
      updateRoundProg: updateRoundProg
      
// ...END //// SPEECH TEST UI Returns //////////////// M.M.

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
          audio =     'audio-calib-l-high';
          sideLabel = '.calib-label-l';
          toneLabel = '.calib-tone-l-high';
          break;
        case 3:
          audio =     'audio-calib-l-low';
          sideLabel = '.calib-label-l';
          toneLabel = '.calib-tone-l-low';
          break;
        case 4:
          audio =     'audio-calib-r-high';
          sideLabel = '.calib-label-r';
          toneLabel = '.calib-tone-r-high';
          break;
        case 5:
          audio =     'audio-calib-r-low';
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
    var freqs, q;

    freqs = ['14000hz', '14500hz', '14800hz', '15000hz', '16000hz'];
    q = dataCtrl.getResponseNum('toneTest');

    if(q < 6) {
      UICtrl.setProgBubbles(q);
      UICtrl.setFreqLabel(q - 1);
      UICtrl.playTone(freqs[q - 1]);
      UICtrl.volFull(freqs[q - 1]);
    } else {
      ctrlSetStepSpeechTest(dataCtrl.speechQuiz.quizType.speech);
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

  var ctrlSetStepSpeechTest = function(arrayType) {
    UICtrl.setStage('stageSpeechTest', 4);
    UICtrl.setProgBubbles(1);
    speechInit(arrayType);
  };

    
// START... //// SPEECH TEST //////////////// M.M.

//// FUNCTIONS ////
    
// Log if answer is right, update answerCounter
function logTarget(){
    var curAnsNum;
    
   // 1. Console log true or false 
    console.log(dataCtrl.speechQuiz.answers[(dataCtrl.speechQuiz.answers.length - 1)].isCorrect);
    
    // 2. Add one to answerCounter
    curAnsNum = dataCtrl.counters.answerCounter + 1;
    dataCtrl.updateAnswerCounter(curAnsNum);
};
    
// Load and play next round
function loadNextQuestion(){        
    
    if (dataCtrl.counters.answerCounter === 3){
        
        // Delay loading next questions
        setTimeout(function(){
            
            // 1. Play new audio
            askQuestion();
            
            // 2. Reset answer counter to 0
            dataCtrl.updateAnswerCounter(0);
            
            // 3. Reset Progress bubbles
            for (i = 0; i < 3; i++){
                
                // Load bubble elements as nodelist
                var tempNode = document.querySelectorAll('.filled');
                
                // For each node, remove class
                tempNode.forEach(function(cur){
                    cur.classList.remove('filled');
                });
            };
        }, 600);
    };
};
    
// Play the 3 audio files
function playAudio(aud1, aud2, aud3){
    
    // 1. Play first
    aud1.play();
    
    // 2. After finished, start second
    aud1.onended = function(){
        aud2.play();
    };
    
    // 3. After finished, start third
    aud2.onended = function(){
        aud3.play();
    };
};    
  
// app        
function audioLoop(){
    
    // 1. Play audio
    UICtrl.backgroundAud.play();
    
    // 2. Loop the Audio
    UICtrl.backgroundAud.loop = true;
    
    // 3. Set audio volume
    UICtrl.backgroundAud.volume = dataCtrl.counters.volumeCounter;
    
};

// app        
function pauseAudio(){
    UICtrl.backgroundAud.pause();
};

// app        
function updateVolume(){
    
    if(dataCtrl.counters.volumeCounter <= .8){
        
        // 1. Increase volume counter by .2
        dataCtrl.increaseVolumeCounter(.2);
        
        // 2. Update audio with new volume level
        UICtrl.backgroundAud.volume = dataCtrl.counters.volumeCounter;
    };
};
 
// app        
function playRoundAudio(){  
    var tempNum, question, audio1, audio2, audio3;
    
    // 1. Pull current round as temp number
    tempNum = dataCtrl.counters.curRound;
        
    // 2. Returns three audio file pathway strings matching current round
    question = UICtrl.audioString(tempNum, dataCtrl.speechQuiz.questionsOrder);    
        
    // 3. create three new Audio elements from returned strings
    audio1 = new Audio(question.curAudio1);
    audio2 = new Audio(question.curAudio2);
    audio3 = new Audio(question.curAudio3);
    
    // 4. Play the 3 audio clips
    playAudio(audio1, audio2, audio3);
    
    
    
    /* !!! volControl code for lowering audio each time: audio3.volume = (1 - dataCtrl.counters.curRound * .05);*/
};

// app        
function answerInput(){
   
    // 1. Create and add new answer obj
    dataCtrl.addNewAnswer();
    
    // 2. Console log if true/false and update totalAnswerCount
    logTarget();
    
    // 3. Update progress bubbles
    UICtrl.setProgBubbles(dataCtrl.counters.answerCounter);
    
    // 4. Load next question and play audio
    loadNextQuestion();

}; 

// app        
function speechInit(ansArray){
    
    // 1. Load speech test HTML
    dataCtrl.updateAnswerOptions(ansArray);
    console.log(dataCtrl.speechQuiz.answers);
    
    // 2. Update html to match answers provided as arguments
    UICtrl.updateAnsHTML(dataCtrl.speechQuiz.questions);
    
    // 3. Load Random Order
    dataCtrl.loadRandomOrder();

    // 4. Add event listeners
    UICtrl.backgroundAud.volume = 0;
   UICtrl.backgroundAud.play();
    document.querySelector('#toneAnswer').addEventListener('click', function(){
         document.querySelector('.answerGrid').addEventListener('click', answerInput);
        askQuestion();
    });
};

// app
function askQuestion(){
    UICtrl.resetProgBubbles(2);
    // Limit number of rounds
    if (dataCtrl.counters.curRound < 4){
        
        // 1. Play audio
        playRoundAudio();
        
        // 2. Update background noise volume
        updateVolume();
        
    } else if (dataCtrl.counters.curRound >= 5 && dataCtrl.counters.curRound < 8) {
        document.querySelector('#toneAnswer').removeEventListener('click', function(){
         document.querySelector('.answerGrid').addEventListener('click', answerInput);
        askQuestion();
    }); 
    ctrlSetStepSpeechTest(dataCtrl.speechQuiz.quizType.num);
    } else {
        console.log('quizDone');
        pauseAudio();
        
        // 2. Calculate Total Wrong
       dataCtrl.howWell(); console.log(dataCtrl.testResults.speech.totalRight);
       // 3. load next stage
    }
    
    // Update curRound counter
    dataCtrl.increaseCurRound();
};
    
// ...END //// SPEECH TEST //////////////// M.M.


  // RETURNED PUBLIC FUNCTIONS
  return {

    init: function() {
      console.log('init');
      ctrlSetStepIntro();
    },
      dataCtrl: dataCtrl

  };

})(dataController, UIController);


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// MAKE IT GO
controller.init();
