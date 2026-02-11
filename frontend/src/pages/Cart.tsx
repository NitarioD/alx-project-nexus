import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { RootState, AppDispatch } from '../app/store';
import { selectCartItems } from '../features/cart/cartSlice';
import { removeFromCart, updateQuantity } from '../features/cart/cartSlice';
import { AppPage } from '../App';

interface CartProps {
  onNavigate: (page: AppPage) => void;
}

const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector(selectCartItems);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = typeof item.product.price === 'number'
      ? item.product.price
      : parseFloat(item.product.price as string);
    return sum + price * item.quantity;
  }, 0);

  const formatPrice = (price: number | string) => {
    const num = typeof price === 'number' ? price : parseFloat(price as string);
    return Number.isFinite(num) ? num.toFixed(2) : '0.00';
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-800 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center text-primary-blue hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => {
            const price = typeof item.product.price === 'number'
              ? item.product.price
              : parseFloat(item.product.price as string);
            const lineTotal = price * item.quantity;

            return (
              <div
                key={item.product.id}
                className="flex flex-col sm:flex-row gap-4 p-6 hover:bg-gray-50 transition"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={
                      item.product.image_url ||
                      `https://placehold.co/96x96/CCCCCC/333333?text=${item.product.name
                        .slice(0, 10)
                        .replace(/\s/g, '+')}`
                    }
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/96x96/CCCCCC/333333?text=No+Image';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.product.category_title}</p>
                  <p className="text-lg font-bold text-primary-blue mt-1">
                    ${formatPrice(price)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.product.id,
                          quantity: Math.max(0, item.quantity - 1),
                        })
                      )
                    }
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          productId: item.product.id,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Line Total & Remove */}
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-900 min-w-[80px] text-right">
                    ${formatPrice(lineTotal)}
                  </span>
                  <button
                    onClick={() => dispatch(removeFromCart(item.product.id))}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    aria-label="Remove from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-gray-600">
            <span className="font-semibold">{totalItems}</span>{' '}
            {totalItems === 1 ? 'item' : 'items'} in cart
          </p>
          <p className="text-xl font-extrabold text-gray-900">
            Total: <span className="text-primary-blue">${formatPrice(totalPrice)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
