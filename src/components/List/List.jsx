import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import styles from './List.module.css';

const List = () => {
  const { users, loading, error, selectedUser, selectUser } = useUsers();

  // Состояние загрузки
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка списка пользователей...</div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Пользователи</h2>
      <ul className={styles.list}>
        {users.map((user) => (
          <li
            key={user.id}
            className={`${styles.item} ${selectedUser?.id === user.id ? styles.active : ''}`}
            onClick={() => selectUser(user)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;