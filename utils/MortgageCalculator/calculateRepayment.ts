import { formatCurrency } from "../formatCurrency";

/**
 * Calculates the monthly mortgage payment.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The monthly mortgage payment.
 */
export function calculateMonthlyPayment(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): number {
  const adjustedLoanAmount = propertyPrice - deposit;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = mortgageTermInYears * 12;

  if (monthlyInterestRate === 0) {
    return adjustedLoanAmount / numberOfPayments;
  }
  if(mortgageTermInYears < 1 ){
    return 0;
  }

  const monthlyPayment =
    (adjustedLoanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return monthlyPayment;
}

/**
 * Calculates the total repayment amount.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The total repayment amount.
 */
export function calculateTotalRepayment(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): number {
  const monthlyPayment =
    calculateMonthlyPayment(propertyPrice, deposit, annualInterestRate, mortgageTermInYears);

  const totalRepayment =
    monthlyPayment * mortgageTermInYears * 12;

  return totalRepayment;
}

/**
 * Calculates the capital amount.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @returns The capital amount.
 */
export function calculateCapital(
  propertyPrice: number,
  deposit: number,
): number {
  return propertyPrice - deposit;
}

/**
 * Calculates the total interest paid.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The total interest paid.
 */
export function calculateTotalInterestPaid(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): number {
  if(mortgageTermInYears < 1 ){
    return 0;
  }
  const adjustedLoanAmount = propertyPrice - deposit;
  const totalRepayment =
    calculateTotalRepayment(propertyPrice, deposit, annualInterestRate, mortgageTermInYears);

  return totalRepayment - adjustedLoanAmount;
}

/**
 * Calculates the affordable monthly payment.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The affordable monthly payment.
 */
export function calculateAffordableMonthlyPayment(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): number {
  let increasedInterestRate = Number(annualInterestRate) + 3;
  const affordableMonthlyPayment =
    calculateMonthlyPayment(propertyPrice, deposit, increasedInterestRate, mortgageTermInYears);

  return affordableMonthlyPayment;
}

/**
 * Calculates the remaining debt over time.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The remaining debt over time.
 */
export function calculateRemainingDebt(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): object {
  const adjustedLoanAmount = propertyPrice - deposit;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  type RemainingDebtType = { [index: number]: string };
  let remainingDebt: RemainingDebtType = { 0: formatCurrency(adjustedLoanAmount, 0) };
  let paymentYear = 1;
  let paymentsMade: number = 0;

  const monthlyPayment = calculateMonthlyPayment(propertyPrice, deposit, annualInterestRate, mortgageTermInYears);

  for (paymentYear; paymentYear <= mortgageTermInYears; paymentYear++) {
    paymentsMade += 12;
    if (paymentYear === Number(mortgageTermInYears)) {
      remainingDebt[paymentYear] = formatCurrency(0, 0);
      continue;
    } else if(monthlyInterestRate === 0){
      const remainingBalance = adjustedLoanAmount - monthlyPayment * paymentsMade;
      remainingDebt[paymentYear] = formatCurrency(remainingBalance, 0);
      continue;
    }

    const remainingBalance =
      (adjustedLoanAmount *
        Math.pow(1 + monthlyInterestRate, paymentsMade)) - monthlyPayment / monthlyInterestRate * (Math.pow(1 + monthlyInterestRate, paymentsMade) - 1);
    remainingDebt[paymentYear] = formatCurrency(remainingBalance, 0);
  }

  return remainingDebt;
}