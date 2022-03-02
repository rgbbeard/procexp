<?php
require_once "taskmanager.class.php";

$TaskManager = new TaskManager();

$active_processes = @empty($_GET["pn"]) ? $TaskManager->get_active_processes() : $TaskManager->find_processes_by_name(base64_decode($_GET["pn"]));
?>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Task Manager</title>
		<link rel="shortcut icon" href="img/icon.png">
		<style type="text/css">
			:root {
				--row-highlight-color: #ccbb00;
				--row-highlight-outline: solid 1px #000;
				--row-highlight-filter: brightness(130%);
				--is-vital-color: #ebe;
				--is-daemon-color: #dfdfdf;
				--is-system-color: #77ccff;
				--by-root-color: #5dc;
				--by-user-color: #ea8;
				--column-padding: 3px 7px;
				--default-border-radius: 5px;
				--red-color-1: #c00;
			}

			* {
				box-sizing: border-box;
				font-size: 13px;
				font-family: "Calibri", sans-serif;
			}

			.is_vital {
				background-color: var(--is-vital-color);
			}

			.is_daemon {
				background-color: var(--is-daemon-color);
			}

			.is_system {
				background-color: var(--is-system-color);
			}

			.is_ordinary {
				background-color: #fff;
			}

			html, body {
				margin: 0;
				padding: 0;
				scroll-behavior: smooth;
			}

			#legenda {
				position: sticky;
				height: auto;
				width: 100%;
				top: 0;
				left: 0;
				background-color: #fff;
				margin-bottom: 10px;
				padding: 5px;
				z-index: 99999;
			}

			#legenda span {
				display: inline-block;
				width: 10%;
				height: 20px;
				text-align: center;
				line-height: 20px;
				user-select: none;
				-moz-user-select: none;
				-webkit-user-select: none;
			}

			#scrolltop,
			#scrolldown {
				display: inline-block;
				position: fixed;
				right: 30px;
				padding: 8px 10px;
				background-color: var(--red-color-1);
				color: #fff;
				cursor: pointer;
				font-size: 16px;
				border-radius: var(--default-border-radius);
			}

			#scrolltop {
				bottom: 80px;
			}

			#scrolldown {
				bottom: 30px;
			}

			a {
				text-decoration: none;
			}

			input,
			a {
				cursor: pointer;
			}

			input:not([type="checkbox"]),
			a {
				display: inline-block;
				appearance: none;
				border: solid 1px #ccc;
				padding: 4px 8px;
				outline: none !important;
			}

			input:not([type="checkbox"]):focus {
				background-color: #0055ff22;
			}

			input[type="submit"],
			a {
				background-color: #efefef;
				color: #000;
			}

			table {
				border-collapse: collapse;
			}

			table thead {
				position: sticky;
				top: 30px;
				background-color: var(--red-color-1);
				color: #fff;
				z-index: 99999;
			}

			table tr {
				margin: 2px 0;
			}

			table tbody tr:hover,
			table tbody tr.selected {
				/*background-color: var(--row-highlight-color) !important;*/
				outline: var(--row-highlight-outline);
				filter: var(--row-highlight-filter);
			}

			table tr td {
				width: 10%;
				padding: var(--column-padding);
			}

			table tr.by_root td:first-child {
				font-weight: bold;
			}

			table tr td input {
				display: inline-block;
				user-select: none;
				-moz-user-select: none;
				-webkit-user-select: none;
				width: 30px;
				background-position: center center;
				background-size: 40%;
				background-repeat: no-repeat;
				border-radius: var(--default-border-radius);
			}

			table tr td input.restart-btn {				
				background-image: url("img/reload.png");
			}

			table tr td input.kill-btn {				
				background-image: url("img/kill.png");
			}

			table tr td input.kill-btn:hover {
				background-color: #c00;
				color: #fff;
			}

			table tr td input.restart-btn:hover {
				background-color: #f90;
				color: #fff;

			}
		</style>
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
					<b>Refreshing in: <i id="refresh-display">60</i>s</b>
				</span>
			</div>
			<table width="100%">
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
						<a href=\"http://localhost:9010/taskmanager.php\">Clear filters</a>
					</div>";
				}

				if(isset($_POST["search"])) {
					if(!empty(trim($_POST["search-process"]))) {
						$params[] = "pn=" . base64_encode($_POST["search-process"]);
					}

					if(isset($_POST["filter_vital"]) || isset($_POST["filter_system"]) || isset($_POST["filter_daemon"])) {
						$filters = [];

						if(!is_null($_POST["filter_vital"])) {
							$filters[] = $_POST["filter_vital"];
						}

						if(!empty($_POST["filter_daemon"])) {
							$filters[] = $_POST["filter_daemon"];
						}

						if(!empty($_POST["filter_system"])) {
							$filters[] = $_POST["filter_system"];
						}

						$params[] = "filters=" . base64_encode(implode(";", $filters));
					}

					header("Location: http://localhost:9010/taskmanager.php?" . implode("&", $params));
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
						$kill_input_name = "rpid-$pid";
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
							echo "<td>$info</td>";
						}
							
						echo "<td>
								<input class=\"kill-btn\" type=\"submit\" name=\"$kill_input_name\" value=\"\" title=\"Kill process\">
								<input class=\"restart-btn\" type=\"submit\" name=\"$restart_input_name\" value=\"\" title=\"Restart process\">
							</td>
						</tr>";

						if(isset($_POST[$kill_input_name])) {
							TaskManager::kill_process(intval($pid));
						}

						if(isset($_POST[$restart_input_name])) {
							TaskManager::restart_process(intval($pid));
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
<script type="text/javascript">
	window.onload = function() {
		let
			timeout = 59,
			display = document.getElementById("refresh-display"),
			scrolltop = document.getElementById("scrolltop"),
			scrolldown = document.getElementById("scrolldown"),
			rows = document.querySelectorAll("table tbody tr");
		rows.forEach(r => {
			r.onclick = function() {
				rows.forEach(i => i.classList.remove("selected"));
				r.classList.add("selected");
			};
		});
		setInterval(function() {
			display.textContent = timeout;
			timeout--;
		}, 1000);
		setTimeout(function() {
			window.location.href = "http://localhost:9010/taskmanager.php";
		}, timeout*1000);
		scrolltop.onclick = function() {
			window.scrollTo(0, 0);
		};
		scrolldown.onclick = function() {
			window.scrollTo(0, document.documentElement.scrollHeight);
		};
	};
</script>
