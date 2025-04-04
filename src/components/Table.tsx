"use client"; 

import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import { TableProps } from "../app/models/interface/Table";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { Dialog, Transition } from '@headlessui/react';
import { UserProps } from "../app/models/interface/User";

const Tooltip = dynamic(() => import('react-tooltip').then(mod => mod.Tooltip), {
    ssr: false
});

function UsersTable({ data }: TableProps) {
    const [userStatus, setUserStatus] = useState<Record<string, boolean>>(
        data.reduce((acc, user) => ({ ...acc, [user.id]: true }), {})
    );

    //ALTERAR STATUS DO USUARIO
    const handleToggle = (userId: number) => {
        return (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            
            setUserStatus(prev => {
                const newStatus = !prev[userId];
                return {
                    ...prev,
                    [userId]: newStatus
                };
            });

            const newStatus = !userStatus[userId];
            if (newStatus) {
                toast.success(`Usuário ativado com sucesso!`);
            } else {
                toast.warning(`Usuário desativado com sucesso!`);
            }
        };
    };

    return (
        <div className="bg-[#550055] text-white p-2 sm:p-4 rounded-lg">
            <div className="p-2 sm:p-4">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Lista de Usuários</h2>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] sm:min-w-full border border-gray-300 rounded-lg">
                        <thead>
                            <tr className="bg-[#3A3845] text-left">
                                <th className="p-1 sm:p-2 border text-xs sm:text-sm">ID</th>
                                <th className="p-1 sm:p-2 border text-xs sm:text-sm">Nome</th>
                                <th className="p-1 sm:p-2 border text-xs sm:text-sm sm:table-cell">Email</th>
                                <th className="p-1 sm:p-2 border text-xs sm:text-sm md:table-cell">Telefone</th>
                                <th className="p-1 sm:p-2 border text-xs sm:text-sm">Detalhes</th>
                                <th className="p-1 sm:p-2 border text-xs sm:text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user) => {
                                // ESTADO DO MODAL PARA CADA USUARIO
                                const [isOpen, setIsOpen] = useState(false);

                                console.log("User data:", user);

                                return (
                                    <Fragment key={user.id}>
                                        <tr className="border hover:bg-[#4a3a5a] transition-colors">
                                            <td className={`p-1 sm:p-2 border text-center text-xs sm:text-sm ${!userStatus[user.id] ? 'line-through' : ''}`}>
                                                {user.id}
                                            </td>
                                            <td className={`p-1 sm:p-2 border text-left text-xs sm:text-sm ${!userStatus[user.id] ? 'line-through' : ''}`}>
                                                {user.name}
                                            </td>
                                            <td className={`p-1 sm:p-2 border text-left text-xs sm:text-sm  sm:table-cell ${!userStatus[user.id] ? 'line-through' : ''}`}>
                                                {user.email}
                                            </td>
                                            <td className={`p-1 sm:p-2 border text-right text-xs sm:text-sm  md:table-cell ${!userStatus[user.id] ? 'line-through' : ''}`}>
                                                {user.phone}
                                            </td>
                                            <td className="p-1 sm:p-2 border text-center">
                                                <button 
                                                    className="hover:opacity-80 cursor-pointer"
                                                    onClick={() => setIsOpen(true)}
                                                    data-tooltip-id={`detalhe-${user.id}`}
                                                    data-tooltip-content="Ver detalhes do usuário"
                                                >
                                                    <FontAwesomeIcon icon={faSquarePlus} className="text-base sm:text-xl" />
                                                </button>
                                                <Tooltip 
                                                    id={`detalhe-${user.id}`}
                                                    place="top"
                                                    delayShow={300}
                                                />
                                            </td>
                                            <td className="p-1 sm:p-2 border text-center">
                                                <button
                                                    className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                                                        userStatus[user.id] 
                                                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                                    }`}
                                                    onClick={handleToggle(user.id)}
                                                    data-tooltip-id={`status-${user.id}`}
                                                    data-tooltip-content={userStatus[user.id] ? "Desativar" : "Ativar"}
                                                    aria-label={userStatus[user.id] ? "Desativar" : "Ativar"}
                                                >
                                                  <FontAwesomeIcon 
                                                        icon={userStatus[user.id] ? faToggleOn : faToggleOff} 
                                                        className="text-sm sm:text-lg"
                                                  />
                                                </button>
                                                <Tooltip 
                                                    id={`status-${user.id}`}
                                                    place="top"
                                                    delayShow={300}
                                                />
                                            </td>
                                        </tr>
                                            
                                        {/* MODAL COM DETALHES DOS USUARIOS */}
                                        <Transition appear show={isOpen} as={Fragment}>
                                            <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
                                                <Transition.Child
                                                    as={Fragment}
                                                    enter="ease-out duration-300"
                                                    enterFrom="opacity-0"
                                                    enterTo="opacity-100"
                                                    leave="ease-in duration-200"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                                                </Transition.Child>

                                                <div className="fixed inset-0 overflow-y-auto">
                                                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                                                        <Transition.Child
                                                            as={Fragment}
                                                            enter="ease-out duration-300"
                                                            enterFrom="opacity-0 scale-95"
                                                            enterTo="opacity-100 scale-100"
                                                            leave="ease-in duration-200"
                                                            leaveFrom="opacity-100 scale-100"
                                                            leaveTo="opacity-0 scale-95"
                                                        >
                                                            <Dialog.Panel as="div" className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#550055] p-6 text-left align-middle shadow-xl transition-all">
                                                                <Dialog.Title
                                                                    as="h3"
                                                                    className="text-lg font-medium leading-6 text-white"
                                                                >
                                                                    Detalhes do Usuário: {user.name}
                                                                </Dialog.Title>

                                                                <div className="mt-4 text-white">
                                                                    <p><strong>ID:</strong> {user.id}</p>
                                                                    <p><strong>Username:</strong> {user.username}</p>
                                                                    <p><strong>Email:</strong> {user.email}</p>
                                                                    <p><strong>Telefone:</strong> {user.phone}</p>
                                                                    <p><strong>Website:</strong> {user.website}</p>

                                                                    <div className="mt-4">
                                                                        <h4 className="font-semibold">Endereço:</h4>
                                                                        <p>{user.address.street}, {user.address.suite}</p>
                                                                        <p>{user.address.city}, {user.address.zipcode}</p>
                                                                        <p>Geo: {user.address.geo.lat}, {user.address.geo.lng}</p>
                                                                    </div>

                                                                    <div className="mt-4">
                                                                        <h4 className="font-semibold">Empresa:</h4>
                                                                        <p>{user.company.name}</p>
                                                                        <p>{user.company.catchPhrase}</p>
                                                                        <p>{user.company.bs}</p>
                                                                    </div>

                                                                    <div className="mt-4 flex items-center">
                                                                        <strong className="mr-2">Status:</strong>
                                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                                            userStatus[user.id] 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                            {userStatus[user.id] ? (
                                                                                <Fragment>
                                                                                    <FontAwesomeIcon icon={faToggleOn} className="mr-1 text-green-500" />
                                                                                    Ativo
                                                                                </Fragment>
                                                                            ) : (
                                                                                <Fragment>
                                                                                    <FontAwesomeIcon icon={faToggleOff} className="mr-1 text-red-500" />
                                                                                    Inativo
                                                                                </Fragment>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-6 flex justify-end">
                                                                    <button
                                                                        type="button"
                                                                        className="rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-[#550055] hover:bg-gray-100 focus:outline-none"
                                                                        onClick={() => setIsOpen(false)}
                                                                    >
                                                                        Fechar
                                                                    </button>
                                                                </div>
                                                            </Dialog.Panel>
                                                      </Transition.Child>
                                                    </div>
                                                </div>
                                            </Dialog>
                                        </Transition>
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UsersTable;