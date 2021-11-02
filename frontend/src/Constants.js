const prod = {
    url: {
        API_URL: 'https://myapp.herokuapp.com',
        API_URL_USERS: 'https://myapp.herokuapp.com/users'
    },
    web: {
        API_URL: '127.0.0.1:8000'
    }
};
const dev = {
    url: {
        // API_URL: '192.168.1.2:8000'
        API_URL: 'localhost:8000'
    },
    web: {
        // API_URL: '192.168.1.2:3000'
        API_URL: 'localhost:8000'
    }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
