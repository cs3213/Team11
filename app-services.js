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
.service('characterService', function($timeout) {
	/// this service provides the character
	console.log('characterService initialized from app-services.js');
	var nextTickTime = 0;
	var timePerTick = 1000;
	var xMoved = 0;
	var yMoved = 0;
	var currentX = 0;
	var currentY = 0;

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

		var unitX = (x/speed)  * timePerTick/1000;
		var unitY = (y/speed)  * timePerTick/1000;
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

		

		console.log("left: " + this.config.left);
		console.log("top: " + this.config.top);
		//if haven't reached destination
		if(xMoved != x || yMoved != y){
			console.log("recursing");
			$timeout(this.move(speed,x,y, false),timePerTick);
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
	
	var commandsInterval = 50;
	/*
	this.execute = function($elem, $attr, $command) {
		$commandSplit = split(trim($command), " ");
		$commandLength = $commandSplit.length;
		if($commandLength < 1 || $commandLength > 3) {
			return false;
		}
		switch($commandSplit[0]) {
			case 'background': // background 1
			this.changeBackground($commandSplit[1]);
			break;
			case 'costume': // costume 3
			this.changeCostume($commandSplit[1]);
			return true;
			break;
			case 'endrepeat':
				// TODO
				return true;
				break;
			case 'hide': // hide
			this.hide($elem);
			return true;
			break;
			case 'move': // move up 3, move left 8
			switch($commandSplit[1]) {
				case 'down':
				this.move($elem, 0, -$commandSplit[2]);
				break;
				case 'left':
				this.move($elem, -$commandSplit[2], 0);
				break;
				case 'right':
				this.move($elem, $commandSplit[2], 0);
				break;
				case 'up':
				this.move($elem, 0, $commandSplit[2]);
				break;
			}
			return true;
			break;
			case 'repeat':
				// TODO
				return true;
				break;
			case 'set': // set x 312, set y 794
			if($commandSplit[1] == 'x') {
				this.setX($commandSplit[2]);
			} else if($commandSplit[1] == 'y') {
				this.setY($commandSplit[2]);
			}
			break;
			case 'show': // show
			this.show();
			return true;
			break;
		}
		
	};
	*/

	this.parseCommands = function(commands){
		var currentExecutionIndex = 0;

		for(currentExecutionIndex = 0; currentExecutionIndex < commands.length; currentExecutionIndex++){
			cmd = commands[currentExecutionIndex];
			this.execute(cmd);
			/*
			if(!isRepeat(cmd)){
				execute(commands[currentExecutionIndex]);
				currentExecutionIndex++;
			}
			//if repeat block start
			else if(isRepeat(cmd)){
				lastRepeatBlockIndex = currentExecutionIndex;
				parseRepeat(cmd.commands, cmd.count);
			}
			*/
		}
	};

	this.parseRepeat = function(commands, numberOfLoops){
		loopExecutionIndex = 0;
		if(numberOfLoops < 0)
			return;
		while(true){
			for(loopExecutionIndex = 0; loopExecutionIndex < commands.length; loopExecutionIndex++){

				cmd = commands[loopExecutionIndex];
				this.execute(cmd);
				/*
				if(!isRepeat(cmd)){
					execute(commands[loopExecutionIndex].commands);
					loopExecutionIndex++;
				}
				//if repeat block start
				else if(isRepeat(cmd)){
					lastRepeatBlockIndex = loopExecutionIndex;
					parseRepeat(cmd.commands, cmd.count);
				}
				*/
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

/*
this.setX = function($elem, $xCoord) {
	console.log('setX was called from service.commandProcessor');
		// set the x coordinate of $elem to $xCoord
		
	};
	this.setY = function($elem, $yCoord) {
		console.log('setY was called from service.commandProcessor');
		// set the y coordinate of $elem to $yCoord
		
	};
	this.show = function($elem) {
		console.log('show was called from service.commandProcessor');
		// make the $elem visible
	};
	this.hide = function($elem) {
		console.log('hide was called from service.commandProcessor');
		// make the $elem invisible
	};
	this.move = function($elem, $xSteps, $ySteps) {
		console.log('move was called from service.commandProcessor');
		// smooth scroll the $elem by $xSteps steps on the x-axis
		// and $ySteps steps on the y-axis
		
	};
	*/
	this.changeCostume = function($elem, $costumeId) {
		console.log('changeCostume was called from service.commandProcessor');
		characterService.changeCostume($elem, $costumeId);
	};
	this.changeBackground = function($backgroundId) {
		console.log('changeBackground was called from service.commandProcessor');
		backgroundService.changeImage($backgroundId);
	};
	/*
	this.repeat = function($elem, $nTimes) {
		console.log('repeat was called from service.commandProcessor');
		// get the children of the elems and repeat it $nTimes times
		
	};
	*/
}])
.service('pageService', function() {
	/// this service provides the page meta data
	console.log('pageService initialized from app-services.js');
	this.title = 'Default Page Title';
	this.author = 'CS3213 Team 11';
	this.description = 'A Single-Page-Application (SPA) for Assignment 2';
});