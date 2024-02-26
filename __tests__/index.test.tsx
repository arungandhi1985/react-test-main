import { render } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import Home, { getServerSideProps } from '../pages';
import { GetServerSidePropsContext } from 'next';

describe('Home Page', () => {
    it('renders the MortgageCalculator component with the correct props', () => {
        const { getByTestId } = render(<Home data={{ interestRate: 0 }} />);

        expect(getByTestId("test-loanAmount")).toBeInTheDocument();
        expect(getByTestId('test-deposit')).toBeInTheDocument();
        expect(getByTestId('test-loanTerm')).toBeInTheDocument();
        expect(getByTestId('test-calculate-btn')).toBeInTheDocument();

        const interestRateInput = getByTestId('test-interestRate');
        expect(interestRateInput).toBeInTheDocument();
        expect(interestRateInput).toHaveValue(0);
    });

    it('renders the MortgageCalculator component without props', () => {
        const { getByTestId } = render(<Home data={{ interestRate: null }} />);

        expect(getByTestId("test-loanAmount")).toBeInTheDocument();
        expect(getByTestId('test-deposit')).toBeInTheDocument();
        expect(getByTestId('test-loanTerm')).toBeInTheDocument();
        expect(getByTestId('test-calculate-btn')).toBeInTheDocument();

        const interestRateInput = getByTestId('test-interestRate');
        expect(interestRateInput).toBeInTheDocument();
        expect(interestRateInput).toHaveValue(4.25);
    });
});

describe('getServerSideProps', () => {
    const correctMockResponse = 'DATE,IUMABEDR\r\n31 Jan 2024,6.25\r\n';
    const incorrectMockResponse = 'DATE,IUMABDR\r\n31 Jan 2024,6.25\r\n';

    const server = setupServer();

    beforeEach(() => {
        server.listen();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    afterAll(() => {
        server.close()
    });

    it('fetches interest data successfully', async () => {
        server.use(http.get('https://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp',
            (info) => {
                return HttpResponse.text(correctMockResponse);
            },
        ));
        const context = {}; // Mock context if necessary
        const response = await getServerSideProps(context as GetServerSidePropsContext); // Type casting for test purposes

        expect(response).toEqual({
            props: {
                data: { interestRate: "6.25" },
            },
        });
    });

    it('fetches incorrect interest data', async () => {
        server.use(http.get('https://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp',
            (info) => {
                return HttpResponse.text(incorrectMockResponse);
            },
        ));

        const context = {}; // Mock context if necessary
        const response = await getServerSideProps(context as GetServerSidePropsContext); // Type casting for test purposes

        expect(response).toEqual({
            props: {
                data: { interestRate: null },
            },
        });
    });

    it('throws an error for fetching interest data', async () => {
        server.use(http.get('https://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp',
            (info) => {
                return new HttpResponse(null, { status: 400 });
            },
        ));
        
        const context = {}; // Mock context if necessary
        const response = await getServerSideProps(context as GetServerSidePropsContext); // Type casting for test purposes

        expect(response).toEqual({
            props: {
                data: { interestRate: null },
            },
        });
    });
});