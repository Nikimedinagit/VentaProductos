

function ObtenerProductosDropdown() {
    fetch('https://localhost:7245/Productos')
        .then(response => response.json())
        .then(async data => {
            localStorage.setItem("productos", JSON.stringify(data));

        })
        .catch(error => console.log("No se pudo acceder al servicio.", error));
}

function FiltrarDropdownProductos() {
    let todosProductos = localStorage.getItem("productos");
    todosProductos = JSON.parse(todosProductos);

    $('#ProductosIdDetalle').empty();
    todosProductos.forEach(item => {
        $('#ProductosIdDetalle').append(
            `<option value='${item.id}'>${item.nombreProducto}</option>`
        );
    });
}

