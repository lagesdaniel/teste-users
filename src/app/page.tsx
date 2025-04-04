//  TRANSFORMAR EM CLIENT COMPONENT
"use client"; 

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserProps } from '../app/models/interface/User';
import UsersTable from "@/components/Table";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {

    //VARIAVEL PARA EXIBIR A TABELA APOS CLICAR NO BOTAO
    const [showTable, setShowTable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<UserProps[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [tableData, setTableData] = useState<any[]>([]); 


    const handleDisplayTable = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.preventDefault();
      setIsLoading(true);

      //SIMULAR LOADING
      setTimeout(() => {
        setShowTable(true);
        setIsLoading(false);
        toast.success("Tabela exibida com sucesso!");
      }, 500);

    };

    //TRAZER OS DADOS UTILIZANDO O LINK FORNECIDO
    useEffect(() => {
      const fetchUsers = async () => {
          try {
              const response = await fetch('https://jsonplaceholder.typicode.com/users');
              
              if (!response.ok) {
                  toast.error("Falha na requisição!");
              }

              const data: UserProps[] = await response.json();
              const tableData: UserProps[] = data.map(user => ({
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                website: user.website,
                address: {
                  street: user.address.street,
                  suite: user.address.suite,
                  city: user.address.city,
                  zipcode: user.address.zipcode,
                  geo: {
                    lat: user.address.geo.lat,
                    lng: user.address.geo.lng
                  }
                },
                company: {
                  name: user.company.name,
                  catchPhrase: user.company.catchPhrase,
                  bs: user.company.bs
                }
              }));
              

              
              setUsers(data);
              setTableData(tableData); // Armazena os dados formatados
              setError(null);
              

          } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
              setError(errorMessage);
              toast.error(errorMessage)
              return{
                data: [],

              }
          }
      };
    
      fetchUsers();
    }, []);

    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            {/* EXIBIR A TABELA E OCULTAR O BOTAO */}
            {!showTable && (
                <div className="bg-[#550055] text-white p-4 rounded-lg text-center ">
                  <div className="mb-6 ">
                    <h1 className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-geist-sans)]">Daniel Lages</h1>
                    <p className="text-xl sm:text-2xl mt-2 font-[family-name:var(--font-geist-sans)]">Teste Front-End PayIP</p>
                  </div>

                  <button
                    onClick={handleDisplayTable}
                    disabled={isLoading}
                    className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#330033] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto mx-auto"
                    rel="noopener noreferrer"
                  >
                    {isLoading ? "Carregando..." : "Exibir tabela"}
                  </button>
              </div>
            )}
            {/* EXIBIR TABELA E OCULTAR DIV APOS O CLIQUE */}
            <AnimatePresence>
              {showTable && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                >
                  <UsersTable data={tableData} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        </footer>
      </div>
    );
}
