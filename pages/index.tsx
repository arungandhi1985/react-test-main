import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Papa from 'papaparse';
import MortgageCalculator from './components/MortgageCalculator';

/**
 * The Rate of Interest data.
 */
export interface RateOfInterest {
  interestRate: number | null;
}

/**
 * Retrieves server-side props containing interest rate data.
 * @returns {Promise<{ data: RateOfInterest }>} The server-side props containing the interest rate data.
 */
export const getServerSideProps: GetServerSideProps<{ data: RateOfInterest }> = async () => {
  const url = 'https://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp?csv.x=yes&Datefrom=18/Jan/2024&Dateto=18/Feb/2024&SeriesCodes=IUMABEDR&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N';
  const response = await fetch(url);
  if (!response.ok) {
    //console.error("Failed to fetch CSV file");
    return { props: { data: { interestRate: null } } };
  }
  const csvData = await response.text();
  const parsedData: Papa.ParseResult<any> = Papa.parse(csvData, { header: true });

  const interestRateData = parsedData.data.find(findInterestRate);

  const rateOfInterest: RateOfInterest = {
    interestRate: interestRateData ? interestRateData['IUMABEDR'] : null
  };

  // Pass the data to the page via props
  return { props: { data: rateOfInterest } };
};

/**
 * Finds the interest rate in the parsed data.
 * @param data - The parsed data.
 * @returns {boolean} Whether the interest rate is found.
 */
function findInterestRate(data: any): boolean {
  return data['IUMABEDR'] !== undefined;
}

/**
 * The Home page.
 * @param data - The interest rate data.
 * @returns {JSX.Element} The Home page.
 */
export default function Home({data,}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  return (
    <div>
      <MortgageCalculator data={data} />
    </div>
  )
}
