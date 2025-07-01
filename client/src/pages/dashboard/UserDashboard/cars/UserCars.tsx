import { carsAPI, type TCar } from "../../../../Features/car/carsAPI"


const UserCars = () => {
    const { data: carsData, isLoading: carsLoading, error: carError } = carsAPI.useGetCarsQuery(
        undefined,
        {
            refetchOnMountOrArgChange: true,
            pollingInterval: 60000,
        }
    );

    // console.log("Cars Data:", carsData);
    return (
        <div className="p-4">
            {carsLoading && <p>Loading cars...</p>}
            {carError && <p className="text-red-500">Error fetching cars</p>}

            {(carsData?.data?.length ?? 0) > 0 ? (
                <div className="md:overflow-x-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr className="bg-gray-600 text-white text-md lg:text-lg">
                                <th className="px-4 py-2">Car Model</th>
                                <th className="px-4 py-2">Year</th>
                                <th className="px-4 py-2">Color</th>
                                <th className="px-4 py-2">Rental Rate</th>
                                <th className="px-4 py-2">Availability</th>
                                <th className="px-4 py-2">Location ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carsData?.data.map((car: TCar) => (
                                <tr key={car.carID} className="hover:bg-gray-300 border-b border-gray-400">
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{car.carModel}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{new Date(car.year).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{car.color}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{car.rentalRate}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                                        <span className={`badge ${car.availability ? "badge-success" : "badge-warning"}`}>
                                            {car.availability ? "Available" : "Unavailable"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{car.locationID}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No Cars found.</p>
            )}
        </div>
    )
}

export default UserCars