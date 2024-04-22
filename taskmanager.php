<?php
require_once "taskmanager.class.php";

$TaskManager = new TaskManager();

$active_processes =	$TaskManager->get_active_processes();
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Task Manager</title>
		<link rel="shortcut icon" href="img/icon.png">
		<link href="/res/css/lib.css" rel="stylesheet">
		<link href="/res/css/buttons.css" rel="stylesheet">
		<link href="/res/css/dark.css" rel="stylesheet">
		<script type="module" src="/res/js/prototypes.js"></script>
		<script type="module" src="/res/js/html/prototypes.js"></script>
		<script type="module" src="/res/js/main.js"></script>
	</head>
	<body>
		<form action="" method="post">
			<div id="legenda">
				<span class="is_vital">Vital</span>
				<span class="is_daemon">Daemons</span>
				<span class="is_system">System</span>
				<span class="is_ordinary">Others</span>
				<p>Processes found: <?php echo sizeof($active_processes);?></p>
				<span>Refreshing in: <i id="refresh_display">120s</i></span>
			</div>
			<div class="input-group" id="search_process_container">
				<input type="text" name="search_process" id="search_process" placeholder="Find process" />
				<label for="search_process">Find process</label>
			</div>
			<table>
				<thead>
					<tr>
						<?php
						foreach($TaskManager->processes_headers as $header) {
							echo "<td>" . strtoupper($header) . "</td>";
						}
						?>
					</tr>
				</thead>
				<tbody>
					<?php
					foreach($active_processes as $process) {
						$process_classes = [];
						$pid = $process["pid"];
						$kill_input_name = "kpid-$pid";
						$restart_input_name = "rpid-$pid";
						$row_color = "";

						if(TaskManager::process_is_vital($process)) {
							$process_classes[] = "is_vital";
						}elseif(TaskManager::process_is_daemon($process)) {
							$process_classes[] = "is_daemon";
						} elseif(TaskManager::process_is_system($process)) {
							$process_classes[] = "is_system";
						} else {
							$process_classes[] = "is_ordinary";
						}

						if(TaskManager::process_by_root($process)) {
							$process_classes[] = "by_root";
						} elseif(TaskManager::process_by_user($process)) {
							$process_classes[] = "by_user";
						}

						$process_classes = implode(" ", $process_classes);

						echo "<tr class=\"$process_classes\">";

						if(@!empty($_GET["filters"])) {
							$processes_filters = explode(";", base64_decode($_GET["filters"]));

							if(!in_array($process["ppid"], $processes_filters)) {
								continue;
							}
						}

						foreach($process as $info) {
							echo "<td><p>$info</p></td>";
						}

						echo "</tr>";
					}
					?>
				<tbody>
			</table>
		</form>
		<span id="scrolltop" class="btn-ripple round error" title="Return to top">&uarr;</span>
		<span id="scrolldown" class="btn-ripple round error" title="Return to bottom">&darr;</span>
	</body>
</html>
