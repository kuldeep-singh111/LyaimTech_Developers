'use client';

import { useEffect, useState } from 'react';
import apiService from '@/components/apiService';
import toast from 'react-hot-toast';

const UsersPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users when component mounts
        const fetchUsers = async () => {
            try {
                const response = await apiService.fetchData('/admin/getUsers');
                setUsers(response.data?.users || []);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error fetching users! Check console.');
                console.error(error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (username) => {
        try {
            // Assuming an endpoint to delete a user by username
            const response = await apiService.deleteData(`/admin/deleteUser/${username}`);
            if (response?.status === 200) {
                toast.success('User deleted successfully');
                setUsers(users.filter(user => user.username !== username)); // Remove the user from the list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting user!');
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All Users</h1>

            <div className="">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Username</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Mobile No</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Referral Code</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Wallet Amount</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.length > 0 ? (users.map((user) => (
                            <tr key={user.username} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.mobileNo}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.referralCode || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2">${user.wallet.depositAmount.toFixed(2)}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(user.username)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))) : (
                            <tr>
                                <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;