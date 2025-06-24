import image from "../../assets/images/hero-img.jpeg"
import { NavLink } from 'react-router';


const Hero = () => {
  return (
    <div>
                <div
        className="hero min-h-screen"
        style={{
            backgroundImage:
            `url(${image})`,
        }}
        >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-extrabold text-gray-200">Hello there</h1>
            <p className="mb-5 text-gray-200 text-xl font-bold">
                Welcome to Deluxe Car Rental Management System. Here you will be able to find
                deluxe cars for bookings, reservation and much more.
            </p>
            <button className="btn btn-primary text-blue-200 font-bold">
              <NavLink to="/login">Get Started</NavLink></button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Hero