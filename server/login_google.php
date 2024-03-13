<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

require_once('config.php');

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {


    if (isset($data["username"]) && isset($data["password"])) {
        
        $username = $data["username"];
        $password = $data["password"];
        

        if (empty($username)) {
            echo json_encode(["success" => false, "message" => "Brukernavn er nødvendig."]);
            exit();
        }

       
        $sql = "SELECT * FROM kundeinfo WHERE epost = ?";

        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $username);
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                if ($result->num_rows == 1) {
                    $row = $result->fetch_assoc();
                    echo json_encode([
                        "success" => true,
                        "kundeid" => $row['kundeid'], 
                        "fornavn" => $row['fornavn'], 
                        "etternavn" => $row['etternavn'], 
                        "epost" => $row['epost']
                    ]);
                    exit();
                } else {
                    echo json_encode(["success" => false, "message" => "Invalid email or password"]);
                    exit();
                }
            } else {
                echo json_encode(["success" => false, "message" => "Could not execute query"]);
                exit();
            }
        } else {
            echo json_encode(["success" => false, "message" => "Could not prepare statement"]);
            exit();
        }
        
            $stmt->close();
        } else {
            echo json_encode(["success" => false, "message" => "Kunne ikke forberede spørringen."]);
            exit();
        }
    } else {
        echo json_encode(["success" => false, "message" => "Mangler brukernavn eller passord."]);
        exit();
    }
?>

