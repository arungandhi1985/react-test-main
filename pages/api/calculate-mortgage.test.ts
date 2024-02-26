import { NextApiRequest, NextApiResponse } from 'next';
import handler from './calculate-mortgage';

describe('handler', () => {
  let req: NextApiRequest;
  let res: NextApiResponse;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        loanAmount: 100000,
        deposit: 20000,
        interestRate: 5,
        loanTerm: 30,
      },
    } as NextApiRequest;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the calculated mortgage details', () => {
    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
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
    });
  });

  it('should return error if method is not POST', () => {
    req.method = 'GET';

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method Not Allowed' });
  });
});