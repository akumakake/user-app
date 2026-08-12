import React, { createContext, useState, useEffect } from 'react';

// Создаем контекст
export const UsersContext = createContext();

// Провайдер контекста
export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка списка пользователей при первом рендере
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hooks-context/use-effect/data/users.json'
        );
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить список пользователей');
        }
        
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Функция для выбора пользователя
  const selectUser = (user) => {
    setSelectedUser(user);
  };

  // Значения, которые будут доступны через контекст
  const value = {
    users,
    selectedUser,
    loading,
    error,
    selectUser
  };

  return (
    <UsersContext.Provider value={value}>
      {children}
    </UsersContext.Provider>
  );
};