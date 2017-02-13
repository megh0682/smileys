 $(document).ready(function(){
   
var timerClock = 0;
var wrongLetters= [];
var correctLetters =[];
var guessedLetter = null;
var guessLetterObject ={};
var imgAddr ="http://www.drodd.com/images12/smiley-face-clip-art1.jpg";
var snowman = {

  init : function(){
  wrongLetters = [];
  correctLetters = [];
  guessedLetter = "";
  guessLetterObject = {};
  //console.log("wrongLetters: " + wrongLetters );
  //remove previous correct data, incorrect data and hint
   $("#wordDiv").empty();
   $("#hint").html("");
   $("#wrongLetter").empty();
   $("#section1").empty();
    
 //pick a random word from json db pre-requisite
  var pickedWordObj = randomWord();
  var pickedWord = pickedWordObj.word;
  var pickedWordHint = pickedWordObj.hint;
 //console.log(pickedWord);
 //validate the word fullfills validation rules
  while(!validate_pickedWord(pickedWord)){
      pickedWord = randomWord();
  }
  
 //generate a lookup of expected word character array
 guessLetterObject = generatedExpLookUp(pickedWord);
 //console.log(guessLetterObject);    
 //create empty spaces on the UI per word's length
 displayDashesForGuess(pickedWord);
 //display hint for guess word
 displayHintForGuess(pickedWordHint);
 //create polling with certain time interval to check on 2 events i.e. wordCompleted event and outOfChances event
 setInterval(userWon,1000);
 setInterval(userOutOfChances,1000);
 //create a time out if user exceed more than 5 minutes on guessing a word
 setTimeout(gameUp,300000);
}  
};

/**validate picked word is fullfilling the min and max allowed length.In case otherwise, pick another word**/
 var validate_pickedWord = function(pickedWord){
  /* 
  1. It consists of only English Alphabets
  2. length of the word is minimum 3 letter long and maximum 20 letter long*/
  var pattern = /\w{3,20}/i;
  return pattern.test(pickedWord); 
};

/**get random work picked**/
var randomWord = function(){
  //console.log(wordData.length);
  var ranNum = Math.floor(Math.random()*(wordData.length));
  //console.log(wordData[ranNum]);
  return wordData[ranNum];  
};
   
/** generate empty spaces on ui for random word**/
var displayDashesForGuess = function(word){
  var wordLen = word.length;
  //console.log(wordLen);
   
    for(i=0;i<wordLen;i++){
     var buttonEle = $("<button></button>");
     buttonEle.attr("id", "button-" + i);
     buttonEle.addClass("btn btn-primary");
     buttonEle.attr("type","button");
     buttonEle.prop('disabled', true);
     $("#wordDiv").append(buttonEle);
   }
//display lives
  for(i=0;i<(wordLen+5);i++){
     var img = $("<img>");
     img.attr("src", imgAddr);
     img.addClass("img-circle");  
     img.attr("width","75px");
     img.attr("height","75px");
     //img.animate({top: "-=100"}, 2000);
     $("#section1").append(img);
   }
  
}

/*********************************************** display hint for the guessed word****************************************************************/
var displayHintForGuess = function(hint){
     var hintStr = "Hint: ";
     hintStr += hint;
     //console.log(hintStr);
     $("#hint").html(hintStr);
}  

/************************************************Game over due to time exceeded more than 5 minutes*************************************************/
var gameUp = function() {
    $("<div title='Game Over!'>You exceeded the maximum time.</div>").dialog();
    snowman.init();
    
}
/*************************************generate expected lookUpArray of guessed letters of the word************************************************/
var generatedExpLookUp = function(word){
  var map = {};
  var wordLen = word.length;
  var word = word.toUpperCase();
  var charArray = word.split('');
  for(i=0;i<charArray.length;i++){
      var charCode = charArray[i].charCodeAt(0);
      map[i]=charArray[i];
  }
  //console.log(map);
  return map;
}
/**********************create custom event for word being completed ***************************************************************************/
var userWon = function(){
  if(correctLetters.length===(Object.values(guessLetterObject)).length){
   var myEvent = new CustomEvent("wordCompleted");
   document.body.dispatchEvent(myEvent);
   return true; 
  } else{
    return false;
  }
};

document.body.addEventListener("wordCompleted", userWonfunc, false);
 
function userWonfunc(e) {
  alert("won");
  $("<div id='wonDialog' title='Game Over!'>You Won.</div>").dialog({
   /* appendTo: "#wordDiv",
    autoOpen:true,
    modal: false
  */
  });

    //$("#wordDiv").remove("#wonDialog");
    snowman.init();
}
 
 /***********************create custom event to check if user out of chances ******************************************************************/
 var userOutOfChances = function(){
     var limit = (Object.values(guessLetterObject)).length;
   if(wrongLetters.length>(limit+5))
    {
     var myEvent = new CustomEvent("outOfChances");
     document.body.dispatchEvent(myEvent);
     return true;
    }
   else
     return false;
  
 };
   
document.body.addEventListener("outOfChances", userLost, false);
 
function userLost(e) {
    //show modal user lost
 $("<div title='Game Over!'>You Lost.</div>").dialog({     
 /* buttons: [
    {
      text: "OK",
      click: function() {
        $( this ).dialog( "close" );
    }
    }
  ]
*/

 });
 
 snowman.init();
}

/*******************************************Display the correct guess on the screeen *********************************************************************************/
var displayCharacter = function(key,charValue) {
  //$("#button-" + key).prop('value',charValue);
  $("#button-" + key).html(charValue);
 } ;


/*******************************************Display wrong guess on the screen ********************************************************************/
 var displayWrongCharacter = function(charValue) {
  var delText = $("<del></del>");
  delText.html(charValue);
  var buttonE = $("<button></button>");
  buttonE.append(delText);
  buttonE.addClass("wrongLetterClass");
  $("#wrongLetter").append(buttonE);
 // spanEle.html(charValue);
 } ;
 
/******************************************************************************************************************************************/   

/** Window's event listener for capturing pressed letter keys**/
window.addEventListener('keyup', function (e) {
   /*setTimeout(function(){
     
   },1000);*/
  /***if user not out of chances and has not yet won enter the loop***/
   var alphArray = ['A','B','C','D','E','F','G','F','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
   var charCode = e.which?e.which:e.keyCode;
   var charValue = String.fromCharCode(charCode);
   // console.log(e.which + " : " + e.keyCode + " : "+charValue);
  if( alphArray.indexOf(charValue) > -1 ){
      if(((Object.values(guessLetterObject)).indexOf(charValue) > -1) && (correctLetters.indexOf(charValue)===-1)){
         //console.log(charValue);
        for (var [key, value] of Object.entries(guessLetterObject)) {
             //console.log(value+" : "+ charValue);
             if(value===charValue){
                correctLetters.push(charValue);
               // console.log(key + " : " + value +"is equal to" + charValue);
                displayCharacter(key,value);
              }
        }
      }else{
        //wrong character list display
        if((correctLetters.indexOf(charValue) === -1)){
          wrongLetters.push(charValue);
          displayWrongCharacter(charValue);
          $("#section1 img").first().animate({
            top: "+=200",
            opacity: 0.20
           },1000,function(){
            $("#section1 img").first().remove();
          });
         
        }
      }
  } 
 }, false);
   
/**************************************************************TEST DATA IN JSON FORMAT*********************************************************/
   
var wordData = [{
	"word": "webdesigner",
	"hint": "who beautifies the web page"
}, {
	"word": "developer",
	"hint": "who builds websites"
}, {
	"word": "sql",
	"hint": "language to query database"
}, {
	"word": "html",
	"hint": "web DOM cannot survive without me"
}, {
	"word": "css",
	"hint": "add color and properties to webpage"
}, {
	"word": "javascript",
	"hint": "wepage interaction happens due to me!"
}, {
	"word": "jquery",
	"hint": "abstraction of javascript"
}, {
	"word": "bootstrap",
	"hint": "abstraction of CSS"
}, {
	"word": "github",
	"hint": "cloud server to manage different versions of the source"
}, {
	"word": "heroku",
	"hint": "cloud server to host your web applications"
}, {
	"word": "webservices",
	"hint": "A function to  expose data and methods to the outside world over http protocol"
}, {
	"word": "json",
	"hint": "javascript notation to support interoperability data exchange  "
}, {
	"word": "ajax",
	"hint": "web 2.0 technology to eliminiate page reloads "
}, {
	"word": "http",
	"hint": "protocol of internet"
}];
   
 snowman.init();

});