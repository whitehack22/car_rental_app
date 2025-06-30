import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { customerAPI, type TCustomer } from "../../../../Features/customers/customerAPI";
import { toast } from "sonner";
import { useEffect } from "react";

type ChangeRoleProps = {
    customer: TCustomer | null;
};

type ChangeRoleInputs = {
    role: "user" | "admin";
};

const schema = yup.object({
    role: yup.string().oneOf(["user", "admin"]).required("Role is required"),
});

const ChangeRole = ({ customer }: ChangeRoleProps) => {
    const [updateUser, { isLoading }] = customerAPI.useUpdateCustomerMutation(
        { fixedCacheKey: "updateCustomer" }
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ChangeRoleInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            role: customer ? (customer.role as "user" | "admin") : "user", // Default to user's current role or "user"
        },
    });

    // Update form value when user changes
    // (so the modal always shows the correct role)
    useEffect(() => {
        if (customer) {
            setValue("role", customer.role as "user" | "admin"); // Set the role based on the user object
        } else {
            reset();
        }
    }, [customer, setValue, reset]);

    const onSubmit: SubmitHandler<ChangeRoleInputs> = async (data) => {
        try {
            if (!customer) {
                toast.error("No user selected for role change.");
                return;
            }
            await updateUser({ customerID: customer.customerID, role: data.role })
            toast.success("Role updated successfully!");
            reset();
            (document.getElementById('role_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update role. Please try again.");
        }
    };

    return (
        <dialog id="role_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
                <h3 className="font-bold text-lg mb-4">
                    Change Role for {customer?.firstName} {customer?.lastName}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <label className="text-white font-semibold">Select Role:</label>
                    <select
                        {...register("role")}
                        className="select select-bordered w-full bg-white text-black dark:bg-gray-200 dark:text-black"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && (
                        <span className="text-sm text-red-700">{errors.role.message}</span>
                    )}

                    <div className="modal-action flex flex-col sm:flex-row gap-2">
                        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner text-primary" /> Updating...
                                </>
                            ) : "Update Role"}
                        </button>
                        <button
                            className="btn w-full sm:w-auto"
                            type="button"
                            onClick={() => {
                                (document.getElementById('role_modal') as HTMLDialogElement)?.close();
                                reset();
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ChangeRole;