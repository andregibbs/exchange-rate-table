import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      <input
        type="text"
        placeholder="What is your destination country or Currency"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      {/* Exchange rate table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {/* Table headers */}
          <tr style={{ backgroundColor: '#212644', color: '#ffffff' }}>
            <th>Country</th>
            <th>Currency</th>
            <th>Exchange Rate</th>
          </tr>
        </thead>
        <tbody>
          {/* Render filtered rates */}
          {filteredRates.map(rate => (
            <tr key={rate.currency}>
              <td style={{ color: '#475467' }}>{rate.country}</td>
              <td style={{ color: '#475467' }}>{rate.currency}</td>
              <td style={{ color: '#475467' }}>{rate.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExchangeRateTable;
