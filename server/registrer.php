<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");


require_once('config.php');


$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);


if (!isset($data['fornavn']) || !isset($data['etternavn']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}


$fornavn = $data['fornavn'];
$etternavn = $data['etternavn'];
$email = $data['email'];
$password = $data['password'];


$sql = "SELECT * FROM kundeinfo WHERE epost = '$email'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    echo json_encode(["success" => false, "message" => "Username or email already exists"]);
    exit();
}


$hashed_password = password_hash($password, PASSWORD_DEFAULT);


$insert_query = "INSERT INTO kundeinfo (fornavn, etternavn, epost, passord) VALUES ('$fornavn', '$etternavn', '$email', '$hashed_password')";
if (mysqli_query($conn, $insert_query)) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to register user"]);
}

mysqli_close($conn);
?>
