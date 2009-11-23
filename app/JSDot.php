<?php 
	
	header("Content-type: text/javascript");

	$libs = array("lib/jquery-1.3.2.js", "lib/jquery-ui-1.7.2.js","core/main.js");
	
	foreach($libs as $lib) {
		require_once $lib;
	}
	
?>