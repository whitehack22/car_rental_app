import { bookingsAPI, type TBooking } from "../../../../Features/booking/bookingsAPI"
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import CreateBookings from "./CreateBookings";
import UpdateBooking from "./UpdateBooking";
import DeleteBooking from "./DeleteBooking";


const Bookings = () => {
    const { data: bookingsData, isLoading: bookingsLoading, error: bookingError } = bookingsAPI.useGetBookingsQuery(
        undefined, // No parameters needed for fetching car
        {
            refetchOnMountOrArgChange: true, // Refetch when the component mounts or when the query arguments change 
            pollingInterval: 60000, // Poll every 60 seconds to keep data fresh - the todos will be refetched every 60 seconds to keep the data fresh
        }
    )

    // state for booking to update
    const [selectedBooking, setSelectedBooking] = useState<TBooking | null>(null);

    // state for booking to delete
    const [bookingToDelete, setBookingToDelete] = useState<TBooking | null>(null);

    const handleEdit = (booking: TBooking) => {
        setSelectedBooking(booking);
        (document.getElementById('update_modal') as HTMLDialogElement)?.showModal();

    }
    console.log("Bookings Data:", bookingsData);
    return (
        <div>
            {/* Create Booking Button */}
            <div className="flex justify-center mb-3 mt-3">
                <button
                    className="btn bg-gray-600 text-white hover:bg-gray-700 border border-gray-400 rounded-lg px-4 py-2 text-lg"
                    onClick={() => (document.getElementById('my_modal_5') as HTMLDialogElement)?.showModal()}
                >
                    Create Booking
                </button>
            </div>

            {/* Modal and form */}
            <CreateBookings />
            <UpdateBooking booking={selectedBooking} />
            <DeleteBooking booking={bookingToDelete} />


            {/* Display Bookings */}
            {bookingsLoading && <p>Loading bookings...</p>}
            {bookingError && <p className="text-red-500">Error fetching bookings</p>}
            {bookingsData && bookingsData.data && bookingsData.data.length > 0 ? (
                <div className="md:overflow-x-auto">
                    <table className="table table-xs">
                        <thead>
                            <tr className=" bg-gray-600 text-white text-md lg:text-lg">
                                <th className="px-4 py-2">Car ID</th>
                                <th className="px-4 py-2">Customer ID</th>
                                <th className="px-4 py-2">Rental Start Date</th>
                                <th className="px-4 py-2">Rental End Date</th>
                                <th className="px-4 py-2">Total Amount</th>
                                <th className="px-4 py-2">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {bookingsData.data.map((booking: TBooking) => (
                                <tr key={booking.bookingID} className="hover:bg-gray-300 border-b border-gray-400 ">
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base  ">{booking.carID}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base  ">{booking.customerID}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{new Date(booking.rentalStartDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{new Date(booking.rentalEndDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 border-r border-gray-400 lg:text-base">{booking.totalAmount}</td>
                                    {/* Actions to delete and Edit */}
                                    <td className="px-4 py-2 flex">
                                        <button className="btn btn-sm btn-primary mr-4 text-blue-500"
                                            onClick={() => handleEdit(booking)}
                                        >
                                            <FaEdit size={20} />
                                        </button>
                                        <button className="btn btn-sm btn-danger text-red-500"
                                            onClick={() => {
                                                setBookingToDelete(booking);
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
                <p>No Bookings found.</p>
            )}
        </div>
    )
}

export default Bookings