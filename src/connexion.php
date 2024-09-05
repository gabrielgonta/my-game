<?php
// connexion.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Connexion à la base de données
$host = 'fdb1034.awardspace.net'; // ou votre hôte
$dbname = '4076560_dbgame';
$username = '4076560_dbgame'; // ou votre utilisateur MySQL
$pwd = 'Gabi&Luis-Game2024'; // mot de passe MySQL

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $pwd);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit();
}

// Récupérer les données envoyées par le formulaire
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'];
$pass = $input['password'];

// Vérifier si l'utilisateur existe dans la base de données
$sql = "SELECT * FROM my-game WHERE (email = :email OR username = :email) AND password = :password";
$stmt = $pdo->prepare($sql);
$stmt->execute(['email' => $email, 'password' => md5($pass)]); // Utilisation de md5 pour le hash du mot de passe (non recommandé, préférer bcrypt)

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    echo json_encode(['success' => true, 'message' => 'Connexion réussie']);
} else {
    echo json_encode(['success' => false, 'message' => 'Identifiants incorrects']);
}
?>
