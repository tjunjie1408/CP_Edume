<?php
include "connect_db.php";
header("Content-Type: application/json");
$data=json_decode(file_get_contents("php://input"),true);
$name=$data["name"];
$email=$data["email"];
$password=$data["password"];

//Form Validation
if (empty(trim($name))||empty(trim($email))||empty($password)) {
    echo json_encode(["status"=>422,"message"=>"All fields are required"]);
    exit;
}

//Email Validation
if (!filter_var($email,FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status"=>422,"message"=>"Invalid email address"]);
    exit;
}

//Check if email already exists
$stmt=$conn->prepare("SELECT user_ID FROM users WHERE username=? OR email=?");
$stmt->bind_param("ss",$name,$email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows>0) {
    echo json_encode(["status"=>422,"message"=>"Username or Email already exists"]);
    exit;
}

//Password Length Validation
if (strlen($password)<6) {
    echo json_encode(["status"=>422,"message"=>"Password must be at least 6 characters"]);
    exit;
}
$stmt->close();

//Hash Password
$hashed_password=password_hash($password,PASSWORD_BCRYPT);

//Insert User into Database
$stmt=$conn->prepare("INSERT INTO users (username,email,password) VALUES (?,?,?)");
$stmt->bind_param("sss",$name,$email,$hashed_password);
$stmt->execute();
if ($stmt->affected_rows>0) {
    echo json_encode(["status"=>201,"message"=>"User registered successfully"]);
}else{
    echo json_encode(["status"=>500,"message"=>"Failed to register user"]);
}
$stmt->close();
$conn->close();
?>
