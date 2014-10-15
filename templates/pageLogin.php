<?php session_start() ?>
<div class="navbar navbar-app navbar-absolute-bottom"
	style="background-color:transparent;color:#e8e8e8;border-radius:0px;">
	<?php if(isset($_SESSION['opauth'])) { ?>
	<div class="col-sm-3">
		<img src="<?php echo $_SESSION['opauth']['auth']['info']['image'] ?>" style="border-radius:100%;max-width:64px;">
	</div>
	<div class="col-sm-9">
		Logged in as:<br />
		<b><?php echo $_SESSION['opauth']['auth']['info']['name'] ?></b><br />
		<i><?php echo $_SESSION['opauth']['auth']['info']['email'] ?></i>
	</div>
	<div class="col-sm-12">
		<a href="/logout" class="btn btn-link btn-sm input-lg form-control"><b>Log out</b></a>
	</div>
	<?php } else { ?>
	<a class="btn btn-link btn-lg input-lg form-control"
		style="border-radius:0px;margin-bottom:15px;"
		ng-click="login()">
		<img src="/assets/images/buttons/signin_google.png" style="display:inline !important;max-width:100%;vertical-align:top;">
	</a>
	<?php } ?>
</div>