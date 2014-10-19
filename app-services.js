VisualIDE
.service('actionService', ['commandProcessor', function(commandProcessor) {
	/// this service parses the action and calls the commandProcessor
	console.log('actionService initialized from app-services.js');
	this.process = function(elem, attr, command) {
		commandProcessor.execute(elem, attr, command);
	};
}])
.service('backgroundService', function() {
	/// this service provides the background image
	console.log('backgroundService initialized from app-services.js');
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
		'console' 	: false,					// if TRUE, console is visible
		'source' 	: this.backgrounds[1],	// default background source
	};
	this.changeImage = function($backgroundId) {
		console.log('backgroundService.changeImage() called');
		this.config.source = this.backgrounds[$backgroundId];
	};
	this.changeScale = function($scale) {
		console.log('backgroundService.changeScale() called');
		this.config.scale = $scale;
	};
})
.service('characterService', function($timeout, $rootScope) {
	/// this service provides the character
	console.log('characterService initialized from app-services.js');
	var nextTickTime = 0;
	var timePerTick = 50;
	var xMoved = 0;
	var yMoved = 0;
	var currentX = 0;
	var currentY = 0;
	var delay = 0;

	this.costumes = [
	'pikachu',
	];
	this.config = {
		'id'		: 0,
		'name'		: 'default',
		'scale'		: 50,
		'source'	: this.costumes[0],
	};
	this.changeCostume = function($elem,$costumeId) {
		console.log('characterService.changeCostume() called');
		// change the templateUrl of the elem to the dataCostume[costumeId]
		this.config.source = this.costumes[$costumeId];
	};
	this.create = function($id,$name,$scale,$costumeId) {
		console.log('characterService.create() called');
		return {
			'id' 		: $id,
			'name'		: $name,
			'scale'		: $scale,
			'source'	: this.costumes[$costumeId],
		};
	};

	this.reposition = function ($xCoord, $yCoord){
		console.log("characterService.repositon() called");
		this.config.left = xCoord;
		this.config.top = yCoord;
		currentX = xCoord;
		currentY = yCoord;
		return true;
	};

	this.setX = function(xCoord){
		console.log("characterService.setX() called: " + xCoord);
		this.config.left = xCoord;
		currentX = xCoord;
		return true;
	};

	this.setY = function(yCoord){
		console.log("characterService.setY() called:" + yCoord);
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
		//console.log("characterService.move function called");
		//console.log("speed(pixels/s): " + speed);
		//console.log("X to move: " + x);
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
		//console.log("unitX movement: " + unitX);
		//console.log("unitY movement: " + unitY);

		
		xMoved = Number(xMoved) + Number(unitX);
		yMoved = Number(yMoved) + Number(unitY);

		currentX = Number(currentX) + Number(unitX);
		currentY = Number(currentY) + Number(unitY);

		this.config.left = currentX;
		this.config.top = currentY;
		//$rootScope.$apply();

		
		/*
		while(xMoved != x || yMoved != y){

			if(this.tick()){
				xMoved = Number(xMoved) + Number(unitX);
				yMoved = Number(yMoved) + Number(unitY);

				currentX = Number(currentX) + Number(unitX);
				currentY = Number(currentY) + Number(unitY);

				this.config.left = currentX;
				this.config.top = currentY;
			}

		}
		*/

		//console.log("left: " + this.config.left);
		//console.log("top: " + this.config.top);

		//if haven't reached destination
		
		if(xMoved != x || yMoved != y){
			
			var nextExe = Number(timePerTick+delay);
			//console.log("timegap: " + nextExe);
			var that = this;
			$timeout(
				
				function(){
					//console.log("recursing");
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
	console.log('commandProcessor initialized from app-services.js');
	
	var times = [];
	var commandQueue = [];
	var commandsInterval = 1000;
	var defaultCommandsInterval = 1000;
	var blockMainProcess = false;
	var timeToRun = 0;
	var cumulativeRepeatDelay = 0;
	

	this.play = function(commands){
		console.log("making schedule");
		var d = this.makeSchedule(commands,0);
		console.log("running schedule");
		this.runSchedule();
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
		console.log("executing index " + indexToRun + "...");
		cmdToRun = commands[indexToRun];
		this.execute(cmdToRun);
		++indexToRun;
		//commands.push(cmdToRun);
		var that = this;
		console.log("commandInterval: " + commandsInterval);


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
		console.log("maaaakkiiiing");
		timeToRun = startTime;
		for(var i = 0; i < commands.length; i++){

			command = commands[i];
			console.log(command);
			console.log("initial time: " + timeToRun);
			//if move commands
			if(command.title == "move"){
				timeToRun += Math.abs(Number(1000*cmd.count/50)) + Number(defaultCommandsInterval);
				console.log(timeToRun);
				commandQueue.push(command);
				times.push(timeToRun);
				//console.log(commandQueue[commandQueue.length-1]);
			}
			//if not repeat commands
			else if(command.title != "repeat"){
				timeToRun += Number(defaultCommandsInterval);
				console.log(timeToRun);
				commandQueue.push(command);
				times.push(timeToRun);
				//console.log(commandQueue[commandQueue.length-1]);
			}
			//if repeat command
			else if(command.title == "repeat"){
				console.log(command.title)
				var timePerLoop = this.evaluateTimeNeededByRepeatBlock(command.commands, 1);
				var repeatedCommands = command.commands;
				var numLoops = command.count;
				console.log("numLoops: " + numLoops);
				for(var i = 0; i < numLoops; i++){
					//for the repeated commands
					var temp = this.makeSchedule(repeatedCommands,timeToRun);
					console.log("uno");
					/*
					for(var j = 0; j < repeatedCommands.length; j++){
							
					}
					*/
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
		console.log(commandQueue[i]);
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

this.dequeueFromSchedule = function(){
	if(commandQueue.length <= 0){
		timeToRun = 0;
		return;
	}
	var cmdToRun = commandQueue.shift();
	var time = times.shift();
	console.log(time);
	this.executeNoChain(cmdToRun);
	var that = this;
	$timeout(
			function(){
				that.dequeueFromSchedule();
			},
			time
		);
}
	


this.executeNoChain = function(cmd){
	console.log(cmd);
	var pass = true;
	switch(cmd.title){
		case 'setX':
			console.log("setX: " + cmd.x);
			pass = characterService.setX(cmd.x);
			break;
		case 'setY':
			console.log("setY: " + cmd.y);
			pass = characterService.setY(cmd.y);
			break;
		case 'show':
			console.log("show");
			pass = characterService.show();
			break;
		case 'hide':
			console.log("hide");
			pass = characterService.hide();
			break;
		case 'move':
			console.log("move:" + cmd.count);
			pass = characterService.move(50,cmd.count,0,true);
			break;
		case 'changeBackground': // background 1
			pass = this.changeBackground(cmd.costume);
			break;
		case 'changeCostume': // costume 3
			pass = this.changeCostume(cmd.costume);
			break;
		case 'repeat':
			pass = this.parseRepeat(cmd.commands, cmd.count);
			break;
	}
	return pass;
};



this.execute = function(cmd){
	var pass = true;
	commandsInterval = defaultCommandsInterval + cumulativeRepeatDelay;
	switch(cmd.title){
		case 'setX':
			console.log("setX: " + cmd.x);
			pass = characterService.setX(cmd.x);
			break;
		case 'setY':
			console.log("setY: " + cmd.y);
			pass = characterService.setY(cmd.y);
			break;
		case 'show':
			console.log("show");
			pass = characterService.show();
			break;
		case 'hide':
			console.log("hide");
			pass = characterService.hide();
			break;
		case 'move':
			console.log("move:" + cmd.count);
			pass = characterService.move(50,cmd.count,0,true);
			commandsInterval = Math.abs(Number(1000*cmd.count/50)) + Number(defaultCommandsInterval) + cumulativeRepeatDelay;
			break;
		case 'changeBackground': // background 1
			pass = this.changeBackground(cmd.costume);
			break;
		case 'changeCostume': // costume 3
			pass = this.changeCostume(cmd.costume);
			return true;
			break;
		case 'repeat':
			pass = this.parseRepeat(cmd.commands, cmd.count);
			cumulativeRepeatDelay += this.evaluateTimeNeededByRepeatBlock(cmd.commands, 1) * cmd.count;
			commandsInterval = cumulativeRepeatDelay;
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
		
		else if(cmd.title == "move"){
			timeNeeded += Math.abs(Number(1000*cmd.count/50)) + Number(defaultCommandsInterval);
		}
		else{
			timeNeeded += Number(defaultCommandsInterval);
		}
		
		
	}
	
	return timeNeeded * numberOfLoops;
};

this.getRepeatTimes = function(cmd){
	if(isRepeat(cmd))
		return cmd.count;
	return 0;
};

this.isRepeat = function(cmd){
	return (cmd.title == "repeat");
};

this.changeCostume = function($elem, $costumeId) {
	console.log('changeCostume was called from service.commandProcessor');
	characterService.changeCostume($elem, $costumeId);
};
this.changeBackground = function($backgroundId) {
	console.log('changeBackground was called from service.commandProcessor');
	backgroundService.changeImage($backgroundId);
};

}])
.service('pageService', function() {
	/// this service provides the page meta data
	console.log('pageService initialized from app-services.js');
	this.title = 'Default Page Title';
	this.author = 'CS3213 Team 11';
	this.description = 'A Single-Page-Application (SPA) for Assignment 2';
});