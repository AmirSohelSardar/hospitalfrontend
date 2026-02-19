import { useContext, useState } from 'react';
import { authContext } from '../../context/AuthContext';
import MyBookings from './MyBookings';
import Profile from './Profile';
import useGetProfile from '../../hooks/useFetchData';
import { BASE_URL } from '../../config';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import Chat from '../../pages/Doctors/Chat';

const MyAccount = () => {
    const { dispatch } = useContext(authContext);
    const [tab, setTab] = useState('bookings');

    const { data: userData, loading, error } = useGetProfile(`${BASE_URL}/users/profile/me`);

    const isPremiumUser = userData?.isPremiumUser || false;

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
        try {
            const res = await fetch(`${BASE_URL}/users/${userData._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const result = await res.json();
            if (res.ok) {
                dispatch({ type: 'LOGOUT' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section>
            <div className="max-w-[1170px] px-5 mx-auto">
                {loading && <Loading />}
                {error && <Error errMessage={error} />}

                {!loading && !error && userData && (
                    <div className="grid md:grid-cols-3 gap-10">

                        {/* ── Left Sidebar ── */}
                        <div className="pb-[50px] px-[30px] rounded-md shadow-panelShadow flex flex-col items-center">
                            <div className="flex flex-col items-center mt-10">
                                <figure className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-primaryColor">
                                    <img src={userData.photo} alt="" className="w-full h-full object-cover" />
                                </figure>
                                <h3 className="text-[18px] text-headingColor font-bold leading-[30px] mt-4">
                                    {userData.name}
                                </h3>
                                {isPremiumUser && (
                                    <span className="bg-yellowColor text-white text-[12px] font-semibold px-3 py-1 rounded-full mt-1">
                                        Premium User
                                    </span>
                                )}
                                <p className="text-textColor text-[15px] leading-6 mt-2">{userData.email}</p>
                                <p className="text-textColor text-[15px] leading-6">
                                    Blood Type: <span className="font-semibold ml-1">{userData.bloodType}</span>
                                </p>
                            </div>

                            <div className="mt-[50px] w-full">
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
                                >
                                    Logout
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white"
                                >
                                    Delete account
                                </button>
                            </div>
                        </div>

                        {/* ── Right Content ── */}
                        <div className="md:col-span-2">
                            {/* Tabs */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                <button
                                    onClick={() => setTab('bookings')}
                                    className={`px-5 py-2 rounded-md font-semibold text-[14px] transition
                                        ${tab === 'bookings'
                                            ? 'bg-primaryColor text-white'
                                            : 'border border-primaryColor text-headingColor'}`}
                                >
                                    My Bookings
                                </button>

                                {/* Chat tab — only for premium users */}
                                {isPremiumUser && (
                                    <button
                                        onClick={() => setTab('chat')}
                                        className={`px-5 py-2 rounded-md font-semibold text-[14px] transition
                                            ${tab === 'chat'
                                                ? 'bg-primaryColor text-white'
                                                : 'border border-primaryColor text-headingColor'}`}
                                    >
                                        💬 Chat with Doctor
                                    </button>
                                )}

                                <button
                                    onClick={() => setTab('settings')}
                                    className={`px-5 py-2 rounded-md font-semibold text-[14px] transition
                                        ${tab === 'settings'
                                            ? 'bg-primaryColor text-white'
                                            : 'border border-primaryColor text-headingColor'}`}
                                >
                                    Profile Settings
                                </button>
                            </div>

                            {/* Tab Content */}
                            {tab === 'bookings' && <MyBookings />}

                            {tab === 'chat' && isPremiumUser && (
                                <PatientChatSelector userId={userData._id} />
                            )}

                            {tab === 'settings' && <Profile user={userData} />}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

// ── Patient picks which doctor to chat with (from their bookings) ─────────────
import { useEffect } from 'react';
import { getToken } from '../../config';

const PatientChatSelector = ({ userId }) => {
    const [bookedDoctors, setBookedDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookedDoctors = async () => {
            try {
                const res = await fetch(`${BASE_URL}/users/appointments/my-appointments`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                const data = await res.json();
                if (res.ok && data.data) {
                    // Get unique doctors from bookings
                    const seen = new Set();
                    const unique = data.data
                        .filter(b => b.isPaid && b.doctor)
                        .filter(b => {
                            if (seen.has(b.doctor._id)) return false;
                            seen.add(b.doctor._id);
                            return true;
                        })
                        .map(b => b.doctor);
                    setBookedDoctors(unique);
                    if (unique.length === 1) setSelectedDoctor(unique[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookedDoctors();
    }, []);

    if (loading) return <Loading />;

    if (bookedDoctors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <p className="text-lg font-semibold">No booked doctors yet</p>
                <p className="text-sm mt-1">You can chat with doctors after booking an appointment.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Doctor selector if multiple bookings */}
            {bookedDoctors.length > 1 && (
                <div className="flex flex-wrap gap-3 mb-5">
                    {bookedDoctors.map(doctor => (
                        <button
                            key={doctor._id}
                            onClick={() => setSelectedDoctor(doctor)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition
                                ${selectedDoctor?._id === doctor._id
                                    ? 'bg-primaryColor text-white border-primaryColor'
                                    : 'border-gray-200 text-headingColor hover:border-primaryColor'}`}
                        >
                            <img src={doctor.photo} alt="" className="w-6 h-6 rounded-full object-cover" />
                            Dr. {doctor.name}
                        </button>
                    ))}
                </div>
            )}

            {selectedDoctor && (
                <Chat doctorId={selectedDoctor._id} />
            )}

            {!selectedDoctor && bookedDoctors.length > 1 && (
                <div className="text-center text-gray-400 py-10">
                    Select a doctor above to start chatting
                </div>
            )}
        </div>
    );
};

export default MyAccount;