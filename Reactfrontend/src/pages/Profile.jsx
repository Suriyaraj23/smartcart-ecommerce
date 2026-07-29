import { useEffect, useState } from "react";
import api from "../services/api";


function Profile() {

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/users/1");
      setUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-5">

      <div className="card shadow p-4">

        <h2 className="mb-4">My Profile</h2>

        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            value={user.name}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            value={user.email}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label>Phone</label>
          <input
            className="form-control"
            value={user.phone}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label>Address</label>
          <textarea
            className="form-control"
            value={user.address}
            rows="3"
            readOnly
          />

        </div>

      </div>

    </div>
  );
}

export default Profile;