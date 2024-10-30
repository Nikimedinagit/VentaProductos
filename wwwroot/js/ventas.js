function ObtenerVentas() {

    fetch('https://localhost:7245/Ventas')
        .then(response => response.json())
        .then(data => MostrarVentas(data))
        .catch(error => console.log("No se pudo acceder al servicio.", error));
}

function MostrarVentas(data) {
    let tbody = document.getElementById('todasLasVentas');
    tbody.innerHTML = '';

    data.forEach(element => {
        let tr = tbody.insertRow();

        let td0 = tr.insertCell(0);
        let tdId = document.createTextNode(element.id);
        td0.appendChild(tdId);

        let td1 = tr.insertCell(1);
        let tdFecha = document.createTextNode(element.fechaVenta);
        td1.appendChild(tdFecha);

        let td2 = tr.insertCell(2);
        let estadoFinalizada = element.finalizada ? "Finalizado" : "Pendiente";
        let tdFinalizada = document.createTextNode(estadoFinalizada);
        td2.appendChild(tdFinalizada);

        let td3 = tr.insertCell(3);
        let tdCliente = document.createTextNode(`${element.cliente.nombreCliente} ${element.cliente.apellidoCliente}`);
        td3.appendChild(tdCliente);


        let btnEditar = document.createElement('button');
        btnEditar.innerText = 'Modificar';
        btnEditar.setAttribute('class', 'btn btn-info');
        btnEditar.setAttribute('onclick', `BuscarVentaId(${element.id})`);
        let td4 = tr.insertCell(4);
        td4.appendChild(btnEditar);

        let btnEliminar = document.createElement('button');
        btnEliminar.innerText = 'Eliminar';
        btnEliminar.setAttribute('class', 'btn btn-danger');
        btnEliminar.setAttribute('onclick', `EliminarVenta(${element.id})`);
        let td5 = tr.insertCell(5);
        td5.appendChild(btnEliminar);

        let btnDetalle = document.createElement('button');
        btnDetalle.innerText = 'Detalle';
        btnDetalle.setAttribute('class', 'btn btn-success');
        btnDetalle.setAttribute('onclick', `BuscarProductosDetalle(${element.id})`);
        let td6 = tr.insertCell(6);
        td6.appendChild(btnDetalle);
    });
}

function CrearVenta() {
    const clienteId = document.getElementById('ClienteId').value;
    let venta = {
        fechaVenta: document.getElementById("Fecha").value,
        finalizada: document.getElementById("Finalizada").checked,
        clienteId: clienteId,
        cliente: null,
        detalleVenta: null,
    };
    fetch('https://localhost:7245/Ventas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(venta)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.message); });
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("Fecha").value = "";
            document.getElementById("Finalizada").checked = false;
            document.getElementById("ClienteId").value = 0;
            $('#error').empty();
            $('#error').attr("hidden", true);
            $('#modalAgregarVentas').modal('hide');
            ObtenerVentas();
        })
        .catch(error => {
            alert(error.message);
        });
}


function EliminarVenta(id) {
    var eliminarVentaSi = confirm("¿Esta seguro de borrar esta Venta?")
    if (eliminarVentaSi == true) {
        EliminarSi(id);
    }
}

function EliminarSi(id) {
    fetch(`https://localhost:7245/Ventas/${id}`,
        {
            method: "DELETE"
        })

        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.message); });
            }
            return response.json();
        })
        .then(() => {
            ObtenerVentas();
        })
        .catch(error => {
            alert("No se puede borra, porque tiene Ventas pendientes.");
            console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error)
        })
}


function BuscarVentaId(id) {
    fetch(`https://localhost:7245/Ventas/${id}`, {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {

            document.getElementById("IdVentas").value = data.id;
            document.getElementById("FechaEditar").value = data.fechaVenta;
            document.getElementById("FinalizadaEditar").checked = data.finalizada;
            document.getElementById("ClienteIdEditar").value = data.clienteId;

            $('#modalEditarVentas').modal('show');
        })
        .catch(error => console.error("No se pudo acceder a la API, verifique el mensaje de error:", error));
}


function EditarVenta() {
    let idVenta = document.getElementById("IdVentas").value;

    let venta = {
        id: idVenta,
        fechaVenta: document.getElementById("FechaEditar").value,
        finalizada: document.getElementById("FinalizadaEditar").checked,
        clienteId: document.getElementById("ClienteIdEditar").value,
        cliente: null,
    };

    fetch(`https://localhost:7245/Ventas/${idVenta}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(venta)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status == undefined) {
                document.getElementById("IdVentas").value = 0;
                document.getElementById("FechaEditar").value = "";
                document.getElementById("FinalizadaEditar").checked = false;
                document.getElementById("ClienteIdEditar").value = 0;

                $('#errorEditar').empty();
                $('#errorEditar').attr("hidden", true);
                $('#modalEditarVentas').modal('hide');
                ObtenerVentas();
            } else {
                mensajesError('#errorEditar', data);
            }
        })
        .catch(error => console.error("No se pudo acceder a la API, verifique el mensaje de error:", error));
}

function mensajesError(id, data, mensaje) {
    $(id).empty();
    if (data != null) {
        $.each(data.errors, function (index, item) {
            $(id).append(
                "<ol>",
                "<li>" + item + "</li>",
                "</ol>"
            )
        })
    }
    else {
        $(id).append(
            "<ol>",
            "<li>" + mensaje + "</li>",
            "</ol>"
        )
    }

    $(id).attr("hidden", false);
}



function BuscarProductosDetalle(id) {
    fetch(`https://localhost:7245/DetallesVentas/${id}`, {
        method: "GET"
    })
        .then(response => response.json())
        .then(async data => {
            MostrarProductosDetalle(data);
            await ObtenerProductosDropdown();
            FiltrarDropdownProductos();
            document.getElementById("IdDetalleVentas").value = id;
            $('#modalDetalleVentas').modal('show');
        })
        .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error: ", error));
}

function MostrarProductosDetalle(data) {
    $("#todosLosDetalles").empty();
    $.each(data, function (index, item) {
        $('#todosLosDetalles').append(
            `<tr>
                <td>${item.id}</td>
                <td>${item.producto.nombreProducto}</td>
            </tr>`
        );
    });
}

function GuardarDetalle() {
    let idVentaDetalle = document.getElementById("IdDetalleVentas").value;
    let guardarDetalle = {
        productoId: document.getElementById("ProductosIdDetalle").value,
        producto: null,
        ventaId: idVentaDetalle,
    };

    fetch('https://localhost:7245/DetallesVentas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guardarDetalle)
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById("ProductosIdDetalle").value = 0;
            $("#errorDetalle").empty();
            $("#errorDetalle").attr("hidden", true);
            BuscarProductosDetalle(idVentaDetalle);
        })
        .catch(error => console.log("Hubo un error al guardar el detalle, verifique el mensaje de error: ", error));
}













