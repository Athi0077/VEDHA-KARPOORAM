/**
 * Helpers for product weight variants and dynamic pricing.
 * Keeps backward compatibility with existing products that have no weightVariants.
 */

export const getProductVariants = (product) => {
  if (!product || !Array.isArray(product.weightVariants)) return [];
  return product.weightVariants.filter(
    (v) => v && String(v.weight || '').trim() !== '' && Number(v.price) > 0
  );
};

export const getSelectedVariant = (product, selectedWeights = {}) => {
  const variants = getProductVariants(product);
  if (variants.length === 0) return null;

  const productId = product._id || product.id;
  const chosenWeight = selectedWeights[productId];
  return variants.find((v) => v.weight === chosenWeight) || variants[0];
};

export const getEffectivePricing = (product, selectedVariant) => {
  const rawPrice = selectedVariant ? selectedVariant.price : product?.price;
  const rawOriginal = selectedVariant
    ? (selectedVariant.originalPrice || product?.originalPrice)
    : product?.originalPrice;

  const price = Number(rawPrice) || 0;
  const originalPrice = rawOriginal ? Number(rawOriginal) : 0;
  const hasDiscount = originalPrice > price;
  const discount = hasDiscount ? originalPrice - price : 0;
  const discountPercent = hasDiscount ? Math.round((discount / originalPrice) * 100) : 0;

  return {
    price,
    originalPrice,
    hasDiscount,
    discount,
    discountPercent,
    weightLabel: selectedVariant ? selectedVariant.weight : null,
  };
};

export const buildCartProduct = (product, selectedVariant) => {
  const baseId = product._id || product.id;
  if (!selectedVariant) {
    return {
      ...product,
      id: baseId,
      price: Number(product.price) || 0,
    };
  }

  return {
    ...product,
    id: `${baseId}_${selectedVariant.weight}`,
    productId: baseId,
    selectedWeight: selectedVariant.weight,
    name: `${product.name} (${selectedVariant.weight})`,
    price: Number(selectedVariant.price) || 0,
    originalPrice: selectedVariant.originalPrice
      ? Number(selectedVariant.originalPrice)
      : product.originalPrice,
  };
};
