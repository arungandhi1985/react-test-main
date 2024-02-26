import { calculateAffordableMonthlyPayment, calculateCapital, calculateMonthlyPayment, calculateRemainingDebt, calculateTotalInterestPaid, calculateTotalRepayment } from '@/utils/MortgageCalculator/calculateRepayment';
import { formatCurrency } from '@/utils/formatCurrency';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Handles the API request to calculate mortgage details.
 * 
 * @param req - The NextApiRequest object representing the incoming request.
 * @param res - The NextApiResponse object representing the outgoing response.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { loanAmount, deposit, interestRate, loanTerm } = req.body;

    const monthlyPayment = formatCurrency(calculateMonthlyPayment(loanAmount, deposit, interestRate, loanTerm));
    const totalRepayment = formatCurrency(calculateTotalRepayment(loanAmount, deposit, interestRate, loanTerm));
    const capital = formatCurrency(calculateCapital(loanAmount, deposit));
    const interestPaid = formatCurrency(calculateTotalInterestPaid(loanAmount, deposit, interestRate, loanTerm));
    const affordableMonthlyPayment = formatCurrency(calculateAffordableMonthlyPayment(loanAmount, deposit, interestRate, loanTerm));
    const remainingDebt = calculateRemainingDebt(loanAmount, deposit, interestRate, loanTerm);

    res.status(200).json({ monthlyPayment, totalRepayment, capital, interestPaid, affordableMonthlyPayment, remainingDebt});
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
