//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTES
/*

Best display of results - what to include

Summary/CTA - link to schedule appointment, how to send results to member

SPEECH TEST
Start test button can be pressed to skip round during test

*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATA CONTROLLER
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
var dataController = (function() {

  var quiz = {
    questions: {
      q0: 'Do you have difficulty understanding people with higher speaking voices?',
      q1: 'Do you have a hard time understanding people over the phone?',
      q2: 'Do you have trouble keeping up with conversations in busy restaurants?',
      q3: 'Are you often told that you set the television volume very loud?'
    },
    topics: [
      'Understanding high voices', 
      'Talking on the phone',
      'Conversations in restaurants',
      'Watching television'
    ]
  };

  var frequencies = ['2000hz', '4000hz', '6000hz', '8000hz', '10000hz'];

  var results = {
    quiz: {},
    quizScore: 0,
    quizTopics: [],
    speechTest: {},
    speechTestScore: 0,
    toneTest: {},
    toneTestMissed: [],
    toneTestScore: 0
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
    volumeCounter: 0,
    audioDone: false
  };
      
  speechQuiz = {
    quizType: {
      speech: ['Bean', 'Chalk', 'Goose', 'Kite', 'Moon', 'Page', 'Puff', 'Shout', 'Take']
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
  function keyTest(){
    console.log(Object.keys(speechQuiz));
  }

  // Set Audio Counter
  function setAudioCounter(someBool){
    counters.audioDone = someBool;
  }
      
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
      } else if (!cur.isCorrect) {
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

    getFrequencies: function() {
      return frequencies;
    },

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

      if(response) {
        results.toneTestScore++;
      }

      if(response === false) {
        results.toneTestMissed.push(freq);
      }
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
      testResults: testResults,
      setAudioCounter: setAudioCounter,
      keyTest: keyTest
      
// ...END //// SPEECH TEST Data Returns //////////////// M.M.

  };

})();


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UI CONTROLLER
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
// START... //// SPEECH TEST //////////////// M.M.
    
//// VARIABLES ////

// Speech noise in background    
var backgroundAud = new Audio('../sounds/BackgroundNoise.mp3');

    
//// FUNCTIONS ////
    
    function listToArray(nodeList){
        var tempList, newArray;
        tempList = nodeList;
        newArray = [];
        console.log(newArray);
        
        for (i = 0; i < nodeList.length; i++){
            newArray[i] = nodeList[i];
        };
        return newArray;
    };
    
    // apply disabled to buttons
    function disableButtons(someParentID, someBool, someOpacity){
        var tempNodeList = document.querySelector(someParentID).children;
    
        var tempArray = listToArray(tempNodeList);
        
        tempArray.forEach(function(cur){
            cur.disabled = someBool;
            cur.opacity = someOpacity;
        });
    
    };
    
    
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
        document.querySelector('#' + cur).innerHTML = ansArray[i];
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

    getYesNoResponse: function(event) {
      // return true or false for y/n response
      if(event.target.className === 'btn-yn-yes') {
        return true;
      } else if(event.target.className === 'btn-yn-no') {
        return false;
      }
    },

    playTone: function(id) {
      // identify all audio tags and play one with provided id
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

    setFreqLabel: function(q, freqs) {
      // remove existing active label and set new one
      document.querySelector('.active-freq').classList.remove('active-freq');
      document.querySelector('.freq-' + freqs[q]).classList.add('active-freq');
    },

    setProgBubbles: function(current) {
      // receive current step and style prog bubbles
      document.querySelectorAll('.prog-bubble')[current].classList.add('prog-current');
    },

    setStage: function(el, step) {
      // clear quiz window, populate HTML block for provided step
      document.querySelector('.quiz-window').innerHTML = '';
      document.querySelector('.quiz-window').insertAdjacentElement('afterbegin', importElements[el]);

      // set current step at top of window
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
      // set initial stage
      document.querySelector('.quiz-window').insertAdjacentElement('afterbegin', importElements.stageIntro);
    },

    showResultsQuiz: function(score, outOf, topics) {
      // receives quiz score and topics then displays info
      var scoreDisplay;

      scoreDisplay = score + '/' + outOf;
      
      document.querySelector('.score-quiz').textContent = document.querySelector('.score-quiz').textContent.replace('%quizTotal%', scoreDisplay);

      // show environments that user responsed yes to in quiz
      if(topics.length > 0) {
        var introP, topicHtml, topicHtmlTemplate;

        // get html blocks from import and transform to editable strings
        introP = importHTML.querySelector('.environments-intro').outerHTML;
        topicHtmlTemplate = importHTML.querySelector('.environment').outerHTML;

        document.querySelector('.quiz-environments').insertAdjacentHTML('beforeend', introP);
  
        // use provided topics array to display environments user has trouble hearing in
        for(var i=0; i<topics.length; i++) {
          topicHtml = topicHtmlTemplate.replace('%environment%', topics[i]);
          document.querySelector('.quiz-environments').insertAdjacentHTML('beforeend', topicHtml);
        }
      }
    },

    showResultsSpeechTest: function(score) {
        // receives tone test score, number of tones tested, and displays it
      
        var scoreDisplay;

      scoreDisplay = score + '/12';
      // receives speech score and displays
      document.querySelector('.score-speech').textContent = document.querySelector('.score-speech').textContent.replace('%speechTotal%', scoreDisplay);
    },

    showResultsSummary: function(str) {
      // receives summary string to display based on score
      document.querySelector('.results-summary').textContent = str;
    },

    showResultsToneTest: function(score, outOf, tones) {
      // receives tone test score, number of tones tested, and displays it
      var scoreDisplay;

      scoreDisplay = score + '/' + outOf;

      document.querySelector('.score-tone').textContent = document.querySelector('.score-tone').textContent.replace('%toneTotal%', scoreDisplay);

      // show tones not heard
      if (score > 0) {
        var toneHtml, toneHtmlTemplate;

        // get html blocks from import and transform into editable strings
        introP = importHTML.querySelector('.tones-intro').outerHTML;
        toneHtmlTemplate = importHTML.querySelector('.missed-tone').outerHTML;

        document.querySelector('.tone-freqs').insertAdjacentHTML('beforeend', introP);

        // use provided tones array to display tones user couldn't hear
        for(var i=0; i<tones.length; i++) {
          toneHtml = toneHtmlTemplate.replace('%missedTone%', tones[i]);
          document.querySelector('.tone-freqs').insertAdjacentHTML('beforeend', toneHtml);
        }
      }
    },

    volFull: function(audio) {
      // sets provided audio id to full volume
      var audio;

      audio = document.getElementById(audio);
      audio.volume = 1;
    },
      // START... //// SPEECH TEST UI Returns //////////////// M.M.
      
      audioString: audioString,
      updateAnsHTML: updateAnsHTML,
      backgroundAud: backgroundAud,
      updateRoundProg: updateRoundProg,
      resetProgBubbles: function() {
        
        [].forEach.call(
  document.querySelectorAll('.prog-bubble'), 
  function(el){
    el.classList.remove('prog-current');
  });
    },
      disableButtons: disableButtons
      
// ...END //// SPEECH TEST UI Returns //////////////// M.M.

  };

})();


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// APP CONTROLLER
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    // volume step: play noise for user to set to comfortable level

    UICtrl.setStage('stageVolume', 2);
    UICtrl.setProgBubbles(0);

    UICtrl.playTone('noise');

    document.querySelector('.btn-submit-volume').addEventListener('click', ctrlSetStepToneTest);
  };

  var ctrlSetStepToneTest = function() {
    // tone test step: set stage and add event listeners, then go to tone check

    UICtrl.setStage('stageToneTest', 2);
    UICtrl.setProgBubbles(0);

    document.querySelector('.btns-yn').addEventListener('click', ctrlToneResponse);

    ctrlToneNext();
  };

  var ctrlToneNext = function() {
    // check which tone to check next, or go to next step
    var freqs, q;

    freqs = dataCtrl.getFrequencies();
    q = dataCtrl.getResponseNum('toneTest');

    if(q < freqs.length) {
      UICtrl.setProgBubbles(q + 1);
      UICtrl.setFreqLabel(q, freqs);
      UICtrl.playTone(freqs[q]);
      UICtrl.volFull(freqs[q]);
    } else {
      ctrlSetStepSpeechTest();
        speechInit(dataCtrl.speechQuiz.quizType.speech);
    }
  };

  var ctrlToneResponse = function(event) {
    // check response y/n and add to results data, then go to next tone
    var freqs, q, response;

    freqs = dataCtrl.getFrequencies();
    q = dataCtrl.getResponseNum('toneTest');
    response = UICtrl.getYesNoResponse(event);

    dataCtrl.setToneResponse(freqs[q], response);

    ctrlToneNext();
  };

  var ctrlSetStepSpeechTest = function() {
    // TO BE INSERTED
    UICtrl.setStage('stageSpeechTest', 3);
    UICtrl.setProgBubbles(0);
  };

  var ctrlSetStepResults = function() {
    // set step results: set stage, retrieve results, calculate summary, show results
    var missedTones, quizLength, results, toneTestLength;

    UICtrl.setStage('stageResults', 1);
    results = dataCtrl.getResults();
    quizLength = Object.keys(results.quiz).length;
    toneTestLength = Object.keys(results.toneTest).length;
    missedTones = results.toneTestMissed;

    // show summary
    ctrlCalcResults();

    // show quiz results
    UICtrl.showResultsQuiz(results.quizScore, quizLength, results.quizTopics);

    // show tone results
    UICtrl.showResultsToneTest(results.toneTestScore, toneTestLength, missedTones);

    // show speech results
    dataCtrl.howWell();
    UICtrl.showResultsSpeechTest(dataCtrl.testResults.speech.totalRight);
    
  };

  var ctrlCalcResults = function() {
    // calculate summary based on results data
    var results, strings, summary, totalScore;

    results = dataCtrl.getResults();

    strings = {
      aNoVisit:   'No visit: Your hearing seems to be in the healthy range, but regular visits to your audiologist are still super cool.',
      bModerate:  'Moderate: It looks like you may have some level of hearing loss. Contact us to start your journey to better hearing.',
      cSevere:    'Severe: It looks like you may have a significant level of hearing loss. Contact us to start your journey to better hearing.'
    }
    
    // calculate combination of scores to determine summary given
    totalScore = results.quizScore + results.toneTestScore + results.speechTestScore;

    if(totalScore > 5) {
      UICtrl.showResultsSummary(strings.cSevere);
    } else if(totalScore > 0) {
      UICtrl.showResultsSummary(strings.bModerate);
    } else {
      UICtrl.showResultsSummary(strings.aNoVisit);
    }
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
    
    
    function duringAudioUI(someKeyword){
        
        if(someKeyword === 'start'){
        dataCtrl.setAudioCounter(false);
    UICtrl.disableButtons('.calib-tone-1', true, .3);
    UICtrl.disableButtons('.calib-tone-2', true, .3);
    UICtrl.disableButtons('.calib-tone-3', true, .3);
    } else if (someKeyword === 'end'){
        dataCtrl.setAudioCounter(true);
    UICtrl.disableButtons('.calib-tone-1', false, 1);
    UICtrl.disableButtons('.calib-tone-2', false, 1);
    UICtrl.disableButtons('.calib-tone-3', false, 1);
    };
        };
// Play the 3 audio files
function playAudio(aud1, aud2, aud3){
    
    //0. set Audio Counter to false to limit button input
    duringAudioUI('start');
    
    aud1.volume = 1;
    aud2.volume = 1;
    aud3.volume = 1;
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
    
    aud3.onended = function(){
        duringAudioUI('end');
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
        dataCtrl.increaseVolumeCounter(.1);
        
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
   if(dataCtrl.counters.audioDone === true && dataCtrl.counters.answerCounter < 3){
       
    // 1. Create and add new answer obj
    dataCtrl.addNewAnswer();
    
    // 2. Console log if true/false and update totalAnswerCount
    logTarget();
    
    // 3. Update progress bubbles
    UICtrl.setProgBubbles(dataCtrl.counters.answerCounter - 1);
    
    // 4. Load next question and play audio
    loadNextQuestion();
};
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
         document.querySelector('.answerGrid').addEventListener('click', function(){
             console.log(event.target.localName);
             if(event.target.localName === 'button'){
                 answerInput();
             };
         });
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
        ctrlSetStepResults();
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
      ctrlSetStepIntro();
    }

  };

})(dataController, UIController);


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAKE IT GO
controller.init();
