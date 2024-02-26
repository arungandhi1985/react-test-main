import { calculateMonthlyPayment, calculateTotalRepayment, calculateCapital, calculateTotalInterestPaid, calculateAffordableMonthlyPayment, calculateRemainingDebt } from "./calculateRepayment";
import { formatCurrency } from "../formatCurrency";

describe("calculateMonthlyPayment", () => {
  test("should calculate the correct monthly payment with interest", () => {
    const result = calculateMonthlyPayment(300000, 60000, 3.5, 30);
    expect(result).toBeCloseTo(1077.71, 2);
  });

  test("should calculate the correct monthly payment without interest", () => {
    const result = calculateMonthlyPayment(300000, 60000, 0, 30);
    expect(result).toBeCloseTo(666.67, 2);
  });

  test("should calculate the correct monthly payment with a different term", () => {
    const result = calculateMonthlyPayment(300000, 60000, 3.5, 15);
    expect(result).toBeCloseTo(1715.72, 2);
  });
});

describe("calculateTotalRepayment", () => {
  test("should calculate the correct total repayment amount", () => {
    const result = calculateTotalRepayment(300000, 60000, 3.5, 30);
    expect(result).toBeCloseTo(387974.61, 2);
  });

  test("should calculate the correct total repayment amount without interest", () => {
    const result = calculateTotalRepayment(300000, 60000, 0, 30);
    expect(result).toBeCloseTo(240000.00, 2);
  });

  test("should calculate the correct total repayment amount with a different term", () => {
    const result = calculateTotalRepayment(300000, 60000, 3.5, 15);
    expect(result).toBeCloseTo(308829.26, 2);
  });
});

describe("calculateCapital", () => {
  test("should calculate the correct capital amount", () => {
    const result = calculateCapital(300000, 60000);
    expect(result).toBe(240000);
  });
});

describe("calculateTotalInterestPaid", () => {
  test("should calculate the correct total interest paid", () => {
    const result = calculateTotalInterestPaid(300000, 60000, 3.5, 30);
    expect(result).toBeCloseTo(147974.61, 2);
  });

  test("should calculate the correct total interest paid without interest", () => {
    const result = calculateTotalInterestPaid(300000, 60000, 0, 30);
    expect(result).toBeCloseTo(0, 0);
  });

  test("should calculate the correct total interest paid with a different term", () => {
    const result = calculateTotalInterestPaid(300000, 60000, 3.5, 15);
    expect(result).toBeCloseTo(68829.26, 2);
  });
});

describe("calculateAffordableMonthlyPayment", () => {
  test("should calculate the correct affordable monthly payment", () => {
    const result = calculateAffordableMonthlyPayment(300000, 60000, 3.5, 30);
    expect(result).toBeCloseTo(1516.96, 2);
  });

  test("should calculate the correct affordable monthly payment without interest", () => {
    const result = calculateAffordableMonthlyPayment(300000, 60000, 0, 30);
    expect(result).toBeCloseTo(1011.85, 2);
  });

  test("should calculate the correct affordable monthly payment with a different term", () => {
    const result = calculateAffordableMonthlyPayment(300000, 60000, 3.5, 15);
    expect(result).toBeCloseTo(2090.66, 2);
  });
});

describe("calculateRemainingDebt", () => {
  test("should calculate the correct remaining debt over time", () => {
    const result = calculateRemainingDebt(300000, 60000, 3.5, 30);
    const expectedRemainingDebt = {
      0: formatCurrency(240000, 0),
      1: formatCurrency(235394, 0),
      2: formatCurrency(230624, 0),
      30: formatCurrency(0, 0)
    };
    expect(result).toMatchObject(expectedRemainingDebt);
  });

  test("should calculate the correct remaining debt over time without interest", () => {
    const result = calculateRemainingDebt(300000, 60000, 0, 30);
    const expectedRemainingDebt = {
      0: formatCurrency(240000, 0),
      1: formatCurrency(232000, 0),
      2: formatCurrency(224000, 0),
      30: formatCurrency(0, 0)
    };
    expect(result).toMatchObject(expectedRemainingDebt);
  });
});
