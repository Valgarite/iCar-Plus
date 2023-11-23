<?php
$deletedId = $_GET["id"];
$deletedImg = "imagen_carro" . $deletedId + 1 . ".jpg";

borrarNodo("registros.xml", $deletedId, $deletedImg);

function borrarNodo($myXML, $id, $imgId)
{
    $xmlDoc = new DOMDocument();
    $xmlDoc->load($myXML);
    $xpath = new DOMXpath($xmlDoc);
    $nodeList = $xpath->query('//carro[@id="' . (int) $id . '"]');
    if ($nodeList->length) {
        $node = $nodeList->item(0);
        $node->parentNode->removeChild($node);
    }
    $xmlDoc->save($myXML);
    unlink("img/" . $imgId);
}
?>