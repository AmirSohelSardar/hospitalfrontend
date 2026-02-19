import React, { useState, useEffect } from 'react';
import { BASE_URL, getToken } from '../../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import { AiOutlineClose, AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';

const EditDoctorModal = ({ doctor, onClose, onSaved }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        gender: '',
        specialization: '',
        ticketPrice: '',
        about: '',
        isApproved: '',
        qualifications: [],
        experiences: [],
        timeSlots: [],
    });

    useEffect(() => {
        if (doctor) {
            setFormData({
                name: doctor.name || '',
                email: doctor.email || '',
                phone: doctor.phone || '',
                bio: doctor.bio || '',
                gender: doctor.gender || '',
                specialization: doctor.specialization || '',
                ticketPrice: doctor.ticketPrice || '',
                about: doctor.about || '',
                isApproved: doctor.isApproved || 'pending',
                qualifications: doctor.qualifications || [],
                experiences: doctor.experiences || [],
                timeSlots: doctor.timeSlots || [],
            });
        }
    }, [doctor]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ── Array item handlers ──────────────────────────────────────────
    const addItem = (key, emptyItem) => {
        setFormData(prev => ({ ...prev, [key]: [...prev[key], emptyItem] }));
    };

    const removeItem = (key, index) => {
        setFormData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
    };

    const handleArrayChange = (key, index, e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = [...prev[key]];
            updated[index] = { ...updated[index], [name]: value };
            return { ...prev, [key]: updated };
        });
    };

    // ── Submit ───────────────────────────────────────────────────────
    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = getToken();
        try {
            const res = await fetch(`${BASE_URL}/doctors/${doctor._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message);
            toast.success('Doctor updated successfully!');
            onSaved();
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Shared input styles ─────────────────────────────────────────
    const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primaryColor text-[14px]";
    const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide";
    const tabClass = (t) => `px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition ${activeTab === t ? 'border-primaryColor text-primaryColor' : 'border-transparent text-gray-500 hover:text-gray-700'}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-[20px] font-bold text-headingColor">Edit Doctor</h2>
                        <p className="text-sm text-gray-500">{doctor?.name} — {doctor?.email}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
                        <AiOutlineClose className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 px-6 pt-3 border-b border-gray-200">
                    {['basic', 'education', 'experience', 'timeslots'].map(t => (
                        <button key={t} className={tabClass(t)} onClick={() => setActiveTab(t)}>
                            {t === 'basic' ? 'Basic Info' :
                             t === 'education' ? 'Education' :
                             t === 'experience' ? 'Experience' : 'Time Slots'}
                        </button>
                    ))}
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 px-6 py-5">

                    {/* ── BASIC INFO ── */}
                    {activeTab === 'basic' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Email (read only)</label>
                                    <input type="email" name="email" value={formData.email} className={inputClass + " bg-gray-50 cursor-not-allowed"} readOnly />
                                </div>
                                <div>
                                    <label className={labelClass}>Phone</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Ticket Price (₹)</label>
                                    <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleInputChange} className={inputClass} min="0" />
                                </div>
                                <div>
                                    <label className={labelClass}>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputClass}>
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Specialization</label>
                                    <select name="specialization" value={formData.specialization} onChange={handleInputChange} className={inputClass}>
                                        <option value="">Select</option>
                                        <option value="surgeon">Surgeon</option>
                                        <option value="neurologist">Neurologist</option>
                                        <option value="dermatologist">Dermatologist</option>
                                        <option value="cardiologist">Cardiologist</option>
                                        <option value="orthopedic surgeon">Orthopedic Surgeon</option>
                                        <option value="psychiatrist">Psychiatrist</option>
                                        <option value="gynecologist">Gynecologist</option>
                                        <option value="pediatrician">Pediatrician</option>
                                        <option value="oncologist">Oncologist</option>
                                        <option value="radiologist">Radiologist</option>
                                        <option value="endocrinologist">Endocrinologist</option>
                                        <option value="urologist">Urologist</option>
                                        <option value="ophthalmologist">Ophthalmologist</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Approval Status</label>
                                    <select name="isApproved" value={formData.isApproved} onChange={handleInputChange} className={inputClass}>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="cancelled">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Bio (max 50 chars)</label>
                                    <input type="text" name="bio" value={formData.bio} onChange={handleInputChange} maxLength={50} className={inputClass} />
                                    <p className="text-xs text-gray-400 mt-1">{formData.bio?.length || 0}/50</p>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>About</label>
                                <textarea name="about" value={formData.about} onChange={handleInputChange} rows="4" className={inputClass + " resize-none"} />
                            </div>
                        </div>
                    )}

                    {/* ── EDUCATION (Qualifications) ── */}
                    {activeTab === 'education' && (
                        <div className="space-y-4">
                            {formData.qualifications.length === 0 && (
                                <p className="text-center text-gray-400 py-6">No qualifications added yet.</p>
                            )}
                            {formData.qualifications.map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                    <button
                                        type="button"
                                        onClick={() => removeItem('qualifications', index)}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                    >
                                        <AiOutlineDelete className="w-5 h-5" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Degree</label>
                                            <input type="text" name="degree" value={item.degree || ''} onChange={(e) => handleArrayChange('qualifications', index, e)} className={inputClass} placeholder="e.g. MBBS" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>University</label>
                                            <input type="text" name="university" value={item.university || ''} onChange={(e) => handleArrayChange('qualifications', index, e)} className={inputClass} placeholder="e.g. Delhi University" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Starting Date</label>
                                            <input type="date" name="startingDate" value={item.startingDate?.substring(0, 10) || ''} onChange={(e) => handleArrayChange('qualifications', index, e)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Ending Date</label>
                                            <input type="date" name="endingDate" value={item.endingDate?.substring(0, 10) || ''} onChange={(e) => handleArrayChange('qualifications', index, e)} className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addItem('qualifications', { degree: '', university: '', startingDate: '', endingDate: '' })}
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                            >
                                <AiOutlinePlus /> Add Qualification
                            </button>
                        </div>
                    )}

                    {/* ── EXPERIENCE ── */}
                    {activeTab === 'experience' && (
                        <div className="space-y-4">
                            {formData.experiences.length === 0 && (
                                <p className="text-center text-gray-400 py-6">No experiences added yet.</p>
                            )}
                            {formData.experiences.map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                    <button
                                        type="button"
                                        onClick={() => removeItem('experiences', index)}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                    >
                                        <AiOutlineDelete className="w-5 h-5" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Position</label>
                                            <input type="text" name="position" value={item.position || ''} onChange={(e) => handleArrayChange('experiences', index, e)} className={inputClass} placeholder="e.g. Senior Doctor" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Hospital</label>
                                            <input type="text" name="hospital" value={item.hospital || ''} onChange={(e) => handleArrayChange('experiences', index, e)} className={inputClass} placeholder="e.g. AIIMS Delhi" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Starting Date</label>
                                            <input type="date" name="startingDate" value={item.startingDate?.substring(0, 10) || ''} onChange={(e) => handleArrayChange('experiences', index, e)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Ending Date</label>
                                            <input type="date" name="endingDate" value={item.endingDate?.substring(0, 10) || ''} onChange={(e) => handleArrayChange('experiences', index, e)} className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addItem('experiences', { position: '', hospital: '', startingDate: '', endingDate: '' })}
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                            >
                                <AiOutlinePlus /> Add Experience
                            </button>
                        </div>
                    )}

                    {/* ── TIME SLOTS ── */}
                    {activeTab === 'timeslots' && (
                        <div className="space-y-4">
                            {formData.timeSlots.length === 0 && (
                                <p className="text-center text-gray-400 py-6">No time slots added yet. Add slots so patients can book appointments.</p>
                            )}
                            {formData.timeSlots.map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                                    <button
                                        type="button"
                                        onClick={() => removeItem('timeSlots', index)}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                    >
                                        <AiOutlineDelete className="w-5 h-5" />
                                    </button>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className={labelClass}>Day</label>
                                            <select name="day" value={item.day || ''} onChange={(e) => handleArrayChange('timeSlots', index, e)} className={inputClass}>
                                                <option value="">Select Day</option>
                                                <option value="monday">Monday</option>
                                                <option value="tuesday">Tuesday</option>
                                                <option value="wednesday">Wednesday</option>
                                                <option value="thursday">Thursday</option>
                                                <option value="friday">Friday</option>
                                                <option value="saturday">Saturday</option>
                                                <option value="sunday">Sunday</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Start Time</label>
                                            <input type="time" name="startingTime" value={item.startingTime || ''} onChange={(e) => handleArrayChange('timeSlots', index, e)} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>End Time</label>
                                            <input type="time" name="endingTime" value={item.endingTime || ''} onChange={(e) => handleArrayChange('timeSlots', index, e)} className={inputClass} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addItem('timeSlots', { day: '', startingTime: '', endingTime: '' })}
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                            >
                                <AiOutlinePlus /> Add Time Slot
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-4 px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={submitHandler}
                        disabled={isLoading}
                        className="flex-1 bg-primaryColor text-white py-3 rounded-lg font-semibold text-[15px] disabled:opacity-70 flex items-center justify-center"
                    >
                        {isLoading ? <HashLoader color="#fff" size={20} /> : 'Save All Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold text-[15px] hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditDoctorModal;