<?php
require_once "taskmanager.class.php";

$TaskManager = new TaskManager();

$active_processes =	$TaskManager->get_active_processes();

$has_params = false;

if(!@empty($_GET["pn"])) {
	$process_name = base64_decode($_GET["pn"]);

	if(!empty($process_name)) {
		$has_params = true;
		$active_processes = $TaskManager->find_processes_by_name($process_name, $active_processes);
	}
}

if(!@empty($_GET["refresh"]) && boolval($_GET["refresh"]) === true) {
	header("Location: " . $_SERVER["PHP_SELF"] . (
		$has_params ? "?pn=" . $_GET["pn"] : ""
	));
}
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Task Manager</title>
		<link rel="shortcut icon" href="img/icon.png">
		<link href="css/main.css" rel="stylesheet">
		<link href="css/dark.css" rel="stylesheet">
	</head>
	<body>
		<form action="" method="post">
			<div id="legenda">
				<span class="is_vital">Vital</span>
				<span class="is_daemon">Daemons</span>
				<span class="is_system">System</span>
				<span class="is_ordinary">Others</span>
				<span>
					<b>Processes found: <?php echo sizeof($active_processes);?></b>
				</span>
				<span>
					<b>Refreshing in: <i id="refresh-display">120</i>s</b>
				</span>
				<span id="btn-mode">Dark mode</span>
			</div>
			<table>
				<input type="text" name="search-process" placeholder="Find process" value="<?php echo @empty($_GET["pn"]) ? "" : base64_decode($_GET["pn"]);?>">
				<br>
				<br>
				<div>
					<input id="filter_vital" type="checkbox" name="filter_vital" value="0">
					<label for="filter_vital">Filter vital processes</label>
					<input id="filter_daemon" type="checkbox" name="filter_daemon" value="1">
					<label for="filter_daemon">Filter daemon processes</label>
					<input id="filter_system" type="checkbox" name="filter_system" value="2">
					<label for="filter_system">Filter system processes</label>
				</div>
				<br>
				<br>
				<input type="submit" name="search" value="Filter processes">
				<br>
				<br>
				<div>
					<a href="<?php echo $_SERVER["REQUEST_URI"];?>">Refresh</a>
				</div>
				<?php
				if(@!empty($_GET)) {
					echo "<br>
					<div>
						<a href=\"http://localhost:10000/taskmanager.php\">Clear filters</a>
					</div>";
				}
				?>
				<br>
				<br>
				<thead>
					<tr>
						<?php
						foreach($TaskManager->processes_headers as $header) {
							echo "<td>" . strtoupper($header) . "</td>";
						}
						?>
						<td>ACTIONS</td>
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
							echo "<td>
								<p>$info</p>
							</td>";
						}
							
						echo "<td>
								<input class=\"kill-btn\" type=\"submit\" name=\"$kill_input_name\" value=\"\" title=\"Kill process\">
							</td>
						</tr>";

						if(isset($_POST[$kill_input_name])) {
							TaskManager::kill_process(intval($pid));
							header("Location: " . $_SERVER["REQUEST_URI"] . (
								$has_params ? "?pn=" . $_GET["pn"] . "&refresh=true" : "?refresh=true"
							));
						}
					}
					?>
				<tbody>
			</table>
		</form>
		<span id="scrolltop" title="Return to top">&uarr;</span>
		<span id="scrolldown" title="Return to bottom">&darr;</span>
	</body>
</html>
<script type="text/javascript" src="js/main.js"></script>
