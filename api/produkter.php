<?php
error_reporting(E_ALL); ini_set('display_errors', 1);
header('Content-Type: application/json');


include "config.php";

$sql = "SELECT produktid, navn, pris FROM produkt";
$result = $conn->query($sql);

if ($result->num_rows > 0) {

  $products = array();
  while ($row = $result->fetch_assoc()) {
    $products[] = $row;
  }
  echo json_encode($products);

} else {
  echo "0 results";
}

$conn->close();
?>