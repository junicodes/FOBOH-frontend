/**
 * Unit tests for frontend price preview calculation logic
 * Tests all calculation scenarios and edge cases
 * Matches backend calculation logic
 */

import {
  calculatePricePreview,
  calculateBatchPricePreview,
  validateCalculationParams,
  PricePreviewParams,
} from "../calculatePricePreview";

describe("calculatePricePreview", () => {
  describe("Fixed Adjustment - Increase", () => {
    it("should calculate fixed increase correctly", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "fixed",
        adjustmentValue: 20,
        incrementType: "increase",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(120);
      expect(result.basePrice).toBe(100);
      expect(result.adjustment).toBe(20);
    });

    it("should handle decimal base prices", () => {
      const params: PricePreviewParams = {
        basePrice: 99.99,
        adjustmentType: "fixed",
        adjustmentValue: 10.50,
        incrementType: "increase",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(110.49);
    });

    it("should round to 2 decimal places", () => {
      const params: PricePreviewParams = {
        basePrice: 100.123,
        adjustmentType: "fixed",
        adjustmentValue: 20.456,
        incrementType: "increase",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(120.58); // Rounded from 120.579
    });
  });

  describe("Fixed Adjustment - Decrease", () => {
    it("should calculate fixed decrease correctly", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "fixed",
        adjustmentValue: 20,
        incrementType: "decrease",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(80);
      expect(result.adjustment).toBe(-20);
    });

    it("should clamp to 0 when decrease exceeds base price", () => {
      const params: PricePreviewParams = {
        basePrice: 50,
        adjustmentType: "fixed",
        adjustmentValue: 100,
        incrementType: "decrease",
      };

      // Should throw error during validation
      expect(() => calculatePricePreview(params)).toThrow(
        "Fixed decrease amount cannot exceed base price"
      );
    });

    it("should handle decrease that results in exactly 0", () => {
      const params: PricePreviewParams = {
        basePrice: 50,
        adjustmentType: "fixed",
        adjustmentValue: 50,
        incrementType: "decrease",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(0);
      expect(result.adjustment).toBe(-50);
    });
  });

  describe("Dynamic Adjustment - Increase", () => {
    it("should calculate percentage increase correctly", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "dynamic",
        adjustmentValue: 20,
        incrementType: "increase",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(120); // 100 + (20% of 100) = 100 + 20 = 120
      expect(result.adjustment).toBe(20);
    });

    it("should handle 100% increase", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "dynamic",
        adjustmentValue: 100,
        incrementType: "increase",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(200); // 100 + (100% of 100) = 100 + 100 = 200
      expect(result.adjustment).toBe(100);
    });

    it("should handle decimal percentages", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "dynamic",
        adjustmentValue: 12.5,
        incrementType: "increase",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(112.5); // 100 + (12.5% of 100) = 100 + 12.5 = 112.5
    });

    it("should reject percentage > 100%", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "dynamic",
        adjustmentValue: 150,
        incrementType: "increase",
      };

      expect(() => calculatePricePreview(params)).toThrow(
        "Percentage adjustment cannot exceed 100%"
      );
    });
  });

  describe("Dynamic Adjustment - Decrease", () => {
    it("should calculate percentage decrease correctly", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "dynamic",
        adjustmentValue: 20,
        incrementType: "decrease",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(80); // 100 - (20% of 100) = 100 - 20 = 80
      expect(result.adjustment).toBe(-20);
    });

    it("should handle 100% decrease (results in 0)", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "dynamic",
        adjustmentValue: 100,
        incrementType: "decrease",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(0); // 100 - (100% of 100) = 100 - 100 = 0
      expect(result.adjustment).toBe(-100);
    });

    it("should reject percentage decrease > 100%", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "dynamic",
        adjustmentValue: 150,
        incrementType: "decrease",
      };

      // Should throw error during validation
      expect(() => calculatePricePreview(params)).toThrow(
        "Percentage decrease cannot exceed 100%"
      );
    });
  });

  describe("Edge Cases - Validation", () => {
    it("should reject negative base price", () => {
      const params: PricePreviewParams = {
        basePrice: -10,
        adjustmentType: "fixed",
        adjustmentValue: 20,
        incrementType: "increase",
      };

      expect(() => calculatePricePreview(params)).toThrow(
        "Base price must be a valid positive number"
      );
    });

    it("should reject NaN base price", () => {
      const params: PricePreviewParams = {
        basePrice: NaN,
        adjustmentType: "fixed",
        adjustmentValue: 20,
        incrementType: "increase",
      };

      expect(() => calculatePricePreview(params)).toThrow(
        "Base price must be a valid positive number"
      );
    });

    it("should reject negative adjustment value", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "fixed",
        adjustmentValue: -10,
        incrementType: "increase",
      };

      expect(() => calculatePricePreview(params)).toThrow(
        "Adjustment value must be a valid positive number"
      );
    });

    it("should reject NaN adjustment value", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "fixed",
        adjustmentValue: NaN,
        incrementType: "increase",
      };

      expect(() => calculatePricePreview(params)).toThrow(
        "Adjustment value must be a valid positive number"
      );
    });

    it("should handle zero base price", () => {
      const params: PricePreviewParams = {
        basePrice: 0,
        adjustmentType: "fixed",
        adjustmentValue: 20,
        incrementType: "increase",
      };

      // Zero is technically valid, but let's test it
      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(20); // 0 + 20 = 20
    });

    it("should reject zero adjustment value", () => {
      const params: PricePreviewParams = {
        basePrice: 100,
        adjustmentType: "fixed",
        adjustmentValue: 0,
        incrementType: "increase",
      };

      // Zero adjustment value should be rejected
      expect(() => calculatePricePreview(params)).toThrow(
        "Adjustment value must be a valid positive number"
      );
    });
  });

  describe("Price Clamping", () => {
    it("should never return negative price", () => {
      const params: PricePreviewParams = {
        basePrice: 10,
        adjustmentType: "fixed",
        adjustmentValue: 5,
        incrementType: "decrease",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Rounding", () => {
    it("should round to 2 decimal places", () => {
      const params: PricePreviewParams = {
        basePrice: 100.111,
        adjustmentType: "fixed",
        adjustmentValue: 20.222,
        incrementType: "increase",
      };

      const result = calculatePricePreview(params);
      // Should be rounded to 2 decimal places
      expect(result.newPrice).toBe(120.33);
    });

    it("should handle rounding edge cases", () => {
      const params: PricePreviewParams = {
        basePrice: 100.005,
        adjustmentType: "fixed",
        adjustmentValue: 20.005,
        incrementType: "increase",
      };

      const result = calculatePricePreview(params);
      expect(result.newPrice).toBe(120.01); // Rounded from 120.01
    });
  });
});

describe("validateCalculationParams", () => {
  it("should return null for valid params", () => {
    const params: PricePreviewParams = {
      basePrice: 100,
      adjustmentType: "fixed",
      adjustmentValue: 20,
      incrementType: "increase",
    };

    const error = validateCalculationParams(params);
    expect(error).toBeNull();
  });

  it("should return error for negative base price", () => {
    const params: PricePreviewParams = {
      basePrice: -10,
      adjustmentType: "fixed",
      adjustmentValue: 20,
      incrementType: "increase",
    };

    const error = validateCalculationParams(params);
    expect(error).toBe("Base price must be a valid positive number");
  });

  it("should return error for negative adjustment value", () => {
    const params: PricePreviewParams = {
      basePrice: 100,
      adjustmentType: "fixed",
      adjustmentValue: -10,
      incrementType: "increase",
    };

    const error = validateCalculationParams(params);
    expect(error).toBe("Adjustment value must be a valid positive number");
  });

  it("should return error for percentage > 100%", () => {
    const params: PricePreviewParams = {
      basePrice: 100,
      adjustmentType: "dynamic",
      adjustmentValue: 150,
      incrementType: "increase",
    };

    const error = validateCalculationParams(params);
    expect(error).toBe("Percentage adjustment cannot exceed 100%");
  });

  it("should return error for fixed decrease > base price", () => {
    const params: PricePreviewParams = {
      basePrice: 50,
      adjustmentType: "fixed",
      adjustmentValue: 100,
      incrementType: "decrease",
    };

    const error = validateCalculationParams(params);
    expect(error).toBe("Fixed decrease amount cannot exceed base price");
  });
});

describe("calculateBatchPricePreview", () => {
  it("should calculate previews for multiple products", () => {
    const products = [
      { id: 1, globalWholesalePrice: 100 },
      { id: 2, globalWholesalePrice: 200 },
      { id: 3, globalWholesalePrice: 50 },
    ];

    const adjustmentParams = {
      adjustmentType: "fixed" as const,
      adjustmentValue: 20,
      incrementType: "increase" as const,
    };

    const results = calculateBatchPricePreview(products, adjustmentParams);

    expect(results).toHaveLength(3);
    expect(results[0].newPrice).toBe(120);
    expect(results[1].newPrice).toBe(220);
    expect(results[2].newPrice).toBe(70);
  });

  it("should handle invalid product prices", () => {
    const products = [
      { id: 1, globalWholesalePrice: 100 },
      { id: 2, globalWholesalePrice: 0 }, // Invalid
      { id: 3, globalWholesalePrice: -10 }, // Invalid
    ];

    const adjustmentParams = {
      adjustmentType: "fixed" as const,
      adjustmentValue: 20,
      incrementType: "increase" as const,
    };

    const results = calculateBatchPricePreview(products, adjustmentParams);

    expect(results).toHaveLength(3);
    expect(results[0].newPrice).toBe(120);
    expect(results[1].error).toBe("Invalid product price");
    expect(results[2].error).toBe("Invalid product price");
  });

  it("should handle calculation errors gracefully", () => {
    const products = [
      { id: 1, globalWholesalePrice: 100 },
      { id: 2, globalWholesalePrice: 50 },
    ];

    const adjustmentParams = {
      adjustmentType: "fixed" as const,
      adjustmentValue: 100, // Will cause error for decrease
      incrementType: "decrease" as const,
    };

    const results = calculateBatchPricePreview(products, adjustmentParams);

    expect(results).toHaveLength(2);
    expect(results[0].error).toBeDefined(); // Error for first product
    expect(results[1].newPrice).toBe(0); // Second product: 50 - 100 = clamped to 0
  });
});
