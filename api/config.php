<?php
$servername = "localhost";
$username = "root";
$password = "Admin";
$dbnavn = "mydb";


$conn = new mysqli($servername, $username, $password, $dbnavn);


if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
?>
