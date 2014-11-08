VisualIDE
.service('actionService', ['commandProcessor', function(commandProcessor) {
	/// this service parses the action and calls the commandProcessor
	//console.log('actionService initialized from app-services.js');
	this.process = function(elem, attr, command) {
		commandProcessor.execute(elem, attr, command);
	};
}])
.service('backgroundService', function() {
	/// this service provides the background image
	//console.log('backgroundService initialized from app-services.js');
	this.backgrounds = [
	'binding_dark',
	'congruent_outline',
	'halftone',
	'hoffman',
	'ps_neutral',
	'seamless_paper_texture',
	'small_steps',
	'squared_metal',
	'stardust',
	'tree_bark',
	'triangular'
	];
	this.config = {
		'scale' 	: 10,					// default background scale
		'//console' 	: false,					// if TRUE, //console is visible
		'source' 	: this.backgrounds[1],	// default background source
	};
	this.changeImage = function($backgroundId) {
		//console.log('backgroundService.changeImage() called');
		this.config.source = $backgroundId;
	};
	this.changeScale = function($scale) {
		//console.log('backgroundService.changeScale() called');
		this.config.scale = $scale;
	};
})
.service('characterService', function($timeout, $rootScope) {
	/// this service provides the character
	//console.log('characterService initialized from app-services.js');
	var nextTickTime = 0;
	var timePerTick = 25;
	var xMoved = 0;
	var yMoved = 0;
	var currentX = 0;
	var currentY = 0;
	var delay = 0;

	this.costumes = [
	'pikachu',
	'pikaspec',
	'pikasquirk',
	'pikadead'
	];
	this.config = {
		'id'		: 0,
		'name'		: 'default',
		'scale'		: 50,
		'source'	: this.costumes[0],
	};
	this.changeCostume = function($elem,$costumeId) {
		//console.log('characterService.changeCostume() called');
		// change the templateUrl of the elem to the dataCostume[costumeId]
		this.config.source = $elem;
	};
	this.create = function($id,$name,$scale,$costumeId) {
		//console.log('characterService.create() called');
		return {
			'id' 		: $id,
			'name'		: $name,
			'scale'		: $scale,
			'source'	: this.costumes[$costumeId],
		};
	};

	this.reposition = function (xCoord, yCoord){
		//console.log("characterService.repositon() called");
		this.config.left = xCoord;
		this.config.top = yCoord;
		currentX = xCoord;
		currentY = yCoord;
		return true;
	};

	this.setX = function(xCoord){
		//console.log("characterService.setX() called: " + xCoord);
		this.config.left = xCoord;
		currentX = xCoord;
		return true;
	};

	this.setY = function(yCoord){
		//console.log("characterService.setY() called:" + yCoord);
		this.config.top = yCoord;
		currentY = yCoord;
		return true;
	};

	this.hide = function(){
		this.config.visibility = "hidden";	
		return true;
	};

	this.show = function(){
		this.config.visibility = "visible";
		return true;
	};
	//speed : pixels per second?
	//convert to steps
	this.move = function(speed, stepSize, x, y, newMovement){
		////console.log("characterService.move function called");
		////console.log("speed(pixels/s): " + speed);
		////console.log("X to move: " + x);

		if(x == 0 && y == 0)
			return true;

		if(newMovement){
			xMoved = 0;
			yMoved = 0;
		}
		//var startTime = (new Date()).getTime();
		//var currentTime = startTime;
		//convert to milisecs to standardize

		var unitX = 0;
		var unitY = 0;
		if(x != 0){
			unitX = (speed)  * Number(timePerTick/1000.00);
			if(x < 0){
				unitX *= -1;
			}
		}
		if(y != 0){
			unitY = (speed)  * Number(timePerTick/1000.00);
			if(y < 0){
				unitY *= -1;
			}
		}

		////console.log("unitX movement: " + unitX);
		////console.log("unitY movement: " + unitY);

		
		xMoved = Number(xMoved) + Number(unitX);
		yMoved = Number(yMoved) + Number(unitY);

		currentX = Number(currentX) + Number(unitX);
		currentY = Number(currentY) + Number(unitY);

		this.config.left = currentX;
		this.config.top = currentY;

		//if haven't reached destination
		
		if(xMoved != x*stepSize || yMoved != y*stepSize){
			
			var nextExe = Number(timePerTick+delay);
			////console.log("timegap: " + nextExe);
			var that = this;
			$timeout(
				
				function(){
					////console.log("recursing");
					that.move(speed, stepSize,x,y, false);
				}
				
				,nextExe);
			}
		else if(xMoved == x*stepSize && yMoved == y*stepSize){
			return true;
		}

		return false;
	};


	this.tick = function(){
		var currentTime = (new Date()).getTime();
		if(currentTime < nextTickTime){
			return false;
		}
		else{
			nextTickTime = currentTime + timePerTick + delay;
			return true;
		}
	};

})
.service('commandProcessor', ['$interval', '$timeout','backgroundService', 'characterService', function($interval, $timeout, backgroundService, characterService) {
	/// this service contains the functions for the actions to call
	//console.log('commandProcessor initialized from app-services.js');
	
	var times = [];
	var commandQueue = [];
	var commandsInterval = 300;
	var defaultCommandsInterval = 1000;
	var blockMainProcess = false;
	var timeToRun = 0;
	var cumulativeRepeatDelay = 0;
	var speed = 100;
	var stepSize = 50;
	var playing = false;

	var stack = [];
	var lineNumber = 0;
	var currentBlock;

	this.play = function(commands){
		//console.log("making schedule");
		//commandQueue = [];
		//times = [];
		//var d = this.makeSchedule(commands,0);
		//console.log("running schedule");
		//this.runSchedule();


		//console.log(commands[0]);
		if(!playing){

			// Initialize variables
			stack = [];
			lineNumber = 0;
			currentBlock = this.deepClone(commands);

			$timeout(this.stepThrough, 1);
			playing = true;
		}else{
			this.reset();
		}

	};

	var that = this;
	this.stepThrough = function(){

		if (!playing) {
			return;
		}

		var currentLine = currentBlock[lineNumber];
		console.log(currentLine);
		console.log(lineNumber);

		var timeForThisCommand = defaultCommandsInterval;
		// To be overwritten by commands if applicable

		// Execute currentLine (flow control)
		if (currentLine.title == "repeat") {
			if (currentLine.count > 0) {

				currentLine.count--;
				stack.push({
					lineNumber: lineNumber,
					codeBlock: currentBlock,
				});

				lineNumber = 0;
				currentBlock = that.deepClone(currentLine.commands);
				
				$timeout(that.stepThrough, 1);
				return;
			}

		} else if (currentLine.title == "forever") {
			
			stack.push({
				lineNumber: lineNumber,
				codeBlock: currentBlock,
			});

			lineNumber = 0;
			currentBlock = that.deepClone(currentLine.commands);
				
			$timeout(that.stepThrough, 1);
			return;

		} else if  (currentLine.title == "ifelse") {

			if (!currentLine.executed){
				currentLine.executed = true;

				if (currentLine.condition.eval() == true) {

					stack.push({
						lineNumber: lineNumber,
						codeBlock: currentBlock,
					});

					lineNumber = 0;
					currentBlock = that.deepClone(currentLine.ifblock);
					
					$timeout(that.stepThrough, 1);
					return;
				} else {

					stack.push({
						lineNumber: lineNumber,
						codeBlock: currentBlock,
					});

					lineNumber = 0;
					currentBlock = that.deepClone(currentLine.elseblock);
					
					$timeout(that.stepThrough, 1);
					return;
				}
			}
		}

		// Execute currentLine (normal stuff)
		timeForThisCommand = that.calculateStatementExecutionTime(currentLine);
		that.executeNoChain(currentLine);

		// Advance to next line!
		lineNumber++;

		// pop out if end of command block
		if (lineNumber >= currentBlock.length) {
			var stackFrame = stack.pop();
			if ( typeof(stackFrame) === "undefined" ) {
				console.log("execution complete");
				return;
			}else{
				lineNumber = stackFrame.lineNumber;
				currentBlock = stackFrame.codeBlock;
			}
		}

		$timeout(that.stepThrough, timeForThisCommand);

	}

	this.reset = function(){
		playing = false;
		console.log("reset-ed");
	}

	//not for containers
	this.calculateStatementExecutionTime = function(command){
		exeTime = 0;
		if(command.title== "repeat" || command.title == "if"){
			console.log("container statement received. Not valid.");
			return;
		}

		//if move commands
		if(command.title == "move"){
			exeTime = Math.abs(Number(1000 * stepSize * command.count/speed)) + Number(defaultCommandsInterval)*0.5;
		}
		//if not repeat commands and not move command
		else {
			exeTime = Number(defaultCommandsInterval);
		}
		return exeTime;
	}; 

	this.executeNoChain = function(cmd){
		//console.log(cmd);
		var pass = true;
		switch(cmd.title){
			case 'setX':
				//console.log("setX: " + cmd.x);
				characterService.setX(cmd.x);
				break;
			case 'setY':
				//console.log("setY: " + cmd.y);
				characterService.setY(cmd.y);
				break;
			case 'show':
				//console.log("show");
				characterService.show();
				break;
			case 'hide':
				//console.log("hide");
				characterService.hide();
				break;
			case 'move':
				//console.log("move:" + cmd.count);
				characterService.move(speed,stepSize,cmd.count,0,true);
				break;
			case 'changeBackground': // background 1
				that.changeBackground(cmd.costume);
				break;
			case 'changeCostume': // costume 3
				that.changeCostume(cmd.costume);
				break;
		}
		return pass;
	};


	this.isContainer = function(cmd){
		console.log(cmd);
		if(cmd.title == "repeat" || cmd.title == "ifelse")
			return true;
		return false;
	}

	this.isRepeat = function(cmd){
		return (cmd.title == "repeat");
	};

	this.changeCostume = function($elem, $costumeId) {
		//console.log('changeCostume was called from service.commandProcessor');
		//console.log($elem);
		//console.log($costumeId);
		characterService.changeCostume($elem, $costumeId);
	};
	this.changeBackground = function($backgroundId) {
		//console.log('changeBackground was called from service.commandProcessor');
		//console.log($backgroundId);
		backgroundService.changeImage($backgroundId);
	};

	this.deepClone = function(command){
		return $.extend(true, [], command);
	}

}])
.service('pageService', function() {
	/// this service provides the page meta data
	//console.log('pageService initialized from app-services.js');
	this.title = 'Default Page Title';
	this.author = 'CS3213 Team 11';
	this.description = 'A Single-Page-Application (SPA) for Assignment 2';
});