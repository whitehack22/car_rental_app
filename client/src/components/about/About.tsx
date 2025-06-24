import carRental from '../../assets/images/car_rental.jpeg';
const About = () => {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between gap-8 h-fit p-4 md:p-8">
                <div className="w-full md:w-1/2 flex items-center">
                    <img
                        src={carRental}
                        alt="car_rental"
                        className="w-full h-48 md:h-full object-cover rounded-lg shadow-lg"
                    />
                </div>


                <div className="w-full md:w-1/2 border-2 border-gray-300 rounded-lg p-6 md:p-8 mb-6 md:mb-0">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-600">
                        About Deluxe Car Rental
                    </h1>
                    <p className="mb-4 text-gray-700 text-base md:text-lg">
                        Deluxe Car Rental System is powerful system that allows you to find cars for hire.
                    </p>
                    <p className="mb-2 text-gray-700 text-base md:text-lg">
                        With Deluxe Car Rental you can be able to make reservations for cars at a timely manner.
                    </p>
                    <p className="text-gray-700 text-base md:text-lg">
                        You can be able to find a variety of cars for SUVs to saloon cars and even luxury vehicles.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default About