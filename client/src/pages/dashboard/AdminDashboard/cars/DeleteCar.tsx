import { toast } from "sonner";
import { carsAPI, type TCar } from "../../../../Features/car/carsAPI";

type DeleteCarProps = {
    car: TCar | null;
};

const DeleteCar = ({ car }: DeleteCarProps) => {
    const [deleteCar, { isLoading }] = carsAPI.useDeleteCarMutation(
        { fixedCacheKey: "deleteCar" } //used to prevent cache invalidation issues - in simple terms, it helps to keep the cache consistent
    );

    const handleDelete = async () => {
        try {
            if (!car) {
                toast.error("No car selected for deletion.");
                return;
            }
            await deleteCar(car.carID);
            toast.success("Car deleted successfully!");
            (document.getElementById('delete_modal') as HTMLDialogElement)?.close();

        } catch (error) {
            console.error("Error deleting car:", error);
            toast.error("Failed to delete car. Please try again.");

        }
    };

    return (
        <dialog id="delete_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">

                <h3 className="font-bold text-lg mb-4">Delete Car</h3>
                <p className="mb-6">
                    Are you sure you want to delete <span className="font-semibold">{car?.carModel}</span>?
                </p>
                <div className="modal-action flex gap-4">
                    <button
                        className="btn btn-error"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner text-primary" /> Deleting...
                            </>
                        ) : "Yes, Delete"}
                    </button>
                    <button
                        className="btn"
                        type="button"
                        onClick={() => (document.getElementById('delete_modal') as HTMLDialogElement)?.close()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default DeleteCar;