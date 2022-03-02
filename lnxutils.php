<?php
/*
	Minimum PHP version 7.x
	Using PHP version 7.4.3
	Author - Davide - 22/02/2022
	Git - github.com/rgbbeard
*/

function get_user() {
	return trim(shell_exec("echo \$USER"));
}
?>