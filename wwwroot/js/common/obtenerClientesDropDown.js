function ObtenerClientesDropDown() {
    fetch("https://localhost:7245/Clientes")
        .then(response => response.json())
        .then(data => CompletarDropdown(data))
        .catch(error => console.log("No se pudo acceder al servicio.", error));
}
function CompletarDropdown(data) {
    let bodySelect = document.getElementById('ClienteId');
    bodySelect.innerHTML = '';
    let bodySelect2 = document.getElementById('ClienteIdEditar');
    bodySelect2.innerHTML = '';

    data.forEach(element => {
        let opt = document.createElement("option");
        opt.value = element.id;
        opt.text = `${element.nombreCliente} ${element.apellidoCliente}`;
        bodySelect.add(opt);

        let opt2 = document.createElement("option");
        opt2.value = element.id;
        opt2.text = `${element.nombreCliente} ${element.apellidoCliente}`;
        bodySelect2.add(opt2);
    });
}



