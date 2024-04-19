<?php
 
require_once("config.php");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);


$customerId = $data->customerId;
$productId = $data->productId;
$quantity = $data->quantity;


$stmt3 = $conn->prepare("SELECT antall FROM handlekurv WHERE kundeid = ? AND produktid = ?");
$stmt3->bind_param("ii", $customerId, $productId);
$stmt3->execute();
$stmt3->store_result();

if ($stmt3->num_rows() > 0) {
    $stmt3->bind_result($existingQuantity);
    $stmt3->fetch();
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
$stmt2 = $conn->prepare("INSERT INTO handlekurv (kundeid, produktid, antall) VALUES (?, ?, ?)");
$stmt2->bind_param("iii", $customerId, $productId, $newQuantity);
if ($stmt2->execute()) {
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

