<?php
  require_once "../taskmanager.class.php";
  if($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_POST["pid"])) {
    $pid = $_POST["pid"];

    TaskManager::kill_process($pid);

    echo "ok";
  }
?>
