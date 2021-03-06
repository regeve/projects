var single_game_time = 40;
var questions_length = 30;
var animationSetup = false;

function randint(max_value) {
	return Math.floor(Math.random() * (max_value));
}

function isInArray(List, Item) {
	return List.indexOf(Item) > -1;
}
 
 function animationPipeline() {
   
	/* Variables */
	var self = this,
	w = window.innerWidth,
	h = window.innerHeight,
	stage = document.getElementById('stage'),
	startButton1 = document.getElementById('startButton1'),
	startButton2 = document.getElementById('startButton2'),
	subMenu = document.getElementById('subMenu'),
	subMenuButton1 = document.getElementById('subMenuButton1'),
	subMenuButton2 = document.getElementById('subMenuButton2'),
	subMenuButton3 = document.getElementById('subMenuButton3'),
	mainMenu = document.getElementById('mainMenu'),
	title = document.getElementById('title'),
	questionTitle = document.getElementsByClassName("questions"),
	score = document.getElementsByClassName("score"),
	scoreSpan = score[0].getElementsByTagName('span'),
	timer = document.getElementsByClassName("timer"),
	timerSpan = timer[0].getElementsByTagName('span'),
	gameChoices = document.getElementById('gameChoices'),
	gameHeader = document.getElementById('gameHeader'),
	exitButton = document.getElementById('exitButton'),
	buttonOne = document.getElementById('buttonOne'),
	buttonTwo = document.getElementById('buttonTwo'),
	buttonThree = document.getElementById('buttonThree'),
	buttonFour = document.getElementById('buttonFour'),
	buttonArray = [buttonOne, buttonTwo, buttonThree, buttonFour],
	modal_window = document.getElementById('modal_window'),
	startAnimation = new TimelineMax({repeat:0}),
	gameIndex = 0,
	actualScore = 0,
	timerIndex = single_game_time,
	runningGameAgain = false,
	timerObject = undefined,
	gameQuestions = [],
	//gameMusic = new Audio('http://f5361a5c08a4c03f7c6f-acbeb9602bd0a56bf9c1a6bed3d8280b.r27.cf2.rackcdn.com/math2.mp3'),
	rightAnswer = new Audio('http://f5361a5c08a4c03f7c6f-acbeb9602bd0a56bf9c1a6bed3d8280b.r27.cf2.rackcdn.com/RightSound2%202.mp3'),
	wrongAnser = new Audio('http://f5361a5c08a4c03f7c6f-acbeb9602bd0a56bf9c1a6bed3d8280b.r27.cf2.rackcdn.com/wrongSound2.mp3'),
	gameAnswers = [],
	notes = ['A2', 'A#2', 'A3', 'A#3', 'A4', 'A#4', 'A5', 'A#5', 'B2', 'B3', 'B4', 'B5', 'C3', 'C#3', 'C4', 'C#4', 'C5', 'C#5',
	'D3', 'D#3', 'D4', 'D#4', 'D5', 'D#5', 'E3', 'E4', 'E5', 'F3', 'F#3', 
	'F4', 'F#4', 'F5', 'F#5', 'G2', 'G#2', 'G3', 'G#3', 'G4', 'G#4', 'G5', 'G#5'],
	doremi_table = {'A': 'La', 'B': 'Si', 'C': 'Do', 'D': 'Re', 'E': 'Mi', 'F': 'Fa', 'G': 'Sol'},
	doremi_notes = ['La', 'Si', 'Do', 'Re', 'Mi', 'Fa', 'Sol'],
	shortLetter_notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	
	/** types:
		- ear_training
			* doremi
			* ABC
			* ABC_extended
		- nodes_reading
			* doremi
			* ABC
			* ABC_extended
	**/
	
	self.createQuestion = function(section, subSection) {
		self.subSection = subSection;
		if (section == 'ear_training') {
			var options = notes;
			var index = randint(options.length);
			var note = options[index];
			var path = 'notes/' +  note.toLowerCase().replace('#','-') + '.mp3';
			var html = '<audio id="audio1" controls="controls"><source id="mp3Source" type="audio/mp3"></source></audio>';
			self.question_function = function(path) {
				var audio = document.getElementById('audio1');
				var source = document.getElementById('mp3Source');
				source.src = path;
				audio.load();
				audio.play();
			};
		} 
		else if (section == 'nodes_reading'){
			var options = notes.filter(function(x) {return !x.includes('#')});
			var index = randint(options.length);
			var note = options[index];
			var path = 'notes_sheet/' + note.toLowerCase() + '.png'
			var html = '<img id ="image1" src=' + path + ' alt="Mountain View" style="width:304px;height:200px;">' 
			self.question_function = function() {
				return 0;
			};
		}
		// creation of results, which is the poll for optional answers.
		if (subSection == 'doremi') {
			var results = doremi_notes;
			index = results.findIndex(function(element){return element == letter2doremi(note);});
		} else if (subSection == 'ABC') {
			var results = shortLetter_notes;
			index = results.findIndex(function(element){return element == note[0];});
		} else {
			var results = options;
		}
		// creation of answers
		var correctAnswer = randint(3); // only 4 options
		var answers = new Array();
		for(var i=0;i<4;i++) {
			do {
				rand = randint(results.length);
			} while (rand == index || isInArray(answers, results[rand]));
			if (i == correctAnswer) {
				answers[i] = results[index];
			} else {
				answers[i] = results[rand];
			}
		}
		return {html: html,
		path: path,
		answers: answers,
		correctAnswer: correctAnswer};
	};
    
	// Convert letters to DoReMi notation
	self.letter2doremi = function(note) {
		var letter = note[0];
		return doremi_table[letter];
	};
	
   /**
    * Setup styles and events
    **/
	self._initilize = function() {
		self.windowWasResized();
		// Add click listener to start button 
		startButton1.addEventListener('click', function() {self.subMenu_page('ear_training')}, false);
		startButton2.addEventListener('click', function() {self.subMenu_page('nodes_reading')}, false);
		subMenuButton1.addEventListener('click', function(){self.startGamePlay(self.section, 'doremi')}, false);
		subMenuButton2.addEventListener('click', function(){self.startGamePlay(self.section, 'ABC')}, false);
		subMenuButton3.addEventListener('click', function(){self.startGamePlay(self.section, 'ABC_extended')}, false);
		// Add answer click listener
		for (var i = 0; i < buttonArray.length; i++) {
		  buttonArray[i].addEventListener('click', self.anwerClicked, false);
		}
		
    };
	
	self.main_menu = function() {
		window.clearTimeout(timerObject);
		timerObject = undefined;
		gameIndex = 0;
		gameAnswers = [];
		actualScore = 0;
		timerIndex = single_game_time;
		gameQuestions = [];
		scoreSpan[0].textContent = actualScore;
		timerSpan[0].textContent = timerIndex;
		//self.runTimer();
		gameHeader.style.display = 'none';
		gameChoices.style.display = 'none';
		mainMenu.style.display = 'block';
		//mainMenu.style.visibility = 'visible';
		//title.style.display = 'block';
		//startButton1.style.display = 'block';
		//self._initilize();
	};
   /**
    * Called everytime the window resizes to calculate new dimensions
    **/
	self.windowWasResized = function() {
		stage.style.height = (h - 8) + 'px';
		stage.style.width = (w - 8) + 'px';
	};
	
	self.subMenu_page = function(section) {
		self.section = section;
		mainMenu.style.display = 'none';
		subMenu.style.display = 'block';
	};
	
    /**
    * Setup the stage and fire off the stage animations
    **/
	self.startGamePlay = function(section, subSection) {

		// Get the game indexes
		self.generateGameIndexes(section, subSection);
		// Add data to the interface
		self.setupUserInterfaceWithData();
		// Set the score to zero
		scoreSpan[0].textContent = actualScore;
		timerSpan[0].textContent = timerIndex;
		subMenu.style.display = 'none';
		mainMenu.style.display = 'none';
		//startAnimation.to([startButton1, startButton2, title], 1, {alpha:0});
		//startAnimation.to([startButton1, startButton2, title], 0.1, {css:{display:'none'}});
		//startAnimation.to([gameHeader, gameChoices], 0.1, {css:{display:'block'}, onComplete:self.fireOffGameLogic});
		
		
		gameHeader.style.display = 'block';
		gameChoices.style.display = 'block';
		self.fireOffGameLogic();
		// Initialize the exit button
		exitButton.addEventListener('click', self.main_menu);
	};

   /**
    * Callback function from the startAnimation timeline above
    * This function starts the timer and plays the music at the same time
    **/
	self.fireOffGameLogic = function() {
		self.runTimer();
		//gameMusic.currentTime = 0;
		//gameMusic.play();
   }

	/**
    * This function rebuilds the UI with a new question and answer
    **/
	self.setupUserInterfaceWithData = function() {
		// Add questions to buttons
		var ques = gameQuestions[gameIndex];
		var t = questionTitle[0].getElementsByTagName('span');
		t[0].innerHTML = ques.html;
		self.question_function(ques.path);
		// Add answers to buttons
		var ans = gameQuestions[gameIndex].answers;
		for (var i = 0; i < ans.length; i++) {
		  var a = ans[i];
		  buttonArray[i].textContent = a;
		}
	};
	
	/**
	* Called to start a gameplay timer that runs every second
	**/
	self.runTimer = function() {
		timerObject = window.setInterval(self.updateClock, 1000);
	};
	
	/**
    * Callback function for the gameplay timer
    **/
	self.updateClock = function() {
		timerIndex--;
		if (timerIndex == -1) {
		  timerIndex = single_game_time;
		  gameIndex++;
		} 
	 
		if (gameIndex == gameQuestions.length) {
		  clearTimeout(timerObject);
		  // end the game
		  self.runEndOfGame();
		  return;
		} else if(timerIndex == single_game_time){
		  self.setupUserInterfaceWithData();
		}
		// Display updated time
		timerSpan[0].textContent = timerIndex;
	};

	/**
    * Determines if an answer is correct or incorrect
    * Displays a message to user and plays sound effect
    **/
	self.anwerClicked = function(e) {

		clearTimeout(timerObject);
		//gameMusic.pause();
		//gameMusic.currentTime = 0;
		// Get the answer index
		var answerIndex = Number(e.target.getAttribute('data-index'));
		// Get the actual answer index 
		var actualCorrectAnswerIndex = gameAnswers[gameIndex];

		// Correct answer
		if (actualCorrectAnswerIndex == answerIndex) {
		  rightAnswer.play();
		  actualScore += 10;
		  scoreSpan[0].textContent = actualScore;
		  cancelButtons = true;
		  self.dispatch_modal('YOUR ANSWER IS: <span class="correct">CORRECT!</span>', 1000);
		// Incorrect Answer
		} else {
		  wrongAnser.play();
		  cancelButtons = true;
		  self.dispatch_modal('YOUR ANSWER IS: <span class="incorrect">INCORRECT!</span>', 1000);
		}
	}

	/**
    * This function generates random indexes to be used for our game logic
    * The indexes are used to assign questions and correct answers
    **/
	self.generateGameIndexes = function(section, subSection) {
		var breakFlag = false;
		while (!breakFlag) {
		  /**var randomNumber = Math.floor(Math.random() * 9);
		  if (gameQuestions.indexOf(randomNumber) == -1) {
			gameQuestions.push(randomNumber);
			gameAnswers.push(correctAnswers[randomNumber]);
		  }**/
		  var ques = self.createQuestion(section, subSection);
		  gameQuestions.push(ques);
		  gameAnswers.push(ques.correctAnswer)
		  if (gameQuestions.length == questions_length) {
			breakFlag = true;
		  }
		}
	};

  /**
   *  Dispatches a modal window with a message to user
   */
	self.dispatch_modal = function(message, time) {
		window_width = window.innerWidth|| document.documentElement.clientWidth
					   || document.body.clientWidth;

		modal_window.getElementsByTagName('p')[0].innerHTML = message;
		modal_window.style.left = ((window_width / 2) - 150)+ 'px';

		self.fade_in(time, modal_window, true);
	};

	/**
	* Credit for the idea about fade_in and fade_out to Todd Motto
	* fade_in function emulates the fadeIn() jQuery function
	*/
	self.fade_in = function(time, elem, flag) {

		var opacity = 0, interval = 50, 
		gap = interval / time, self = this;
		  
		elem.style.display = 'block';
		elem.style.opacity = opacity;
		
		function func() { 
		  opacity += gap;
		  elem.style.opacity = opacity;
		  
		  if (opacity >= 1) {
			window.clearInterval(fading);
			//now detect if we need to call fade out
			if (flag) {
			  setTimeout(function(){
				 self.fade_out(time, elem);
			  }, 1500);
			}
		  }
		}
		var fading = window.setInterval(func, interval);
	},

	/**
	*  
	* Credit for the idea about fade_in and fade_out to Todd Motto
	* fade_out function emulates the fadeOut() jQuery function
	*/
	self.fade_out = function(time, elem) {
		var opacity = 1, interval = 50, gap = interval / time;
			
		function func() { 
		  opacity -= gap;
		  elem.style.opacity = opacity;
		  
		  if (opacity <= 0) {
			window.clearInterval(fading); 
			elem.style.display = 'none';
			gameIndex++;
			// Determine if we need to run another game loop
			if (gameIndex != gameQuestions.length) {
			  timerIndex = single_game_time;
			  timerSpan[0].textContent = timerIndex
			  self.setupUserInterfaceWithData();
			  self.runTimer();
			  //gameMusic.play();
			} else {
			  self.runEndOfGame();
			}
		  }
		}  
		var fading = window.setInterval(func, interval);
	};

   /**
    * Runs when the game ends
    * Displays a modal window with the option to tweet score or play again
    **/
	self.runEndOfGame = function() {
  
		window_width = window.innerWidth|| document.documentElement.clientWidth
					   || document.body.clientWidth;
		var tweetButton = '<button id="tweekScore" class="left twitter" onClick="self.tweetScore()">TWEET SCORE</button>';
		var playAgainButton = '<button id="playAgain" class="left" onClick="self.resetGame()">PLAY AGAIN</button>';
		var actualScoreHeader = '<h2>CONGRATS, YOUR FINAL SCORE IS: '+ actualScore + '</h2>';
		var insertedHTML = actualScoreHeader +'<div>' + tweetButton + playAgainButton + '</div>';
		modal_window.getElementsByTagName('div')[0].innerHTML = insertedHTML;
		modal_window.style.left = ((window_width / 2) - 150)+ 'px';

		self.fade_in(1000, modal_window, false);
	};

   /**
    * The tweets score function allows a user to post their score to twitter
    **/
	self.tweetScore = function() {
		var u = 'http://codepen.io/agnosticdev/pen/ZbWjaB';
		var text = 'I just played Web Trivia Game on @CodePen and scored: ' + actualScore + ' points! @matt_815';
		var url = 'https://twitter.com/intent/tweet?original_referer=' + u + '&url=' + u + '&text=' + text;
		var newWindow = window.open(url, 'name','height=400,width=450');
		if (window.focus) {newWindow.focus()}
		return false;
	}
	
   /**
    * This function resets the game and starts it all over again
    * This function acts as to reset all data from scratch
    **/
	self.resetGame = function() {

		modal_window.style.opacity = 0.0;
		modal_window.innerHTML = '<div class="modal_message"><p></p></div>';

		window.clearTimeout(timerObject);
		timerObject = undefined;
		gameIndex = 0;
		gameAnswers = [];
		actualScore = 0;
		timerIndex = single_game_time;
		gameQuestions = [];
		// Get the game indexes
		self.generateGameIndexes(self.section, self.subSection);
	 
		// Add data to the interface
		self.setupUserInterfaceWithData();
		// Set the score to zero
		scoreSpan[0].textContent = actualScore;
		timerSpan[0].textContent = timerIndex;
		self.runTimer();
		//gameMusic.currentTime = 0;
		//gameMusic.play();

	};

   /**
    * Logging Function
    **/
	self.l = function(message) {
		console.log(message);
	};

   // Initialize the functionality of the controller
	self._initilize();

	} // End animationPipeline

	
	
 // Used to call the animationPipline function
 var interval = setInterval(function() {
	if(document.readyState === 'complete') {
		clearInterval(interval);
		var pipe = animationPipeline();

		window.onresize = function(event) {
			var pipe = animationPipeline()
		};
	}
}, 100);