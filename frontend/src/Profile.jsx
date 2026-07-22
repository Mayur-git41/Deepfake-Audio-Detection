function Profile({ username }) {

  return (

    <div className="card mt-4 p-3">

      <h3>User Profile</h3>

      <p>
        <strong>Username:</strong>
        {username}
      </p>

      <p>
        Welcome to the Deepfake Audio Detection Dashboard.
      </p>

    </div>

  );
}

export default Profile;