import React, { useState, useRef } from 'react';
import type { ChangeEvent } from "react";

import type { Person, screenTypes } from '../types';

interface SettingsProps {
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

const Settings: React.FC<SettingsProps> = ({ hidden, toggleScreen, chatOperator }) => {
    const [image, setImage] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const triggerInput = () => {
        inputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (chatOperator.profileName != '') {
            try {
                const response = await fetch(import.meta.env.VITE_BASE_API_URL + "/profile", {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${chatOperator.jwtToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ profileName: chatOperator.profileName }),
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                console.log("Update successful:", data);

                toggleScreen('settings', true);
            } catch (error) {
                console.error("Authentication failed:", error);
            }
        }
    };

    return (
        <div id="settingsScreen" className={`relative z-10${hidden ? ' hidden' : ''}`} aria-labelledby="settingsScreenTitle" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity"></div>              
            <div className="triggerBlurbg fixed inset-0 overflow-y-auto z-10">
                <div className="blurbg flex min-h-full items-center justify-center p-4 text-center">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h1 className="font-semibold text-center text-gray-900" id="settingsScreenTitle">Settings</h1>
                                    <div className="mt-2 flex justify-center">
                                        <div className="flex flex-1 max-w-fit center bg-grey-light rounded-2xl">
                                            <div className="items-center flex">
                                                <div id="settingsChangeProfileImgbtn" className="relative h-24 w-24 cursor-pointer" onClick={triggerInput}>
                                                    <span className="absolute right-0 bottom-0 ring-1 rounded-full p-1 ring-black bg-white">
                                                        <svg height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" className="">
                                                            <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"></path>
                                                        </svg>
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        ref={inputRef}
                                                        className="sr-only"
                                                        tabIndex={2}
                                                    />
                                                    <img data-newimg="" src={image ? URL.createObjectURL(image) : "https://obscuron-cdn.faizath.com/placeholder.png"} alt="" className="w-24 h-24 min-w-24 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-1 py-6 flex flex-col">
                                                <div className="flex items-bottom justify-between">
                                                    <label className="flex items-center" htmlFor="settingsProfile">Name : </label>
                                                    <input type="text" value={chatOperator.profileName} onChange={(e) => { chatOperator.setProfileName(e.target.value) }} placeholder="Profile Name" className="overlayInput p-2 border" tabIndex={1} autoFocus />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="submit" className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-blue-200 hover:text-gray-200 sm:ml-3 sm:w-auto cursor-pointer" tabIndex={3}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;