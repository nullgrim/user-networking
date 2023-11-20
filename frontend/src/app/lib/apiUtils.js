import axios from 'axios';

const apiUrl = "http://localhost:4000/v1";

const searchUsers = async (params) => {
    try {
        const response = await axios.get(`${apiUrl}/user/users?search=${params.search}&limit=${params.limit}`);
        return response.data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

const searchUserRelations = async (userId) => {
    try {
        const response = await axios.get(`${apiUrl}/user/relatives/${userId}`);
        return response.data.relatives[0];
    } catch (error) {
        console.error('Error fetching user relation data:', error);
        return [];
    }
}

export { searchUsers, searchUserRelations }