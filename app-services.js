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

	var cmdBlockStack = new Array();
	var cmdBlockIndexStack = new Array();

	this.play = function(commands){
		//console.log("making schedule");
		//commandQueue = [];
		//times = [];
		//var d = this.makeSchedule(commands,0);
		//console.log("running schedule");
		//this.runSchedule();


		//console.log(commands[0]);
		if(!playing){
			cmdBlockStack.push(commands);
			console.log("cmdBlockStack: " + cmdBlockStack.length);
			this.executeNew(0, commands, commands[0]);
			playing = true;
		}

	};

this.reset = function(){
	while(cmdBlockIndexStack.length>0)
		cmdBlockIndexStack.pop();
	while(cmdBlockStack.length > 0)
		cmdBlockStack.pop();
	playing = false;
	console.log("reset-ed");
}

this.executeNew = function(currentIndex){
	console.log("currentIndex: " + currentIndex);

	if(currentIndex < 0 || cmdBlockStack.length <= 0){
		console.log("finished tasks");
		this.reset();
		return;
	}

	currentBlock = cmdBlockStack[cmdBlockStack.length-1];
	
	//if there's no next statement in the current block
	if(currentIndex >= currentBlock.length){
		console.log("safety barrier activated");
		console.log(cmdBlockStack);
		console.log(cmdBlockStack.length);
		//pop out the current block from the stack
		cmdBlockStack.pop();
		//check if there's another block in the blockStack
		if(cmdBlockStack.length > 0){
			//retrieve the resuming index
			console.log("expected error here since indexstack not checked");
			currentIndex = cmdBlockIndexStack.pop();
			currentBlock = cmdBlockStack[cmdBlockStack.length-1];
		}
		//means there's nothing left
		else{
			console.log("terminating");
			this.reset();
			return;
		}
	}
	

	//console.log("executing");

	//console.log("current block size: " + currentBlock.length);
	cmd =  currentBlock[currentIndex]

	//safety check
	if(typeof cmd ==='undefined' || !cmd || cmd === 'null'){
		console.log("cmd is undefined");
		console.log("cmdBlockStack: " + cmdBlockStack.length);
		//error correction
		//if due to out of index
		if(currentIndex >= currentBlock.length){
			console.log("index out of bound");
			//check command stack
			if(cmdBlockStack.length > 0 && cmdBlockIndexStack.length > 0){
				currentIndex = cmdBlockIndexStack.pop();
				cmdBlockStack.pop();
				console.log("cmdBlockStack: " + cmdBlockStack.length);
				currentBlock = cmdBlockStack[cmdBlockStack.length-1];
				cmd =  currentBlock[currentIndex]

				console.log("reassigned cmd: " + cmd);
			}
			else{
				console.log("terminating");
				this.reset();
				return;
			}
		}
		//else move to next index
		else if(currentIndex+1 < currentBlock.length){
			currentIndex++;
			cmd =  currentBlock[currentIndex]	
			console.log("reassigned cmd2: " + cmd);		
		}
		//jump to next command stack
		else{
			console.log("cmdBlockStack: " + cmdBlockStack.length);
			console.log("cmdBlockIndexStack: " + cmdBlockIndexStack.length);
			console.log("currentIndex: " + currentIndex);
			if(cmdBlockStack.length > 0 && cmdBlockIndexStack.length > 0){
				currentIndex = cmdBlockIndexStack.pop();
				cmdBlockStack.pop();

				currentBlock = cmdBlockStack[cmdBlockStack.length-1];
				cmd =  currentBlock[currentIndex]

				console.log("reassigned cmd: " + cmd);
			}
			else{
				console.log("terminating");
				this.reset();
				return;
			}
		}

	}



	if(this.isContainer(cmd)){
		//console.log("is Container");

		//check if there's statements after the container statement
		//if there is, add the block and the index of the statement after to the stack
		if(currentIndex + 1 <  currentBlock.length){

			//the current block stack should already be inside the stack, so no need to push again
			//just push the index to resume from
			cmdBlockIndexStack.push(1*currentIndex + 1);
			console.log("pushed resuming index: " + 1*currentIndex+1);
			this.executeContainer(cmd);
		}
		//otherwise (if it ends with the container statement)
		//execute
		else{
			this.executeContainer(cmd);
		}
	}
	//if normal statement, e.g move, change bg etc
	else{
		that = this;
		//calculate the execution time of this statement
		//execution time fo this statement = delay for next statement
		timeNeededToExecute = this.calculateStatementExecutionTime(cmd);
		//execute
		this.executeNoChain(cmd);
		//start planning for next statemment
		currentIndex++;
		//check if there's a next stmt in the current block
		//if there is a next statement in the current block, shcedule it
		if(currentIndex < currentBlock.length){

			$timeout(
			function(){
				that.executeNew(currentIndex);
			},
			timeNeededToExecute
			);
			console.log("scheduled next statement");

		}
		
		//else if there's no next statement in the current block
		else{
			console.log("shuupin! popping out used block. current block:");
			
			//pop out the current block from the stack
			cmdBlockStack.pop();
			console.log("cmdBlockStack: " + cmdBlockStack.length);
			console.log(cmdBlockStack[cmdBlockStack.length-1]);
			console.log(cmdBlockStack[cmdBlockStack.length-1][0]);
			//check if there's another block in the blockStack
			if(cmdBlockStack.length > 0 && cmdBlockIndexStack.length > 0){
				//retrieve the resuming index
				currentIndex = cmdBlockIndexStack.pop();
				//schedule the resuming statement.
				console.log("scheduling resuming statement");
				console.log(cmdBlockStack[cmdBlockStack.length-1]);
				console.log("index: " + currentIndex);
				$timeout(
				function(){
					that.executeNew(currentIndex);
				},
				timeNeededToExecute
				);
				//console.log("scheduled next block");
			}
			//means there's nothing left
			else{
				console.log("terminating");
				this.reset();
				return;
			}
		}
		

	}

};

this.executeContainer = function(cmd){
	console.log("executing container");
	if(cmd.title == "repeat"){
		this.executeRepeat(cmd);
	}
	else if(cmd.title == "ifelse"){
		this.executeIf(cmd);
	}


};

this.executeRepeat = function(cmd){
	if(cmd.count <= 0)
		return

	else if(cmd.count == "inf"){
		console.log("need to implement infinite looping");
		return;
	}
	else{
		console.log("executing repeat");
		console.log("iterations left: " + cmd.count);

		cmd.count--;
		//push in the repeat block (if it needs to be run again)
		if(cmd.count > 0){
			
			temp = new Array();
			temp.push(cmd);
			cmdBlockStack.push(temp);
			cmdBlockIndexStack.push(0);
			console.log("queued next repeat iteration");
		}

		//push in the block to run to change the context
		cmdBlockStack.push(cmd.commands);
		console.log("cmdBlockStack: " + cmdBlockStack.length);
		this.executeNew(0);
		console.log("executing iteration");


		
	}
};

this.executeIf = function(cmd){

	console.log(cmd);
	if(cmd.condition.eval()){
		console.log("executing if");
		cmdBlockStack.push(cmd.ifblock);
		this.executeNew(0);
	}
	else{
		console.log("executing else");
		cmdBlockStack.push(cmd.elseblock);
		this.executeNew(0);
	}
};

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
			this.changeBackground(cmd.costume);
			break;
		case 'changeCostume': // costume 3
			this.changeCostume(cmd.costume);
			break;
		case 'repeat':
			this.parseRepeat(cmd.commands, cmd.count);
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

}])
.service('pageService', function() {
	/// this service provides the page meta data
	//console.log('pageService initialized from app-services.js');
	this.title = 'Default Page Title';
	this.author = 'CS3213 Team 11';
	this.description = 'A Single-Page-Application (SPA) for Assignment 2';
});