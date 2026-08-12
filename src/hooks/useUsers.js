import { useContext } from 'react';
import { UsersContext } from '../context/UsersContext';

export const useUsers = () => {
  const context = useContext(UsersContext);
  
  if (!context) {
    throw new Error('useUsers должен использоваться внутри UsersProvider');
  }
  
  return context;
};