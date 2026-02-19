import { useState, useEffect, useRef } from 'react';
import { BASE_URL, getToken } from '../../config';
import HashLoader from 'react-spinners/HashLoader';

const Chat = ({ doctorId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    // FIX: ref on the scrollable container div instead of a bottom element
    const messagesContainerRef = useRef(null);
    const pollRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${BASE_URL}/messages/${doctorId}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (res.ok) {
                setMessages(data.data || []);
                setError(null);
            }
        } catch (err) {
            setError('Could not load messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        pollRef.current = setInterval(fetchMessages, 3000);
        return () => clearInterval(pollRef.current);
    }, [doctorId]);

    // FIX: scrolls only the inner chat div, page stays still
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setSending(true);
        try {
            const res = await fetch(`${BASE_URL}/messages/send/${doctorId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ message: newMessage.trim() })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setNewMessage('');
            await fetchMessages();
        } catch (err) {
            setError(err.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const userId = localStorage.getItem('userId');

    return (
        <div className="flex flex-col h-[500px] border border-gray-200 rounded-xl overflow-hidden shadow-sm">

            {/* Header */}
            <div className="bg-primaryColor px-4 py-3 flex items-center gap-2 flex-shrink-0">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <p className="text-white font-semibold text-sm">Chat with Doctor</p>
                <span className="ml-auto text-white text-xs opacity-70">Auto-refreshes every 3s</span>
            </div>

            {/* Scrollable messages — only THIS div scrolls */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-3"
            >
                {loading && (
                    <div className="flex justify-center items-center h-full">
                        <HashLoader color="#0A8F6C" size={30} />
                    </div>
                )}

                {!loading && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                    </div>
                )}

                {messages.map((msg, index) => {
                    const isMe = msg.senderId === userId || msg.sender === userId;
                    return (
                        <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm
                                ${isMe
                                    ? 'bg-primaryColor text-white rounded-tr-sm'
                                    : 'bg-white text-headingColor rounded-tl-sm border border-gray-100'
                                }`}>
                                <p className="leading-relaxed">{msg.message}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-white opacity-70 text-right' : 'text-gray-400'}`}>
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {error && <p className="text-center text-red-400 text-xs">{error}</p>}
            </div>

            {/* Input — fixed at bottom */}
            <form onSubmit={sendMessage} className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-200 flex-shrink-0">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primaryColor"
                    disabled={sending}
                />
                <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-primaryColor text-white px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-50 transition flex items-center gap-1"
                >
                    {sending ? <HashLoader color="#fff" size={14} /> : (
                        <>Send <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></>
                    )}
                </button>
            </form>
        </div>
    );
};

export default Chat;