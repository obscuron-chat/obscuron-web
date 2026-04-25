import React, { useState, useEffect } from 'react';

import type { screenTypes, Person } from '../types';

import { secp256k1 } from '@noble/curves/secp256k1.js';
import { hexToBytes, bytesToHex } from '@noble/curves/utils.js';
import { sha3_256 } from 'js-sha3';

interface AuthScreenProps {
    hidden: boolean;
    toggleScreen: (screen: screenTypes, hidden: boolean) => void;
    chatOperator: {
        authUsername: string;
        setAuthUsername: React.Dispatch<React.SetStateAction<string>>;
        authPubkey: string;
        setAuthPubkey: React.Dispatch<React.SetStateAction<string>>;
        authPrivateKey: string;
        setAuthPrivateKey: React.Dispatch<React.SetStateAction<string>>;
        jwtToken: string;
        setjwtToken: React.Dispatch<React.SetStateAction<string>>;
        profileName: string;
        setProfileName: React.Dispatch<React.SetStateAction<string>>;
        profileImage: string;
        setProfileImage: React.Dispatch<React.SetStateAction<string>>;
        currentChat: string;
        setCurrentChat: React.Dispatch<React.SetStateAction<string>>;
        chatData: string;
        setChatData: React.Dispatch<React.SetStateAction<string>>;
        contacts: Person[];
    };
}

const AuthScreen: React.FC<AuthScreenProps> = ({ hidden, toggleScreen, chatOperator }) => {
    type Status = 'signIn' | 'signUp';
    const [authState, setAuthState] = useState<Status>('signIn');
    const updateState = () => {
        setAuthState(authState == 'signIn' ? 'signUp' : 'signIn');
    };

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    useEffect(() => {
        chatOperator.setAuthUsername(username);
    }, [username]);

    useEffect(() => {
        const hashHex = sha3_256(password);
        const privateKey = hashHex;
        const pubKeyHex = bytesToHex(secp256k1.getPublicKey(hexToBytes(privateKey), false));
        chatOperator.setAuthPubkey(pubKeyHex);
        chatOperator.setAuthPrivateKey(privateKey);
    }, [password]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(import.meta.env.VITE_BASE_API_URL + "/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, publicKey: chatOperator.authPubkey }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Auth successful:", data);

            chatOperator.setProfileName(data.data.profileName);
            chatOperator.setjwtToken(data.data.token);

            toggleScreen("auth", true);
            toggleScreen("settings", false);
        } catch (error) {
            console.error("Authentication failed:", error);
        }
    };

    return (
        <div
            id="authScreen"
            className={`relative z-10 ${hidden ? 'hidden' : ''}`}
            aria-labelledby="authScreenTitle"
            role="dialog"
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 overflow-y-auto z-10">
                <div className="backdrop-blur-sm flex min-h-full items-center justify-center p-4 text-center">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                            { authState == 'signIn' ? "Sign In" : "Sign Up" } to Obscuron Chat
                                        </h2>
                                    </div>

                                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                                        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                            <form className="space-y-6" onSubmit={handleSubmit}>
                                            <div>
                                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                                Username
                                                </label>
                                                <div className="mt-1">
                                                <input
                                                    id="username"
                                                    name="username"
                                                    type="string"
                                                    autoComplete="username"
                                                    value={username}
                                                    onChange={(e) => {setUsername(e.target.value)}}
                                                    required
                                                    tabIndex={1}
                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Password
                                                </label>
                                                <div className="mt-1">
                                                <input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    autoComplete="current-password"
                                                    value={password}
                                                    onChange={(e) => {setPassword(e.target.value)}}
                                                    required
                                                    tabIndex={2}
                                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                />
                                                </div>
                                            </div>

                                            <div>
                                                <button
                                                    type="submit"
                                                    tabIndex={3}
                                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                                                >
                                                { authState == 'signIn' ? "Sign In" : "Sign Up" }
                                                </button>
                                            </div>
                                            </form>

                                            <div className="mt-6">
                                                <div className="relative">
                                                    <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-gray-300" />
                                                    </div>
                                                    <div className="relative flex justify-center text-sm">
                                                    <span className="px-2 bg-white text-gray-500">Or <span tabIndex={4} className='cursor-pointer text-blue-500' onClick={updateState}>{ authState == 'signIn' ? "sign up" : "sign in" }</span> instead</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;