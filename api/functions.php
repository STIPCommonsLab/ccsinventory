<?php

function insertSQL($staging_table, $data) {

	$keys = implode(',', array_keys($data));
	$values = implode(',', array_values($data));
	$sql = "INSERT INTO $staging_table ($keys) VALUES($values);";
	return $sql;
}

function sanitizeInput($str) {
    $str = trim($str);
    $str = stripslashes($str);
    $str = str_replace("'", "''", $str);
    return $str;
}

