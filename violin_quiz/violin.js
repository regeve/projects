(function() {
 /* var questions = [{
    question: "What is 2*5?",
    choices: [2, 5, 10, 15, 20],
    correctAnswer: 2
  }, {
    question: "What is 3*6?",
    choices: [3, 6, 9, 12, 18],
    correctAnswer: 4
  }, {
    question: "What is 8*9?",
    choices: [72, 99, 108, 134, 156],
    correctAnswer: 0
  }, {
    question: "What is 1*7?",
    choices: [4, 5, 6, 7, 8],
    correctAnswer: 3
  }, {
    question: "What is 8*8?",
    choices: [20, 30, 40, 50, 64],
    correctAnswer: 4
  }]; */
  
  
  var notes = ['A2', 'A#2', 'A3', 'A#3', 'A4', 'A#4', 'A5', 'A#5', 'B2', 'B3', 'B4', 'B5', 'C3', 'C#3', 'C4', 'C#4', 'C5', 'C#5',
  'D3', 'D#3', 'D4', 'D#4', 'D5', 'D#5', 'E3', 'E4', 'E5', 'F3', 'F#3', 
  'F4', 'F#4', 'F5', 'F#5', 'G2', 'G#2', 'G3', 'G#3', 'G4', 'G#4', 'G5', 'G#5']; 
  
  var notes_length = notes.length;
  
  var questions = new Array();
  for (var i=0; i<10; i++) {
	  questions[i] = createQuestion();
  }
  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var quiz = $('#quiz'); //Quiz div object
  
  // Display initial question
  displayNext();
  
  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
    e.preventDefault();

    // Suspend click listener during fade animation
    if(quiz.is(':animated')) {        
      return false;
    }
    choose();
    
    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
      alert('Please make a selection!');
    } else {
      questionCounter++;
      displayNext();
    }
  });
  
  // Click handler for the 'prev' button
  $('#prev').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    choose();
    questionCounter--;
    displayNext();
  });
  
  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();
    
    if(quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    displayNext();
    $('#start').hide();
  });
  
  // Animates buttons on hover
  $('.button').on('mouseenter', function () {
    $(this).addClass('active');
  });
  $('.button').on('mouseleave', function () {
    $(this).removeClass('active');
  });
  
  function randint(max_value) {
	return Math.floor(Math.random() * (max_value))
  }
  
  function isInArray(List, Item) {
    return List.indexOf(Item) > -1;
}
  
  function createQuestion() {
	var index = randint(notes_length);
	var note = notes[index];
	var audio_file = note.toLowerCase().replace('#','-') + '.mp3';
	var audio_path = 'notes/' +  audio_file;
	var correctAnswer = randint(3); // only 4 options
	var choices = new Array();
	for(var i=0;i<4;i++) {
		do {
			rand = randint(notes_length);
		} while (rand == index || isInArray(choices, notes[rand]));
		if (i == correctAnswer) {
			choices[i] = notes[index];
		} else {
			choices[i] = notes[rand];
			if (notes[rand] == undefined) {
				//alert(rand)
			}
		}
	}
	return {audio_path: audio_path,
	choices: choices,
	correctAnswer: correctAnswer};
  }

  function play_sound() {

	var thissound=document.getElementById('audio1');
	
	alert(thissound);
	thissound.play();

}  
  
  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });
    
    var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    qElement.append(header);
    
	var question = $('<p>').append("What is the note?");
    qElement.append(question);
    
	var audio = $('<audio id="audio1" src="questions[index].audio_path" type="audio/mp3" controls></audio>');
	qElement.append(audio);
	//alert(questions[index].audio_path);
	
	var abutton = $('<form><input type="button" value="PlaySound" onClick="$(audio1).play"></form>');
	qElement.append(abutton);
	
	var radioButtons = createRadios(index);
    qElement.append(radioButtons);
	
	
    return qElement;
  }
  
  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }
  


   function PauseSound(soundobj) {

	var thissound=document.getElementById(soundobj);

	thissound.pause();

}
  
  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }
  
  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $('#question').remove();
      
      if(questionCounter < 10){
        var nextQuestion = createQuestionElement(questionCounter);
		var audio = new Audio(questions[questionCounter].audio_path);
		audio.play();
		quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }
        
        // Controls display of 'prev' button
        if(questionCounter === 1){
          $('#prev').show();
        } else if(questionCounter === 0){
          
          $('#prev').hide();
          $('#next').show();
        }
      }else {
        var scoreElem = displayScore();
        quiz.append(scoreElem).fadeIn();
        $('#next').hide();
        $('#prev').hide();
        $('#start').show();
      }
    });
  }
  
  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    var score = $('<p>',{id: 'question'});
    
    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] === questions[i].correctAnswer) {
        numCorrect++;
      }
    }
    
    score.append('You got ' + numCorrect + ' questions out of ' +
                 questions.length + ' right!!!');
    return score;
  }
})();