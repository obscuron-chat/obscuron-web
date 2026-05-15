import React from 'react';

import type { Person, screenTypes } from '../types';

interface PeerProfileProps {
    hidden: boolean;
    toggleScreen: (screen: screenTypes, hidden: boolean) => void;
    chatOperator: {
        authUsername: string;
        setAuthUsername: React.Dispatch<React.SetStateAction<string>>;
        authPubkey: string;
        setAuthPubkey: React.Dispatch<React.SetStateAction<string>>;
        authPrivateKey: string;
        setAuthPrivateKey: React.Dispatch<React.SetStateAction<string>>;
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

const PeerProfile: React.FC<PeerProfileProps> = ({ hidden, toggleScreen, chatOperator }) => {
    const closePeerProfile = () => {
        toggleScreen("peerprofile", true);
    };

    return (
        <div id="peerProfile" className={`relative z-10${hidden ? ' hidden' : ''}`} aria-labelledby="peerProfileTitle" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity"></div>              
            <div className="triggerBlurbg fixed inset-0 overflow-y-auto z-10" onClick={closePeerProfile}>
                <div className="blurbg flex min-h-full items-center justify-center p-4 text-center">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h1 className="font-semibold text-center text-gray-900" id="peerProfileTitle">Contact Profile</h1>
                                <div className="mt-2 flex justify-center">
                                    <div className="flex flex-1 max-w-fit center bg-grey-light rounded-2xl">
                                        <div className="items-center flex">
                                            <div className="relative h-24 w-24">
                                                <img id="peerProfileImgURL" src={chatOperator.currentChat ? chatOperator.contacts.filter((x) => {return x.username == chatOperator.currentChat})[0].imageURL : "https://obscuron-cdn.faizath.com/placeholder.png"} alt={chatOperator.currentChat ? chatOperator.contacts.filter((x) => {return x.username == chatOperator.currentChat})[0].profileName : ""} className="w-24 h-24 min-w-24 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1 py-4 flex flex-col justify-center">
                                            <div className="flex flex-row">
                                                <p id="peerProfileusername">Username : {chatOperator.currentChat ? chatOperator.currentChat : ""}</p>
                                            </div>
                                            <p id="peerProfileName">Name : {chatOperator.currentChat ? chatOperator.contacts.filter((x) => {return x.username == chatOperator.currentChat})[0].profileName : ""}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button type="button" id="peerProfileBackbtn" className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 sm:ml-3 sm:w-auto cursor-pointer" onClick={closePeerProfile}>Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeerProfile;