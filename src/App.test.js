import React from 'react';
import { render } from '@testing-library/react';
import ExchangeRateTable from './App';

describe('ExchangeRateTable component', () => {
  it('renders without crashing', () => {
    render(<ExchangeRateTable />);
  });

  it('renders input field and table headers', () => {
    const { getByPlaceholderText, getByText } = render(<ExchangeRateTable />);
    expect(getByPlaceholderText('What is your destination Country or Currency')).toBeInTheDocument();
    expect(getByText('Country')).toBeInTheDocument();
    expect(getByText('Currency')).toBeInTheDocument();
    expect(getByText('Exchange Rate')).toBeInTheDocument();
  });

  // Performance tests
  it('loads data and renders the table within a reasonable time', async () => {
    const startTime = performance.now();
    render(<ExchangeRateTable />);
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThanOrEqual(3000); // Adjust the threshold as needed
  });
});
