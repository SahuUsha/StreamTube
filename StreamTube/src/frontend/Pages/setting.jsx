import React, { useState } from 'react';
import UpdatePassword from '../Commponents/UpdatePassword';
import UpdateAvatar from '../Commponents/UpdateAvatar';
import UpdateCoverImage from '../Commponents/UpdateCoverImage';
import UpdateAccount from '../Commponents/UpdateAcoount';

const Setting = () => {
  const [passwordModel, setpasswordModel] = useState(false);
  const [avatarModel, setavatarModel] = useState(false);
  const [coverImageModel, setcoverImageModel] = useState(false);
  const [accountModel, setaccountModel] = useState(false);

  return (
    <div className="min-h-screen text-white p-8 lg:px-24 md:p-12">
      <h2 className="text-3xl font-bold text-white mb-6">Account Settings</h2>
      <div className="space-y-6 w-full mx-auto ">
        <div>
          <button
            onClick={() => setpasswordModel(!passwordModel)}
            className="w-full border text-[1.2rem] border-yellow-400  bg-yellow-600 bg-opacity-5 shadow-2xl px-4 py-3 font-semibold  rounded-lg hover:bg-yellow-400 hover:text-black transition"
          >
            Change Password
          </button>
          {passwordModel && <UpdatePassword onClose={() => setpasswordModel(false)} />}
        </div>

        <div>
          <button
            onClick={() => setavatarModel(!avatarModel)}
           className="w-full border text-[1.2rem] border-yellow-400  bg-yellow-600 bg-opacity-5 shadow-2xl px-4 py-3 font-semibold  rounded-lg hover:bg-yellow-400 hover:text-black transition"
          >
            Update Avatar
          </button>
          {avatarModel && <UpdateAvatar onClose={() => setavatarModel(false)} />}
        </div>

        <div>
          <button
            onClick={() => setcoverImageModel(!coverImageModel)}
            className="w-full border text-[1.2rem] border-yellow-400  bg-yellow-600 bg-opacity-5 shadow-2xl px-4 py-3 font-semibold  rounded-lg hover:bg-yellow-400 hover:text-black transition"
          >
            Change Cover Image
          </button>
          {coverImageModel && <UpdateCoverImage onClose={() => setcoverImageModel(false)} />}
        </div>

        <div>
          <button
            onClick={() => setaccountModel(!accountModel)}
            className="w-full border text-[1.2rem] border-yellow-400  bg-yellow-600 bg-opacity-5 shadow-2xl px-4 py-3 font-semibold  rounded-lg hover:bg-yellow-400 hover:text-black transition"
          >
            Change Account Details
          </button>
          {accountModel && <UpdateAccount onClose={() => setaccountModel(false)} />}
        </div>
      </div>
    </div>
  );
};

export default Setting;
