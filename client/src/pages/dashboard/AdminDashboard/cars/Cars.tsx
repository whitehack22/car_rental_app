import { carsAPI, type TCar } from "../../../../Features/car/carsAPI"
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import CreateCars from "./CreateCars";
import UpdateCar from "./UpdateCar";
import DeleteCar from "./DeleteCar";


const Cars = () => {
    const { data: carsData, isLoading: carsLoading, error: carError } = carsAPI.useGetCarsQuery(
        undefined, // No parameters needed for fetching car
        {
            refetchOnMountOrArgChange: true, // Refetch when the component mounts or when the query arguments change 
            pollingInterval: 60000, // Poll every 60 seconds to keep data fresh - the todos will be refetched every 60 seconds to keep the data fresh
        }
    )

    // state for the car to update
    const [selectedCar, setSelectedCar] = useState<TCar | null>(null);

    // state for the car to delete
    const [carToDelete, setCarToDelete] = useState<TCar | null>(null);

    const handleEdit = (car: TCar) => {
        setSelectedCar(car);
        (document.getElementById('update_modal') as HTMLDialogElement)?.showModal();

    }
    console.log("Cars Data:", carsData);
    return (
        <div>
            {/* Create Car Button */}
            <div className="flex justify-center mb-3 mt-3">
                <button
                    className="btn bg-gray-600 text-white hover:bg-gray-700 border border-gray-400 rounded-lg px-4 py-2 text-lg"
                    onClick={() => (document.getElementById('my_modal_5') as HTMLDialogElement)?.showModal()}
                >
                    Create Car
                </button>
            </div>

            {/* Modal and form */}
            <CreateCars />
            <UpdateCar car={selectedCar} />
            <DeleteCar car={carToDelete} />


            {/* Display Cars */}
            {carsLoading && <p>Loading cars...</p>}
            {carError && <p className="text-red-500">Error fetching cars</p>}
            {carsData && carsData.data && carsData.data.length > 0 ? (
                <div className="md:overflow-x-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr className=" bg-gray-600 text-white text-md lg:text-lg">
                                <th className="px-4 py-2">Car Model</th>
                                <th className="px-4 py-2">Year</th>
                                <th className="px-4 py-2">Color</th>
                                <th className="px-4 py-2">Rental Rate</th>
                                <th className="px-4 py-2">Availability</th>
                                <th className="px-4 py-2">Location ID</th>
                                <th className="px-4 py-2">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {carsData.data.map((car: TCar) => (
                                <tr key={car.carID} className="hover:bg-gray-300 border-b border-gray-400 ">
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base  ">{car.carModel}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{new Date(car.year).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{car.color}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{car.rentalRate}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">
                                        <span className={`badge ${car.availability ? "badge-success" : "badge-warning"}`}>
                                            {car.availability ? (
                                                <span className="text-green-700 lg:text-base">Available</span>
                                            ) : (
                                                <span className="text-yellow-700 lg:text-base">Unavailable</span>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{car.locationID}</td>
                                    {/* Actions to delete and Edit */}
                                    <td className="px-4 py-2 flex">
                                        <button className="btn btn-sm btn-primary mr-4 text-blue-500"
                                            onClick={() => handleEdit(car)}
                                        >
                                            <FaEdit size={20} />
                                        </button>
                                        <button className="btn btn-sm btn-danger text-red-500"
                                            onClick={() => {
                                                setCarToDelete(car);
                                                (document.getElementById('delete_modal') as HTMLDialogElement)?.showModal();
                                            }}
                                        >

                                            <MdDeleteForever size={20} />
                                        </button>
                                    </td>
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

export default Cars