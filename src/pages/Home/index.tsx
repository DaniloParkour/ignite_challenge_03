import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sum, p) => {
    const newSumAmount = {...sum};
    newSumAmount[p.id] = p.amount;

    return newSumAmount;
  }, {} as CartItemsAmount);

  console.log(cartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      const resp = await api.get<Product[]>('products');

      const data = resp.data.map(p => ({
        ...p,
        priceFormatted: formatPrice(p.price)
      } as ProductFormatted))
      setProducts(data);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
    /*const aux = cartItemsAmount;
    aux[id] = aux[id] ? aux[id] += 1 : aux[id] = 1;
    setCartItemsAmount(aux);
    // console.log(cartItemsAmount);
    console.log(aux);
    console.log("Cart Item " + cartItemsAmount[id]);*/
  }

  return (
    <ProductList>
      {products.map(product => (
            <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <strong>{product.title}</strong>
              <span>{new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(product.price)}</span>
              <button
                type="button"
                data-testid="add-product-button"
                onClick={() => handleAddProduct(product.id)}
              >
                <div data-testid="cart-product-quantity">
                  <MdAddShoppingCart size={16} color="#FFF" />
                  {cartItemsAmount[product.id] || 0}
                </div>

                <span>ADICIONAR AO CARRINHO</span>
              </button>
            </li>
          )
        )
      }
    </ProductList>
  );
};

export default Home;
