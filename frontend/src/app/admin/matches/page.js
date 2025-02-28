'use client';
import { useState, useEffect } from 'react';
import apiService from '@/components/apiService';
import toast from 'react-hot-toast';

const MatchesPage = () => {
    const [liveMatches, setLiveMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [completedMatches, setCompletedMatches] = useState([]);
    const [newMatch, setNewMatch] = useState({
        home_team: '',
        away_team: '',
        match_date: '',
        status: 'Upcoming',
    });

    // Fetch matches on component mount
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await apiService.fetchData('/admin/getMatches');
                setLiveMatches(response.data?.live || []);
                setUpcomingMatches(response.data?.upcoming || []);
                setCompletedMatches(response.data?.completed || []);
            } catch (error) {
                toast.error('Error fetching matches! Check console.');
                console.error('Error', error);
            }
        };
        fetchMatches();
    }, []);

    // Create a new match
    const handleCreateMatch = async () => {
        try {
            await apiService.postData('/admin/match', newMatch);
            toast.success('Match added successfully!');
            setNewMatch({ home_team: '', away_team: '', match_date: '', status: 'Upcoming' });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error adding match');
            console.error('Error:', error);
        }
    };

    // Edit a match
    const handleEditMatch = async (id) => {
        // const matchToEdit = matches.find((match) => match.id === id);
        // setNewMatch({
        //     home_team: matchToEdit.home_team,
        //     away_team: matchToEdit.away_team,
        //     match_date: matchToEdit.match_date,
        //     status: matchToEdit.status,
        // });

        // Optionally, we can remove the match temporarily from the list to show the form for editing
        // setMatches(matches.filter((match) => match.id !== id));
    };

    // Save the edited match
    const handleSaveEdit = async (id) => {
        // try {
        //     const response = await apiService.putData(/admin/updateMatch ${ id }, newMatch);
        //     setMatches((prevMatches) =>
        //         prevMatches.map((match) => (match.id === response.data.id ? response.data : match))
        //     );
        //     toast.success('Match edited successfully!');
        //     setNewMatch({ home_team: '', away_team: '', match_date: '', status: 'Upcoming' });
        // } catch (error) {
        //     toast.error('Error editing match');
        // }
    };

    // Delete a match
    const handleDeleteMatch = async (id, status) => {
        try {
            await apiService.deleteData(`/admin/deleteMatch/${ id }`);
            if (status == 'Upcoming') {
                setUpcomingMatches(upcomingMatches.filter(match => match.id !== id))
            } else if(status == 'Live'){
                setLiveMatches(liveMatches.filter(match => match.id !== id));
            } else {
                setCompletedMatches(completedMatches.filter(match => match.id !== id));
            }
            toast.success('Match deleted successfully!');
        } catch (error) {
            toast.error('Error deleting match! Check console.');
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Matches</h1>

            {/* Render Matches form */}
            <div>
                <h3 className="text-xl font-semibold mb-2">{newMatch.id ? 'Edit Match' : 'Add New Match'}</h3>
                <form onSubmit={handleCreateMatch}>
                <input
                    type="text"
                    className="border p-2 mb-2 w-full"
                    placeholder="Home Team"
                    value={newMatch.home_team}
                    required
                    onChange={(e) => setNewMatch({ ...newMatch, home_team: e.target.value })}
                />
                <input
                    type="text"
                    className="border p-2 mb-2 w-full"
                    placeholder="Away Team"
                    value={newMatch.away_team}
                    required
                    onChange={(e) => setNewMatch({ ...newMatch, away_team: e.target.value })}
                />
                <input
                    type="date"
                    className="border p-2 mb-2 w-full"
                    value={newMatch.match_date}
                    required
                    min={new Date()}
                    onChange={(e) => setNewMatch({ ...newMatch, match_date: e.target.value })}
                />
                <select
                    className="border p-2 mb-2 w-full"
                    value={newMatch.status}
                    onChange={(e) => setNewMatch({ ...newMatch, status: e.target.value })}
                >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                </select>
                <button
                    // onClick={newMatch.id ? handleSaveEdit : handleCreateMatch}
                    type='submit'
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-300"
                >
                    {newMatch.id ? 'Update Match' : 'Add Match'}
                </button>
                </form>
            </div>

            {/* Render Matches list in Card Format */}
            <div className="flex flex-col md:flex-row justify-center gap-10 mt-12 w-full">
                {/* Upcoming Matches */}
                <div className="flex flex-col items-center w-full sm:w-96">
                    <button className="bg-[linear-gradient(125.26deg,#5672B8_22.66%,rgba(4,11,41,0.86)_59.18%)] text-[#ffffff] text-2xl md:text-xl sm:text-lg font-aleo px-6 py-3 sm:px-4 sm:py-2 rounded-lg w-full">
                        Upcoming Matches
                    </button>
                    <div className="bg-gray-700 bg-opacity-50 w-full h-56 rounded-lg mt-4 overflow-y-auto p-2">
                        {upcomingMatches.length > 0 ? (
                            upcomingMatches.map(match => (
                                <div key={match.id} className="p-2 bg-gray-800 rounded-lg mb-2 text-white">
                                    <p>{match.home_team} vs {match.away_team}</p>
                                    <p>{match.match_date}</p>
                                    <div className="mt-4 flex justify-between">
                                        <button
                                            onClick={() => handleEditMatch(match.id)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMatch(match.id, match.status)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-5 text-lg">No Upcoming Matches!</p>
                        )}
                    </div>
                </div>

                {/* Live Matches */}
                <div className="flex flex-col items-center w-full sm:w-96">
                    <button className="bg-[linear-gradient(125.26deg,#5672B8_22.66%,rgba(4,11,41,0.86)_59.18%)] text-[#ffffff] text-2xl md:text-xl sm:text-lg font-aleo px-6 py-3 sm:px-4 sm:py-2 rounded-lg w-full">
                        Live Matches
                    </button>
                    <div className="bg-gray-700 bg-opacity-50 w-full h-56 rounded-lg mt-4 overflow-y-auto p-2">
                        {liveMatches.length > 0 ? (
                            liveMatches.map(match => (
                                <div key={match.id} className="p-2 bg-gray-800 rounded-lg mb-2 text-white">
                                    <p>{match.home_team} vs {match.away_team}</p>
                                    <p>{match.match_date}</p>
                                    <div className="mt-4 flex justify-between">
                                        <button
                                            onClick={() => handleEditMatch(match.id)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMatch(match.id, match.status)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-5 text-lg">No Live Matches!</p>
                        )}
                    </div>
                </div>

                {/* Completed Matches */}
                <div className="flex flex-col items-center w-full sm:w-96">
                    <button className="bg-[linear-gradient(125.26deg,#5672B8_22.66%,rgba(4,11,41,0.86)_59.18%)] text-[#ffffff] text-2xl md:text-xl sm:text-lg font-aleo px-6 py-3 sm:px-4 sm:py-2 rounded-lg w-full">
                        Completed Matches
                    </button>
                    <div className="bg-gray-700 bg-opacity-50 w-full h-56 rounded-lg mt-4 overflow-y-auto p-2">
                        {completedMatches.length > 0 ? (
                            completedMatches.map(match => (
                                <div key={match.id} className="p-2 bg-gray-800 rounded-lg mb-2 text-white">
                                    <p>{match.home_team} vs {match.away_team}</p>
                                    <p>{match.match_date}</p>
                                    <div className="mt-4 flex justify-between">
                                        <button
                                            onClick={() => handleEditMatch(match.id)}
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMatch(match.id, match.status)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-5 text-lg">No Completed Matches!</p>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default MatchesPage;