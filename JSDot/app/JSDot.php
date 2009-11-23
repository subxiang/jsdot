
<?php 
	$libs = array("jquery-1.3.2.js", "jquery-ui-1.7.2.js");
	foreach($libs as $lib) {
		require_once "lib/".$lib;
	}
	
	header("Content-type: text/javascript");
?>