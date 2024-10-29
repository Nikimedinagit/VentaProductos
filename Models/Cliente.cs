using System.ComponentModel.DataAnnotations;

namespace VentaProductos.Models;

public class Cliente
{
    public int Id { get; set; }

    [StringLength(100, ErrorMessage = "El Nombre debe contener entre {2} y {1} caracteres.", MinimumLength = 3)]
    [RegularExpression(@"^[A-Z]+[a-zA-Z\s]*$", ErrorMessage = "El Nombre debe empezar con una letra mayúscula.")]
    public string? NombreCliente { get; set; }

    [StringLength(100, ErrorMessage = "El Apellido debe contener entre {2} y {1} caracteres.", MinimumLength = 3)]
    [RegularExpression(@"^[A-Z]+[a-zA-Z\s]*$", ErrorMessage = "El Apellido debe empezar con una letra mayúscula.")]
    public string? ApellidoCliente { get; set; }

    public int Dni { get; set; }

    public float Saldo { get; set; }

    public virtual ICollection<Venta>? Ventas { get; set; }
}