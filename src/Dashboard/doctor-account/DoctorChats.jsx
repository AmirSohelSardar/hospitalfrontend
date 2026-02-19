import { useState, useEffect } from 'react';
import { BASE_URL, getToken } from '../../config';
import ChatWithPatient from './ChatWithPatient';
import Loading from '../../components/Loader/Loading';

const DoctorChats = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch(`${BASE_URL}/messages/doctor/patients/list`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });
                const data = await res.json();
                if (res.ok) setPatients(data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    return (
        <div className="grid md:grid-cols-3 gap-5 h-[500px]">

            {/* Patient List */}
            <div className="md:col-span-1 border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-primaryColor px-4 py-3">
                    <p className="text-white font-semibold text-sm">Patient Messages</p>
                </div>
                <div className="overflow-y-auto h-[calc(100%-48px)]">
                    {loading && <Loading />}
                    {!loading && patients.length === 0 && (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                            No patients have messaged you yet.
                        </div>
                    )}
                    {patients.map(patient => (
                        <div
                            key={patient._id}
                            onClick={() => setSelectedPatient(patient)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition
                                ${selectedPatient?._id === patient._id ? 'bg-green-50 border-l-4 border-l-primaryColor' : ''}`}
                        >
                            <img
                                src={patient.photo || 'https://via.placeholder.com/36'}
                                alt={patient.name}
                                className="w-9 h-9 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-sm text-headingColor">{patient.name}</p>
                                <p className="text-xs text-gray-400 capitalize">{patient.gender || 'patient'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2">
                {selectedPatient ? (
                    <ChatWithPatient
                        patientId={selectedPatient._id}
                        patientName={selectedPatient.name}
                        onClose={() => setSelectedPatient(null)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full border border-gray-200 rounded-xl text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-sm">Select a patient to view messages</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorChats;