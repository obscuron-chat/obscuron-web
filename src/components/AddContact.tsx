import React, { useState } from 'react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/react';

import type { PeerChat, Person, screenTypes } from '../types';

interface AddContactProps {
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
        setContacts: React.Dispatch<React.SetStateAction<Person[]>>;
    };
}

function classNames(...classes: (string | boolean | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

const AddContact: React.FC<AddContactProps> = ({ hidden, toggleScreen, chatOperator }) => {
    const [query, setQuery] = useState<string>('');
    const [selectedPerson, setSelectedPerson] = useState<Person | null | undefined>(undefined);

    const filteredPeople =
        query === ''
        ? chatOperator.contacts
        : chatOperator.contacts.filter((person) =>
            person.profileName.toLowerCase().includes(query.toLowerCase())
            );

    const closeAddContact = () => {
        toggleScreen('addcontact', true);
        setQuery('');
        setSelectedPerson(null);
    };

    const addContact = () => {
        let chatData = JSON.parse(chatOperator.chatData);
        if (selectedPerson && chatData.filter((x: PeerChat) => {return x.username == selectedPerson.username}).length == 0) {
            chatOperator.setCurrentChat(selectedPerson ? selectedPerson.username : '');
            chatData.unshift({
                username: selectedPerson.username,
                textData: []
            });
            // console.log("chatData:", chatData);
            chatOperator.setChatData(JSON.stringify(chatData));
            // console.log("chatOperator.chatData:", chatOperator.chatData);
            toggleScreen('addcontact', true);
            toggleScreen('chat', false);
            toggleScreen('blank', true);
            setQuery('');
            setSelectedPerson(null);
        }
    };

    return (
        <div
            id="addContactScreen"
            className={`relative z-10${hidden ? ' hidden' : ''}`}
            aria-labelledby="addContactScreenTitle"
            role="dialog"
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 overflow-y-auto z-0">
                <div className="flex min-h-full items-center justify-center text-center p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h1 className="font-semibold text-center text-gray-900" id="addContactScreenTitle">
                                    Add Contact
                                </h1>
                                <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
                                    <div className="relative mt-1">
                                        <ComboboxInput
                                            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                            onChange={(event) => setQuery(event.target.value)}
                                            displayValue={(person: Person | null | undefined) =>
                                                person ? person.username : ''
                                            }
                                        />
                                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </ComboboxButton>

                                        {filteredPeople.length > 0 && (
                                            <ComboboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {filteredPeople.map((person) => (
                                                    <ComboboxOption
                                                        key={person.username}
                                                        value={person}
                                                        className={({ active }) =>
                                                            classNames(
                                                                'relative cursor-default select-none py-2 pl-3 pr-9 z-10',
                                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                            )
                                                        }
                                                    >
                                                        {({ selected }) => (
                                                            <>
                                                                <div className="flex items-center">
                                                                    <img
                                                                        src={person.imageURL ? person.imageURL : "asdsna"}
                                                                        alt={person.username}
                                                                        className="h-6 w-6 flex-shrink-0 rounded-full"
                                                                    />
                                                                    <span
                                                                        className={classNames(
                                                                        'ml-3 truncate',
                                                                        selected && 'font-semibold'
                                                                        )}
                                                                    >
                                                                        {person.profileName} (@{person.username})
                                                                    </span>
                                                                </div>

                                                                {selected && (
                                                                <span
                                                                    className={classNames(
                                                                        'absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600',
                                                                        'aria-selected:text-white'
                                                                    )}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                                )}
                                                            </>
                                                        )}
                                                    </ComboboxOption>
                                                ))}
                                            </ComboboxOptions>
                                        )}
                                    </div>
                                </Combobox>
                            </div>
                        </div>
                        <div className="bg-gray-50 py-3 px-6">
                            <div id="searchContactResults" className={`flex flex-1 center justify-center${selectedPerson ? '' : ' hidden'}`}>
                                <div className="flex flex-1 max-w-fit center bg-grey-light rounded-2xl">
                                    <div>
                                        <img
                                            id="searchContactResultsImg"
                                            className="h-12 w-12 min-w-12 rounded-full"
                                            src={selectedPerson?.imageURL ? selectedPerson?.imageURL : "https://obscuron-cdn.faizath.com/placeholder.png" }
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-4 flex-1 py-4">
                                        <div className="flex items-bottom justify-between">
                                            <p
                                                id="searchContactResultsName"
                                                data-peerid=""
                                                className="text-black max-w-180"
                                            >{selectedPerson?.profileName}</p>
                                        </div>
                                    </div>
                                    <button
                                        id="addContactProfilebtn"
                                        className="h-11 w-11 ml-2 self-center flex flex-col justify-center items-center p-2 rounded-full focus:ring-2 hover:bg-gray-50 hover:opacity-30 focus:outline-none cursor-pointer"
                                        onClick={addContact}
                                    >
                                        <svg viewBox="0 0 24 24" height="24" width="24">
                                        <path
                                            fill="currentColor"
                                            d="M14.7,12c2,0,3.6-1.6,3.6-3.6s-1.6-3.6-3.6-3.6s-3.6,1.6-3.6,3.6S12.7,12,14.7,12z  M6.6,10.2V7.5H4.8v2.7H2.1V12h2.7v2.7h1.8V12h2.7v-1.8H6.6z M14.7,13.8c-2.4,0-7.2,1.2-7.2,3.6v1.8H22v-1.8 C21.9,15,17.1,13.8,14.7,13.8z"
                                        ></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-1 flex-row-reverse">
                                <button
                                    type="button"
                                    id="addContactBackbtn"
                                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-200 sm:ml-3 sm:w-auto cursor-pointer"
                                    onClick={closeAddContact}
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddContact;