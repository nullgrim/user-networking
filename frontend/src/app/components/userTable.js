"use client";

import React, { useRef } from 'react';
import dayjs from "dayjs";

import NewUserIcon from "@/app/assets/new_user.svg";

import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from '@table-library/react-table-library/table';

const Component = ({ setUserModal, data, setSearch, fetchRelatives }) => {
  const timeout = useRef();

  const handleSearch = (event) => {
    // * Debounce for search
    if (timeout.current) clearTimeout(timeout.current);

    timeout.current = setTimeout(
      () => {
        setSearch(event.target.value);
      },
      500
    );
  };

  return (
    <div className="flex flex-col !bg-white rounded-xl w-full">
      <div className="flex flex-row p-4">
        <div className="flex flex-row gap-4 w-full mb-4">
          <div className="flex flex-col gap-2 w-1/2 text-gray-900">
            <span className="font-bold text-lg">User List</span>
            <span className="text-sm">View, Search and Interaction with users</span>
          </div>
          <div className="flex flex-col justify-end gap-4 w-full items-end">
            <a
              onClick={() => { setUserModal(true) }}
              className="flex select-none text-white bg-dark-800 rounded-md p-3 uppercase font-semibold cursor-pointer text-center items-center gap-1"
            >
              <NewUserIcon
                width={24}
                height={24}
                className="fill-white"
              />
              Add User
            </a>
            <input
              className="shadow appearance-none border rounded-xl py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="search"
              type="text"
              placeholder="Search"
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      <Table data={data} className="striped-table pb-4">
        {(tableList) => (
          <>
            <Header>
              <HeaderRow className="!bg-light-gray !p-4 text-gray-400">
                <HeaderCell className="!py-4 !px-3">Full name</HeaderCell>
                <HeaderCell>Friends</HeaderCell>
                <HeaderCell>Date of Birth</HeaderCell>
                <HeaderCell>SSN</HeaderCell>
                <HeaderCell>SSN Issued Date</HeaderCell>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item) => (
                <Row key={item.id} item={item} className="text-dark-800">
                  <Cell>
                    <a
                      onClick={() => fetchRelatives(item.id)}
                      className='!text-blue-900 cursor-pointer font-semibold px-3'
                    >
                      {item.forename} {item.surname}
                    </a>
                  </Cell>
                  <Cell>
                    <a>{item.friends}</a>
                  </Cell>
                  <Cell>
                    {new Date(item.dob).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })} ({dayjs().diff(item.dob, 'years')})
                  </Cell>
                  <Cell>{item.ssn}</Cell>
                  <Cell>
                    {new Date(item.ssnIssuedDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </div>
  );
};

export default Component;
