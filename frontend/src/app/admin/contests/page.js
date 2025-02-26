'use client';

import { useState } from 'react';
import apiService from '@/components/apiService';
import toast from 'react-hot-toast';

const ContestsPage = () => {
  const [contests, setContests] = useState([]);
  const [newContest, setNewContest] = useState({
    name: '',
    entryFee: 0,
    maxPlayers: 0,
    prizePool: 0,
    matchId: '',
  });

  // Fetch contests when component mounts
  const fetchContests = async () => {
    try {
    //   const response = await apiService.fetchData('/admin/contests');
      setContests(response.data);
    } catch (error) {
      toast.error('Error fetching contests');
    }
  };

  // Handle new contest creation
  const handleCreateContest = async () => {
    try {
    //   const response = await apiService.postData('/admin/contest', newContest);
      setContests([...contests, response.data]);
      toast.success('Contest added successfully!');
      setNewContest({ name: '', entryFee: 0, maxPlayers: 0, prizePool: 0, matchId: '' });
    } catch (error) {
      toast.error('Error adding contest');
    }
  };

  // Handle contest deletion
  const handleDeleteContest = async (contestId) => {
    try {
    //   await apiService.deleteData(/admin/contest/${contestId});
      setContests(contests.filter(contest => contest.id !== contestId));
      toast.success('Contest deleted successfully');
    } catch (error) {
      toast.error('Error deleting contest');
    }
  };

  // Handle contest update
  const handleUpdateContest = async (contestId, updatedContest) => {
    try {
    //   const response = await apiService.putData(/admin/contest/${contestId}, updatedContest);
      setContests(contests.map(contest => contest.id === contestId ? response.data : contest));
      toast.success('Contest updated successfully!');
    } catch (error) {
      toast.error('Error updating contest');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contests</h1>

      {/* Add new contest form */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Add New Contest</h3>
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Contest Name"
          value={newContest.name}
          onChange={(e) => setNewContest({ ...newContest, name: e.target.value })}
        />
        <input
          type="number"
          min={0}
          className="border p-2 mb-2 w-full"
          placeholder="Entry Fee"
          value={newContest.entryFee}
          onChange={(e) => setNewContest({ ...newContest, entryFee: e.target.value })}
        />
        <input
          type="number"
          min={0}
          className="border p-2 mb-2 w-full"
          placeholder="Max Players"
          value={newContest.maxPlayers}
          onChange={(e) => setNewContest({ ...newContest, maxPlayers: e.target.value })}
        />
        <input
          type="number"
          min={0}
          className="border p-2 mb-2 w-full"
          placeholder="Prize Pool"
          value={newContest.prizePool}
          onChange={(e) => setNewContest({ ...newContest, prizePool: e.target.value })}
        />
        <input
          type="text"
          className="border p-2 mb-2 w-full"
          placeholder="Match ID"
          value={newContest.matchId}
          onChange={(e) => setNewContest({ ...newContest, matchId: e.target.value })}
        />
        <button
          onClick={handleCreateContest}
          className="bg-blue-500 text-white px-6 py-2 rounded-md"
        >
          Add Contest
        </button>
      </div>

      {/* Display contests in card format */}
      <div>
        {contests.map((contest) => (
          <div key={contest.id} className="border p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold">{contest.name}</h3>
            <p>Entry Fee: ${contest.entryFee}</p>
            <p>Max Players: {contest.maxPlayers}</p>
            <p>Prize Pool: ${contest.prizePool}</p>
            <p>Match ID: {contest.matchId}</p>
            <button
              onClick={() => handleDeleteContest(contest.id)}
              className="bg-red-500 text-white px-6 py-2 rounded-md mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestsPage;