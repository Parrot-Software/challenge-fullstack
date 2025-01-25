import React, { useState } from "react";
import useAuth from "@/app/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";

function CreateOrder() {
  const { token } = useAuth();
  const [customerName, setCustomerName] = useState("");
  const [products, setProducts] = useState([
    { name: "", quantity: 1, price: 0 },
  ]);
  const queryClient = useQueryClient();

  const handleAddProduct = () => {
    setProducts([...products, { name: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleProductChange = (index, event) => {
    const newProducts = products.map((product, i) => {
      if (i === index) {
        return { ...product, [event.target.name]: event.target.value };
      }
      return product;
    });
    setProducts(newProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const orderData = {
      customer_name: customerName,
      products: products.map((product) => ({
        product_name: product.name,
        quantity: product.quantity,
        unit_price: product.price,
      })),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        console.log("Order submitted successfully");
        queryClient.invalidateQueries("recentOrders");
        // Aquí puedes manejar la respuesta exitosa, como limpiar el formulario o mostrar un mensaje
      } else {
        console.error("Failed to submit order");
        // Aquí puedes manejar errores, como mostrar un mensaje de error
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  return (
    <div className="w-1/3 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Crear Pedido</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-gray-800"
          >
            Nombre del cliente:
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {products.map((product, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Producto {index + 1}
            </h3>
            <label
              htmlFor={`productName-${index}`}
              className="block text-sm font-medium text-gray-800"
            >
              Nombre del producto:
            </label>
            <input
              type="text"
              id={`productName-${index}`}
              name="name"
              value={product.name}
              onChange={(e) => handleProductChange(index, e)}
              className="mt-1 block text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <label
              htmlFor={`quantity-${index}`}
              className="block text-sm font-medium text-gray-800 mt-2"
            >
              Cantidad:
            </label>
            <input
              type="number"
              id={`quantity-${index}`}
              name="quantity"
              value={product.quantity}
              onChange={(e) => handleProductChange(index, e)}
              className="mt-1 block text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <label
              htmlFor={`price-${index}`}
              className="block text-sm font-medium text-gray-800 mt-2"
            >
              Precio:
            </label>
            <input
              type="number"
              id={`price-${index}`}
              name="price"
              value={product.price}
              onChange={(e) => handleProductChange(index, e)}
              className="mt-1 block text-gray-500 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveProduct(index)}
                className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                -
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddProduct}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Agregar producto
        </button>
        <button
          type="submit"
          className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Crear Orden
        </button>
      </form>
    </div>
  );
}

export default CreateOrder;
