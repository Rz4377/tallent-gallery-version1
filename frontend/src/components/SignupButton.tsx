import { useNavigate } from "react-router-dom"

export default function SignupButton(){
    const navigate = useNavigate();
    return (
        <button
            onClick={()=>navigate("/signup")}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
        >
            signup
        </button>
    )
}