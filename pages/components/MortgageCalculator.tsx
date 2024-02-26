import { FormEvent, useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import { RateOfInterest } from "..";

/**
 * The results of the mortgage calculation.
 */
interface Results {
  monthlyPayment: string;
  totalRepayment: string;
  capital: string;
  interestPaid: string;
  affordableMonthlyPayment: string;
  remainingDebt: Record<string, string>;
}

/**
 * Renders a mortgage calculator component.
 *
 * @component
 * @param data - The interest data.
 * @returns {JSX.Element} The mortgage calculator component.
 */
function MortgageCalculator({ data }: { data: RateOfInterest }): JSX.Element {
  const [results, setResults] = useState<Results>({
    monthlyPayment: "",
    totalRepayment: "",
    capital: "",
    interestPaid: "",
    affordableMonthlyPayment: "",
    remainingDebt: {},
  });
  const [loanAmount, setLoanAmount] = useState<number | "">("");
  const [deposit, setDeposit] = useState<number | "">("");
  const [loanTerm, setLoanTerm] = useState<number>(15);
  const [interestRate, setInterestRate] = useState<number>(4.25);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/calculate-mortgage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loanAmount, deposit, interestRate, loanTerm }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults((previousInputs) => ({
          ...previousInputs,
          monthlyPayment: data.monthlyPayment,
          totalRepayment: data.totalRepayment,
          capital: data.capital,
          interestPaid: data.interestPaid,
          affordableMonthlyPayment: data.affordableMonthlyPayment,
          remainingDebt: data.remainingDebt,
        }));
      } else {
        // Handle error
        console.error("Failed to calculate mortgage");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  useEffect(() => {
    if (data && data.interestRate !== null) {
      setInterestRate(data.interestRate);
    }
  }, [data]);

  return (
    <Container>
      <title>Mortgage Calculator Test</title>
      <Row className="gap-x-10 pt-3">
        <Col className="border-r" md="auto">
          <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor="loanAmount">Property Price</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control
                id="loanAmount"
                data-testid="test-loanAmount"
                name="loanAmount"
                type="number"
                className="no-spinner"
                step="any"
                onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                value={loanAmount}
                required
              />
            </InputGroup>
            <Form.Label htmlFor="deposit">Deposit</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control
                id="deposit"
                data-testid="test-deposit"
                name="deposit"
                type="number"
                className="no-spinner"
                step="any"
                value={deposit}
                onChange={(e) => setDeposit(parseFloat(e.target.value))}
                required
              />
            </InputGroup>

            <Form.Label htmlFor="loanTerm">Mortgage Term</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="loanTerm"
                data-testid="test-loanTerm"
                name="loanTerm"
                type="number"
                step="any"
                min={1}
                max={40}
                value={loanTerm}
                onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                required
              />
              <InputGroup.Text>years</InputGroup.Text>
            </InputGroup>
            <Form.Label htmlFor="interestRate">Interest rate</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="interestRate"
                data-testid="test-interestRate"
                name="interestRate"
                type="number"
                step="any"
                className="no-spinner"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                required
              />
              <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>
            <Button className="w-full" variant="primary" type="submit"  data-testid="test-calculate-btn">
              Calculate
            </Button>
          </Form>
        </Col>
        {results.monthlyPayment &&
          <>
            <Col md="auto">
              <h2 className="pb-3">Results</h2>
              <Table striped>
                <tbody>
                  <tr className="border-b border-t">
                    <td>Monthly Payment</td>
                    <td data-testid="test-monthlyPayment" className="text-right">{results.monthlyPayment}</td>
                  </tr>
                  <tr className="border-b">
                    <td>Total Repayment</td>
                    <td className="text-right">{results.totalRepayment}</td>
                  </tr>
                  <tr className="border-b">
                    <td>Capital</td>
                    <td className="text-right">{results.capital}</td>
                  </tr>
                  <tr className="border-b">
                    <td>Interest</td>
                    <td className="text-right">{results.interestPaid}</td>
                  </tr>
                  <tr className="border-b">
                    <td>Affordability check</td>
                    <td className="text-right">{results.affordableMonthlyPayment}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md="auto">
              <h2 className="pb-3">Yearly Breakdown</h2>
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Remaining Debt</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(results.remainingDebt).map(([key, val], i) => (
                    <tr key={i}>
                      <td>{key}</td>
                      <td>{String(val)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </>
        }
      </Row>
    </Container>
  );
}

export default MortgageCalculator;
