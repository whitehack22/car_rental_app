import { Link } from "react-router"
import { userDrawerData } from "./drawerData"


const UserDrawer = () => {
    return (
        <div>

            <h2 className="text-xl font-bold text-white p-4 border-b-2 border-gray-700 ">
                Dashboard Menu
            </h2>
            <ul>
                {
                    userDrawerData.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.link}
                                className="flex space-x-3 border-b-2 border-transparent hover:border-blue-400 text-white hover:bg-gray-700 p-4"
                            >
                                <item.icon size={30} />
                                <span className="text-xl text-gray-100 mb-2">{item.name}</span>
                            </Link>

                        </li>
                    ))
                }
            </ul>

        </div>
    )
}

export default UserDrawer