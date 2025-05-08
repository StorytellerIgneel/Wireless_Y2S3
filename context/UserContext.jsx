import { createContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }, ...props) => {
    const [user, setUser] = useState(null);

    const loginUser = (userInfo) => setUser(userInfo);

    const logoutUser = () => setUser(null);

    return (
        <UserContext.Provider value={{user, loginUser, logoutUser}} {...props}>
            { children }
        </UserContext.Provider>
    );
}

export default UserContext;