import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../../context/AuthContext';
import { BASE_URL, getToken } from '../../config';

const CheckoutSuccess = () => {
  const { dispatch } = useContext(authContext);

  // FIX: After Stripe redirects here, re-fetch user profile and update
  // auth context so isPremiumUser = true reflects immediately without re-login
  useEffect(() => {
    const refreshUserProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/profile/me`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const data = await res.json();
        if (res.ok && data.data) {
          // Update auth context with fresh user data including isPremiumUser: true
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: data.data,
              token: getToken(),
              role: data.data.role,
              userId: data.data._id,
              isPremiumUser: data.data.isPremiumUser || false,
            }
          });
        }
      } catch (err) {
        console.error('Failed to refresh user profile:', err);
      }
    };

    // Only refresh if user is logged in
    if (getToken()) {
      refreshUserProfile();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">

        {/* Success checkmark */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-[22px] font-bold mt-4 text-headingColor text-center">
          Payment Successful! 🎉
        </h2>

        <p className="text-textColor text-center mt-2 text-[15px]">
          Thank you for using Lifeline Hospital.
        </p>

        {/* Show premium badge if applicable */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <span className="text-[14px] font-semibold text-yellow-700">
            👑 You are now a Premium Member!
          </span>
          <p className="text-[12px] text-yellow-600 mt-1">
            Chat with doctors and access exclusive features are now unlocked.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/users/profile/me"
            className="bg-primaryColor hover:bg-opacity-90 text-white font-semibold py-3 px-4 rounded-lg text-center transition"
          >
            Go to My Profile
          </Link>
          <Link
            to="/home"
            className="border border-primaryColor text-primaryColor font-semibold py-3 px-4 rounded-lg text-center hover:bg-primaryColor hover:text-white transition"
          >
            Go Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;