import React, { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      });
  }, []);

  const calcularPrecioFinal = (price, discountPercentage) => {
    if (!discountPercentage) return price;
    const descuento = price * (discountPercentage / 100);
    return (price - descuento).toFixed(2);
  };

  const productosFiltrados = products.filter(product => {
    const coincideCategoria = category === 'all' || product.category === category;
    const coincidePrecio = product.price > maxPrice;
    return coincideCategoria && coincidePrecio;
  });

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div className="card" style={{ padding: '24px', background: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>Tienda de Productos</h1>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Categoría:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="all">Todas</option>
              <option value="beauty">Beauty</option>
              <option value="fragrances">Fragrances</option>
              <option value="furniture">Furniture</option>
              <option value="groceries">Groceries</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Precio Máximo (${maxPrice}):</label>
            <input 
              type="range" 
              min="0" 
              max="2000" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
            />
          </div>
        </div>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {productosFiltrados.map(product => (
              <div key={product.id} style={{ padding: '12px', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee' }}>
                <img src={product.thumbnail} alt={product.title} style={{ width: '100%', height: '120px', objectFit: 'contain' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 'bold', margin: '8px 0 4px 0' }}>{product.title}</h3>
                <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0' }}>Categoría: {product.category}</p>
                <p style={{ fontSize: '13px', margin: '0' }}>
                  Precio Original: <span style={{ textDecoration: 'line-through' }}>${product.price}</span>
                </p>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#28a745', margin: '4px 0 0 0' }}>
                  Precio Final: ${calcularPrecioFinal(product.price, product.discountPercentage)} ({product.discountPercentage}% OFF)
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}