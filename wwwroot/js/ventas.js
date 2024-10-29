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
        let tdFinalizada = document.createTextNode(element.finalizada);
        td2.appendChild(tdFinalizada);

        let td3 = tr.insertCell(3);
        let tdCliente = document.createTextNode(element.cliente.nombreCliente);
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
    });
}

function CrearVenta() {
    let nuevaVenta = {
        fechaVenta: document.getElementById("fechaVenta").value,
        finalizada: document.getElementById("ventaFinalizada").checked,
        clienteId: document.getElementById("clienteId").value
    };

    fetch('https://localhost:7245/Ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaVenta)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status == undefined) {
                document.getElementById("fechaVenta").value = 0;
                document.getElementById("ventaFinalizada").checked;
                document.getElementById("clienteId").value = 0;

                $('#error').empty();
                $('#error').attr("hidden", true);
                $('#modalAgregarVentas').modal('hide');
                ObtenerVentas();
            } else {
                mensajesError('#error', data);
            }
        });

}

function BuscarVentaId(id) {
    fetch(`https://localhost:7245/Ventas/${id}`)
        .then(response => response.json())
        .then(venta => {
            document.getElementById("ventaIdEditar").value = venta.id;
            document.getElementById("fechaVentaEditar").value = venta.fechaVenta;
            document.getElementById("clienteIdEditar").value = venta.clienteId;
            document.getElementById("ventaFinalizadaEditar").checked = venta.finalizada;

            $('#modalEditarVentas').modal('show');
        })
        .catch(error => console.error("Error al cargar la venta:", error));
}

function EditarVenta() {
    let idVenta = document.getElementById("ventaIdEditar").value;
    let ventaEditada = {
        id: idVenta,
        fechaVenta: document.getElementById("fechaVentaEditar").value,
        finalizada: document.getElementById("ventaFinalizadaEditar").checked,
        clienteId: document.getElementById("clienteIdEditar").value
    };

    fetch(`https://localhost:7245/Ventas/${idVenta}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaEditada)
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("ventaIdEditar").value = 0;
            document.getElementById("fechaVentaEditar").value = 0;
            document.getElementById("clienteIdEditar").value = 0;

            $('#errorEditar').empty();
            $('#errorEditar').attr("hidden", true);
            $('#modalEditarVentas').modal('hide');
            ObtenerVentas()
        })
        .catch(error => console.error("No se pudo acceder a la api, verifique el mensaje de error:", error));
}

function EliminarVenta(id) {
    if (confirm("¿Está seguro de que desea eliminar esta venta?")) {
        fetch(`https://localhost:7245/Ventas/${id}`, { method: 'DELETE' })
            .then(() => ObtenerVentas())
            .catch(error => console.error("Error al eliminar la venta:", error));
    }
}

function AgregarDetalle() {
    let nuevoDetalle = {
        productoId: document.getElementById("productoId").value,
        cantidad: document.getElementById("cantidadProducto").value,
        ventaId: document.getElementById("ventaIdEditar").value
    };

    fetch('https://localhost:7245/DetallesVenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoDetalle)
    })
        .then(() => {
            MostrarDetallesVenta(nuevoDetalle.ventaId);
        })
        .catch(error => console.log("Error al agregar el detalle de venta:", error));
}

function MostrarDetallesVenta(idVenta) {
    fetch(`https://localhost:7245/DetallesVenta/${idVenta}`)
        .then(response => response.json())
        .then(detalles => {
            $("#listaDetallesVenta").empty();
            $.each(detalles, function (index, detalle) {
                $('#listaDetallesVenta').append(
                    "<tr>",
                    "<td>" + detalle.producto.nombre + "</td>",
                    "<td>" + detalle.cantidad + "</td>",
                    "<td><button class='btn btn-info' onclick='EditarDetalle(" + detalle.id + ")'>Modificar</button></td>",
                    "<td><button class='btn btn-danger' onclick='EliminarDetalle(" + detalle.id + ")'>Eliminar</button></td>",
                    "</tr>"
                );
            });
        })
        .catch(error => console.log("Error al cargar los detalles de la venta:", error));
}

function EliminarDetalle(idDetalle) {
    if (confirm("¿Está seguro de que desea eliminar este detalle?")) {
        fetch(`https://localhost:7245/DetallesVenta/${idDetalle}`, { method: 'DELETE' })
            .then(() => {
                let idVenta = document.getElementById("ventaIdEditar").value;
                MostrarDetallesVenta(idVenta);
            })
            .catch(error => console.log("Error al eliminar el detalle de venta:", error));
    }
}