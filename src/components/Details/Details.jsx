import React, { useState, useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import styles from './Details.module.css';

const Details = () => {
  const { selectedUser } = useUsers();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());

  useEffect(() => {
    // При смене пользователя сбрасываем старые данные
    setUserDetails(null);
    setError(null);
    // Обновляем timestamp для принудительной перезагрузки аватарки
    setAvatarTimestamp(Date.now());
    
    if (!selectedUser) {
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `https://raw.githubusercontent.com/netology-code/ra16-homeworks/master/hooks-context/use-effect/data/${selectedUser.id}.json`
        );

        if (!response.ok) {
          throw new Error('Не удалось загрузить данные пользователя');
        }

        const data = await response.json();
        setUserDetails(data);
      } catch (err) {
        console.error('Ошибка:', err);
        setError(err.message);
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [selectedUser?.id]);

  const formatFieldName = (key) => {
    const fieldNames = {
      name: 'Имя',
      age: 'Возраст',
      email: 'Email',
      phone: 'Телефон',
      address: 'Адрес',
      city: 'Город',
      company: 'Компания',
      position: 'Должность',
      avatar: 'Аватар',
      website: 'Веб-сайт',
      about: 'О себе',
    };
    return fieldNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    
    if (avatar.includes('pravatar.cc')) {
      const separator = avatar.includes('?') ? '&' : '?';
      return `${avatar}${separator}t=${avatarTimestamp}`;
    }
    
    return avatar;
  };

  if (!selectedUser) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Выберите пользователя из списка</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка данных пользователя...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Ошибка: {error}</div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Данные пользователя не найдены</div>
      </div>
    );
  }

  const excludeFields = ['id'];
  
  // Получаем поля для отображения
  const fields = Object.entries(userDetails)
    .filter(([key]) => !excludeFields.includes(key))
    .filter(([_, value]) => value !== null && value !== undefined && value !== '');

  const avatarUrl = getAvatarUrl(userDetails.avatar);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {userDetails.name || 'Информация о пользователе'}
      </h2>
      
      {avatarUrl && (
        <div className={styles.avatarWrapper}>
          <img 
            src={avatarUrl}
            alt={userDetails.name || 'User avatar'} 
            className={styles.avatar}
            onError={(e) => {
              // Если аватарка не загружается, показываем заглушку
              const name = userDetails.name || 'User';
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1976d2&color=fff&size=120&bold=true`;
            }}
          />
        </div>
      )}

      <div className={styles.content}>
        {fields.map(([key, value]) => {
          // Если значение - объект, показываем его поля
          if (typeof value === 'object' && value !== null) {
            return (
              <div key={key} className={styles.fieldGroup}>
                <div className={styles.groupLabel}>{formatFieldName(key)}:</div>
                <div className={styles.nestedFields}>
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <div key={subKey} className={styles.field}>
                      <span className={styles.label}>{formatFieldName(subKey)}:</span>
                      <span className={styles.value}>
                        {typeof subValue === 'object' 
                          ? JSON.stringify(subValue) 
                          : String(subValue)
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          
          // Обычное поле
          return (
            <div key={key} className={styles.field}>
              <span className={styles.label}>{formatFieldName(key)}:</span>
              <span className={styles.value}>
                {String(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Details;