import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { useLoginMutation } from '../features/auth/authApi';
import { setCredentials, logout } from '../features/auth/authSlice';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetCategoriesQuery,
} from '../features/products/productsApi';
import { Category } from '../types';

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  // Auth mutations
  const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation();

  // Product mutations
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: categories = [] } = useGetCategoriesQuery();

  // Local form state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    category: '',
  });
  const [updateForm, setUpdateForm] = useState({
    id: '',
    price: '',
    stock_quantity: '',
    is_available: true,
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokens = await login({
        username: loginForm.username,
        password: loginForm.password,
      }).unwrap();
      dispatch(setCredentials({ access: tokens.access, refresh: tokens.refresh, username: loginForm.username }));
      setLoginForm({ username: '', password: '' });
    } catch {
      // handled via loginError
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        stock_quantity: Number(newProduct.stock_quantity),
        image_url: newProduct.image_url || null,
        category: Number(newProduct.category),
        is_available: true,
      }).unwrap();
      setNewProduct({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        image_url: '',
        category: '',
      });
    } catch {
      // error handled by RTK Query; could show toast in real app
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateForm.id) return;
    try {
      await updateProduct({
        id: Number(updateForm.id),
        data: {
          price: updateForm.price || undefined,
          stock_quantity: updateForm.stock_quantity
            ? Number(updateForm.stock_quantity)
            : undefined,
          is_available: updateForm.is_available,
        },
      }).unwrap();
      setUpdateForm({
        id: '',
        price: '',
        stock_quantity: '',
        is_available: true,
      });
    } catch {
      // handled by RTK Query
    }
  };

  if (!auth.accessToken) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          Admin Login
        </h2>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              required
            />
          </div>

          {loginError && (
            <p className="text-sm text-red-600">
              Invalid credentials or server error. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-2 px-4 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-60"
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage products in the e-commerce catalog.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-2">
            Logged in as <span className="font-semibold">{auth.username}</span>
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Create Product */}
      <section className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Create New Product
        </h2>
        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct((prev) => ({ ...prev, price: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={newProduct.stock_quantity}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  stock_quantity: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              required
            >
              <option value="">Select category</option>
              {categories.map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={newProduct.image_url}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  image_url: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2 bg-primary-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-60"
            >
              {isCreating ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </section>

      {/* Update Product */}
      <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Update Existing Product
        </h2>
        <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product ID
            </label>
            <input
              type="number"
              min="1"
              value={updateForm.id}
              onChange={(e) =>
                setUpdateForm((prev) => ({ ...prev, id: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Price (optional)
            </label>
            <input
              type="number"
              step="0.01"
              value={updateForm.price}
              onChange={(e) =>
                setUpdateForm((prev) => ({ ...prev, price: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Stock Quantity (optional)
            </label>
            <input
              type="number"
              min="0"
              value={updateForm.stock_quantity}
              onChange={(e) =>
                setUpdateForm((prev) => ({
                  ...prev,
                  stock_quantity: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-blue focus:border-primary-blue"
            />
          </div>

          <div className="flex items-center mt-6">
            <input
              id="is_available"
              type="checkbox"
              checked={updateForm.is_available}
              onChange={(e) =>
                setUpdateForm((prev) => ({
                  ...prev,
                  is_available: e.target.checked,
                }))
              }
              className="h-4 w-4 text-primary-blue border-gray-300 rounded"
            />
            <label htmlFor="is_available" className="ml-2 text-sm text-gray-700">
              Product is available
            </label>
          </div>

          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition disabled:opacity-60"
            >
              {isUpdating ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AdminDashboard;

