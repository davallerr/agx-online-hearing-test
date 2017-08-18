
// Data CONTROLLER
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var dataController = (function () {

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
        speech: ['bells', 'cat', 'king', 'hand', 'cars', 'tree', 'dog', 'book', 'chair'],
        num: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
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
        answer1 = speechQuiz.questions[num1];
        answer2 = speechQuiz.questions[num2];
        answer3 = speechQuiz.questions[num3];
        
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
    
    // 1. Create and push new answer obj
    speechQuiz.answers.push(new Answer(speechQuiz.questionsOrder[counters.totalAnswerCount], event.target.id, event.target.parentNode.id, Math.random()));
    
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
}
    
//// RETURNED PUBLIC FUNCTIONS ////
  return {
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
  };

})();







// UI CONTROLLER
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var UIController = (function() {

  /* var importHTML = document.querySelector('link[id="html-templates"]').import;

  var importElements = {
    stageCalib:       importHTML.querySelector('.stage-calib'),
    stageIntro:       importHTML.querySelector('.stage-intro'),
    stageQuiz:        importHTML.querySelector('.stage-quiz'),
    stageSpeechTest:  importHTML.querySelector('.stage-speech-test'),
    stageToneTest:    importHTML.querySelector('.stage-tone-test'),
    stageVolume:      importHTML.querySelector('.stage-volume')
  };
  */

//// VARIABLES ////

// Speech noise in background    
var backgroundAud = new Audio('Audio/BackgroundNoise.mp3');

    
//// FUNCTIONS ////
    
// Update html to match answers provided as arguments
function updateAnsHTML(ansArray){
    
    for (i = 0; i < 9; i++){
        
        // 1. Load string into cur variable
        cur = ansArray[i];
        
        // 2. Temp number for non-zero based elements
        tempNum = i + 1;
        
        // 3. Update HTML ids for answer divs
        document.querySelector('#ans' + tempNum).id = cur;
        
        // 4. Add answer text inside answer divs
        document.querySelector('#' + cur).innerHTML = '<p>' + cur + '</p>';
    };
};
    
// Update Progress Bubbles
function updateRoundProg(ansCounter){        
    
    if (ansCounter < 4){
        
        // Add filled class to next bubble
        document.querySelector('#box' + (ansCounter)).classList.add('filled');
    };
};
    
// Create next round's audio file name string
function audioString(someNum, someArray){
    var tempNum, curAudio1, curAudio2, curAudio3;
    
    // Multiply current round by 3 to target correct answers
    tempNum = someNum * 3;
    
    // Create 3 Audio strings
    curAudio1 = 'Audio/Speech_' + someArray[tempNum] + '.mp3';
    tempNum++;
    
    curAudio2 = 'Audio/Speech_' + someArray[tempNum] + '.mp3';
    tempNum++;
  
    curAudio3 = 'Audio/Speech_' + someArray[tempNum] + '.mp3';
    
    // return audio strings as object
    return {
        curAudio1: curAudio1,
        curAudio2: curAudio2,
        curAudio3: curAudio3
    };
};

    
//// RETURNED PUBLIC FUNCTIONS ////
  return {
      audioString: audioString,
      updateAnsHTML: updateAnsHTML,
      backgroundAud: backgroundAud,
      updateRoundProg: updateRoundProg
  };

})();






// APP CONTROLLER
///////////////////////////////////////////////////////
////////////////////////////////////////////////////////

var controller = (function(dataCtrl, UICtrl) {

//// VARIABLES ////

    

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
    UICtrl.updateRoundProg(dataCtrl.counters.answerCounter);
    
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
    document.querySelector('.container-fluid').addEventListener('click', answerInput);
    document.querySelector('#toneAnswer').addEventListener('click', askQuestion);
};

// app
function askQuestion(){
    
    // Limit number of rounds
    if (dataCtrl.counters.curRound < 4){
        
        // 1. Play audio
        playRoundAudio();
        
        // 2. Update background noise volume
        updateVolume();
        
    } else {
        pauseAudio();
    };
    
    // Update curRound counter
    dataCtrl.increaseCurRound();
};
    
//// RETURNED PUBLIC FUNCTIONS ////
return {
      speechInit: speechInit,
      dataCtrl: dataCtrl,
    quizType: dataCtrl.speechQuiz.quizType
  };

})(dataController, UIController);


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// MAKE IT GO






controller.speechInit(controller.dataCtrl.speechQuiz.quizType.speech);




