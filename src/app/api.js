import axios from 'axios';

export const loginUser = async (email, password) => {
    console.log("HEllo")
    try {
        const response = await axios.post(
            'http://localhost:8000/auth/login',
            { email, password },
            
        );
        console.log(response+"HI")
        if (response.data.token) {
            localStorage.setItem('token', response.data.token); // Store the token securely
        }

        return {
            status: true,
            message: 'Login successful',
        };
    } catch (error) {
        return {
            status: false,
            message: error.response?.data?.message || 'Login failed',
        };
    }
};