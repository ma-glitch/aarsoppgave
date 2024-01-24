<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

require_once('config.php');

$sql = "SELECT * FROM produkt";
$result = $conn->query($sql);



$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}


$conn->close();

header('Content-Type: application/json');
echo json_encode($data);
?>
