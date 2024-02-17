<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");


require_once('config.php');


$data = json_decode(file_get_contents("php://input"));


if (!isset($data->fornavn) || !isset($data->etternavn) || !isset($data->username) || !isset($data->email) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}


$fornavn = mysqli_real_escape_string($conn, trim($data->fornavn));
$etternavn = mysqli_real_escape_string($conn, trim($data->etternavn));
$username = mysqli_real_escape_string($conn, trim($data->username));
$email = mysqli_real_escape_string($conn, trim($data->email));
$password = mysqli_real_escape_string($conn, trim($data->password));

// Check if the username or email already exists
$sql = "SELECT * FROM kundeinfo WHERE brukernavn = '$username' OR epost = '$email'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    echo json_encode(["success" => false, "message" => "Username or email already exists"]);
    exit();
}

// Hash the password
$hashed_password = ($password);

// Insert the user into the database
$insert_query = "INSERT INTO kundeinfo (fornvavn, etternavn, epost, brukernavn, passord) VALUES ('$fornavn', '$etternavn', '$email', '$username', '$hashed_password')";
if (mysqli_query($conn, $insert_query)) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to register user"]);
}

mysqli_close($conn);
?>
