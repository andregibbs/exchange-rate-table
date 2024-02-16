import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExchangeRateTable() {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch exchange rates
        const exchangeRatesResponse = await axios.get(
          'https://api.currencyfreaks.com/latest?apikey=b9a15d23a4424ef7b6b131e2d7685475&symbols=GBP,EUR,USD'
        );
        const { rates } = exchangeRatesResponse.data;

        // Log currency codes extracted from exchange rates data
        console.log('Currency Codes:', Object.keys(rates));

        // Fetch country data
        const countryDataResponse = await axios.get(
          'https://restcountries.com/v3.1/all'
        );
        const countryData = countryDataResponse.data;

        // Map exchange rates with country names
        const formattedRates = Object.keys(rates).map(currency => {
          // Find country info by currency code
          const countryInfo = countryData.find(country => country.currencies && country.currencies[0] && country.currencies[0].code === currency);
          
          // If country info is found, extract country name
          const countryName = countryInfo ? countryInfo.name.common : 'Unknown';
          
          return {
            country: countryName,
            currency,
            rate: rates[currency],
          };
        });

        setExchangeRates(formattedRates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
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
