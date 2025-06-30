import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { carsAPI } from "../../../../Features/car/carsAPI";
import { toast } from "sonner";

type CreateCarInputs = {
    carModel: string;
    year: string;
    color: string;
    rentalRate: string;
    availability: boolean;
    locationID: number;
};

const schema = yup.object({
    carModel: yup.string().max(75, "Max 75 characters").required("Car Model is required"),
    year: yup.string().required("Year is required"),
    color: yup.string().max(75, "Max 75 characters").required("Color is required"),
    rentalRate: yup.string().max(75, "Max 75 characters").required("Rental Rate is required"),
    availability: yup.boolean().default(true),
    locationID: yup.number().required("Location ID is required").positive("Location ID must be a positive number").integer("Location ID must be an integer"),

});

const CreateCars = () => {
    const [createCar, { isLoading }] = carsAPI.useCreateCarMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateCarInputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<CreateCarInputs> = async (data) => {
        try {
            await createCar(data).unwrap();
            // console.log("Car created successfully:", response);
            toast.success("Car created successfully!");
            reset(); // Clear the form after successful submission
            (document.getElementById('my_modal_5') as HTMLDialogElement)?.close();

        } catch (error) {
            console.error("Error creating car:", error);
            toast.error("Failed to create car. Please try again.");

        }
    };

    return (
        <dialog id="my_modal_5" className="modal sm:modal-middle">
            <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">

                <h3 className="font-bold text-lg mb-4">Create New Car</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <input
                        type="text"
                        {...register("carModel")}
                        placeholder="Car Model"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"

                    />
                    {errors.carModel && (
                        <span className="text-sm text-red-700">{errors.carModel.message}</span>
                    )}

                    <input
                        type="date"
                        {...register("year")}
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />
                    {errors.year && (
                        <span className="text-sm text-red-700">{errors.year.message}</span>
                    )}
                    
                    <input
                        type="text"
                        {...register("color")}
                        placeholder="Color"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"

                    />
                    {errors.color && (
                        <span className="text-sm text-red-700">{errors.color.message}</span>
                    )}
                    <input
                        type="text"
                        {...register("rentalRate")}
                        placeholder="Rental Rate"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"

                    />
                    {errors.rentalRate && (
                        <span className="text-sm text-red-700">{errors.rentalRate.message}</span>
                    )}

                    <input
                        type="number"
                        {...register("locationID")}
                        placeholder="Location ID"
                        className="input rounded w-full p-2 focus:ring-2 focus:ring-blue-500 text-lg bg-white text-gray-800"
                    />

                    {errors.locationID && (
                        <span className="text-sm text-red-700">{errors.locationID.message}</span>
                    )}

                    

                    <div className="form-control">
                        <label className="label cursor-pointer">
                            <span className="label-text mr-4 text-white">Availability</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        value="true"
                                        {...register("availability")}
                                        className="radio radio-primary text-green-400"
                                        defaultChecked
                                    />
                                    True
                                </label>
                                <label className="flex items-center gap-1">
                                    <input
                                        type="radio"
                                        value="false"
                                        {...register("availability")}
                                        className="radio radio-primary  text-yellow-400"
                                    />
                                    False
                                </label>
                            </div>
                        </label>
                    </div>
                    {errors.availability && (
                        <span className="text-sm text-red-700">{errors.availability.message}</span>
                    )}

                    <div className="modal-action">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner text-primary" /> Creating...
                                </>
                            ) : "Create"}
                        </button>
                        <button
                            className="btn"
                            type="button"
                            onClick={() => {
                                (document.getElementById('my_modal_5') as HTMLDialogElement)?.close();
                            }}
                        >
                            Close
                        </button>

                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default CreateCars;