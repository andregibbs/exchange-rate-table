import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const TableContainer = styled.div`
  overflow-x: auto;
  max-width: 100%; 

  @media (max-width: 768px) {
    display: none; 
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #212644;
    color: #ffffff;
  }

  tr {
    border-bottom: 1px solid #212644
  }

  td {
    color: #475467;
  }
`;

const MobileContainer = styled.div`
  display: none;

  h3 {
    background-color: #212644;
    color: #ffffff;
    padding: 0.5rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    display: block; 
  }
`;


const FilterContainer = styled.div`
    padding: 0.5rem;
    border-bottom: 1px solid #212644
`;

const InputContainer = styled.div`
  text-align: center;
  margin: 15px 0;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px; 
`;

export function ExchangeRateTable() {
  // State variables
  const [exchangeRates, setExchangeRates] = useState([]); // State for storing exchange rates
  const [filter, setFilter] = useState(''); // State for filter input value

  // Function to fetch data from APIs
  const fetchAllData = () => {
    const endpoints = [
      'https://api.currencyfreaks.com/latest?apikey=d2d6339b576a429a9b4de6c5e04512ac&symbols=GBP,EUR,USD',
      'https://api.currencyfreaks.com/v2.0/supported-currencies'
    ];

    // Fetch data from multiple endpoints using Promise.all
    Promise.all(endpoints.map(endpoint => axios.get(endpoint)))
      .then(responses => {
        // Extract data from responses
        const exchangeRatesResponse = responses[0].data;
        const countryDataResponse = responses[1].data;

        // Log API responses
        console.log('Exchange Rates API response:', exchangeRatesResponse);
        console.log('Country Data API response:', countryDataResponse);
        
        // Extract exchange rates data
        const exchangeRatesData = exchangeRatesResponse.rates;

        // Format exchange rates data with country names
        const formattedRates = Object.keys(exchangeRatesData).map(currency => {
          const countryName = countryDataResponse.supportedCurrenciesMap[currency]?.currencyName || 'Unknown';
          return {
              country: countryName,
              currency,
              rate: exchangeRatesData[currency]
          };
        });

        // Set formatted exchange rates to state
        setExchangeRates(formattedRates);
      })
      .catch(error => {
        // Log errors if any
        console.error('Error fetching data:', error);
      });
  };

  // Effect hook to fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filtered exchange rates based on user input
  const filteredRates = exchangeRates.filter(rate =>
    rate.country.toLowerCase().includes(filter.toLowerCase()) ||
    rate.currency.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>

      {/* Filter input */}
      <InputContainer>
        <StyledInput
          type="text"
          placeholder="What is your destination Country or Currency"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </InputContainer>

       {/* Mobile header */}
       <MobileContainer>
        <h3>Currencies</h3>
        <div>
          {filteredRates.map(rate => (
            <FilterContainer key={rate.currency}>
              <div>{rate.country}</div>
              <div>{rate.currency}</div>
              <div>{rate.rate}</div>
            </FilterContainer>
          ))}
        </div>
      </MobileContainer>


      {/* Exchange rate table */}
      <TableContainer>
        <StyledTable>
        <thead>
          {/* Table headers */}
          <tr>
            <th>Country</th>
            <th>Currency</th>
            <th>Exchange Rate</th>
          </tr>
        </thead>
        <tbody>
          {/* Render filtered rates */}
          {filteredRates.map(rate => (
            <tr key={rate.currency}>
              <td>{rate.country}</td>
              <td>{rate.currency}</td>
              <td>{rate.rate}</td>
            </tr>
          ))}
        </tbody>
        </StyledTable>
      </TableContainer>
    </div>
  );
}

export default ExchangeRateTable;
