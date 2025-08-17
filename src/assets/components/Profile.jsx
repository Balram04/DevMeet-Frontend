import { useSelector } from "react-redux"
import EditProfile from "./EditProfile"

const Profile = () => {
  const user =useSelector((store)=>store.user)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <EditProfile user={user}/>
    </div>
  )
}

export default Profile  