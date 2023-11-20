"use client";
import React, { useState, useCallback, useEffect } from 'react';

import Modal from '@/app/components/modal';
import UserTable from '@/app/components/userTable';
import UserModal from '@/app/components/modals/createUser';
import SocialNetworkChart from '@/app/components/socialNetworkChart';
import { searchUsers, searchUserRelations } from '@/app/lib/apiUtils';

import InfoIcon from "@/app/assets/info.svg";

import { Barlow_Semi_Condensed } from 'next/font/google'

const barlowSemi = Barlow_Semi_Condensed({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin']
})

export default function Home() {
  const [userModal, setUserModal] = useState(false);
  const [userAdded, setUserAdded] = useState(false);
  const [userRelatives, setUserRelatives] = useState(false);
  const [data, setData] = useState({ nodes: [] });
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async ({ search, limit }) => {
    const users = await searchUsers({
      search,
      limit,
    });

    setData({ nodes: users });
  }, []);

  const fetchRelatives = useCallback(async (userId) => {
    const relations = await searchUserRelations(userId)

    setUserRelatives(relations)
  }, [])

  useEffect(() => {
    fetchUsers({
      search,
      limit: 20
    });
  }, [fetchUsers, userAdded, search]);

  return (
    <main className={`${barlowSemi.className} flex flex-row relative`}>
      <section className="flex flex-col w-full container mx-auto mt-12 justify-center">
        <div className="w-full text-center justify-center text-dark-800 flex flex-col gap-1 mb-6">
          <span className='font-bold text-[44px]'>User Networking</span>
          <span className='font-semibold text-dark-700/50 text-[18px]'>Create, link up new users and view their social network!</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
          <div className="w-full">
            <UserTable
              setUserModal={setUserModal}
              setSearch={setSearch}
              data={data}
              search={search}
              fetch={fetchUsers}
              fetchRelatives={fetchRelatives}
            />
          </div>
          <div className="flex flex-col bg-white rounded-lg text-black">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col pt-6 px-6 pb-3">
                <span className="font-bold text-lg">User Relation Network</span>
                <span className="text-md">Select a user from the data table to display their relations.</span>
                <span className="text-sm flex flex-row gap-1 text-center items-center mt-2">
                  <InfoIcon
                    width={18}
                    height={18}
                    strokeWidth={11}
                    className="relative top-[1px]"
                  />
                  You can hover over the nodes for more information.
                </span>
              </div>
              <div className="w-full h-1 bg-light-gray"></div>
              <div className="graph-container" id="social-network-chart" >
                {userRelatives ?
                  <SocialNetworkChart user={userRelatives} />
                  :
                  <div className="w-full h-full justify-center items-center flex">
                    <span className="text-lg font-semibold">
                      Please select one of the users from the data table.
                    </span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      {userModal && (
        <Modal
          onClose={() => setUserModal(false)}
          props={{
            onUserAdded: (prop) => { setUserAdded(prop) }
          }}
        >
          <UserModal />
        </Modal>
      )
      }
    </main >
  )
}