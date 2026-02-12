const UserProfile = () => {
  return (
    <div className="max-w-xl p-6 bg-white border rounded-lg">
      <h2 className="mb-4 text-xl font-semibold">
        Profile
      </h2>

      <div className="space-y-2 text-sm text-gray-700">
        <p><b>Name:</b> Karthik P</p>
        <p><b>Email:</b> karthik@gmail.com</p>
        <p><b>Skills:</b> React, JavaScript, CSS</p>
      </div>

      <button className="px-4 py-2 mt-5 text-white bg-blue-600 rounded">
        Edit Profile
      </button>
    </div>
  );
};

export default UserProfile;
