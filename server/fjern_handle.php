<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");

require_once('config.php');

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

$customerId = $data->customerId;
$productId = $data->productId;

$stmt = $conn->prepare("DELETE FROM handlekurv WHERE kundeid = ? AND produktid = ?");
$stmt->bind_param("ii", $customerId, $productId);

if ($stmt->execute()) {
    $response = array(
        'success' => true,
        'message' => 'slettet updated successfully.'
    );
} else {
    $response = array(
        'success' => false,
        'message' => 'Failed to fjerne.'
    );
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);
?>
