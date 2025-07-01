import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { customerAPI } from "../../../Features/customers/customerAPI";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";

type UpdateProfileInputs = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    image_url: string;
};

const schema = yup.object({
    firstName: yup.string().max(50, "Max 50 characters").required("First name is required"),
    lastName: yup.string().max(50, "Max 50 characters").required("Last name is required"),
    phoneNumber: yup.string().max(50, "Max 50 characters").required("Phone Number is required"),
    address: yup.string().max(50, "Max 50 characters").required("Address is required"),
    image_url: yup.string().url("Invalid URL").required("Image URL is required"),
});

interface User {
    customerID: string | number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    address?: string;
    image_url?: string;
}

interface UpdateProfileProps {
    user: User;
    refetch?: () => void;
}

const UpdateProfile = ({ user, refetch }: UpdateProfileProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [updateUser, { isLoading }] = customerAPI.useUpdateCustomerMutation(
        { fixedCacheKey: "updateUser" }
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<UpdateProfileInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            phoneNumber: user?.phoneNumber || "",
            address: user?.address || "",
            image_url: user?.image_url || "",
        },
    });

    // Update form values when user changes
    useEffect(() => {
        if (user) {
            setValue("firstName", user.firstName || "");
            setValue("lastName", user.lastName || "");
            setValue("phoneNumber", user.phoneNumber || "");
            setValue("address", user.address || "");
            setValue("image_url", user.image_url || "");
        } else {
            reset();
        }
    }, [user, setValue, reset]);


    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setImage(file);
        }
    }

    const onSubmit: SubmitHandler<UpdateProfileInputs> = async (data) => {
        try {
            console.log('Update Profile data:', data);
            let image_url = data.image_url
            // If an image file is selected, upload it and get the URL
            if (image) {
                setIsUploading(true);
                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', 'carApplication')
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/doqhz7z2t/image/upload',
                    formData
                )
                console.log("Cloudinary response:", response.data);
                setIsUploading(false);
                if (response.data && response.data.secure_url) {
                    image_url = response.data.secure_url
                } else {
                    toast.error("Image upload failed. Please try again.");
                    return;
                }
            }

            await updateUser({ customerID: Number(user.customerID), ...data, image_url }).unwrap()

            toast.success("Profile updated successfully!");
            if (refetch) {
                refetch(); // Call refetch if provided
            }
            reset();
            (document.getElementById('update_profile_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            setIsUploading(false);
            console.log("Error updating profile:", error);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    return (
        <dialog id="update_profile_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
                <h3 className="font-bold text-lg mb-4">Update Profile</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <input
                        type="text"
                        {...register("firstName")}
                        placeholder="First Name"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.firstName && (
                        <span className="text-sm text-red-700">{errors.firstName.message}</span>
                    )}

                    <input
                        type="text"
                        {...register("lastName")}
                        placeholder="Last Name"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.lastName && (
                        <span className="text-sm text-red-700">{errors.lastName.message}</span>
                    )}
                    <input
                        type="text"
                        {...register("phoneNumber")}
                        placeholder="Phone Number"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.phoneNumber && (
                        <span className="text-sm text-red-700">{errors.phoneNumber.message}</span>
                    )}
                    <input
                        type="text"
                        {...register("address")}
                        placeholder="Address"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.address && (
                        <span className="text-sm text-red-700">{errors.address.message}</span>
                    )}
                    {/* 
                    <input
                        type="text"
                        {...register("image_url")}
                        placeholder="Image URL"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.image_url && (
                        <span className="text-sm text-red-700">{errors.image_url.message}</span>
                    )} */}

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-300">Upload Image</label>
                        <input
                            type="file" // File input for image upload
                            accept="image/*" // Accept only image files - jpeg, png, etc.
                            onChange={handleImageUpload}
                            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                        />

                        {
                            image && (
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="preview"
                                    className="w-24 h-24 rounded-full object-cover mx-auto mb-2"
                                />
                            )
                        } {/* used to preview the image before uploading */} 
                        

                    </div>

                    {errors.image_url && (
                        <span className="text-sm text-red-700">{errors.image_url.message}</span>
                    )}



                    <div className="modal-action flex flex-col sm:flex-row gap-2">
                        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isLoading || isUploading}>
                            {(isLoading || isUploading) ? (
                                <>
                                    <span className="loading loading-spinner text-primary" /> Updating...
                                </>
                            ) : "Update"}
                        </button>
                        <button
                            className="btn w-full sm:w-auto"
                            type="button"
                            onClick={() => {
                                (document.getElementById('update_profile_modal') as HTMLDialogElement)?.close();
                                reset();
                            }}
                            disabled={isLoading || isUploading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default UpdateProfile;