<?php
 
require_once("config.php");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);


$customerId = $data->customerId;
$productId = $data->productId;
$quantity = $data->quantity;


$stmt = $conn->prepare("SELECT antall FROM handlekurv WHERE kundeid = ? AND produktid = ?");
$stmt->bind_param("ii", $customerId, $productId);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows() > 0) {
    $stmt->bind_result($existingQuantity);
    $stmt->fetch();
    $newQuantity = $existingQuantity + $quantity;
    $stmt = $conn->prepare("UPDATE handlekurv SET antall = ? WHERE kundeid = ? AND produktid = ?");
    $stmt->bind_param("iii", $newQuantity, $customerId, $productId);
    if ($stmt->execute()) {
        $response = array(
            'success' => true,
            'message' => 'Quantity updated successfully.'
        );
    } else {
        $response = array(
            'success' => false,
            'message' => 'Failed to update quantity.'
        );
    }
} else {
$stmt = $conn->prepare("INSERT INTO handlekurv (kundeid, produktid, antall) VALUES (?, ?, ?)");
if ($stmt->execute([$customerId, $productId, $quantity])) {
    $response = array(
        'success' => true,
        'message' => 'Item added to cart successfully.'
    );
} else {
    $response = array(
        'success' => false,
        'message' => 'Failed to add item to cart.'
    );
}
}


$response = array(
    'success' => true,
    'message' => 'Item added to cart successfully.'
);
echo json_encode($response);
?>

