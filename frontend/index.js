const lista = document.getElementById("lista")
const backUrl = "../backend/"
const xmlUrl = `${backUrl}registros.xml`
const inputs = [inImg, inMarca, inModel, inYear, inTipo, inDesc] = ["imagen", "marca", "model", "año", "tipo", "desc"].map((el) => document.getElementById(el))
var carrosManipulables = []
var editando = -1
main()

function main() {
    cargarDoc()
}

function readCarList(xmlResponse) {
    const carros = Array.from(xmlResponse.getElementsByTagName("carro"))
    carrosManipulables = carros.map((el) => xmlToJson(el))
    let cardElement = ""
    carrosManipulables.forEach((carro) => {
        const carId = carro["@attributes"].id
        cardElement +=
            `<article id=car${carId} class=card>
                <img src='../backend/img/${carro.imagen["#text"]}?t=${Math.random()}'>
                <div class=info>
                    <div class=column1>
                    <p class=marca>${carro.marca["#text"]}</p>
                    <p class=modelo>${carro.modelo["#text"]}</p>
                    <p class=year>${carro.year["#text"]}</p>
                    <p class=tipo>${carro.tipo["#text"]}</p>
                    </div>
                    <div class=column2>
                        <p class=desc>${carro.descripcion["#text"]}</p>
                    </div>
                </div>
                <div class=info>
                    <button class="editar" onclick=editar(${carId})>Editar</button>
                    <button class="eliminar" onclick=borrar(${carId})>Eliminar</button>
                </div>
            </article>`
    });
    lista.innerHTML = cardElement
}

function cargarDoc() {
    const xml = `${xmlUrl}` + "?t=" + Math.random()
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            readCarList(this.responseXML)
        }
    };
    xhttp.open("GET", xml, true);
    xhttp.send();
}

function crear() {
    let validacion = true
    // inputs.forEach((el) => {
    //     if (el.value == "" || null || undefined) {
    //         validacion = false
    //     }
    // })
    // if (!validacion) {
    //     window.alert("¡Campos vacíos!")
    //     return
    // }
    // const values = inputs.map((input) => {return input.value})
    const mensaje = {
        img: inImg.files[0],
        marca: inMarca.value,
        modelo: inModel.value,
        year: inYear.value,
        tipo: inTipo.value,
        descripcion: inDesc.value
    }

    const formData = new FormData();
    for (const key in mensaje) {
        if (Object.hasOwnProperty.call(mensaje, key)) {
            const element = mensaje[key];
            if (key == "img" & !element) {
                if (editando > -1) {
                    continue
                }
                alert("Suba una imagen para el carro")
                return
            }
            if (key != "img") {
                formData.append(key, element)
            } else {
                formData.append(key, element, "fotocarro.jpg")
            }
        }
    }

    const xhr = new XMLHttpRequest();
    let url = ''
    if (editando > -1) {
        formData.append("editando", editando)
        url = `${backUrl}update-car.php`
    } else {
        url = `${backUrl}create-car.php`
    }
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Procesar respuesta exitosa
            cargarDoc()
            window.alert(xhr.responseText)

            editando = -1 //Reiniciar estado
            inputs.forEach((el) => { el.value = "" }) //Limpiar campos
        } else if (xhr.readyState === 4) {
            // Procesar error
            window.alert("Error en la solicitud.");
        }
    };
    xhr.send(formData);
}

function editar(num) {
    const selected = carrosManipulables[num]
    editando = num
    const selectedValues = [/*selected.imagen["#text"],*/ selected.marca["#text"], selected.modelo["#text"], selected.year["#text"], selected.tipo["#text"], selected.descripcion["#text"]]
    for (let index = 1; index < inputs.length; index++) {
        inputs[index].value = selectedValues[index - 1]
    }
}

function borrar(num) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${backUrl}delete-car.php?id=${num}`)
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            cargarDoc()
        } else if (xhr.readyState === 4) {
            // Procesar error
            window.alert("Error en la solicitud.");
        }
    }
    xhr.send()
}

function xmlToJson(xml) {
    // Verifica si el input es un elemento XML
    if (!xml || xml.nodeType !== 1) {
        return null;
    }

    // Crea el objeto que almacenará el JSON
    let obj = {};

    // Si el XML tiene atributos, agrégalos al objeto JSON
    if (xml.attributes && xml.attributes.length > 0) {
        obj['@attributes'] = {};
        for (let j = 0; j < xml.attributes.length; j++) {
            let attribute = xml.attributes.item(j);
            obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
    }

    // Si el XML tiene nodos hijos, recórrelos y agrégalos al objeto JSON
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            let item = xml.childNodes.item(i);
            let nodeName = item.nodeName;

            // Si es un nodo de texto, agrégalo como un valor
            if (item.nodeType === 3) {
                let text = item.nodeValue.trim();
                if (text) {
                    // Si ya existe texto, concaténalo
                    obj['#text'] = obj['#text'] ? obj['#text'] + text : text;
                }
            } else if (item.nodeType === 1) { // Si es un elemento, realiza una llamada recursiva
                let childObj = xmlToJson(item);
                if (obj[nodeName]) {
                    // Si ya existe, conviértelo en un arreglo
                    if (!Array.isArray(obj[nodeName])) {
                        obj[nodeName] = [obj[nodeName]];
                    }
                    obj[nodeName].push(childObj);
                } else {
                    obj[nodeName] = childObj;
                }
            }
        }
    }
    return obj;
}
