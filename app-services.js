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
	this.move = function(speed, x, y, newMovement){
		////console.log("characterService.move function called");
		////console.log("speed(pixels/s): " + speed);
		////console.log("X to move: " + x);
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
		
		if(xMoved != x || yMoved != y){
			
			var nextExe = Number(timePerTick+delay);
			////console.log("timegap: " + nextExe);
			var that = this;
			$timeout(
				
				function(){
					////console.log("recursing");
					that.move(speed,x,y, false);
				}
				
				,nextExe);
			}
		else if(xMoved == x && yMoved == y){
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
	

	var cmdBlockStack = new Array();
	var cmdBlockIndexStack = new Array();

	this.play = function(commands){
		//console.log("making schedule");
		//commandQueue = [];
		//times = [];
		//var d = this.makeSchedule(commands,0);
		//console.log("running schedule");
		//this.runSchedule();

		cmdBlockStack.push(commands);
		executeNew(0, commands, commands[0]);

	};





	this.parseCommands = function(commands){
		var currentExecutionIndex = 0;

		var that = this;
		var iterations = commands.length;

		$timeout(
			function(){
				that.executeNext(commands,0);
			},
			commandsInterval
			);

	};

	this.executeNext = function(commands, indexToRun){
		if(commands.length <= 0 || indexToRun < 0 || indexToRun >= commands.length)
			return;
		//console.log("executing index " + indexToRun + "...");
		cmdToRun = commands[indexToRun];
		this.execute(cmdToRun);
		++indexToRun;
		//commands.push(cmdToRun);
		var that = this;
		//console.log("commandInterval: " + commandsInterval);


		$timeout(
			function(){
				that.executeNext(commands,indexToRun);
			},
			commandsInterval
			);

	};


	this.parseRepeat = function(commands, numberOfLoops){
		var loopExecutionIndex = 0;

		if(numberOfLoops < 0)
			return;

		cmd = commands[loopExecutionIndex];
		this.execute(cmd);

		var that = this;
		//"schedule" next command in loop
		$timeout(
		function(){
			that.executeNext(commands,loopExecutionIndex);
		},
		commandsInterval
		);
		
		numberOfLoops--;
		if(numberOfLoops < 0)
			return;
		//"schedule" next loop
		$timeout(
		function(){
			that.parseRepeat(commands,numberOfLoops);
		},
		this.evaluateTimeNeededByRepeatBlock(commands,1)
		);

		//this.execute(commands,numberOfLoops);

	};

	this.makeSchedule = function(commands, startTime){
		//console.log("maaaakkiiiing");
		timeToRun = startTime;
		var relativeTime = 0;
		for(var i = 0; i < commands.length; i++){

			command = commands[i];
			//console.log(command);
			//console.log("Time to execute command: " + timeToRun);
			//if move commands
			if(command.title == "move"){
				////console.log(timeToRun);
				commandQueue.push(command);
				relativeTime = Math.abs(Number(1000 * 1.2 * command.count/speed)) + Number(defaultCommandsInterval);
				times.push(relativeTime);
				//times.push(timeToRun);
				timeToRun += Math.abs(Number(1000 * 1.2 * command.count/speed)) + Number(defaultCommandsInterval)*0.3;
				////console.log(commandQueue[commandQueue.length-1]);
			}
			//if not repeat commands
			else if(command.title != "repeat"){
				////console.log(timeToRun);
				commandQueue.push(command);
				relativeTime = Number(defaultCommandsInterval);
				times.push(relativeTime);
				//times.push(timeToRun);
				timeToRun += Number(defaultCommandsInterval);
				////console.log(commandQueue[commandQueue.length-1]);
			}
			//if repeat command
			else if(command.title == "repeat"){
				//console.log(command.title)
				//var timePerLoop = this.evaluateTimeNeededByRepeatBlock(command.commands, 1);
				var repeatedCommands = command.commands;
				var numLoops = command.count;
				//console.log("numLoops: " + numLoops);
				//console.log("loop: " + repeatedCommands);

				/*
				for(var b = 0; b < repeatedCommands.length;b++)
					//console.log(repeatedCommands[b]);
				*/
				
				for(var a = 0; a < numLoops; a++){
					//for the repeated commands
					this.makeSchedule(repeatedCommands,timeToRun);
				}
				
			}
		}
		return true;
	}; 

this.runSchedule = function(){
	var that = this;
	/*
	var t = times;
	var cq = commandQueue;
	for(var i = 0; i < commandQueue.length; i++){
		//console.log(commandQueue[i]);
		$timeout(
			function(){
				that.executeNoChain(commandQueue[i]);
			},
			times[i]
			);
	}
	timeToRun = 0;
	*/
	this.dequeueFromSchedule();

};

this.executeNew = function(currentIndex, currentBlock, cmd){

	if(isContainer(cmd)){

		//check if there's statements after the container statement
		//if there is, add the block and the index of the statement after to the stack
		if(currentIndex + 1 <  currentBlock.length){
			//push in the current block
			cmdBlockStack.push(currentBlock);
			cmdBlockIndexStack.push(currentIndex + 1);
			executeContainer(cmd, currentIndex, currentBlock);
		}
	}
	//if norma statement, e.g move, change bg etc
	else{
		that = this;
		timeNeededToExecute = calculateStatementExecutionTime(cmd);
		executeNoChain(cmd);
		currentBlock++;
		//check if there's a next stmt in the current block
		if(currentBlock >= cmdBlockStack.length){
			//pop out current block
			cmdBlockStack.pop();

			//check how many cmd blocks left
			//if nothing left, return
			if(cmdBlockStack.length <= 0){
				return;
			}
			else{
				//if still have, pop out and continue
				currentBlock = cmdBlockStack.pop();
				currentIndex = cmdBlockIndexStack.pop();
				executeNew(currentIndex,currentBlock, currentBlock[currentIndex]);
			}

		}

		$timeout(
			function(){
				that.executeNew(currentIndex,currentBlock,currentBlock[currentIndex]);
			},
			timeNeededToExecute
		);


	}

}

this.executeContainer = function(cmd, currentIndex, currentBlock){

	if(cmd.title == "repeat"){
		executeRepeat(cmd);
	}
	else if(cmd.title == "if"){
		executeIf(cmd);
	}


}

this.executeRepeat = function(cmd){
	if(cmd.count <= 0)
		return

	else if(cmd.count == "inf"){
		console.log("need to implement infinite looping");
		return;
	}
	else{
		cmd.count--;
		//push in the repeat block (if it needs to be run again)
		if(cmd.count > 1){
			cmdBlockIndexStack.push(0);
			temp = new Array();
			temp.push(cmd);
			cmdBlockStack.push(temp);
		}
		//execute the block once
		executeNew(0,cmd.commands, cmd.commands[0]);
	}
}

this.executeIf = function(cmd){
	
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
		exeTime = Math.abs(Number(1000 * command.count/speed)) + Number(defaultCommandsInterval)*0.3;
	}
	//if not repeat commands and not move command
	else {
		exeTime = Number(defaultCommandsInterval);
	}
	return exeTime;
}; 



this.dequeueFromSchedule = function(){
	if(commandQueue.length <= 0){
		timeToRun = 0;
		return;
	}
	var cmdToRun = commandQueue.shift();
	var time = times.shift();
	//console.log(time);
	
	var that = this;
	$timeout(
			function(){
				that.executeNoChain(cmdToRun);
				that.dequeueFromSchedule();
			},
			time
		);
}
	


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
			characterService.move(speed,cmd.count,0,true);
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



//function to help evaluate the time needed for repeat blocks
//problems that need to be addressed : nested repeat blocks
this.evaluateTimeNeededByRepeatBlock = function(cmdBlock, numberOfLoops){
	var timeNeeded = 0;
	if(cmdBlock.length == 0){
		return 0;
	}
	
	//check the commands in the repeat block
	for(var i = 0; i < cmdBlock.length; i++){
		cmd = cmdBlock[i];
		//if it's a repeat
		if(this.isRepeat(cmd)){
			timeNeeded += Number(this.evaluateTimeNeeded(cmd.commands));
		}
		
		else if(cmd.title !== "if"){
			timeNeeded += calculateStatementExecutionTime(cmd)
		}
		
		
	}
	
	return timeNeeded * numberOfLoops;
};

this.getRepeatTimes = function(cmd){
	if(isRepeat(cmd))
		return cmd.count;
	return 0;
};

this.isContainer = function(cmd){
	if(cmd.title == "repeat" || cmd.title == "if")
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