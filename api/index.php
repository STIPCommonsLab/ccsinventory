<?php
require_once 'Slim/Slim.php';

require_once 'config.php';
require_once 'functions.php';

\Slim\Slim::registerAutoloader();

/*
 * Creating new Slim application
 */
$app = new \Slim\Slim();

/*
 * Add a new project
 */
$app->post('/project', function () use ($app, $cartodb_username, $staging_table, $api_key) {

    /*
     * We are reading JSON object received in HTTP request body and converting it to array
     */
    $data = (array) json_decode($app->request()->getBody());

    unset($data['cartodb_id']);
    
    foreach($data as $key => $value) {
        if($key == 'the_geom') {
            if($value == '') {
                $data[$key] = 'null';
            }else{
                $data[$key] = sanitizeInput($value);
            }
        }else{
            $data[$key] = "'" . sanitizeInput($value) . "'";
        }
    }

    $sql = insertSQL($staging_table, $data);

	//---------------
	// Initializing curl
	$ch = curl_init( "https://".$cartodb_username.".cartodb.com/api/v2/sql" );
	$query = http_build_query(array('q'=>$sql,'api_key'=>$api_key));
	// Configuri    ng curl options
	curl_setopt($ch, CURLOPT_POST, TRUE);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	$result_not_parsed = curl_exec($ch);
	//----------------

    $app->response()->header('Content-Type', 'application/json');
    
    /*
     * Outputing request, we need to return whole task object as an array, that way ID will be automatically added to model
     */
    echo json_encode($sql);

});


/*
 * Runing the Slim app
 */
$app->run();
