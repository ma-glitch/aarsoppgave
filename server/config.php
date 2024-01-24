<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

$servername = "localhost";
$username = "root";
$password = "Admin";
$dbnavn = "mydb";


$conn = new mysqli($servername, $username, $password, $dbnavn);


if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);

}
?>
