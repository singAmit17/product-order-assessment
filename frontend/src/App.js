import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: ""
  });

  const [orderForm, setOrderForm] = useState({
    customer_name: "",
    items: []
  });

  // ------------------------
  // Fetch Data
  // ------------------------

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products/`);
    setProducts(res.data);
  };

  const fetchOrders = async () => {
    const res = await axios.get(`${API_URL}/orders/`);
    setOrders(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // ------------------------
  // Product Handlers
  // ------------------------

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/products/`, {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    });
    setForm({ name: "", description: "", price: "", stock: "" });
    fetchProducts();
  };

  // ------------------------
  // Order Handlers
  // ------------------------

  const handleOrderChange = (e) => {
    setOrderForm({ ...orderForm, customer_name: e.target.value });
  };

  const handleQuantityChange = (productId, quantity) => {
    const updatedItems = orderForm.items.filter(i => i.product_id !== productId);

    if (quantity > 0) {
      updatedItems.push({
        product_id: productId,
        quantity: Number(quantity)
      });
    }

    setOrderForm({ ...orderForm, items: updatedItems });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_URL}/orders/`, orderForm);
    setOrderForm({ customer_name: "", items: [] });
    fetchOrders();
    fetchProducts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product & Order Management</h1>

      {/* PRODUCT SECTION */}
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} required />
        <button type="submit">Add Product</button>
      </form>

      <h2>Product List</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ₹{p.price} (Stock: {p.stock})
          </li>
        ))}
      </ul>

      <hr />

      {/* ORDER SECTION */}
      <h2>Create Order</h2>
      <form onSubmit={handleOrderSubmit}>
        <input
          placeholder="Customer Name"
          value={orderForm.customer_name}
          onChange={handleOrderChange}
          required
        />

        <h4>Select Products</h4>
        {products.map((p) => (
          <div key={p.id}>
            {p.name} (Stock: {p.stock})
            <input
              type="number"
              min="0"
              placeholder="Quantity"
              onChange={(e) =>
                handleQuantityChange(p.id, e.target.value)
              }
            />
          </div>
        ))}

        <button type="submit">Create Order</button>
      </form>

      <h2>Order List</h2>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            Order #{o.id} - {o.customer_name} - ₹{o.total_amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;