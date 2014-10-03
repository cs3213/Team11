<div style="
	background-attachment:fixed;
	background-image:url('/assets/images/backgrounds/{{ current.source }}.png');
	background-position:center;
	background-repeat:repeat;
	background-size:{{ current.scale }}%;
	bottom:0;
	heigth:100%;
	left:0;
	position:absolute;
	top:0;
	width:100%;
	z-index:0;
">
	<div class="container-fluid" ng-show="current.console">
		<div class="col-sm-4">
			<div class="panel panel-default">
				<div class="panel-heading text-center">
					<h1 class="panel-title" style="padding-top:8px;">
						Background Controller
					</h1>
				</div>
				<div class="panel-body">
					<span class="form-group">
						<label class="control-label col-sm-4" for="scale">Scale:</label>
						<span class="col-sm-8">
							<input id="scale" ng-model="current.scale" type="number" class="form-control">
						</span>
					</span>
					<span class="form-group">
						<label class="control-label col-sm-4" for="source">Source:</label>
						<span class="col-sm-8">
							<select id="source" ng-model="current.source" class="form-control">
								<option ng-repeat="bg in availableBackgrounds" val="{{bg}}">{{ bg }}</option ng-repeat="bg">
							</select>
						</span>
					</span>
				</div>
			</div>
		</div>
	</div>

</div>
