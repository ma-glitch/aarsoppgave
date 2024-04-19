<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

$servername = "10.200.1.117";
$username = "skodex";
$password = "Admin";
$dbnavn = "SkoDex";


$conn = new mysqli($servername, $username, $password, $dbnavn);


if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);

}
?>
