<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

require_once('config.php');

if(isset($_GET['query'])) {

    $searchQuery = mysqli_real_escape_string($conn, $_GET['query']);
    
   
    $sql = "SELECT * FROM produkt WHERE navn LIKE '%$searchQuery%'";
    
  
    $result = mysqli_query($conn, $sql);
    

    if(mysqli_num_rows($result) > 0) {
   
        $searchResults = array();
        while($row = mysqli_fetch_assoc($result)) {
            $searchResults[] = $row;
        }
        
        
        echo json_encode($searchResults);
    } else {
       
        echo json_encode(array());
    }
} else {
    
    echo json_encode(array('error' => 'No search query provided'));
}
?>