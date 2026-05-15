import React from 'react';

import type { Person, PeerChat, screenTypes } from '../types';

interface ChatListProps {
    username: string;
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
    toggleScreen: (screen: screenTypes, hidden: boolean) => void;
}

interface TextListProps {
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

interface StandaloneChat {
    imageURL: string;
    text: string;
    isVerified?: boolean; 
}

interface MultipleBubbleProps {
    chat: string;
    isLast: boolean;
    isSelf: boolean;
    isVerified?: boolean;
}

interface MultiplePeerProps {
    imageURL: string;
    chats: string[];
    isVerified: boolean[];
}

interface MultipleSelfProps {
    imageURL: string;
    chats: string[];
}

type lastPerson = "null" | "self" | "peer";

const ChatListBox: React.FC<ChatListProps> = ({ chatOperator, username, toggleScreen }) => {
    // console.log("chatOperator.contacts:",chatOperator.contacts);
    // console.log("chatOperator.chatData:",chatOperator.chatData);
    return (
        <div className={`${username == chatOperator.currentChat ? 'bg-gradient-to-r from-blue-700 to-blue-400 ' : ''}px-3 flex items-center cursor-pointer rounded-2xl`} onClick={()=>{
            chatOperator.setCurrentChat(username);
            toggleScreen('chat', false);
            toggleScreen('blank', true);
        }} >
            <div>
                <img className="h-12 w-12 min-w-12 rounded-full" src={chatOperator.currentChat ? chatOperator.contacts.filter((x: Person) => {return x.username == username})[0].imageURL : "https://obscuron-cdn.faizath.com/placeholder.png"}/>
            </div>
            <div className="ml-4 flex-1 border-b border-gray-100 py-4">
                <div className="flex items-end justify-between">
                    <p className={`${username == chatOperator.currentChat ? 'text-white' : 'text-black'} max-w-180 truncate`}>{chatOperator.currentChat ? chatOperator.contacts.filter((x: Person) => {return x.username == username})[0].profileName : ""}</p>
                </div>
                <p className={`${username == chatOperator.currentChat ? 'text-white' : 'text-grey-dark'} mt-1 text-sm max-w-90 truncate`}>{JSON.parse(chatOperator.chatData).filter((x: PeerChat) => {return x.username == username})[0].textData.length == 0 ? <br/> : JSON.parse(chatOperator.chatData).filter((x: PeerChat) => {return x.username == username})[0].textData.slice(-1)[0].message.replace(/&#10;/gi,'\n')}</p>
            </div>
        </div>
    );
};

const StandalonePeer: React.FC<StandaloneChat> = ({ imageURL, text, isVerified }) => {
    return (
        <div title={isVerified ? "✅ Verified" : "❌ Unverified"}>
            <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                    <div>
                        <span data-subject="peer" className={`chat-bubble px-4 py-2 rounded-2xl inline-block rounded-bl-none bg-gradient-to-r ${isVerified ? "to-blue-700 from-blue-500" : "to-red-700 from-red-500"} text-white`}>
                            {text.split('&#10;').map((line, i) => (<React.Fragment key={i}>{line}<br /></React.Fragment>))}
                        </span>
                    </div>
                </div>
                <img src={imageURL} alt="My profile" className="w-8 h-8 rounded-full order-1" />
            </div>
        </div>
    );
};

const StandaloneSelf: React.FC<StandaloneChat> = ({ imageURL, text }) => {
    return (
        <div className="chat-message">
            <div className="flex items-end justify-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                    <div>
                        <span data-subject="self" className="chat-bubble px-4 py-2 rounded-2xl inline-block rounded-br-none bg-gradient-to-r from-gray-300 to-gray-100 text-black">
                            {text.split('&#10;').map((line, i) => (<React.Fragment key={i}>{line}<br /></React.Fragment>))}
                        </span>
                    </div>
                </div>
                <img src={imageURL} alt="My profile" className="w-8 h-8 rounded-full order-2" />
            </div>
        </div>
    );
};

const MultipleBubble: React.FC<MultipleBubbleProps> = ({ chat, isLast, isSelf, isVerified }) => {
    return (
        <div>
            <span data-subject="peer" className={`chat-bubble px-4 py-2 rounded-2xl${isLast ? " rounded-br-none" : ""} inline-block bg-gradient-to-r ${isSelf ? "from-gray-300 to-gray-100 text-black" : `${isVerified ? "to-blue-700 from-blue-500" : "to-red-700 from-red-500"} text-white`}`}>
                {chat.split('&#10;').map((line, i) => (<React.Fragment key={i}>{line}<br /></React.Fragment>))}
            </span>
        </div>
    );
};

const MultiplePeer: React.FC<MultiplePeerProps> = ({ imageURL, chats, isVerified }) => {
    return (
        <div className="chat-message">
            <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
                    {chats.map((text: string, index: number) => (
                        <MultipleBubble 
                            key={index} 
                            chat={text}
                            isSelf={false} 
                            isLast={index === chats.length - 1}
                            isVerified={isVerified[index]}
                        />
                    ))}
                </div>
                <img src={imageURL} alt="My profile" className="w-8 h-8 rounded-full order-1" />
            </div>
        </div>
    );
};

const MultipleSelf: React.FC<MultipleSelfProps> = ({ imageURL, chats }) => {
    return (
        <div className="chat-message">
            <div className="flex items-end justify-end">
                <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                    {chats.map((text: string, index: number) => (
                        <MultipleBubble 
                            key={index} 
                            chat={text} 
                            isSelf={true}
                            isLast={index === chats.length - 1} 
                        />
                    ))}
                </div>
                <img src={imageURL} alt="My profile" className="w-8 h-8 rounded-full order-2" />
            </div>
        </div>
    );
};

const TextList: React.FC<TextListProps> = ({ chatOperator }) => {
    let chatData = chatOperator.currentChat ? JSON.parse(chatOperator.chatData).filter((x: PeerChat) => {return x.username == chatOperator.currentChat})[0].textData : [];
    let chatHtml: React.ReactElement[] = [];
    let multipleChatCheck: {
        lastPerson: lastPerson;
        chats: string[];
        isVerified: boolean[];
    } = {
        lastPerson: "null",
        chats: [],
        isVerified: []
    };

    function pushHtml() {
        if (multipleChatCheck.lastPerson === "self") {
            if (multipleChatCheck.chats.length > 1) {
                chatHtml.push(<MultipleSelf imageURL={chatOperator.profileImage} chats={multipleChatCheck.chats} />);
            } else {
                chatHtml.push(<StandaloneSelf imageURL={chatOperator.profileImage} text={multipleChatCheck.chats[0]} />);
            }
        } else if (multipleChatCheck.lastPerson === "peer") {
            if (multipleChatCheck.chats.length > 1) {
                chatHtml.push(<MultiplePeer imageURL={chatOperator.contacts.filter((x)=>{return x.username == chatOperator.currentChat})[0].imageURL} chats={multipleChatCheck.chats} isVerified={multipleChatCheck.isVerified} />);
            } else {
                chatHtml.push(<StandalonePeer imageURL={chatOperator.contacts.filter((x)=>{return x.username == chatOperator.currentChat})[0].imageURL} text={multipleChatCheck.chats[0]} isVerified={multipleChatCheck.isVerified[0]} />);
            }
        }
    }
    for (let chat of chatData) {
        let chatStream: lastPerson = chat.sender == chatOperator.authUsername ? "self" : "peer";
        let chattxt: string = chat.message;
        if (!(multipleChatCheck.lastPerson === "null" || multipleChatCheck.lastPerson == chatStream)) {
            pushHtml();
            multipleChatCheck.chats = [];
            multipleChatCheck.isVerified = [];
        }
        multipleChatCheck.isVerified.push(chat.verified);
        multipleChatCheck.chats.push(chattxt);
        multipleChatCheck.lastPerson = chatStream;
    }
    pushHtml();
    return chatHtml;
};

export { ChatListBox, TextList };