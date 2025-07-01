
import { type RootState } from "../../../app/store";
import { useDispatch, useSelector } from 'react-redux';
import { customerAPI } from "../../../Features/customers/customerAPI";
import { useNavigate } from "react-router";
import { logout } from "../../../Features/login/userSlice";
import UpdateProfile from "./UpdateProfile";




const UserProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const customer = useSelector((state: RootState) => state.customer);
    const customerID = customer.customer?.customer_id;
    // console.log('customer id', customerID)

    const { data, isLoading, error,  refetch } = customerAPI.useGetCustomerByIdQuery(customerID ?? 0, {
        skip: !customerID, // Skip the query if user_id is not available
    });

    // console.log("Customer data:", data);
    // console.log("Error:", error);

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error loading profile</p>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md h-screen">
                    <h2 className="text-xl font-semibold mb-4">User Information</h2>
                    <div className="flex flex-col items-center mb-4 gap-4 border border-gray-300 p-4 rounded">
                        <img
                            src={data?.image_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                            alt="User Avatar"
                            className="w-40 h-40 object-cover rounded-full mr-4 border-2 border-gray-400"
                        />
                        <div>
                            <h3 className="text-lg font-bold">Name: {data?.firstName} {data?.lastName}</h3>
                            <p className="text-gray-600">User ID: {data?.customerID}</p>
                            <p className="text-gray-600">Email: {data?.email}</p>
                            <p className="text-gray-600">Phone Number: {data?.phoneNumber}</p>
                            <p className="text-gray-600">Address: {data?.address}</p>
                            <p className="text-gray-600">Role: {data?.role}</p>
                            <p className="text-gray-600">Verified? {data?.isVerified ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                            className="btn btn-primary flex mx-auto"
                            onClick={() => {
                                (document.getElementById('update_profile_modal') as HTMLDialogElement)?.showModal();
                            }}
                        >
                            Update Profile
                        </button>

                        <button
                            className="btn btn-primary flex mx-auto"
                            onClick={() => {
                                dispatch(logout());
                                    navigate("/")                                
                            }}
                        >
                            LogOut
                        </button>
                    </div>

                </div>
            )}
            {/* Modal */}
            {data && <UpdateProfile user={data} refetch={refetch} />} 
        </div>
    );
}

export default UserProfile