import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [vehicleMakes, setVehicleMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);

  useEffect(() => {
    const fetchVehicleMakes = async () => {
      const res = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
      const data = await res.json();
      setVehicleMakes(data.Results || []);
    };

    fetchVehicleMakes();

    const currentYear = new Date().getFullYear();
    const yearRange = Array.from({ length: currentYear - 2015 + 1 }, (_, i) => 2015 + i);
    setYears(yearRange);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-black">
      <h1 className="text-3xl font-bold mb-8">Car Dealer</h1> 

      <div className="w-1/2 space-y-4">
        <div>
          <label className="block text-sm font-medium">Select Vehicle Make</label> 
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full p-2 border border-black rounded-md" 
          >
            <option value="">-- Select --</option>
            {vehicleMakes.map((make) => (
              <option key={make.MakeId} value={make.MakeId}>
                {make.MakeName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Select Model Year</label> 
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2 border border-black rounded-md" 
          >
            <option value="">-- Select --</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="text-right">
          {selectedMake && selectedYear ? (
            <Link href={`/result/${selectedMake}/${selectedYear}`}>
              <button
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                Next
              </button>
            </Link>
          ) : (
            <button
              disabled
              className="px-4 py-2 rounded bg-gray-400 cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
