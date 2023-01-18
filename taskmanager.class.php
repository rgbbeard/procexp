<?php
/*
	Minimum PHP version 7.x
	Using PHP version 7.4.3
	Author - Davide - 28/02/2022
	Git - github.com/rgbbeard
*/

function get_user() {
	return trim(getenv("USER"));
}

function contains($target, string $container) {
    return strpos($container, $target) > -1;
}

class TaskManager {
	protected const ps_cmd = "ps -eF";
	public $processes_headers = ["user", "pid", "ppid", "%cpu", "sz", "rss", "psr", "start time", "tty", "time", "command"];

	public function get_active_processes() {
		$processes = shell_exec($this::ps_cmd);
		$processes = explode("\n", trim($processes));

		array_shift($processes);

		$result = [];

		$y = 0;
		foreach($processes as $process) {
			$process_info = preg_replace("/\s+/", ";", $process);
			$process_info = explode(";", $process_info);

			if(count($process_info) > count($this->processes_headers)) {
				for($z = count($this->processes_headers);$z<count($process_info);$z++) {
					$process_info[count($this->processes_headers)-1] .= " " . $process_info[$z];
				}
			}

			$result[$y] = [];

			for($x = 0;$x<count($this->processes_headers);$x++) {
				$ph = strtolower($this->processes_headers[$x]);
				$pi = $process_info[$x];
				$result[$y][$ph] = $pi;
			}
			$y++;
		}

		return $result;
	}

	public function find_processes_by_name(string $process_name, array $active_processes) {
		$processes = [];

		foreach($active_processes as $process) {
			if(contains($process_name, $process["command"])) {
				$process["command"] = str_replace(
					$process_name,
					"<span class='highlight'>$process_name</span>",
					$process["command"]
				);
				$processes[] = $process;
			}
		}

		return $processes;
	}

	public static function process_is_daemon(array $process_info) {
		$ppid = @$process_info["ppid"];
		$uid = @$process_info["user"];

		return intval($ppid) === 1 || contains("systemd", $uid);
	}

	public static function process_is_system(array $process_info) {
		$ppid = @$process_info["ppid"];

		return intval($ppid) === 2;
	}

	public static function process_is_vital(array $process_info) {
		$ppid = @$process_info["ppid"];

		return intval($ppid) === 0;
	}

	public static function process_by_root(array $process_info) {
		$uid = @trim(strval($process_info["user"]));

		return $uid === "root";
	}

	public static function process_by_user(array $process_info) {
		$uid = @trim(strval($process_info["user"]));

		return $uid === get_user();
	}

	public static function kill_process(int $pid) {
		shell_exec("kill $pid");
	}
}
?>
