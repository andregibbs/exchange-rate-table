import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExchangeRateTable() {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [filter, setFilter] = useState('');

  const fetchAllData = () => {
    const endpoints = [
      'https://api.currencyfreaks.com/latest?apikey=d2d6339b576a429a9b4de6c5e04512ac&symbols=GBP,EUR,USD',
      'https://api.currencyfreaks.com/v2.0/supported-currencies'
    ];
  
    Promise.all(endpoints.map(endpoint => axios.get(endpoint)))
      .then(responses => {
        const exchangeRatesResponse = responses[0].data;
        const countryDataResponse = responses[1].data;
  
        console.log('Exchange Rates API response:', exchangeRatesResponse);
        console.log('Country Data API response:', countryDataResponse);
        
        const exchangeRatesData = exchangeRatesResponse.rates;
  
        const formattedRates = Object.keys(exchangeRatesData).map(currency => {
          const countryName = countryDataResponse[currency]?.country || 'Unknown';
  
          return {
            country: countryName,
            currency,
            rate: exchangeRatesData[currency]
          };
        });
  
        setExchangeRates(formattedRates);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const filteredRates = exchangeRates.filter(rate =>
    rate.country.toLowerCase().includes(filter.toLowerCase()) ||
    rate.currency.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="What is your destination country or Currency"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#212644', color: '#ffffff' }}>
            <th>Country</th>
            <th>Currency</th>
            <th>Exchange Rate</th>
          </tr>
        </thead>
        <tbody>
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
