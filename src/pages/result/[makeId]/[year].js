import { useEffect, useState, Suspense } from 'react';

export async function getStaticPaths() {
    try {
        const res = await fetch(`${process.env.PUBLIC_API_URL}/vehicles/GetMakesForVehicleType/car?format=json`);
        const data = await res.json();
        const makes = data.Results || [];

        const years = Array.from({ length: 11 }, (_, i) => 2015 + i);

        const paths = [];

        makes.forEach(make => {
            years.forEach(year => {
                paths.push({
                    params: { makeId: make.MakeId.toString(), year: year.toString() },
                });
            });
        });

        return {
            paths,
            fallback: false,
        };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return { paths: [], fallback: false };
    }
}

export async function getStaticProps({ params }) {
    const { makeId, year } = params;

    try {
        const vehicleRes = await fetch(
            `${process.env.PUBLIC_API_URL}/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
        );
        const vehicleData = await vehicleRes.json();

        const makeRes = await fetch(
            `${process.env.PUBLIC_API_URL}/vehicles/GetMakesForVehicleType/car?format=json`
        );
        const makeData = await makeRes.json();
        const makes = makeData.Results || [];

        const make = makes.find((make) => make.MakeId.toString() === makeId);
        const makeName = make ? make.MakeName : 'Unknown Make';

        return {
            props: {
                makeId,
                makeName,
                year,
                vehicles: vehicleData.Results || [],
            },
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            props: {
                makeId,
                makeName: 'Unknown Make',
                year,
                vehicles: [],
            },
        };
    }
}

export default function ResultPage({ makeName, year, vehicles }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (vehicles.length > 0) {
            setLoading(false);
        }
    }, [vehicles]);

    return (
        <div className="min-h-screen bg-gray-100 p-8 text-black">
            <h1 className="text-3xl font-bold text-center mb-6">
                Vehicles for {year} {makeName}
            </h1>

            <Suspense fallback={<div className="text-center text-xl">Loading vehicles...</div>}>
                {loading ? (
                    <div className="text-center text-xl">Loading vehicles...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vehicles.length > 0 ? (
                            vehicles.map(vehicle => (
                                <div key={vehicle.Model_ID} className="border rounded-lg p-4 bg-white shadow-lg">
                                    <h2 className="text-xl font-semibold">{vehicle.Model_Name}</h2>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">No vehicles found for this year and make.</p>
                        )}
                    </div>
                )}
            </Suspense>
        </div>
    );
}

