import React, { useState } from 'react';
import useFetchData from '../../hooks/useFetchData';
import { BASE_URL } from '../../config';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { formateDate } from '../../utils/formateDate';

// ── Prescription PDF Generator ────────────────────────────────────────────────
const generatePrescriptionPDF = (booking) => {
    // Build printable HTML and trigger browser print as PDF
    const doctorName = booking.doctor?.name || 'Doctor';
    const doctorSpec = booking.doctor?.specialization || '';
    const patientName = booking.user?.name || 'Patient';
    const patientGender = booking.user?.gender || '';
    const appointmentDate = booking.appointmentDate
        ? new Date(booking.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'N/A';
    const appointmentTime = booking.appointmentTime || 'N/A';
    const price = booking.ticketPrice || 0;
    const prescriptionNotes = booking.prescription || '';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8"/>
        <title>Prescription - ${patientName}</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Georgia', serif; color: #1a2332; background: #fff; }

            .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 12mm 15mm; }

            /* Header */
            .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 10px; border-bottom: 3px solid #0A8F6C; margin-bottom: 18px; }
            .clinic-name { font-size: 26px; font-weight: bold; color: #0A8F6C; letter-spacing: 1px; }
            .clinic-sub { font-size: 11px; color: #52606D; margin-top: 3px; }
            .rx-badge { font-size: 48px; font-weight: bold; color: #0A8F6C; opacity: 0.15; line-height: 1; }

            /* Doctor info */
            .doctor-section { background: #f0fdf8; border-left: 4px solid #0A8F6C; padding: 10px 14px; border-radius: 0 8px 8px 0; margin-bottom: 18px; }
            .doctor-name { font-size: 16px; font-weight: bold; color: #1a2332; }
            .doctor-spec { font-size: 12px; color: #0A8F6C; font-style: italic; margin-top: 2px; }

            /* Patient + booking info */
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 22px; }
            .info-box { border: 1px solid #d1fae5; border-radius: 8px; padding: 10px 14px; }
            .info-box h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #0A8F6C; margin-bottom: 6px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 12px; }
            .info-label { color: #52606D; }
            .info-value { font-weight: bold; color: #1a2332; }

            /* Prescription area */
            .rx-section { margin-bottom: 22px; }
            .rx-title { font-size: 14px; font-weight: bold; color: #1a2332; border-bottom: 1px dashed #0A8F6C; padding-bottom: 6px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
            .rx-symbol { font-size: 20px; color: #0A8F6C; font-weight: bold; }
            .rx-content { min-height: 120px; padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 13px; line-height: 1.7; white-space: pre-wrap; color: #1a2332; }
            .rx-empty { color: #9ca3af; font-style: italic; }

            /* Payment badge */
            .paid-badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 20px; border: 1px solid #bbf7d0; }

            /* Footer */
            .footer { margin-top: 30px; padding-top: 14px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: flex-end; }
            .signature-line { border-top: 1px solid #1a2332; width: 140px; text-align: center; padding-top: 4px; font-size: 11px; color: #52606D; }
            .footer-note { font-size: 10px; color: #9ca3af; max-width: 250px; text-align: right; line-height: 1.5; }
            .watermark { text-align: center; margin-top: 20px; font-size: 10px; color: #d1d5db; letter-spacing: 2px; }

            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .page { padding: 8mm 12mm; }
            }
        </style>
    </head>
    <body>
        <div class="page">

            <!-- Header -->
            <div class="header">
                <div>
                    <div class="clinic-name">+ Lifeline Hospital</div>
                    <div class="clinic-sub">Medical Appointment & Healthcare Services</div>
                    <div class="clinic-sub" style="margin-top:4px;">📞 +91 90830 12008 &nbsp;|&nbsp; ✉ support@lifelinehospital.com</div>
                </div>
                <div class="rx-badge">Rx</div>
            </div>

            <!-- Doctor -->
            <div class="doctor-section">
                <div class="doctor-name">Dr. ${doctorName}</div>
                <div class="doctor-spec">${doctorSpec ? doctorSpec.charAt(0).toUpperCase() + doctorSpec.slice(1) : ''}</div>
            </div>

            <!-- Patient & Booking Info -->
            <div class="info-grid">
                <div class="info-box">
                    <h4>Patient Information</h4>
                    <div class="info-row">
                        <span class="info-label">Name</span>
                        <span class="info-value">${patientName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Gender</span>
                        <span class="info-value">${patientGender ? patientGender.charAt(0).toUpperCase() + patientGender.slice(1) : 'N/A'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Email</span>
                        <span class="info-value" style="font-size:11px">${booking.user?.email || 'N/A'}</span>
                    </div>
                </div>
                <div class="info-box">
                    <h4>Appointment Details</h4>
                    <div class="info-row">
                        <span class="info-label">Date</span>
                        <span class="info-value">${appointmentDate}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Time</span>
                        <span class="info-value">${appointmentTime}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Fee Paid</span>
                        <span class="info-value">₹${price}</span>
                    </div>
                    <div class="info-row" style="margin-top:6px">
                        <span class="info-label">Status</span>
                        <span class="paid-badge">✓ PAID</span>
                    </div>
                </div>
            </div>

            <!-- Prescription -->
            <div class="rx-section">
                <div class="rx-title">
                    <span class="rx-symbol">℞</span>
                    Prescription & Notes
                </div>
                <div class="rx-content">
                    ${prescriptionNotes
                        ? prescriptionNotes
                        : '<span class="rx-empty">No prescription notes provided by doctor yet. Please consult your doctor for medication details.</span>'
                    }
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div>
                    <div class="signature-line">Dr. ${doctorName}</div>
                </div>
                <div class="footer-note">
                    This is a computer-generated prescription from Lifeline Health Platform.
                    Valid for consultation reference only.
                </div>
            </div>

            <div class="watermark">Lifeline HEALTH PLATFORM — OFFICIAL PRESCRIPTION</div>
        </div>
    </body>
    </html>`;

    // Open print dialog
    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => {
        win.print();
    }, 500);
};

// ── Main Component ────────────────────────────────────────────────────────────
const MyBookings = () => {
    const { data: bookings, loading, error } = useFetchData(`${BASE_URL}/users/appointments/my-appointments`);

    return (
        <div>
            {loading && <Loading />}
            {error && <Error errMessage={error} />}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    {bookings?.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <p className="text-lg">No bookings yet.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Booked On</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                                    <th className="py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prescription</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings?.map(booking => (
                                    <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="py-3 px-2 font-medium text-headingColor">
                                            {booking.doctor?.name}
                                        </td>
                                        <td className="py-3 px-2 text-textColor capitalize">
                                            {booking.user?.gender || 'N/A'}
                                        </td>
                                        <td className="py-3 px-2">
                                            {booking.isPaid ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-semibold">
                                                    Unpaid
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-2 font-semibold text-headingColor">
                                            ₹{booking.ticketPrice}
                                        </td>
                                        <td className="py-3 px-2 text-textColor">
                                            {formateDate(booking.createdAt)}
                                        </td>
                                        <td className="py-3 px-2 text-textColor">
                                            {booking.appointmentDate
                                                ? new Date(booking.appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                                : 'N/A'}
                                        </td>
                                        <td className="py-3 px-2 text-textColor">
                                            {booking.appointmentTime || 'N/A'}
                                        </td>
                                        <td className="py-3 px-2">
                                            {booking.isPaid ? (
                                                <button
                                                    onClick={() => generatePrescriptionPDF(booking)}
                                                    className="flex items-center gap-1 bg-primaryColor hover:bg-opacity-90 text-white text-xs font-semibold px-3 py-2 rounded-lg transition shadow-sm whitespace-nowrap"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                    </svg>
                                                    Download
                                                </button>
                                            ) : (
                                                <span className="text-gray-300 text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyBookings;