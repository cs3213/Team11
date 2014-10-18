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
	var timePerTick = 500;
	var xMoved = 0;
	var yMoved = 0;
	var currentX = 0;
	var currentY = 0;
	var delay = 1000;

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
	};

	this.setX = function(xCoord){
		console.log("characterService.setX() called: " + xCoord);
		this.config.left = xCoord;
		currentX = xCoord;
	};

	this.setY = function(yCoord){
		console.log("characterService.setY() called:" + yCoord);
		this.config.top = yCoord;
		currentY = yCoord;
	};

	this.hide = function(){
		this.config.visibility = "hidden";	
	};

	this.show = function(){
		this.config.visibility = "visible";
	};
	//speed : pixels per second?
	this.move = function(speed, x, y, newMovement){
		console.log("characterService.move function called");
		console.log("speed(pixels/s): " + speed);
		console.log("X to move: " + x);
		if(newMovement){
			xMoved = 0;
			yMoved = 0;
		}
		//var startTime = (new Date()).getTime();
		//var currentTime = startTime;
		//convert to milisecs to standardize

		var unitX = (x/speed)  * Number(timePerTick/1000.00);
		var unitY = (y/speed)  * Number(timePerTick/1000.00);
		console.log("unitX movement: " + unitX);
		console.log("unitY movement: " + unitY);

		
		/*
		while(xMoved != x || yMoved != y){

			if(this.tick()){
				xMoved += unitX;
				yMoved += unitY;
				this.config.left = currentX + unitX;
				this.config.top = currentY + unitY;
				console.log("top: " + this.config.top);
				console.log("left: " + this.config.left);
				currentX += unitX;
				currentY += unitY;
			}

		}
		*/

		
		xMoved = Number(xMoved) + Number(unitX);
		yMoved = Number(yMoved) + Number(unitY);

		currentX = Number(currentX) + Number(unitX);
		currentY = Number(currentY) + Number(unitY);

		this.config.left = currentX;
		this.config.top = currentY;
		//$rootScope.$apply();
		//$rootScope.$digest();

		console.log("left: " + this.config.left);
		console.log("top: " + this.config.top);
		//if haven't reached destination
		if(xMoved != x || yMoved != y){
			console.log("recursing");
			var nextExe = Number(timePerTick+delay);
			console.log("timegap: " + nextExe);
			$timeout(this.move(speed,x,y, false),nextExe);
		}
		
	};


	this.tick = function(){
		var currentTime = (new Date()).getTime();
		if(currentTime < nextTickTime){
			return false;
		}
		else{
			nextTickTime = currentTime + timePerTick;
			return true;
		}
	};

})
.service('commandProcessor', ['backgroundService', 'characterService', function(backgroundService, characterService) {
	/// this service contains the functions for the actions to call
	console.log('commandProcessor initialized from app-services.js');
	
	var commandsInterval = 200;


	this.parseCommands = function(commands){
		var currentExecutionIndex = 0;

		for(currentExecutionIndex = 0; currentExecutionIndex < commands.length; currentExecutionIndex++){
			cmd = commands[currentExecutionIndex];
			this.execute(cmd);
		}
	};

	this.mainLoop = function(commands){
		var currentExecutionIndex = 0;
		
		/*
		while(currentExecutionIndex < commands.length){

			cmd = commands[currentExecutionIndex];
			this.execute(cmd);
			++currentExecutionIndex;

		}
		*/


	}


	this.parseRepeat = function(commands, numberOfLoops){
		loopExecutionIndex = 0;
		if(numberOfLoops < 0)
			return;
		while(true){
			for(loopExecutionIndex = 0; loopExecutionIndex < commands.length; loopExecutionIndex++){

				cmd = commands[loopExecutionIndex];
				this.execute(cmd);

			}
		numberOfLoops--;
		//terminate repeat loop if no more repeats
		if(numberOfLoops < 0)
			break;
		}
	};
	
this.execute = function(cmd){
	//var pixelsPerStep = 5;
	switch(cmd.title){
		case 'setX':
			console.log("setX: " + cmd.x);
			characterService.setX(cmd.x);
			break;
		case 'setY':
			console.log("setY: " + cmd.y);
			characterService.setY(cmd.y);
			break;
		case 'show':
			console.log("show");
			characterService.show();
			break;
		case 'hide':
			console.log("hide");
			characterService.hide();
			break;
		case 'move':
			console.log("move:" + cmd.count);
			characterService.move(20,cmd.count,0,true);
			break;
		case 'changeBackground': // background 1
			this.changeBackground(cmd.costume);
			break;
		case 'changeCostume': // costume 3
			this.changeCostume(cmd.costume);
			return true;
			break;
		case 'repeat':
			parseRepeat(cmd.commands, cmd.count);
			break;
		
	}
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