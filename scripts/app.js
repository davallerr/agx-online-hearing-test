///////////////////////////////////////////////////////////////////////////////
// NOTES
/*

once HTML block has been pulled into DOM, it's referenced by document.etc
  NOT importHTML.etc

display changes need to know if it only has to update existing DOM elements
  OR remove or add new ones

random thought, because of those things I don't think any kind of 'back' functionality would be wise


*/
///////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// DATA CONTROLLER
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var quizController = (function() {

  var data = {

  };


  // RETURNED PUBLIC FUNCTIONS
  return {

  };

})();


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// UI CONTROLLER
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var UIController = (function() {

  var importHTML = document.querySelector('link[id="html-templates"]').import;

  var DOMStrings = {
    btnSubmit:    '.btn-submit',
    leadText:     '.lead-text',
    headerText:   '.header-text'
  };


  // RETURNED PUBLIC FUNCTIONS
  return {

    addHtmlBlock: function(importString, destinationString, insertCondition) {
      var el = importHTML.querySelector(importString);
      console.log(el);
      document.querySelector(destinationString).insertAdjacentElement(insertCondition, el);
    },

    getDOMStrings: function() {
      return DOMStrings;
    },

    setHeader(headerText)  {
      document.querySelector(DOMStrings.headerText).innerHTML = headerText;
    },

    setLead(leadText) {
      document.querySelector(DOMStrings.leadText).innerHTML = leadText;
    }

  };

})();


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// APP CONTROLLER
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var controller = (function(quizCtrl, UICtrl) {

  var setupListeners = function() {
    var DOM = UICtrl.getDOMStrings();
  };

  var ctrlSetStageIntro = function() {
    // add AGX Hearing logo
    // add header block
    // add lead block
    // add start test button

    //UICtrl.setHeader('AGX<sup>&reg;</sup> Online Hearing Test');
    //UICtrl.setLead('I forget what it is but some lead text for the intro stage');
  };


  // RETURNED PUBLIC FUNCTIONS
  return {

    init: function() {
      console.log('init');
      setupListeners();
      ctrlSetStageIntro();
      UICtrl.addHtmlBlock('.lead', '.parent-container', 'beforeend');
      UICtrl.setLead('we did it!');
    }

  };

})(quizController, UIController);


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// MAKE IT GO
controller.init();
