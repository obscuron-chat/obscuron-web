import React, { useState, useEffect, useRef } from 'react';

import { TextList } from "./ChatTemplates";

import type { Person, screenTypes } from '../types';

import { secp256k1 } from '@noble/curves/secp256k1.js';
import { hexToBytes, bytesToHex } from '@noble/curves/utils.js';
import { sha3_256 } from 'js-sha3';

interface ChatOperator {
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
    socket: WebSocket | null;
    setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>;
}

interface ChatScreenProps {
    hidden: boolean;
    toggleScreen: (screen: screenTypes, hidden: boolean) => void;
    screenWidth: number;
    chatOperator: ChatOperator;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ hidden, toggleScreen, screenWidth, chatOperator }) => {
    const [message, setMessage] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const [isWide, setIsWide] = useState(window.innerWidth >= 768);
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 48rem)');

        const handleResize = (e: MediaQueryListEvent) => {
            setIsWide(e.matches);
        };

        setIsWide(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleResize);

        return () => {
        mediaQuery.removeEventListener('change', handleResize);
        };
    }, []);

    const openPeerProfile = () => {
        // console.log("chatOperator.chatData:", chatOperator.chatData);
        toggleScreen("peerprofile", false);
    };

    const privKey = chatOperator.authPrivateKey;

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const minHeight = 48;
    const maxHeight = 144;

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;

        if (scrollHeight < minHeight) {
            textarea.style.height = `${minHeight}px`;
        } else if (scrollHeight > maxHeight) {
            textarea.style.height = `${maxHeight}px`;
        } else {
            const lineHeight = 24;
            const lineCount = textarea.value.split('\n').length + 1;
            textarea.style.height = `${lineCount * lineHeight}px`;
        }
    };

    const encodeHTML = (text: string) => {
        return text.replace(/[\x26\x0A\<>'"]/g,function(text){return"&#"+text.charCodeAt(0)+";"})
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (textarea) textarea.style.height = `${minHeight}px`;
        if (message.replace(/\n/gi,'').length > 0) {
            let text = message.split('\n');
            while (text[0] == "" || text[text.length-1] == "") {
                if (text[0].replace(/ /gi,'').length == 0) {
                    delete text[0];
                    text = text.filter(function(x) { return x !== null });
                } else if (text[text.length-1].replace(/ /gi,'').length == 0) {
                    delete text[text.length-1];
                    text = text.filter(function(x) { return x !== null });
                }
            }
            let chatData = JSON.parse(chatOperator.chatData);
            for (let chatIdx = 0;  chatIdx < chatData.length; chatIdx++) {
                if (chatData[chatIdx].username == chatOperator.currentChat) {
                    let peerChat = chatData.splice(chatIdx, 1)[0];
                    const messageHash = sha3_256(encodeHTML(text.join('\n')));
                    const newChat = {
                        "sender": chatOperator.authUsername,
                        "receiver": chatOperator.currentChat,
                        "message": encodeHTML(text.join('\n')),
                        "hash": messageHash,
                        "signature": bytesToHex(secp256k1.sign(hexToBytes(messageHash), hexToBytes(privKey), { prehash: false, format: 'der', lowS: false })),
                        "timestamp": new Date().toISOString()
                    };
                    peerChat.textData.push(newChat);
                    chatOperator.socket?.send(JSON.stringify(newChat));
                    chatData.unshift(peerChat);
                    break;
                }
            }
            chatOperator.setChatData(JSON.stringify(chatData));
        }
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    const chatOperatorRef = useRef<ChatOperator>(chatOperator);

    useEffect(() => {
        chatOperatorRef.current = chatOperator;
    }, [chatOperator]);

    const incomingMessage = (event: MessageEvent<any>) => {
        const updatedChatOperator = chatOperatorRef.current;
        let chatData = JSON.parse(updatedChatOperator.chatData);
        for (let chatIdx = 0; chatIdx < chatData.length; chatIdx++ ) {
            if (chatData[chatIdx].username == updatedChatOperator.currentChat) {
                let peerChat = chatData.splice(chatIdx, 1)[0];
                let newChat = JSON.parse(event.data)["message"];
                console.log(`sha3_256(newChat["message"]) == newChat["hash"]:`, sha3_256(newChat["message"]) == newChat["hash"]);
                console.log(`updatedChatOperator.contacts.filter((x: Person) => {return x.username == newChat["sender"]})[0].publicKey:`, updatedChatOperator.contacts.filter((x: Person) => {return x.username == newChat["sender"]})[0].publicKey);
                const senderPubKey = updatedChatOperator.contacts.filter((x: Person) => {return x.username == newChat["sender"]})[0].publicKey;
                const sigVerified = secp256k1.verify(hexToBytes(newChat["signature"]), hexToBytes(newChat["hash"]), hexToBytes(senderPubKey), { prehash: false, format: 'der', lowS: false });
                console.log(`secp256k1.verify(signature, hash, pubKey):`, sigVerified);
                newChat["verified"] = (
                    sha3_256(newChat["message"]) == newChat["hash"]
                ) && sigVerified;
                console.log(`newChat["verified"]:`, newChat["verified"]);
                peerChat.textData.push(newChat);
                chatData.unshift(peerChat);
                break;
            }
        }
        chatOperator.setChatData(JSON.stringify(chatData));
    };

    useEffect(() => {
        if (true) {
            const ws = new WebSocket(import.meta.env.VITE_BASE_API_WEBSOCKET_URL + '/room/' + (parseInt(sha3_256(chatOperator.currentChat), 16) + parseInt(sha3_256(chatOperator.authUsername), 16)).toString(16).slice(0,12));

            ws.onopen = () => {
                console.log('WebSocket connection opened');
            };

            ws.onmessage = (event) => {
                incomingMessage(event);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            ws.onclose = () => {
                console.log('WebSocket connection closed');
            };

            chatOperator.setSocket(ws);

            // Clean up on component unmount
            return () => {
                ws.close();
            };
        }
    }, []);

    return (
        <div id="chatScreen" className={`${hidden ? 'hidden ' : ''}border-0 flex-col h-full`} style={{width: isWide ? `calc(100% - ${screenWidth}px)` : '100%'}}>
            <div className="flex-1 p-6 justify-between flex flex-col h-full w-full">
                <div className="flex sm:items-center justify-between pb-3 border-b-2 border-gray-200">
                    <div id="peerID" data-peerid="" className="relative flex items-center space-x-4">
                        <button
                            id="backChat"
                            className="md:hidden flex flex-col justify-center items-center p-2 rounded-full focus:ring-2 hover:bg-gray-50 hover:bg-opacity-30 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="grey"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                />
                            </svg>
                        </button>
                        <div id="peerProfilebtn" className="relative cursor-pointer" onClick={openPeerProfile}>
                            <span className="absolute text-green-500 right-0 bottom-0">
                                <svg width="20" height="20">
                                    <circle cx="12" cy="12" r="6" fill="currentColor" />
                                </svg>
                            </span>
                            <img
                                id="peerImgURL"
                                src={chatOperator.currentChat ? chatOperator.contacts.filter((x) => {return x.username == chatOperator.currentChat})[0].imageURL : "https://obscuron-cdn.faizath.com/placeholder.png"}
                                alt=""
                                className="w-10 h-10 min-w-10 rounded-full"
                            />
                        </div>
                        <div className="flex flex-col leading-tight">
                            <div className="text-2xl mt-1 flex items-center">
                                <span
                                    className="text-gray-700 mr-3 font-semibold"
                                    id="peerName"
                                >{chatOperator.currentChat ? chatOperator.contacts.filter((x) => {return x.username == chatOperator.currentChat})[0].profileName : ""}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <h1 id="searchCount" className="hidden">
                            0/0
                        </h1>
                        <button
                            type="button"
                            id="search"
                            className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    id="messages"
                    className="flex flex-col space-y-4 p-3 overflow-x-hidden h-full"
                >
                    <TextList chatOperator={chatOperator} />
                </div>
                <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2">
                    <form id="chatForm" onSubmit={handleSubmit}>
                        <div className="relative flex flex-row">
                            <div id="sendOrSearch" className="flex flex-1">
                                <textarea
                                    ref={textareaRef}
                                    id="typing"
                                    placeholder="Type a message"
                                    form="chatForm"
                                    rows={1}
                                    value={message}
                                    onInput={handleInput}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                    className="resize-none w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 px-12 bg-gray-200 rounded-3xl py-3"
                                    aria-label="Type a message"
                                />
                            </div>
                            <button
                                type="submit"
                                id="enter"
                                className="flex items-center justify-center w-12 h-12 rounded-full p-3 ml-2 my-auto transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-6 w-6 transform rotate-90"
                                >
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatScreen;