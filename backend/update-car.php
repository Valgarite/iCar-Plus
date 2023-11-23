<?php
include_once("uploadImg.php");
$xml = simplexml_load_file('registros.xml');

foreach ($xml->carro as $carro) {
    if ((string) $carro['id'] === $_POST['editando']) {
        // Este es el carro que queremos actualizar
        $carro->marca = $_POST["marca"];
        $carro->modelo = $_POST["modelo"];
        $carro->year = $_POST["year"];
        $carro->tipo = $_POST["tipo"];
        $carro->descripcion = $_POST["descripcion"];
        uploadImg($_POST['editando'] - 1);
    }
}

$xml->asXML('registros.xml');

echo("Cambios realizados");
?>