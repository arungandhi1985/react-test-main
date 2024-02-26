import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import MortgageCalculator from "../../pages/components/MortgageCalculator";
import { setupServer } from 'msw/node';

describe("MortgageCalculator", () => {
    const mockResponse = {
        "monthlyPayment": "£429.46",
        "totalRepayment": "£154,604.63",
        "capital": "£80,000.00",
        "interestPaid": "£74,604.63",
        "affordableMonthlyPayment": "£587.01",
        "remainingDebt": {
            "0": "£80,000",
            "1": "£78,820",
            "2": "£77,579",
            "3": "£76,275",
            "4": "£74,904",
            "5": "£73,463",
            "6": "£71,948",
            "7": "£70,356",
            "8": "£68,682",
            "9": "£66,923",
            "10": "£65,074",
            "11": "£63,130",
            "12": "£61,086",
            "13": "£58,938",
            "14": "£56,680",
            "15": "£54,307",
            "16": "£51,812",
            "17": "£49,190",
            "18": "£46,433",
            "19": "£43,536",
            "20": "£40,490",
            "21": "£37,288",
            "22": "£33,923",
            "23": "£30,385",
            "24": "£26,666",
            "25": "£22,757",
            "26": "£18,648",
            "27": "£14,329",
            "28": "£9,789",
            "29": "£5,017",
            "30": "£0",
        },
    };

    const server = setupServer(
        http.post(
            '/api/calculate-mortgage',
            (info) => {
                return HttpResponse.json(mockResponse)
            },
        )
    );

    beforeEach(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close()
    });

    test("renders the form inputs correctly", () => {
        const { getByTestId } = render(<MortgageCalculator data={{ interestRate: 0 }} />);

        expect(getByTestId("test-loanAmount")).toBeInTheDocument();
        expect(getByTestId("test-deposit")).toBeInTheDocument();
        expect(getByTestId("test-calculate-btn")).toBeInTheDocument();
        const loanTermInput = getByTestId('test-loanTerm');
        const interestRateInput = getByTestId('test-interestRate');

        expect(loanTermInput).toBeInTheDocument();
        expect(loanTermInput).toHaveValue(15);
        expect(interestRateInput).toBeInTheDocument();
        expect(interestRateInput).toHaveValue(0);
    });

    test("calculates mortgage correctly when form is submitted", async () => {
        const { getByTestId } = render(<MortgageCalculator data={{ interestRate: 0 }} />);

        act(() => {
            fireEvent.change(getByTestId("test-loanAmount"), { target: { value: "100000" } });
            fireEvent.change(getByTestId("test-deposit"), { target: { value: "20000" } });
            fireEvent.change(getByTestId('test-loanTerm'), { target: { value: "30" } });
            fireEvent.change(getByTestId('test-interestRate'), { target: { value: "5" } });
            fireEvent.click(getByTestId("test-calculate-btn"));
        });

        expect(getByTestId('test-interestRate')).toHaveValue(5);
        const monthlyPayment = await screen.findByText("£429.46");
        expect(monthlyPayment).toBeInTheDocument();
    });

    test('calculates mortgage details on form submission', async () => {
        const { getByTestId } = render(<MortgageCalculator data={{ interestRate: 5 }} />);

        act(() => {
            fireEvent.change(getByTestId("test-loanAmount"), { target: { value: '100000' } });
            fireEvent.change(getByTestId("test-deposit"), { target: { value: '20000' } });
            fireEvent.change(getByTestId("test-loanTerm"), { target: { value: '30' } });
            fireEvent.click(getByTestId("test-calculate-btn"));
        });

        await waitFor(() => {
            expect(getByTestId("test-monthlyPayment")).toBeInTheDocument();
            //expect(getByTestId("test-monthlyPayment")).toHaveValue("£429.46");
        });
    });
});