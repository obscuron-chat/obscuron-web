import { useState, useRef, useEffect } from "react";

import GradientBackground from "../components/GradientBackground";
import LeftScreen from "../components/LeftScreen";
import BlankScreen from "../components/BlankScreen";
import ChatScreen from "../components/ChatScreen";
import AuthScreen from "../components/AuthScreen";
import Settings from "../components/Settings";
import AddContact from "../components/AddContact";
import PeerProfile from "../components/PeerProfile";
import { ChatListBox } from "../components/ChatTemplates";
import DomainNoticePopup from "../components/DomainNoticePopup";

import type { Person, PeerChat } from "../types";

const MainPage = () => {
    const [authUsername, setAuthUsername] = useState<string>('');
    const [authPubkey, setAuthPubkey] = useState<string>('');
    const [authPrivateKey, setAuthPrivateKey] = useState<string>('');
    const [jwtToken, setjwtToken] = useState<string>('');

    const [profileName, setProfileName] = useState<string>('');
    const [profileImage, setProfileImage] = useState<string>("https://cdn.obscuron.chat/placeholder.png");
    const [currentChat, setCurrentChat] = useState<string>('');
    const [chatData, setChatData] = useState<string>('[]');

    const [chatList, setChatList] = useState<React.ReactElement[]>([]);

    const [contacts, setContacts] = useState<Person[]>([{
        username: "faiz",
        publicKey: "048516b9513070d51ee673870eee16b6e8bb9d5e79ec9ea1e6a2b8729ef99cfdb901b59132d9ed21c7416636cdac55345a6a6b70e720c00ca5416ee0834ae2e843",
        imageURL: "https://cdn.obscuron.chat/placeholder.png",
        profileName: "Faiz"
    }]);

    const [socket, setSocket] = useState<WebSocket | null>(null);
    
    // const contacts: Person[] = [
    //     {
    //         id: 'leslie',
    //         name: 'Leslie Alexander',
    //         imageURL:
    //         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    //         publicKey: '04fa4e15a78f92ea7dc550bc026a65445d280a7009e6fa632c266a5bc4e305e3d78599ede4c9d21e134c159b7a2abcd24fe28bc47fcb0df7bcc923db27ea3765ce'
    //     },{
    //         id: 'michael',
    //         name: 'Michael Foster',
    //         imageURL:
    //         'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
    //         publicKey: '04220dae4098514109277088d444d54368ef088487162fe2d1c2ea374cda85c45abeb3ecb0ef7d03c9fd77b9cd423b03e624733082fd5858d34436cfbf9ae8be31'
    //     }
    // ];
    
    const chatOperator = {
        authUsername,
        setAuthUsername,
        authPubkey,
        setAuthPubkey,
        authPrivateKey,
        setAuthPrivateKey,
        jwtToken,
        setjwtToken,
        profileName,
        setProfileName,
        profileImage,
        setProfileImage,
        currentChat,
        setCurrentChat,
        chatData,
        setChatData,
        contacts,
        setContacts,
        socket,
        setSocket
    };

    const [screens, setScreens] = useState({
        blank: false,
        chat: currentChat == '',
        auth: false,
        settings: true,
        addcontact: true,
        peerprofile: true
    });

    const toggleScreen = (screen: keyof typeof screens, hidden: boolean) => {
        setScreens((prev) => ({
            ...prev,
            [screen]: hidden,
        }));
    };

    const [chatListWidth, setChatListWidth] = useState(250);
    const isResizing = useRef(false);

    const startResizing = () => {
        isResizing.current = true;
    };

    const stopResizing = () => {
        isResizing.current = false;
    };

    const resize = (clientX: number) => {
        if (isResizing.current) {
            const newWidth = clientX;
            if (newWidth > 100 && newWidth < window.innerWidth - 100) {
                setChatListWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => resize(e.clientX);
        const handleMouseUp = stopResizing;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 1) {
            resize(e.touches[0].clientX);
        }
        };
        const handleTouchEnd = stopResizing;

        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);


    useEffect(() => {
        const storedChatData = localStorage.getItem('chatData');
        if (storedChatData) {
            setChatData(storedChatData);
        }

        const storedAuthUsername = localStorage.getItem('authUsername');
        if (storedAuthUsername) {
            setAuthUsername(storedAuthUsername);
        }

        const storedAuthPubkey = localStorage.getItem('authPubkey');
        if (storedAuthPubkey) {
            setAuthPubkey(storedAuthPubkey);
        }

        const storedAuthPrivateKey = localStorage.getItem('authPrivateKey');
        if (storedAuthPrivateKey) {
            setAuthPrivateKey(storedAuthPrivateKey);
        }

        const storedjwtToken = localStorage.getItem('jwtToken');
        if (storedjwtToken) {
            setjwtToken(storedjwtToken);
            toggleScreen("auth", true);
        }
    }, []);

    const loadChatList = () => {
        // console.log("loadChatList ", JSON.parse(chatData));
        const peerChatTemplates = JSON.parse(chatData).map((peerChat: PeerChat) => (
            <ChatListBox key={peerChat.username} username={peerChat.username} chatOperator={chatOperator} toggleScreen={toggleScreen} />
        ));
        setChatList(peerChatTemplates);
    };

    useEffect(() => {
        if (chatData) {
            localStorage.setItem('chatData', chatData);
            loadChatList();
        }
    }, [chatData]);

    useEffect(() => {
        if (authUsername) {
            localStorage.setItem('authUsername', authUsername);
        }
    }, [authUsername]);

    useEffect(() => {
        if (authPubkey) {
            localStorage.setItem('authPubkey', authPubkey);
        }
    }, [authPubkey]);

    useEffect(() => {
        if (authPrivateKey) {
            localStorage.setItem('authPrivateKey', authPrivateKey);
        }
    }, [authPrivateKey]);

    useEffect(() => {
        if (jwtToken) {
            localStorage.setItem('jwtToken', jwtToken);
        }
    }, [jwtToken]);

    useEffect(() => {
        loadChatList();
    }, [chatData, currentChat]);
        
    return (
        <div className="flex w-screen h-screen">
            <DomainNoticePopup />
            <GradientBackground />
            <LeftScreen toggleScreen={toggleScreen} screenWidth={chatListWidth} chatOperator={chatOperator} chatList={chatList} />
            <div className="w-0.5 cursor-col-resize z-10" onMouseDown={startResizing} onTouchStart={startResizing}></div>
            <BlankScreen hidden={screens.blank} screenWidth={chatListWidth}/>
            <ChatScreen hidden={screens.chat} toggleScreen={toggleScreen} screenWidth={chatListWidth} chatOperator={chatOperator} />
            <AuthScreen hidden={screens.auth} toggleScreen={toggleScreen} chatOperator={chatOperator} />
            <Settings hidden={screens.settings} toggleScreen={toggleScreen} chatOperator={chatOperator} />
            <AddContact hidden={screens.addcontact} toggleScreen={toggleScreen} chatOperator={chatOperator} />
            <PeerProfile hidden={screens.peerprofile} toggleScreen={toggleScreen} chatOperator={chatOperator} />
        </div>
    );
};

export default MainPage;