<?php
include_once("uploadImg.php");
$carros = simplexml_load_file('registros.xml');
// $node = $xmli->xpath('//carro[@id="1"]');
try {
    $lastnode = $carros->xpath('//carro[last()]');
    $id = strval($lastnode[0]->attributes());
} catch (\Throwable $th) {
    $id = -1;
}
$carroNuevo = $carros->addChild("carro");
$carroNuevo->addAttribute("id", $id + 1);
$carroNuevo->addChild("imagen", uploadImg($id));
foreach ($_POST as $clave => $valor) {
    $carroNuevo->addChild($clave, $valor);
}
$carros->asXml('registros.xml');
?>