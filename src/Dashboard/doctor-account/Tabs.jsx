import React, { useContext, useState } from 'react';
import { BiMenu } from 'react-icons/bi';
import { authContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const Tabs = ({ tab, setTab }) => {
    const { dispatch } = useContext(authContext);
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        toast.success('Logged out successfully');
        navigate('/');
    };

    const handleTabChange = (tabName) => {
        setTab(tabName);
        setMobileMenuOpen(false); // close menu after selecting tab
    };

    return (
        <div>
            {/* Mobile hamburger button */}
            <span className='lg:hidden flex justify-end mb-3'>
                <BiMenu
                    className='w-7 h-7 cursor-pointer text-headingColor'
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                />
            </span>

            {/* Mobile dropdown menu — opens when hamburger clicked */}
            {mobileMenuOpen && (
                <div className='lg:hidden flex flex-col bg-white shadow-panelShadow rounded-md p-4 mb-5'>
                    <button
                        onClick={() => handleTabChange('overview')}
                        className={`${tab === 'overview' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => handleTabChange('appointments')}
                        className={`${tab === 'appointments' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
                    >
                        Appointments
                    </button>
                    <button
                        onClick={() => handleTabChange('chat')}
                        className={`${tab === 'chat' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
                    >
                        View Chat
                    </button>
                    <button
                        onClick={() => handleTabChange('settings')}
                        className={`${tab === 'settings' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
                    >
                        Profile
                    </button>
                    <div className="mt-5 w-full">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
                        >
                            Logout
                        </button>
                        <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">
                            Delete account
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop sidebar — exactly your original unchanged */}
            <div className='hidden lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md'>
                <button
                    onClick={() => setTab('overview')}
                    className={`${tab === 'overview' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setTab('appointments')}
                    className={`${tab === 'appointments' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
                >
                    Appointments
                </button>
                <button
                    onClick={() => setTab('chat')}
                    className={`${tab === 'chat' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
                >
                    View Chat
                </button>
                <button
                    onClick={() => setTab('settings')}
                    className={`${tab === 'settings' ? 'bg-indigo-100 text-primaryColor' : 'bg-transparent text-headingColor'} w-full btn mt-0 rounded-md`}
                >
                    Profile
                </button>
                <div className="mt-[100px] w-full">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
                    >
                        Logout
                    </button>
                    <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">
                        Delete account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Tabs;