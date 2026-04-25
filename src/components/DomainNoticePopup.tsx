import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'domainNoticeDismissed';

const DomainNoticePopup: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            setVisible(true);
        }
    }, []);

    const dismiss = () => {
        localStorage.setItem(STORAGE_KEY, 'true');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={dismiss} />
            <div className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                <div className="bg-white px-6 pt-5 pb-4">
                    <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📢 Domain &amp; Email Migration Notice
                        </h3>
                        <button
                            onClick={dismiss}
                            className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                            aria-label="Dismiss"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                        From <span className="font-semibold">May 14th, 2026</span>, Obscuron will transition to new domains as <code className="bg-gray-100 rounded px-1 text-xs">obscuron.chat</code> will not be renewed:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-gray-700">
                        <li>
                            🌐 <span className="font-medium">Website:</span>{' '}
                            <a href="https://obscuron.faizath.com" className="text-indigo-600 hover:text-indigo-800 underline">obscuron.faizath.com</a>{' '}
                            <span className="text-gray-400">(formerly <em>obscuron.chat</em>)</span>
                        </li>
                        <li>
                            ⚙️ <span className="font-medium">API:</span>{' '}
                            <a href="https://obscuron-api.faizath.com" className="text-indigo-600 hover:text-indigo-800 underline">obscuron-api.faizath.com</a>{' '}
                            <span className="text-gray-400">(formerly <em>api.obscuron.chat</em>)</span>
                        </li>
                        <li>
                            📧 <span className="font-medium">Email:</span>{' '}
                            <a href="mailto:contact@obscuron.faizath.com" className="text-indigo-600 hover:text-indigo-800 underline">contact@obscuron.faizath.com</a>{' '}
                            <span className="text-gray-400">(formerly <em>contact@obscuron.chat</em>)</span>
                        </li>
                        <li>
                            🛰️ <span className="font-medium">CDN:</span>{' '}
                            <span className="text-gray-800">obscuron-cdn.faizath.com</span>{' '}
                            <span className="text-gray-400">(formerly <em>cdn.obscuron.chat</em>)</span>
                        </li>
                        <li>
                            📈 <span className="font-medium">Status Pages:</span>{' '}
                            <a href="https://status.faizath.com/status/obscuron" className="text-indigo-600 hover:text-indigo-800 underline">status.faizath.com/status/obscuron</a>{' '}
                            <span className="text-gray-400">(formerly <em>status.obscuron.chat</em>)</span>
                        </li>
                    </ul>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end">
                    <button
                        onClick={dismiss}
                        className="py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DomainNoticePopup;
