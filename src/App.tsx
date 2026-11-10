import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EnterpriseTicker } from './components/EnterpriseTicker';
import { FarmSectorsShowcase } from './components/FarmSectorsShowcase';
import { ProductCatalog } from './components/ProductCatalog';
import { TrustLogisticsSection } from './components/TrustLogisticsSection';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FarmGateModal } from './components/FarmGateModal';
import { Footer } from './components/Footer';
import { Product, CartItem, ProductCategory, OrderConfirmation } from './types/farm';
import { PRODUCTS } from './data/products';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS[0], // Indigenous Kienyeji Trio
      quantity: 1,
    },
    {
      product: PRODUCTS[19], // Fractal Romanesco Cauliflower
      quantity: 1,
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFarmGateOpen, setIsFarmGateOpen] = useState(false);
  const [checkoutFulfillment, setCheckoutFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ProductCategory>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.product.stockCount, item.quantity + quantity) }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });

    setToastMessage(`Added ${quantity}× ${product.name} to harvest bag`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleStartCheckout = (fulfillment: 'pickup' | 'delivery') => {
    setCheckoutFulfillment(fulfillment);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: OrderConfirmation) => {
    setCartItems([]);
    const receipt = order.mpesaReceiptNumber ? ` Receipt: ${order.mpesaReceiptNumber}` : '';
    setToastMessage(`🎉 M-Pesa Payment Confirmed!${receipt} — Order #${order.orderId} placed successfully.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#0D381E] w-full max-w-full overflow-x-hidden">
      {/* Top Bar Navigation (Damak Farm with 8 Sector links) */}
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateSection={handleNavigateSection}
        onOpenFarmGate={() => setIsFarmGateOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {/* 1. Damak Farm Hero Section */}
        <Hero
          onShopClick={() => handleNavigateSection('catalog')}
          onExploreSectors={() => handleNavigateSection('chickens')}
          onOpenFarmGate={() => setIsFarmGateOpen(true)}
        />

        {/* 2. Enterprise Scope Ticker (8 Sectors) */}
        <EnterpriseTicker />

        {/* 3. Dedicated Homepage Sections for All 8 Types */}
        {/* Chickens, Rabbits, Guinea Fowls, Guinea Pigs, Fish, Turkeys, Ducks, Crop Produce */}
        <FarmSectorsShowcase
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={handleAddToCart}
          onOpenFarmGate={() => setIsFarmGateOpen(true)}
        />

        {/* 4. Complete Searchable Farm Catalog & Filters */}
        <ProductCatalog
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={handleAddToCart}
          selectedCategoryFilter={selectedCategoryFilter}
        />

        {/* 5. Trust & Logistics Strip (47 Counties, Farm Gate, WhatsApp) */}
        <TrustLogisticsSection
          onOpenFarmGate={() => setIsFarmGateOpen(true)}
        />
      </main>

      {/* Footer (Damak Farm) */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenFarmGate={() => setIsFarmGateOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onStartCheckout={handleStartCheckout}
      />

      {/* Checkout Modal & Order Manifest (Includes full Lipa Na M-Pesa STK Push Integration) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        defaultFulfillment={checkoutFulfillment}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Farm Gate & Visiting Modal */}
      <FarmGateModal
        isOpen={isFarmGateOpen}
        onClose={() => setIsFarmGateOpen(false)}
      />

      {/* Bottom Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-90 max-w-lg w-[92%] sm:w-auto animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-auto">
          <div className="bg-[#0B3319] text-white px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold shadow-2xl border-2 border-emerald-400 flex items-center gap-3 backdrop-blur-md">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 font-black">
              ✓
            </span>
            <span className="leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
