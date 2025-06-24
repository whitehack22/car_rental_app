import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { NavLink } from 'react-router';

const Footer = () => {
  return (
    <div>
        <footer className="footer sm:footer-horizontal bg-gray-300 text-base-content p-10">
            <nav>
                <h6 className="footer-title">Services</h6>
                <a className="link link-hover">Bookings</a>
                <a className="link link-hover">Reservation</a>
                <a className="link link-hover">Cars</a>
                <a className="link link-hover">Maintenance</a>
             </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <a className="link link-hover"><NavLink to="/about">About Us</NavLink></a>
                <a className="link link-hover">Contact</a>
                <a className="link link-hover">Jobs</a>
            </nav>
            <nav>
                <h6 className="footer-title">Social</h6>
                <div className="grid grid-flow-col gap-4">
                <a>
                            <FaTwitter className="text-2xl cursor-pointer" />
                        </a>
                        <a>
                            <FaYoutube className="text-2xl cursor-pointer" />
                        </a>
                        <a>
                            <FaFacebook className="text-2xl cursor-pointer" />
                        </a>
                </div>
            </nav>
        </footer>
    </div>
  )
}

export default Footer