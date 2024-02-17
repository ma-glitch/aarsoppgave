<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

require_once('config.php');

$customerId = $_GET['customerId']; // Retrieve customerId from query parameter

$stmt = $conn->prepare("SELECT p.*, h.antall 
                       FROM handlekurv h 
                       JOIN produkt p ON h.produktid = p.produktid 
                       WHERE h.kundeid = ?");
$stmt->bind_param("s", $customerId);
$stmt->execute();
$result = $stmt->get_result();

$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($data);
?>
