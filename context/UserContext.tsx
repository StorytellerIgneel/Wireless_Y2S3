import React, {createContext, ReactNode, useState} from 'react'

// Define the user type
interface User {
  id?: string;
  name: string;
  email: string;
  photoUrl?: string;
}

// Define the context type
interface UserContextType {
  user: User | null;
  loginUser: (userInfo: User) => void;
  logoutUser: () => void;
}

//create context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [user, setUser] = useState<User | null>(null)

  const loginUser = (userInfo: User) => setUser(userInfo);

  const logoutUser = () => setUser(null);

  return (
    <UserContext.Provider value={{user, loginUser, logoutUser}}>
        {children} 
        {/* the children here is a special react prop that refers to all comps inside the provider, making it flexible*/ }
    </UserContext.Provider>
  )
}

export default UserContext