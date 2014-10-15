VisualIDE
.controller('actionController', ['$rootScope','$scope', 'commandProcessor', function($rootScope,$scope, commandProcessor) {
	console.log('actionController initialized from app-controllers.js');
	$scope.actions = [
		'set x 24',
		'set y 50',
		'show',
		'hide',
		'move up 3',
		'costume 2',
		'background 1',
		'repeat 3',
		'move down 2',
		'move left 2',
		'move right 2',
		'move up 2',
		'endrepeat'
	];
	$scope.play = function() {
		//alert("todo!");
		commandProcessor.parseCommands($rootScope.commandData);
	};
	$scope.save = function() {
		alert("todo!");
	};
	$scope.commandsInclude = "commands.htm";
}])
.controller('authController', ['$scope', function($scope) {
	console.log('pageController initialized from app-controllers.js');
	$scope.login = function() {
		alert("todo!");
	};
}])
.controller('backgroundController', ['$scope', function($scope) {
	console.log('backgroundController initialized from app-controllers.js');
	
}])
.controller('characterController', ['$scope', function($scope) {
	console.log('characterController initialized from app-controllers.js');
	$scope.click = function() {
		alert("Pikaaaaaaa!!!");
	};
}])
.controller('menuSidebarLeft', ['$scope', function($scope) {
	console.log('menuSidebarLeft initialized from app-controllers.js');
	
}])
.controller('menuSidebarRight', ['$scope', function($scope) {
	console.log('menuSidebarRight initialized from app-controllers.js');
	
}])
.controller('pageController', ['$scope', function($scope) {
	console.log('pageController initialized from app-controllers.js');
	
}])
.controller('pageMetaData', ['$scope','pageService', function($scope, pageService) {
	console.log('pageMetaData initialized from app-controllers.js');
	$scope.page = pageService;
}]);


VisualIDE.controller('commandControl', function($scope, $element, $rootScope) {
	console.log("controller element", $element);

	$scope.initInputElements = function(){
		$($element).find("input, select").change(function(){
			$scope.updateCommandData($scope);
		});
	}
	$scope.initInputElements();

	$scope.commandData = [];

	$scope.commandDraggableParams = {
        helper: "clone",
			revert: "invalid",
			connectToSortable: "#workspace, .command-inner-sortable",
	};

	$scope.workspaceSortableParams = {
		connectWith: "#workspace, .command-inner-sortable, #trash",
	    deactivate: function(event, ui){
	    	$scope = angular.element(event.target).scope();
	    	console.log($scope);
	        // We run this to apply the sortable to all the newly created sortables (created when you drag out the repeat)
	        $scope.initInnerSortables();
	        $scope.updateCommandData($scope);
	    }
	};

	$scope.trashSortableParams = {
		connectWith: "#workspace, .command-inner-sortable, #trash",
	    deactivate: function(event, ui){
	    	$(event.target).html("Trash here");
	    }
	};

	$scope.initInnerSortables = function(){
		$( ".command-inner-sortable" ).sortable({
    		connectWith: "#workspace, .command-inner-sortable, #trash",
		    deactivate: function(event, ui){
		    	$scope = angular.element(event.target).scope();
		        // We run this to apply the sortable to all the newly created sortables (created when you drag out the repeat)
		        $scope.initInnerSortables();
		        $scope.updateCommandData($scope);
		    }
		});

		$scope.initInputElements();
	}

	$scope.updateCommandData = function($scope){
		var workspaceItems = $( "#workspace" ).children();

		var workspaceElement = $( "#workspace" );
		/*$scope.commandData = [];
		for (var i=0; i < workspaceItems.length; i++){
			$scope.$apply(function () {
				$scope.commandData[i] = $(workspaceItems[i]).html();
			});
		}*/
		$scope.$apply(function () {
			$scope.commandData = $scope.processCommandElements(workspaceElement);
			$rootScope.commandData = $scope.commandData;
		});

	}
	
	$scope.processCommandElements = function(element){

		var items = element.children();

		var commandData = [];
		for (var i=0; i < items.length; i++){
			var item = $(items[i]);
			if (item.hasClass("sub-commands-allowed")) {
				commandData[i] = {
					//title: item.text(),
					title: item.data("command"),
					commands: $scope.processCommandElements(item.children(".command-inner-sortable"))
				}
				var inputs = item.children();
				for (var j=0; j<inputs.length; j++){
					if ( $(inputs[j]).prop("tagName") == "INPUT" || $(inputs[j]).prop("tagName") == "SELECT" ) {
						var name = $(inputs[j]).attr("name");
						var value = $(inputs[j]).val();
						commandData[i][name] = value;
					}
				}
			}else{
				commandData[i] = {
					//title: item.text()
					title: item.data("command"),
				}
				var inputs = item.find("input, select");
				for (var j=0; j<inputs.length; j++){
					var name = $(inputs[j]).attr("name");
					var value = $(inputs[j]).val();
					commandData[i][name] = value;
				}
			}
			
		}
		return commandData;
	}

	$scope.populateCommandElements = function(commandData, rootElement){
		console.log(commandData, rootElement);

		for (var i=0; i<commandData.length; i++){
			var c = commandData[i];
			console.log("c", c);
			var toolboxItem = $("#toolbox").find("li[data-command|='"+c.title+"']");
			var item = $(toolboxItem).clone();
			var inputs = item.children();
			for (var j=0; j<inputs.length; j++){
				var inputElement = inputs[j];
				if ( $(inputElement).prop("tagName") == "INPUT" || $(inputElement).prop("tagName") == "SELECT" ) {
					var attributeName = $(inputElement).attr("name");
					$(inputElement).val(commandData[i][attributeName]);
				}
			}
			if (item.hasClass("sub-commands-allowed")) {
				item.find(".command-inner-sortable").html("");
				$scope.populateCommandElements(commandData[i].commands, item.find(".command-inner-sortable"))
			}
			$(rootElement).append(item);
		}
	}

	$scope.refresh = function(){
		//console.log($("#inputTextArea").val());
		console.log($scope.commandData);

		$("#workspace").html("");
		$scope.populateCommandElements($scope.commandData, $("#workspace"));

		$scope.initInnerSortables();
		$scope.initInputElements();

		// Hack to prevent two $apply from running simultaneously
		setTimeout(function(){
			$scope.updateCommandData($scope)
		}, 1);
	}

	$scope.$watch(function() {		
		if ($rootScope.commandData && ($scope.commandData !== $rootScope.commandData)){
			console.log($rootScope);
			$scope.commandData = $rootScope.commandData;
			$scope.refresh();
		}
	});

});