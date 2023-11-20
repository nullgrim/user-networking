import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import dynamic from 'next/dynamic';
import * as Yup from "yup";

import { useAPI } from '@/app/lib/apiContext';
import { searchUsers } from '@/app/lib/apiUtils';

const createUserSchema = Yup.object().shape({
    forename: Yup.string()
        .min(2, 'Too Short!')
        .max(70, 'Too Long!')
        .required('Required'),
    surname: Yup.string()
        .min(2, 'Too Short!')
        .max(70, 'Too Long!')
        .required('Required'),
    ssn: Yup.string()
        .min(6, 'Too Short!')
        .max(9, 'Too Long!')
        .required('Required'),
    ssnIssuedDate: Yup.date()
        .required('Please provide the issued date.'),
    dob: Yup.date()
        .required('Please provide your DOB'),
    image: Yup.string()
        .required('Please choose an image.')
});

const MapComponent = dynamic(() => import('@/app/components/map'), {
    ssr: false,
});

export default function CreateUserModal({ onClose, props }) {
    const api = useAPI();
    const timeout = useRef();

    const [users, setUsers] = useState([]);
    const [location, setLocation] = useState({ type: "Point", coordinates: [0, 0] });
    const [searchQuery, setSearchQuery] = useState('');

    const search = useCallback(async () => {
        const users = await searchUsers({
            search: searchQuery,
            limit: 8
        });

        setUsers(users);
    }, [searchQuery]);

    const handleSearchInput = (event) => {
        if (timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(
            () => {
                setSearchQuery(event.target.value);
            },
            200
        );
    };

    const handleMapClick = useCallback(({ lat, lng }) => {
        setLocation({
            ...location,
            coordinates: [lat.toFixed(16), lng.toFixed(16)]
        });
    }, [location]);

    useEffect(() => {
        search();
    }, [searchQuery, search]);

    return (
        <>
            <div className="w-full flex flex-col gap-3 relative">
                <div className='flex flex-col text-white max-w-[75%]'>
                    <span className='text-lg sm:text-xl font-bold'>Create User</span>
                </div>
                <Formik
                    initialValues={{
                        forename: '',
                        surname: '',
                        ssn: '',
                        ssnIssuedDate: '',
                        dob: '',
                        image: '',
                        friendsIds: [],
                    }}
                    validationSchema={createUserSchema}
                    onSubmit={async (values) => {
                        await api.post(`/user`, {
                            ...values,
                            location
                        }).then((response) => {
                            alert(JSON.stringify({
                                success: true,
                                message: "User created"
                            }));

                            props.onUserAdded(response.data.user.id);
                            onClose();
                        }).catch((error) => {
                            alert(JSON.stringify({
                                success: false,
                                message: error.response.data?.userFacingMessage || "Error occurred, try again later"
                            }));
                        })
                    }}
                >
                    <Form>
                        <div className='flex flex-col gap-4 scrollbar-thin'>
                            <div className='flex flex-col gap-2'>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <label htmlFor="forename">Forename</label>
                                        <Field
                                            className="input-bar focus:outline-none focus:shadow-outline w-full"
                                            id="forename"
                                            name="forename"
                                            type="text"
                                            placeholder="Forename"
                                        />
                                        <ErrorMessage name="forename" />
                                    </div>
                                    <div>
                                        <label htmlFor="surname">Surname</label>
                                        <Field
                                            className="input-bar focus:outline-none focus:shadow-outline"
                                            id="surname"
                                            name="surname"
                                            type="text"
                                            placeholder="Surname"
                                        />
                                        <ErrorMessage name="surname" />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <label htmlFor="ssn">SSN</label>
                                        <Field
                                            className="input-bar focus:outline-none focus:shadow-outline"
                                            id="ssn"
                                            name="ssn"
                                            type="text"
                                            placeholder="SSN"
                                        />
                                        <ErrorMessage name="ssn" />
                                    </div>
                                    <div>
                                        <label htmlFor="ssnIssuedDate">SSN Issued Date</label>
                                        <Field
                                            className="input-bar focus:outline-none focus:shadow-outline"
                                            id="ssnIssuedDate"
                                            name="ssnIssuedDate"
                                            type="datetime-local"
                                        />
                                        <ErrorMessage name="ssnIssuedDate" />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label>Date of Birth</label>
                                <Field
                                    className="input-bar focus:outline-none focus:shadow-outline"
                                    id="dob"
                                    name="dob"
                                    type="date"
                                />
                                <ErrorMessage name="dob" />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <label>Image</label>
                                <div className="flex flex-row gap-2 overflow-x-auto min-w-0">
                                    <Field className="bg-criminal image-radio flex-shrink-0" type="radio" name="image" value="criminal" />
                                    <Field className="bg-fire-fighter image-radio flex-shrink-0" type="radio" name="image" value="fire-fighter" />
                                    <Field className="bg-inmate-female image-radio flex-shrink-0" type="radio" name="image" value="inmate-female" />
                                    <Field className="bg-medic image-radio flex-shrink-0" type="radio" name="image" value="medic" />
                                    <Field className="bg-lawyer image-radio flex-shrink-0" type="radio" name="image" value="lawyer" />
                                    <Field className="bg-insurgent image-radio flex-shrink-0" type="radio" name="image" value="insurgent" />
                                </div>
                                <ErrorMessage name="image" />
                            </div>
                            <div className='flex flex-col gap-2 bg-dark-700 rounded-lg gap-4 p-3'>
                                <div className='flex flex-row w-full items-center'>
                                    <label className="w-1/2">Find Friends</label>
                                    <div className='flex w-full justify-end'>
                                        <input
                                            className="input-bar focus:outline-none focus:shadow-outline"
                                            id="search-friends"
                                            name="search-friends"
                                            type="text"
                                            placeholder="Search Friends"
                                            onChange={handleSearchInput}
                                        />
                                    </div>
                                </div>
                                <div
                                    className="flex flex-row gap-2 overflow-x-auto !scrollbar-thin"
                                    style={{ scrollbarWidth: 'thin' }}
                                >
                                    <div className='flex overflow-x-auto'>
                                        {
                                            users.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className='w-auto h-fit flex rounded-full relative py-2 mr-2'
                                                >
                                                    <Field
                                                        className="image-radio user"
                                                        type="checkbox"
                                                        name="friendsIds"
                                                        value={`${user.id}`}
                                                        style={{ backgroundImage: `url(/images/${user.image}.png)` }}
                                                    />
                                                    <span className="image-radio__user-name pointer-events-none">{user.forename} {user.surname}</span>
                                                </div>
                                            ))
                                        }
                                    </div>

                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <MapComponent onMapClick={handleMapClick} />
                                <div className="flex flex-row gap-4">
                                    <span className="truncate w-[35%]">Latitude: {location.coordinates[0]}</span>
                                    <span className="truncate w-[35%]">Longitude: {location.coordinates[1]}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            className="bg-dark-600 rounded-md p-4 w-full mt-4"
                            type="submit">
                            Submit
                        </button>
                    </Form>
                </Formik>
            </div >
        </>
    )
}