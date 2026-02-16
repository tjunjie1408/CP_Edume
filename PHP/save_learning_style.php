<?php
session_start();
include "connect_db.php";
header("Content-Type: application/json");

try {
    // Get user_ID from session
    if (!isset($_SESSION["user_ID"])) {
        echo json_encode(["status"=>401,"message"=>"User not logged in"]);
        exit;
    }
    
    $data=json_decode(file_get_contents("php://input"),true);
    
    if (!$data || !isset($data["learnerType"])) {
        echo json_encode(["status"=>400,"message"=>"Invalid request data"]);
        exit;
    }
    
    $user_ID=$_SESSION["user_ID"];
    $learnerType=$data["learnerType"];
    
    $stmt=$conn->prepare("UPDATE users SET learning_style=? WHERE user_ID=?");
    if (!$stmt) {
        echo json_encode(["status"=>500,"message"=>"Database error: " . $conn->error]);
        exit;
    }
    
    $stmt->bind_param("si",$learnerType,$user_ID);
    if ($stmt->execute()) {
        echo json_encode(["status"=>200,"message"=>"Learning style saved successfully"]);
    } else {
        echo json_encode(["status"=>500,"message"=>"Failed to save learning style: " . $stmt->error]);
    }
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(["status"=>500,"message"=>"Server error: " . $e->getMessage()]);
}
