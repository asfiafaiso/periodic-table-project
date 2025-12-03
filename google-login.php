<?php
require_once 'vendor/autoload.php';
session_start();

$client = new Google\Client();
$client->setClientId("48687981210-vqb4iesphh1uepla0ja08oj3m99eu4vi.apps.googleusercontent.com");
$client->setClientSecret("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");
$client->setRedirectUri("http://localhost:8000/google-login.php");
$client->addScope("email");
$client->addScope("profile");
$client->setPrompt("select_account");

if (!isset($_GET['code'])) {
    header("Location: index.php");
    exit;
}

$token = $client->fetchAccessTokenWithAuthCode($_GET['code']);

if (isset($token["error"])) {
    die("Error retrieving access token.");
}

$client->setAccessToken($token);

$oauth2 = new Google\Service\Oauth2($client);
$googleUser = $oauth2->userinfo->get();

$_SESSION['user'] = [
    "name" => $googleUser->name,
    "email" => $googleUser->email,
    "picture" => $googleUser->picture
];

header("Location: dashboard.php");
exit;
?>
