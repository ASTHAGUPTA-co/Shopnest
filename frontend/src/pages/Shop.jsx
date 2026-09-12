import React, { useEffect, useState, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';
import { AuthContext } from '../context/AuthContext';
const Shop = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        return;
      }

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [user]);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="shop-container">
      <h2>All Products</h2>
      <input 
        type="text" 
        placeholder="Search products..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-bar"
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;